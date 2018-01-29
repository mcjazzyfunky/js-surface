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
  //                  'transform-es2015-modules-umd'
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
            preact: {
                entry: ['./build/src/main/__modules__/preact/index.js'],
                output: {
                    filename: './dist/preact/index.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'preact': true,
                    'js-spec': true
                }
            },
            peactAddons: {
                entry: ['./build/src/main/__modules__/preact/addons.js'],
                output: {
                    filename: './dist/preact/addons.js',
                    libraryTarget: 'umd'
                },   
                externals: {
                    'preact': true,
                    'js-spec': true
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
                    'react-dom': true,
                    'js-spec': true
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
                    'react-dom': true,
                    'js-spec': true
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
                    vue: true,
                    'js-spec': true
                }
            },
            vueAddons: {
                entry: ['./build/src/main/__modules__/vue/addons.js'],
                output: {
                    filename: './dist/vue/addons.js',
                    libraryTarget: 'umd'
                },
                externals: {
                    vue: true,
                    'js-spec': true
                }
            }
        },
        browserify: {
            jsSurface: {
                src: 'build/src/main/__modules__/surface/index.js',
                dest: 'dist/index.js',
                options: {
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    external: ['js-spec'],

                    browserifyOptions: {
                        standalone: 'jsSurface'
                    }
                }
            },
            jsSurfaceAddons: {
                src: 'build/src/main/__modules__/surface/addons.js',
                dest: 'dist/addons.js',
                options: {
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    ignore: ['./node_modules/**'],
                    external: ['js-spec'],

                    browserifyOptions: {
                        standalone: 'jsSurfaceAddons'
                    }
                }
            },
            jsSurfaceReact: {
                src: 'build/src/main/__modules/react/index.js',
                dest: 'dist/react/index.js',
                options: {
                    alias: {
                        'js-surface/react': './build/src/main/__modules__/react/index.js',
                    },
                    ignore: ['./node_modules/**'],
                    external: ['js-spec', 'react', 'react-dom'],

                    browserifyOptions: {
                        standalone: 'jsSurfaceReact'
                    }
                }
            },
            jsSurfaceReactAddons: {
                src: 'build/src/main/__modules/react/addons.js',
                dest: 'dist/react/addons.js',
                options: {
                    alias: {
                        'js-surface/react': './build/src/main/__modules__/react/addons.js',
                    },
                    ignore: ['./node_modules/**'],
                    external: ['js-spec', 'react', 'react-dom'],

                    browserifyOptions: {
                        standalone: 'jsSurfaceReactAddons'
                    }
                }
            },
            /*
            jsSurfaceReactNative: {
                src: 'build/src/main/js-surface-react-native.js',
                dest: 'dist/react-native.js',
                options: {
                    alias: {
                        'js-surface': './build/src/main/js-surface-react-native.js'
                    },
                    ignore: ['./node_modules/**'],
                    external: ['js-spec', 'react', 'react-native'],

                    browserifyOptions: {
                        standalone: 'jsSurface'
                    }
                }
            },
            */
            jsSurfacePreact: {
                src: 'build/src/main/__modules__/preact/index.js',
                dest: 'dist/preact/index.js',
                options: {
                    ignore: ['./node_modules/**'],
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    external: ['js-spec', 'preact'],

                    browserifyOptions: {
                        standalone: 'jsSurfacePreact'
                    }
                }
            },
            jsSurfacePreactAddons: {
                src: 'build/src/main/__modules__/preact/addons.js',
                dest: 'dist/preact/addons.js',
                options: {
                    ignore: ['./node_modules/**'],
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    external: ['js-spec', 'preact'],

                    browserifyOptions: {
                        standalone: 'jsSurfacePreactAddons'
                    }
                }
            },
            jsSurfaceVue: {
                src: 'build/src/main/__modules__/vue/index.js',
                dest: 'dist/vue/index.js',
                options: {
                    ignore: ['./node_modules/**'],
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    external: ['js-spec', 'vue'],

                    browserifyOptions: {
                        standalone: 'jsSurfaceVue'
                    }
                }
            },
            jsSurfaceVueAddons: {
                src: 'build/src/main/__modules__/vue/addons.js',
                dest: 'dist/vue/addons.js',
                options: {
                    ignore: ['./node_modules/**'],
                    alias: {
                        'js-surface': './build/src/main/__modules__/surface/index.js'
                    },
                    external: ['js-spec', 'vue'],

                    browserifyOptions: {
                        standalone: 'jsSurfaceVueAddons'
                    }
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
    //grunt.loadNpmTasks('grunt-browserify');
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
