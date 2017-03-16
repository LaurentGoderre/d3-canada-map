/* eslint-env node */
module.exports = function(grunt) {
	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require("load-grunt-tasks")(grunt, {pattern: ["grunt-*", "gruntify-*"]});

	grunt.initConfig({
		eslint: {
			src: ["src/*.js"]
		},

		connect: {
			options: {
				base: "."
			},
			server: {
				options: {
					port: 8000,
					keepalive: true
				},
			},
			test: {
				options: {
					port: 8081,
				},
			},
		},
		mocha: {
			test: {
				options: {
					reporter: "spec",
					urls: ["http://localhost:8081/test/test.html"]
				}
			}
		},

		copy: {
			js: {
				files: {
					"dest/d3-canada-map.js": "src/d3-canada-map.js"
				}
			}
		},

		uglify: {
			options: {
				sourceMap: true
			},
			all: {
				files: {
					"dest/d3-canada-map.min.js": "dest/d3-canada-map.js"
				}
			}
		}
	});
	grunt.registerTask("test", ["connect:test", "mocha"]);
	grunt.registerTask("default", ["eslint", "test", "copy", "uglify"]);
};
