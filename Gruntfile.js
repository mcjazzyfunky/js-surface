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
            surfaceAddons: {
                entry: ['./build/src/main/__modules__/surface/addons.js'],
                output: {
                    filename: './dist/addons.js',
                    libraryTarget: 'umd'
                },
                externals: {
                    'js-surface': true
                }  
            },
            surfaceGenericCommon: {
                entry: ['./build/src/main/__modules__/generic/common.js'],
                output: {
                    filename: './dist/generic/common.js',
                    libraryTarget: 'umd'
                }
            },
            surfaceGenericFlow: {
                entry: ['./build/src/main/__modules__/generic/flow.js'],
                output: {
                    filename: './dist/generic/flow.js',
                    //libraryTarget: 'umd'
                }
            },
            preact: {
                entry: ['./build/src/main/__modules__/preact/index.js'],
                output: {
                    filename: './dist/preact/index.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'preact': true
                }
            },
            preactAddons: {
                entry: ['./build/src/main/__modules__/preact/addons.js'],
                output: {
                    filename: './dist/preact/addons.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'preact': true
                }
            },
            react: {
                entry: ['./build/src/main/__modules__/react/index.js'],
                output: {
                    filename: './dist/react/index.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'react': true,
                    'react-dom': true
                }
            },
            reactAddons: {
                entry: ['./build/src/main/__modules__/react/addons.js'],
                output: {
                    filename: './dist/react/addons.js',
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
                    filename: './dist/vue/index.js',
                    libraryTarget: 'umd'
                },
                externals: {
                    vue: true
                }
            },
            vueAddons: {
                entry: ['./build/src/main/__modules__/vue/addons.js'],
                output: {
                    filename: './dist/vue/addons.js',
                    libraryTarget: 'umd'
                },
                externals: {
                    vue: true
                }
            }
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
            jsSurfaceAddons: {
                src: ['dist/addons.js'],
                dest: 'dist/addons.min.js'
            },
            jsSurfaceGenericCommon: {
                src: ['dist/generic/common.js'],
                dest: 'dist/generic/common.min.js'
            },
            jsSurfaceGenericFlow: {
                src: ['dist/generic/flow.js'],
                dest: 'dist/generic/flow.min.js'
            },
            jsSurfaceReact: {
                src: ['dist/react/index.js'],
                dest: 'dist/react/index.min.js'
            },
            jsSurfaceReactAddons: {
                src: ['dist/react/addons.js'],
                dest: 'dist/react/addons.min.js'
            },
            /*
            jsSurfaceReactNative: {
                src: ['dist/react-native.js'],
                dest: 'dist/react-native.min.js'
            },
            */
            jsSurfacePreact: {
                src: ['dist/preact/index.js'],
                dest: 'dist/preact/index.min.js'
            },
            jsSurfacePreactAddons: {
                src: ['dist/preact/addons.js'],
                dest: 'dist/preact/addons.min.js'
            },
            jsSurfaceVue: {
                src: ['dist/vue/index.js'],
                dest: 'dist/vue/index.min.js'
            },
            jsSurfaceVueAddons: {
                src: ['dist/vue/addons.js'],
                dest: 'dist/vue/addons.min.js'
            }
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
            jsSurfaceAddons: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/addons.min.js'],
                dest: 'dist/addons.min.js.gz'
            },
            jsSurfaceGenericCommon: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/generic/common.min.js'],
                dest: 'dist/generic/common.min.js.gz'
            },
            jsSurfaceGenericFlow: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/generic/flow.min.js'],
                dest: 'dist/generic/flow.min.js.gz'
            },
            jsSurfaceReact: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/react/index.min.js'],
                dest: 'dist/react/index.min.js.gz'
            },
            jsSurfaceReactAddons: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/react/addons.min.js'],
                dest: 'dist/react/addons.min.js.gz'
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
                src: ['dist/preact/index.min.js'],
                dest: 'dist/preact/index.min.js.gz'
            },
            jsSurfacePreactAddons: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/preact/addons.min.js'],
                dest: 'dist/preact/addons.min.js.gz'
            },
            jsSurfaceVue: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/vue/index.min.js'],
                dest: 'dist/vue/index.min.js.gz'
            },
            jsSurfaceVueAddons: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                src: ['dist/vue/addons.min.js'],
                dest: 'dist/vue/addons.min.js.gz'
            }
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
