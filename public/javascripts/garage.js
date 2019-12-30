function activate()
{
	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "/command/activate", true);
		xmlhttp.send(null);
	}

	var info = document.getElementById('info');
	info.innerHTML = "Activating door...";

	setTimeout(function() {
		info.innerHTML = "Click a command to run it.";
	}, 3000);
}
