var express = require('express');
var router = express.Router();
var fs = require('fs');

function activate() {
  const { spawnSync } = require('child_process');
  const pinOn = spawnSync('gpio', ['-g','write','4','1']);
  fs.writeFile("testFile", "1", function(err){
    if(err) {
      console.log(err);
    }
    console.log("Button triggered!");
  });
  setTimeout( () => {
	  const pinOff = spawnSync('gpio', ['-g','write','4','0']);
	  fs.writeFile("testFile", 0, function(err){
		if(err){
			console.log(err);
		}

		console.log("Button reset!");
	  });
  }, 1000);
  
}

/* GET home page. */
router.get('/:action', function(req, res, next) {
    var action = req.params['action'];
	var msg = "";
    var statusCode = 200;

	if(action === "activate") {
		console.log("Command activate received.");
		activate();
		msg = "Door Activated";
    }
	else {
		console.log("Unknown command "+action);
		msg = "Unknown Command";
		statusCode = 400;
	}

    res.status(statusCode).send(msg);
});

module.exports = router;
