var map = d3.select(".dashboard .map")
	.append("svg"),
	heading = d3.select(".dashboard h2"),
	canada = window.getCanadaMap(map, {
		/*provinces: ["ON", "QC"],*/
	})
		.on("loaded", function() {
			window.console.log("loaded");
		})
		.on("zoom", function(province) {
			var text = "Canada";

			if (province){
				switch(province) {
				case "ON":
					text = "Ontario";
					break;
				case "QC":
					text = "Quebec";
					break;
				case "NS":
					text = "Nova Scotia";
					break;
				case "NB":
					text = "New Brunswick";
					break;
				case "MB":
					text = "Manitoba";
					break;
				case "BC":
					text = "British Columbia";
					break;
				case "PE":
					text = "Prince Edward Island";
					break;
				case "SK":
					text = "Saskatchewan";
					break;
				case "AB":
					text = "Alberta";
					break;
				case "NL":
					text = "Newfoundland and Labrador";
					break;
				case "NT":
					text = "Northwest Territories";
					break;
				case "YT":
				case "YK":
					text = "Yukon";
					break;
				case "NU":
					text = "Nunavut";
					break;
				}
			}
			heading.text(text);
			window.console.log("Zoom:" + text);
		});

/*setInterval(function() {
	var provinces = Object.keys(canada.provinces),
		provincesLength = provinces.length,
		show = Math.floor(Math.random() * (provincesLength + 1)),
		province;

	if (show < provincesLength){
		province = provinces[show];
		canada.provinces[province].zoom();
	} else {
		canada.zoom();
	}
}, 2000);*/
