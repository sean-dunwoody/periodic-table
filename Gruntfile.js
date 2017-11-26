module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            js: {
                src: [
                    'app/assets/js/ajax.js',
                    'app/assets/js/responsive-nav.js',
                    'app/assets/js/simple_tabs.js',
                    'app/assets/js/offset.js',
                    'app/assets/js/element.js',
                    'app/assets/js/search.js',
                    'app/assets/js/default.js'
                ],
                dest: 'dist/assets/js/default.js'
            },
            // move the css file to the dist folder so we can run uncss on it
            cssComponents: {
                src: ['app/assets/css/components/_element.css', 'app/assets/css/components/_navigation.css', 'app/assets/css/components/_search.css'],
                dest: 'dist/assets/css/components.css'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'app',
                        src: ['element/*.json'],
                        dest: 'dist',
                        filter: 'isFile'
                    }
                ]
            },
            css: {
                files: [
                    {
                        src: 'app/assets/css/screen.css',
                        dest: 'dist/assets/css/screen.min.css',
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
        uncss: {
            dist: {
                files: {
                    'dist/assets/css/screen.css': ['dist/index.html', 'dist/about.html']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/assets/css/screen.min.css': ['dist/assets/css/screen.css', 'dist/assets/css/components.css']
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/img',
                    flatten: true,
                    src: ['*.{png,jpg,jpeg,gif}'],
                    dest: 'dist/assets/img'
                }]
            }
        },
        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['app/index.html'],
                    'dist/about.html': ['app/about.html']
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
                files: ['app/*.html'],
                tasks: ['processhtml', 'htmlmin']
            },
            css: {
                files: ['app/assets/css/**/*.css'],
                tasks: ['copy', 'concat', 'uncss', 'cssmin']
                //options: {
                //    livereload: true,
                //},
            },
            js: {
                files: ['app/assets/js/*.js'],
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
    grunt.registerTask('build', ['copy', 'concat', 'uglify', 'processhtml', 'htmlmin', 'uncss', 'cssmin', 'imagemin']);

};
