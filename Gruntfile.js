module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            js: {
                src: [
                    'assets/js/ajax.js',
                    'assets/js/responsive-nav.js',
                    'assets/js/simple_tabs.js',
                    'assets/js/element.js',
                    'assets/js/default.js'
                ],
                dest: 'dist/assets/js/default.js'
            },
            // move the css file to the dist folder so we can run uncss on it
            css: {
                src: 'assets/css/screen.css',
                dest: 'dist/assets/css/screen.css'
            },
            cssComponents: {
                src: ['assets/css/components/_element.css', 'assets/css/components/_navigation.css'],
                dest: 'dist/assets/css/components.css'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['element/*.json'],
                        dest: 'dist',
                        filter: 'isFile'
                    }
                ]
            }
        },
        uglify: {
            build: {
                src: 'dist/assets/js/default.js',
                dest: 'dist/assets/js/default.min.js'
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/assets/css/screen.min.css': ['dist/assets/css/screen.css', 'dist/assets/css/components.css']
                }
            }
        },
        uncss: {
            dist: {
                files: {
                    'dist/assets/css/screen.css': ['dist/index.html', 'dist/about.html']
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/img',
                    flatten: true,
                    src: ['*.{png,jpg,jpeg,gif}'],
                    dest: 'dist/assets/img'
                }]
            }
        },
        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['index.html'],
                    'dist/about.html': ['about.html'],
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'dist/index.html',     // 'destination': 'source'
                    'dist/about.html': 'dist/about.html'
                }
            }
        },
        watch: {
            html: {
                files: ['*.html'],
                tasks: ['processhtml', 'htmlmin']
            },
            css: {
                files: ['assets/css/**/*.css'],
                tasks: ['concat', 'uncss', 'cssmin'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['assets/js/*.js'],
                tasks: ['concat', 'uglify']
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['copy', 'concat', 'uncss', 'uglify', 'processhtml', 'htmlmin', 'cssmin', 'imagemin']);

};
