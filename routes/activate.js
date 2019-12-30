var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
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

  res.render('activate', { title: 'Activated' });
});

module.exports = router;
