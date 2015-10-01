module.exports = function(grunt) {

  // Project Configuration
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),
  	concat: {
  		options: {
  			banner: "(function() {",
  			footer: "})();",
  			separator: ';'
  		},
  		dist: {
  			src: ['js/prototypes.js', 'js/state_main.js', 'js/state_boot.js', 'js/main.js'],
  			dest: 'build/<%= pkg.name %>.js'
  		}
  	},
  	uglify: {
  		build: {
  			src: 'build/<%= pkg.name %>.js',
  			dest: 'build/<%= pkg.name %>.min.js'
  		},
  	}
  });

  // Load the plugin that provides the "uglify" task
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s)
  grunt.registerTask('default', ['concat', 'uglify']);

};