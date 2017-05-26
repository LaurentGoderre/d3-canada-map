/* exported getCanadaMap */
this.getCanadaMap = function(svg, settings) {
	var canadaLayer = svg.append("g")
			.attr("class", "canada-map"),
		dispatch = d3.dispatch("loaded", "zoom", "error"),
		onError = function(error) {
			if (error) {
				if (error instanceof Error) {
					return dispatch.call("error", rtnObj, error);
				} else if (error instanceof ProgressEvent) {
					return dispatch.call("error", rtnObj, new Error("Could not load the map file (" + error.target.status + " " + error.target.statusText + ")"));
				}
			}
		},
		loadLayers = function() {
			var done = function() {
					dispatch.call("loaded", rtnObj);
				},
				loadOtherLayers = function() {
					var q = d3.queue(),
						layerCallback = function(error, data) {
							onError(error);
							this.data = data;
							createAdditionalLayer(this);
						},
						l, layer;

					for (l = 0; l < settings.additonalLayers.length; l++) {
						layer = settings.additonalLayers[l];
						if (layer.data) {
							createAdditionalLayer(layer);
						} else if (layer.url){
							q.defer(d3.json, layer.url, layerCallback.bind(layer));
						}
					}
					q.await(done);
				},
				cb = done;

			if (settings.additonalLayers && settings.additonalLayers.length > 0) {
				cb = loadOtherLayers;
			}

			if (typeof settings.baseMap === "object") {
				createBaseMap(settings.baseMap, cb);
			} else {
				d3.json(settings.baseMap, function(error, data) {
					onError(error);
					createBaseMap(data, cb);
				});
			}
		},
		zoom = function(province) {
			var getRatio = function(bBox) {
					return bBox.width * 1.0 / bBox.height;
				},
				getbBoxCorrected = function(origin, reference) {
					var newbBox = {
							x: origin.x,
							y: origin.y,
							width: origin.width,
							height: origin.height
						},
						originRatio = getRatio(origin),
						referenceRatio = getRatio(reference),
						newValue, oldValue;
					if (originRatio > referenceRatio) {
						// Origin bounding box is wider than reference
						newValue = origin.width / referenceRatio;
						oldValue = origin.height;
						newbBox.height = newValue;
						newbBox.y = origin.y - (newValue - oldValue) / 2;
					} else if (originRatio < referenceRatio) {
						//Origin bounding box is higher than reference
						newValue = origin.height * referenceRatio;
						oldValue = origin.width;
						newbBox.width = newValue;
						newbBox.x = origin.x - (newValue - oldValue) / 2;
					}
					return newbBox;
				},
				transition = d3.transition()
					.duration(1000),
				boundingBox, provincePath;

			this.svg.selectAll(".zoomed").classed("zoomed", false);

			if (province) {
				if (this.provinces[province]._bBoxCorrected) {
					provincePath = this.provinces[province].obj;
					boundingBox = this.provinces[province]._bBoxCorrected;
				} else {
					provincePath = this.provinces[province].obj = this.svg.select("." + province);
					this.provinces[province]._bBox = (provincePath.node().getBBox());
					boundingBox = this.provinces[province]._bBoxCorrected = getbBoxCorrected(this.provinces[province]._bBox, this._bBox);
				}
				provincePath.classed("zoomed", true);
				this.obj.classed("zoomed", true);
			} else {
				boundingBox = this._bBox;
			}
			svg.transition(transition).attr("viewBox", [boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height].join(" "))
				.on("end", function() {
					dispatch.call("zoom", this, province);
				});
		},
		createBaseMap = function(canada, cb) {
			var provinces = (settings.getProvinces || function() {
				var keys = Object.keys(canada.objects),
					prReturn = {},
					k, key, root;

				if (keys.length > 1) {
					for (k = 0; k < keys.length; k++) {
						key = keys[k];

						prReturn[key.substr(-2)] = canada.objects[key];
					}
				} else if (keys.length === 1){
					root = canada.objects[keys[0]].geometries;

					for (k = 0; k < root.length; k++) {
						key = root[k].properties.PRCODE;

						prReturn[key.substr(-2)] = root[k];
					}
				}

				return prReturn;
			})(canada);
			try {
				var provincesKeys = Object.keys(provinces),
					p, provinceKey;

				for(p = 0; p < provincesKeys.length; p += 1) {
					provinceKey = provincesKeys[p];
					if (!settings.provinces || settings.provinces.indexOf(provinceKey) !== -1) {
						canadaLayer.append("path")
							.datum(topojson.feature(canada, provinces[provinceKey]))
							.attr("class", provinceKey)
							.attr("d", path);

						rtnObj.provinces[provinceKey] = {
							zoom: zoom.bind(rtnObj, provinceKey)
						};
					}
				}

				rtnObj.obj = canadaLayer;
				rtnObj._bBox = canadaLayer.node().getBBox();
				rtnObj.zoom = zoom.bind(rtnObj);

				rtnObj.zoom();

				if (cb && typeof cb === "function") {
					cb();
				}
			} catch(e) {
				return dispatch.call("error", rtnObj, e);
			}
		},
		createAdditionalLayer = function(layer) {
			var layerGroup = svg.append("g")
					.attr("class", layer.name),
				features = layer.getObjects(layer.data),
				f;

			for (f = 0; f < features.length; f++) {
				layerGroup.append("path")
					.datum(topojson.feature(layer.data, features[f]))
					.attr("d", path)
					.attr("class", layer.getClass ? layer.getClass(features[f]) : "");
			}
		},
		rtnObj, projection, path;

	settings = settings || {};

	rtnObj = {
		settings: settings,
		svg: svg,
		provinces: {},
		on: function(event, fn) {
			dispatch.on(event, fn);
			return this;
		}
	};

	if (settings.provinces && typeof settings.provinces === "string") {
		settings.provinces = [settings.provinces];
	}

	if (!settings.baseMap) {
		settings.baseMap = "data/canada.json";
	}

	projection = settings.projection = settings.projection ||
		d3.geoTransverseMercator()
			.rotate([95,0]);
	path = d3.geoPath()
		.projection(projection);

	loadLayers();

	return rtnObj;
};
