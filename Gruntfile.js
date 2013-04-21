/*global module:false*/
module.exports = function(grunt) {
  /** 
   * Load required Grunt tasks. These are installed based on
   * the versions listed in `package.json` when you do
   * `npm install` in this directory.
   */
  // load all grunt tasks with matchdep
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: grunt.template.process(
      grunt.file.read('grunt/templates/banner.template.js'),
      {
        data: {
          "pkg": grunt.file.readJSON('package.json')
        }
      }
    ),
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    compass: {
      common: {
        options: {
          sassDir: 'src/assets/scss/',
          cssDir: 'src/assets/styles/'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      },
      compass: {
        files: 'src/assets/scss/*.scss',
        tasks: ['compass']
      }
    }
  });
  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
};
