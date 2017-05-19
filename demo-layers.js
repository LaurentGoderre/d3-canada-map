var map = d3.select(".dashboard .map")
	.append("svg");

window.getCanadaMap(map, {
	additonalLayers: [
		{
			name: "canada-er",
			url: "data/canadaER.json",
			getObjects: function(data) {
				return data.objects.collection.geometries;
			},
			getClass: function(feature) {
				return "er-" + feature.properties.GEOCODE;
			}
		}
	]
})
	.on("loaded", function() {
		window.console.log("loaded");
	});
