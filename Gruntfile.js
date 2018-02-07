module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['build/*', 'dist/*'],
            }
        },
        babel: {
            options: {
                moduleId: 'Surface',
                sourceType: 'module',
                presets: ['es2015', 'es2016', 'es2017'],
                retainLines: true,
                moduleIds: false,
                sourceMaps: true,
                plugins: [
                    'transform-object-rest-spread'
                    // 'transform-es2015-modules-umd'
                ]
            },
            dist:  {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['src/main/**/*.js*'],
                    dest: 'build/',
                    ext: '.js'
                }]
            }
        },
        esdoc: {
            dist: {
                options: {
                    source: 'src/main',
                    destination: 'dist/docs/api',
                    //destination: 'dist/v<%= pkg.version %>/docs/api',
                    //undocumentIdentifier: false,
                    //unexportIdentifier: true,
                    includeSource: true,
                    //autoPrivate: false,
                    title: 'js-surface'
                }
            }
        },
        webpack: {
            surface: {
                entry: ['./build/src/main/__modules__/surface/index.js'],
                output: {
                    filename: './dist/index.js',
                    libraryTarget: 'umd'
                }   
            },
            surfaceCommon: {
                entry: ['./build/src/main/__modules__/common/index.js'],
                output: {
                    filename: './dist/common.js',
                    libraryTarget: 'umd'
                }
            },
            preact: {
                entry: ['./build/src/main/__modules__/preact/index.js'],
                output: {
                    filename: './dist/preact.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'preact': true
                }
            },
            react: {
                entry: ['./build/src/main/__modules__/react/index.js'],
                output: {
                    filename: './dist/react.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'react': true,
                    'react-dom': true
                }
            },
            /*
            reactNative: {
                entry: ['./build/src/main/js-surface-react-native.js'],
                output: {
                    filename: './dist/react-native.js',
                    libraryTarget: 'umd'
                }   
            },
            */
            vue: {
                entry: ['./build/src/main/__modules__/vue/index.js'],
                output: {
                    filename: './dist/vue.js',
                    libraryTarget: 'umd'
                },
                externals: {
                    vue: true
                }
            },
        },
        uglify: {
            options: {
                ASCIIOnly: true,
                banner: '/*\n'
                        + ' <%= pkg.name %> v<%= pkg.version %> - '
                        + '<%= grunt.template.today("yyyy-mm-dd") %>\n'
                        + ' Homepage: <%= pkg.homepage %>\n'
                        + ' Licencse: New BSD License\n'
                        + '*/\n'
            },
            jsSurface: {
                src: ['dist/index.js'],
                dest: 'dist/index.min.js'
            },
            jsSurfaceCommon: {
                src: ['dist/common.js'],
                dest: 'dist/common.min.js'
            },
            jsSurfaceReact: {
                src: ['dist/react.js'],
                dest: 'dist/react.min.js'
            },
            /*
            jsSurfaceReactNative: {
                src: ['dist/react-native.js'],
                dest: 'dist/react-native.min.js'
            },
            */
            jsSurfacePreact: {
                src: ['dist/preact.js'],
                dest: 'dist/preact.min.js'
            },
            jsSurfaceVue: {
                src: ['dist/vue.js'],
                dest: 'dist/vue.min.js'
            },
        },
        compress: {
            jsSurface: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/index.min.js'],
                dest: 'dist/index.min.js.gz'
            },
            jsSurfaceCommon: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/common.min.js'],
                dest: 'dist/common.min.js.gz'
            },
            jsSurfaceReact: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/react.min.js'],
                dest: 'dist/react.min.js.gz'
            },
            /*
            jsSurfaceReactNative: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/react-native.min.js'],
                dest: 'dist/react-native.min.js.gz'
            },
            */
            jsSurfacePreact: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/preact.min.js'],
                dest: 'dist/preact.min.js.gz'
            },
            jsSurfaceVue: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/vue.min.js'],
                dest: 'dist/vue.min.js.gz'
            },
        },
        asciidoctor: [{
            options: {
                cwd: 'doc'
            },
            files: {
                'dist/docs': ['*.adoc'],
            },
        }],
        watch: {
            js: {
                options: {
                    spawn: true,
                },
                files: ['src/**/*.js', 'Gruntfile.js',],
                //tasks: ['compile', 'mochaTest']
                tasks: ['dist']
            }
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-asciidoctor');
    //grunt.loadNpmTasks('grunt-esdoc');

    grunt.registerTask('compile', ['babel']);
    grunt.registerTask('test', ['babel', 'mochaTest']);
    grunt.registerTask('dist', ['clean', 'babel', 'webpack', 'uglify', 'compress'/*, 'esdoc'*/]);
    grunt.registerTask('default', ['dist']);
};
