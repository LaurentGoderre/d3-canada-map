/* eslint-env node */
module.exports = function(grunt) {
	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
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
	grunt.registerTask("default", ["copy", "uglify"]);
};
