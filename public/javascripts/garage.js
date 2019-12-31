function runCommand(action)
{
	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "/command/" + action, true);
		xmlhttp.send(null);
	}

}
	
function activate()
{
	runCommand("activate");

    var info = document.getElementById('info');
	info.innerHTML = "Activating door...";

	setTimeout(function() {
		info.innerHTML = "Click a command to run it.";
	}, 3000);
}

function shutdown()
{
	var info = document.getElementById('info');
	info.innerHTML = "Shutting down Pi...";

	runCommand("shutdown");	
}

function reboot()
{
	var info = document.getElementById('info');
	info.innerHTML = "Rebooting Pi...";

	runCommand("reboot");
}
