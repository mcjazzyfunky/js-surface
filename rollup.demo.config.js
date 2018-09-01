import path from 'path'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'

function createRollupConfig(productive) {
  return {
    input: 'src/demo/demo.js',

    output: {
      file: productive
        ? 'build/js-surface.demo.production.js'
        : 'build/js-surface.demo.development.js',

      format: 'umd',
      name: 'jsSurface', 
      sourcemap: false,

      globals: {
        'js-spec': 'jsSpec',
        'preact': 'preact',
        'preact-context': 'preactContext'
      }
    },

    external: ['preact', 'preact-context', 'js-spec'],

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      alias({
        'js-surface/classes': path.resolve(__dirname, 'src/main/js-surface.classes/index.js'),
        'js-surface/util': path.resolve(__dirname, 'src/main/js-surface.util/index.js'),
        'js-surface/dom-factories': path.resolve(__dirname, 'src/main/js-surface.dom-factories/index.js'),
        'js-surface': path.resolve(__dirname, 'src/main/js-surface/index.js'),
      }),
      commonjs({
      }),
      eslint({
      }),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: true,
        presets: [['@babel/preset-env', { modules: false }]],
      }),
      replace({
        exclude: 'node_modules/**',
        
        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'"
        }
      })
    ],
  }
}

export default [
  createRollupConfig(false),
  createRollupConfig(true)
]
