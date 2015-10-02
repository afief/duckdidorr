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
  	},
    compress: {
      main: {
        options: {
          archive: 'publish/<%= pkg.name %>.publish.<%= grunt.template.today("yyyy-mm-dd.hh-MM-ss") %>.zip'
        },
        files: [
          {src: ['assets/**/*', 'index.html', 'js/phaser.min.js', 'css/style.css', 'build/<%= pkg.name %>.min.js'], dest: '/'}
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s)
  grunt.registerTask('default', ['concat', 'uglify', 'compress']);

};