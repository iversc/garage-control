var express = require('express');
var router = express.Router();
const crypto = require('crypto');

function activate() {
  	const { spawnSync } = require('child_process');
  	const pinOn = spawnSync('gpio', ['-g','write','4','1']);

  	console.log("Button triggered!");
  	
	setTimeout( () => {
		const pinOff = spawnSync('gpio', ['-g','write','4','0']);
		console.log("Button reset!");
  	}, 1000);
  
}

function shutdown(sdType) {
	const { spawnSync } = require('child_process');

	if(sdType === "-h") {
		console.log("Shutting down Pi...");
	} else if(sdType === "-r") {
		console.log("Rebooting Pi...");
	} else {
		console.log("Unsupported flag " + sdType);
		return;
	}

	const  sdCommand = spawnSync('sudo', ['shutdown',sdType,'now']);
}

/* GET home page. */
router.get('/:authcode/:action', function(req, res, next) {
    var action = req.params['action'];
	var authcode = req.params['authcode'];
	var msg = "";
    var statusCode = 200;
	var authKey = req.app.locals.authKey;

	let timestamp = (Math.floor(new Date() / 30000)).toString();

	keyHash = crypto.createHmac('sha1', authKey).update(timestamp).digest('hex');

	console.log("HMAC: " + keyHash);

	if(keyHash === authcode) {
		console.log("Good auth code received. Processing command...");

		if(action === "activate") {
			console.log("Command activate received.");
			activate();
			msg = "Door Activated";
    	} else if (action === "shutdown") {
			console.log("Shutdown command received.");
			shutdown("-h");
			msg = "Shutting down";
		} else if (action === "reboot") {
			console.log("Reboot command received.");
			shutdown("-r");
			msg = "Rebooting...";
		}
		else {
			console.log("Unknown command "+action);
			msg = "Unknown Command";
			statusCode = 400;
		}

	} else {
		statusCode = 401;
		msg = "Invalid authorization code.";
	}

   	res.status(statusCode).send(msg);
});

module.exports = router;
