var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const https = require('https');

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

function switchLights(hueUser, lightsOn) {
	body = `{ "on": {"on": ${lightsOn} }}`;

	const options = {
		hostname: "philips-hue",
		port: 443,
		path: "/clip/v2/resource/grouped_light/b6faa6e6-dba5-4e11-81e1-bf92f67b9280",
		method: 'PUT',
		rejectUnauthorized: false,
		headers: {
			"Content-Type": "application/json",
			"hue-application-key": hueUser
		}
	}

	const req = https.request(options, (res) => {
		console.log("HTTP request began");

		res.on("data", (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		res.on("end", () => {
			console.log("End of response data.");
		});
	});

	req.on("error", (e) => {
		console.error(`Error making request: ${e.message}`)
	});
	
	req.write(body);
	req.end();
}

function checkAuthCode(authCode, authKey) {
	let timecode = Math.floor(new Date() / 30000);
	let timestamp = timecode.toString();
	keyHash = crypto.createHmac('sha1', authKey).update(timestamp).digest('hex');

	console.log("HMAC: " + keyHash);

	if(keyHash !== authCode) {
		console.log("First HMAC challenge failed, attempting again with previous code.");
		timecode -= 1;
		
		timestamp = timecode.toString();
		keyHash = crypto.createHmac('sha1', authKey).update(timestamp).digest('hex');

		console.log("HMAC: " + keyHash);
		if(keyHash !== authCode) {
			return false;
		}
	} 

	return true;
}

/* GET home page. */
router.get('/:action', function(req, res, next) {
    var action = req.params['action'];
	var authCode = (req.headers.authorization || '').split(' ')[1] || '';
	var msg = "";
    var statusCode = 200;
	var authKey = req.app.locals.authKey;
	var hueUser = req.app.locals.hueUser;

	if(!checkAuthCode(authCode, authKey)) {
		res.status(403).send("Invalid authorization code.");
		return;
	}

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
	} else if (action == "lightson") {
		console.log("Lights on command received.");
		switchLights(hueUser, true);
		msg = "Lights On";
	} else if (action == "lightsoff") {
		console.log("Lights off command receivd.");
		switchLights(hueUser, false);
		msg = "Lights Off";
	} else {
		console.log("Unknown command "+action);
		msg = "Unknown Command";
		statusCode = 400;
	}

   	res.status(statusCode).send(msg);
});

module.exports = router;
