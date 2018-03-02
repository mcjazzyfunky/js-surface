const path = require('path');

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
                entry: ['./build/src/main/__modules__/surface.js'],
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'index.js',
                    library: 'jsSurface',
                    libraryTarget: 'umd'
                },
                resolve: {
                    alias: {
                        'react$': path.resolve(__dirname, 'node_modules', 'react', 'umd', 'react.production.min.js'),
                        'react-dom$': path.resolve(__dirname, 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js'),
                        'js-hyperscript/react$': path.resolve(__dirname, 'node_modules', 'js-hyperscript', 'dist', 'react.js')
                        //'dio.js$': path.resolve(__dirname, 'node_modules', 'dio.js', 'dist', 'umd.js'),
                        //'js-hyperscript/dio$': path.resolve(__dirname, 'node_modules', 'js-hyperscript', 'dist', 'dio.js')
                    }
                }
            },
            surfaceCommon: {
                entry: ['./build/src/main/__modules__/common.js'],
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'common.js',
                    library: 'jsSurfaceCommon',
                    libraryTarget: 'umd'
                }
            },
            react: {
                entry: ['./build/src/main/__modules__/react.js'],
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'react.js',
                    library: 'jsSurfaceReact',
                    libraryTarget: 'umd'
                },   
                resolve: {
                    alias: {
                        'js-hyperscript/react$': path.resolve(__dirname, 'node_modules', 'js-hyperscript', 'dist', 'react.js')
                    }
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
                entry: ['./build/src/main/__modules__/vue.js'],
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'vue.js',
                    libraryTarget: 'umd'
                },
                resolve: {
                    alias: {
                        'js-hyperscript/universal$': path.resolve(__dirname, 'node_modules', 'js-hyperscript', 'dist', 'universal.js')
                    }
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
