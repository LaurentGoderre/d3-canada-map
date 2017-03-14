function getCanadaMap(svg, settings) {
	var rtnObj = {
			settings: settings || {},
			svg: svg,
			provinces: {}
		},
		zoom = function(province) {
			var transition = d3.transition()
			 		.duration(1000),
				boundingBox, provincePath;

			this.svg.selectAll(".zoomed").classed("zoomed", false);

			if (province) {
				if (this.provinces[province]._bBox) {
					provincePath = this.provinces[province].obj;
					boundingBox = this.provinces[province]._bBox;
				} else {
					provincePath = this.provinces[province].obj = this.svg.select("." + province);
					boundingBox = this.provinces[province]._bBox = (provincePath.node().getBBox());
				}
				provincePath.classed("zoomed", true);
				this.obj.classed("zoomed", true);
			} else {
				boundingBox = this._bBox;
			}
			svg.transition(transition).attr("viewBox", [boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height].join(" "));

			if (this.settings.zoomCallback && typeof this.settings.zoomCallback === "function") {
				this.settings.zoomCallback(province);
			}
		};

	if (settings.provinces && typeof settings.provinces === "string") {
		settings.provinces = [provinces]
	}

	d3.json("data/canada.json", function(error, canada) {
		var canadaLayer = svg.append("g")
			.attr("class", "canada-map"),
			provincesKeys = Object.keys(canada.objects),
			province, provinceShort, p, projection, path;

			projection = settings.projection = settings.projection ||
				d3.geoTransverseMercator()
					.rotate([95,0]);
			path = d3.geoPath()
				.projection(projection);

		for(p = 0; p < provincesKeys.length; p += 1) {
			province = provincesKeys[p];
			provinceShort = province.substr(3);

			//Filter provinces based on specified argument
			if (!settings.provinces || settings.provinces.indexOf(provinceShort) !== -1) {
				canadaLayer.append("path")
					.datum(topojson.feature(canada, canada.objects[province]))
					.attr("class", provinceShort)
					.attr("d", path);

				rtnObj.provinces[provinceShort] = {
					zoom: zoom.bind(rtnObj, provinceShort)
				}
			}
		}

		rtnObj.obj = canadaLayer;
		rtnObj._bBox = canadaLayer.node().getBBox();
		rtnObj.zoom = zoom.bind(rtnObj);

		rtnObj.zoom();
	});

	return rtnObj;
}
