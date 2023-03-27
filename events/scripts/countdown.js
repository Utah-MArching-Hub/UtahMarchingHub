

function countdown(elementName, eDate, dates = 0) {
	//config
	var targetDate = new Date(eDate).getTime();
	//use 
	var element = document.getElementById(elementName)
	var x = setInterval(function() {
		//get the time in m sec
		var now = new Date().getTime();
		//get diff from target and current time
		var d_time = targetDate - now;
		//time const
		const mspd = 1000 * 60 * 60 * 24;
		const msph = 1000 * 60 * 60;
		const mspm = 1000 * 60;
		const msps = 1000;
		//days
		var days = Math.floor(d_time / mspd);
		//hrs
		var hrs = Math.floor(d_time % mspd / msph);
		//min
		var min = Math.floor(d_time % msph / mspm);
		//sec
		var sec = Math.floor(d_time % mspm / msps);
		//inject
		element.innerHTML = days + " Days, " + hrs + " Hrs, " + min + " Min, " + sec + " Sec.";
		//progress bar calculations
		if (!(dates == 0)) {
			var dTxt = document.getElementById(dates);
			dTxt.innerHTML = "Start Date:" + sDate + " | End Date:" + eDate;
		};
	}, 1000);
}