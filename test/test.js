/* eslint-env mocha */
/* global getCanadaMap, expect */
describe("Calling getCanadaMap with default settings", function() {
	var svg, canada;

	before(function(done){
		svg = d3.select("body")
			.append("svg");
		canada = getCanadaMap(svg);
		canada
		.on("error", function(error) {
			done(error);
		})
		.on("loaded", done);
	});

	after(function(){
		svg.remove();
	});

	it("should return an object", function() {
		expect(typeof canada).to.equal("object");
	});

	describe("The return object", function() {
		it("should have a reference to the SVG element", function() {
			expect(canada.svg).to.equal(svg);
		});

		it("should have an object with all provinces", function() {
			expect(Object.keys(canada.provinces)).to.deep.equal(["ON", "NL", "AB", "NB", "PE", "QC", "MB", "YK", "NS", "NU", "NT", "BC", "SK"]);
		});

		it("should have a cached bounding box for Canada", function() {
			expect(canada._bBox).to.deep.equal({
				x: 418.8597412109375,
				y: 17.025590896606445,
				width: 139.9796142578125,
				height: 115.36405944824219
			});
		});

		it("should have a settings object", function() {
			expect(typeof canada.settings).to.equal("object");
		});

		it("should have a zoom function", function() {
			expect(typeof canada.zoom).to.equal("function");
		});
	});

	describe("The settings object", function() {
		it("should contain the d3 projection used", function() {
			expect(Object.keys(canada.settings.projection)).to.deep.equal(["stream", "clipAngle", "clipExtent", "scale", "translate", "center", "rotate", "precision", "fitExtent", "fitSize", "invert"]);
		});
	});

	describe("The provinces object", function() {
		it("should have a zoom function for each provinces", function() {
			expect(typeof canada.provinces.ON.zoom).to.equal("function");
			expect(typeof canada.provinces.NL.zoom).to.equal("function");
			expect(typeof canada.provinces.AB.zoom).to.equal("function");
			expect(typeof canada.provinces.NB.zoom).to.equal("function");
			expect(typeof canada.provinces.PE.zoom).to.equal("function");
			expect(typeof canada.provinces.QC.zoom).to.equal("function");
			expect(typeof canada.provinces.MB.zoom).to.equal("function");
			expect(typeof canada.provinces.YK.zoom).to.equal("function");
			expect(typeof canada.provinces.NS.zoom).to.equal("function");
			expect(typeof canada.provinces.NU.zoom).to.equal("function");
			expect(typeof canada.provinces.NT.zoom).to.equal("function");
			expect(typeof canada.provinces.BC.zoom).to.equal("function");
			expect(typeof canada.provinces.SK.zoom).to.equal("function");
		});
	});

	describe("The map SVG", function() {
		it("should should have a viewBox", function() {
			expect(canada.svg.attr("viewBox")).to.equal("418.8597412109375 17.025590896606445 139.9796142578125 115.36405944824219");
		});

		it("should have a layer for all of Canada", function() {
			expect(canada.svg.node().querySelectorAll(".canada-map").length).to.equal(1);
		});

		it("should contain a path for each province and territory", function() {
			expect(canada.svg.node().querySelectorAll("path.ON, path.NL, path.AB, path.NB, path.PE, path.QC, path.MB, path.YK, path.NS, path.NU, path.NT, path.BC, path.SK")).length(13);
		});

		it("should draw the provinces", function() {
			var regexp = /M[^,]*,/;
			expect(canada.svg.select(".ON").attr("d").match(regexp)[0]).to.equal("M491.63661554877234,");
			expect(canada.svg.select(".NL").attr("d").match(regexp)[0]).to.equal("M552.8605707226327,");
			expect(canada.svg.select(".AB").attr("d").match(regexp)[0]).to.equal("M452.6340372105042,");
			expect(canada.svg.select(".NB").attr("d").match(regexp)[0]).to.equal("M535.506758485303,");
			expect(canada.svg.select(".PE").attr("d").match(regexp)[0]).to.equal("M542.3983836693521,");
			expect(canada.svg.select(".QC").attr("d").match(regexp)[0]).to.equal("M525.2172661173388,");
			expect(canada.svg.select(".MB").attr("d").match(regexp)[0]).to.equal("M480.2270213422908,");
			expect(canada.svg.select(".YK").attr("d").match(regexp)[0]).to.equal("M440.73014153267707,");
			expect(canada.svg.select(".NS").attr("d").match(regexp)[0]).to.equal("M539.3374626373816,");
			expect(canada.svg.select(".NU").attr("d").match(regexp)[0]).to.equal("M506.77979433035915,");
			expect(canada.svg.select(".NT").attr("d").match(regexp)[0]).to.equal("M442.2556708517041,");
			expect(canada.svg.select(".BC").attr("d").match(regexp)[0]).to.equal("M428.79589593976755,");
			expect(canada.svg.select(".SK").attr("d").match(regexp)[0]).to.equal("M468.2295195668913,");
		});
	});
});

