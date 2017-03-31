module.exports = function(grunt){
     
    var buildFiles = ['gruntfile.js', 'server.js']; 

	var jsFiles = [
        'public/js/template.js',
        'public/tools/connection.js',
        //'public/tools/index.js'
        'public/tools/app.js'
	];

	var cssFiles = [
        'public/css/app.css'
	];

	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //grunt.loadTasks('build/tasks');

     // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        jshint: {
            all: [buildFiles, jsFiles],
            options: {
                curly: true,
                eqeqeq: true,
                immed: false, // suppress outer closure warning
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                browser: true,
                jquery: true,
                smarttabs: true,
                strict: false,
                devel: true,
                scripturl: true,
                globals: {
                    ga: true,
                    exports: true,
                    Globalize: true,
                    d3: true,
                    Base64: true,
                    nicEditors: true,
                    nicEditor: true,
                    Galleria: true,
                    docCookies: true,
                    Handlebars: true,
                    gensler: true,
                    _:true,
                    moment:true,
                    base64:true,
                    RTCPeerConnection:true,
                    RTCSessionDescription:true,
                    RTCIceCandidate:true
                },
                esversion: 6
            }
        },
        csslint: {
            options: {
                src: cssFiles,
                rules: {
                    'adjoining-classes': false,
                    'important': false,
                    'duplicate-background-images': false,
                    'box-model': false,
                    'font-faces': false,
                    'box-sizing': false,
                    'zero-units': false,
                    'outline-none': false
                }
            }
        },
        concat: {
            css: {
                src: cssFiles,
                dest: 'public/dist/production.css'
            },
            js: {
                src: jsFiles,
                dest: 'public/dist/production.js'
            }
        },
        cssmin: {
            compress: {
                files: {
                    'public/dist/production.min.css': ['public/dist/production.css']
                }
            }
        },
        uglify: {
            compress: {
                options: {
                    sourceMap: true
                },
                files: {
                    'public/dist/production.min.js': ['public/dist/production.js']
                }
            }
        },
        clean: {
            dist: ['public/dist/*.js', 'public/dist/*.css', 'public/dist/image']
        }
    });

    // Production task.
    grunt.registerTask('prod', ['clean', 'jshint', 'csslint', 'concat', 'cssmin', 'uglify', 'imagerustler', 'generateappsvg']);
    grunt.registerTask('deploy', ['clean', 'concat', 'cssmin', 'uglify', 'imagerustler', 'generateappsvg']);
    // Dev mode: same as prod.
    //grunt.registerTask('default', ['prod']);
    grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'concat']);
};