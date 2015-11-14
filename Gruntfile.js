var mozjpeg = require('imagemin-mozjpeg');
// Project Configuration
module.exports = function(grunt) {
  grunt.initConfig({
    // Package
    pkg: grunt.file.readJSON('package.json'),
    // Bower Concat
    bower_concat: {
      options: {
        separator: ';\n'
      },
      all: {
        dest: 'src/js/vendor/_bower.js',
        exclude: [
          'normalize-scss',
          'bourbon',
          'neat']
      }
    },
    // Imagemin
    imagemin: {
      dynamic: {
        options: {
          quality: 80,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['*.{png,jpg}'],
          dest: 'src/img/'
        }]
      }
    },
    // SASS
    sass: {
      build: {
        options: {
          outputStyle: 'uncompressed'
        },
        files: {
          'src/css/style.css': 'src/scss/style.scss'
        }
      },
      deploy: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'build/css/style.css': 'src/scss/style.scss'
        }
      }
    },
    // Uglify
    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
        
      },
      deploy: {
        files: {
          'build/js/main.js': ['src/js/main.js'],
          'build/js/vendor/_bower.js': ['src/js/vendor/_bower.js']
        }
      }
    },
    // Grunt sync
    sync: {
      deploy: {
        files: [{
          cwd: 'src/',
          src: [
            '*.html',
            '*.png',
            'php/*',
            'img/*',
            '!img/src_images'
          ],
          dest: 'build/'
        }]
      },
      netlify: {
        files: [{
          cwd: 'build/',
          src: [
            '*.html',
            '*.png',
            'img/*',
            '!img/source-images',
            'css/*',
            'js/*'
          ],
          dest: 'netlify/'
        }]
      }
    },
    //// Wire-dep
    wiredep: {
      build: {
        src: ['_sass/**/*.scss']
      }
    },

    // Watch
    watch: {
      options: {
        livereload: true
      },

      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass']
      },

      html: {
        files: ['src/index.html'],
        options: {
          livereload:true
        }
      },

      js: {
        files: ['src/js/**/*.js'],
        options: {
          livereload:true
        }
      },
      livereload: {
        options: { livereload: true },
        files: ['src/css/**/*']
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('deploy', ['sass:deploy', 'newer:imagemin' ,'bower_concat', 'uglify', 'sync:deploy']);
  grunt.registerTask('deploy-netlify', ['sass:deploy', 'newer:imagemin' ,'bower_concat', 'uglify', 'sync:deploy', 'sync:netlify']);
  grunt.registerTask('build', ['wiredep', 'sass:build', 'newer:imagemin' ,'bower_concat']);
  grunt.registerTask('default', ['build', 'watch']);

};