describe("Zoom on a province", function(){
	var svg, canada;

	before(function(done){
		svg = d3.select("body")
			.append("svg");
		canada = getCanadaMap(svg);
		canada
		.on("error", function(error) {
			done(error);
		})
		.on("loaded", done);
	});

	after(function(){
		svg.remove();
	});

	it("trigger a zoom event", function(done) {
		canada.on("zoom", function(province) {
			expect(province).to.equal("ON");
			done();
		});
		canada.provinces.ON.zoom();
	});

	it("should change the viewBox to cover only the province", function() {
		expect(canada.svg.attr("viewBox")).to.equal("479.7120056152344 91.65025329589844 40.736602783203125 40.73939514160156");
	});

	it("should add the 'zoomed' class to the canada layer", function() {
		expect(canada.svg.select(".canada-map").attr("class")).to.contain("zoomed");
	});

	it("should add the 'zoomed' class to the province path", function() {
		expect(canada.svg.select(".ON").attr("class")).to.contain("zoomed");
	});

	it("should cache the province viewBox", function() {
		expect(canada.provinces.ON._bBox).to.deep.equal({
			x: 479.7120056152344,
			y: 91.65025329589844,
			height: 40.73939514160156,
			width: 40.736602783203125
		});
	});
});


describe("Zoom on Canada", function(){
	var svg, canada;

	before(function(done){
		svg = d3.select("body")
			.append("svg");
		canada = getCanadaMap(svg);
		canada
		.on("error", function(error) {
			done(error);
		})
		.on("loaded", done);
	});

	after(function(){
		svg.remove();
	});

	it("trigger a zoom event", function(done) {
		canada.on("zoom", function(province) {
			expect(province).to.equal(undefined);
			done();
		});
		canada.zoom();
	});

	it("should remove the 'zoomed' class from the canada layer", function() {
		expect(canada.svg.select(".canada-map").attr("class")).to.not.contain("zoomed");
	});

	it("should remove the 'zoomed' class from the province path", function() {
		expect(canada.svg.select(".ON").attr("class")).to.not.contain("zoomed");
	});

	it("should change the viewBox to cover only the province", function() {
		expect(canada.svg.attr("viewBox")).to.equal("418.8597412109375 17.025590896606445 139.9796142578125 115.36405944824219");
	});
});

describe("Limitting the displayed provinces", function() {
	var svg, canada;

	before(function(done){
		svg = d3.select("body")
			.append("svg");
		canada = getCanadaMap(svg, {
			provinces: ["ON", "QC"]
		});
		canada
		.on("error", function(error) {
			done(error);
		})
		.on("loaded", done);
	});

	after(function(){
		svg.remove();
	});

	it("should have an object with only the selected provinces", function() {
		expect(Object.keys(canada.provinces)).to.deep.equal(["ON", "QC"]);
	});

	it("should have a cached bounding box for the selected provinces", function() {
		expect(canada._bBox).to.deep.equal({
			x: 479.7120056152344,
			y: 71.92854309082031,
			width: 64.53091430664062,
			height: 60.46110534667969
		});
	});

	describe("The map SVG", function() {
		it("should should have a viewBox", function() {
			expect(canada.svg.attr("viewBox")).to.equal("479.7120056152344 71.92854309082031 64.53091430664062 60.46110534667969");
		});

		it("should contain a path for each of the selected province and territory", function() {
			expect(canada.svg.node().querySelectorAll("path.ON, path.QC")).length(2);
		});

		it("should draw the provinces", function() {
			var regexp = /M[^,]*,/;
			expect(canada.svg.select(".ON").attr("d").match(regexp)[0]).to.equal("M491.63661554877234,");
			expect(canada.svg.select(".QC").attr("d").match(regexp)[0]).to.equal("M525.2172661173388,");
		});
	});
});

describe("Custom projection", function() {
	var svg, canada;

	before(function(done){
		svg = d3.select("body")
			.append("svg");
		canada = getCanadaMap(svg, {
			projection: d3.geoEquirectangular().rotate([95,0])
		});
		canada
		.on("error", function(error) {
			done(error);
		})
		.on("loaded", done);
	});

	after(function(){
		svg.remove();
	});

	it("should should have a viewBox", function() {
		expect(canada.svg.attr("viewBox")).to.equal("357.45703125 28.536026000976562 235.40887451171875 110.44105529785156");
	});

	it("should draw the provinces", function() {
		var regexp = /M[^,]*,/;
		expect(canada.svg.select(".ON").attr("d").match(regexp)[0]).to.equal("M499.98781254722064,");
		expect(canada.svg.select(".NL").attr("d").match(regexp)[0]).to.equal("M584.2490803428306,");
		expect(canada.svg.select(".AB").attr("d").match(regexp)[0]).to.equal("M439.92899887116556,");
		expect(canada.svg.select(".NB").attr("d").match(regexp)[0]).to.equal("M554.8200262091306,");
		expect(canada.svg.select(".PE").attr("d").match(regexp)[0]).to.equal("M567.1331424586706,");
		expect(canada.svg.select(".QC").attr("d").match(regexp)[0]).to.equal("M543.5663559084037,");
		expect(canada.svg.select(".MB").attr("d").match(regexp)[0]).to.equal("M480.4233773591368,");
		expect(canada.svg.select(".YK").attr("d").match(regexp)[0]).to.equal("M363.1780256904759,");
		expect(canada.svg.select(".NS").attr("d").match(regexp)[0]).to.equal("M558.3044262185606,");
		expect(canada.svg.select(".NU").attr("d").match(regexp)[0]).to.equal("M521.7888558494656,");
		expect(canada.svg.select(".NT").attr("d").match(regexp)[0]).to.equal("M372.21863112034845,");
		expect(canada.svg.select(".BC").attr("d").match(regexp)[0]).to.equal("M404.9908258036369,");
		expect(canada.svg.select(".SK").attr("d").match(regexp)[0]).to.equal("M462.7894881222238,");
	});
});
