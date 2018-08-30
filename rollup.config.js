import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import { uglify as uglifyJS} from 'rollup-plugin-uglify'
import uglifyES from 'rollup-plugin-uglify-es'
import gzip from 'rollup-plugin-gzip'

function createRollupConfig(moduleFormat, productive) {
  return {
    input: 'src/main/js-surface/index.js',

    output: {
      file: productive
        ? `dist/js-surface.${moduleFormat}.production.js`
        : `dist/js-surface.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: 'jsSurface', 
      sourcemap: productive ? false : 'inline',

      globals: {
        'js-surface': 'jsSurface',
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
      commonjs({
        namedExports: {
          'node_modules/js-spec/dist/js-spec.js': ['Spec']
        }
      }),
      eslint({
        exclude: [
          'src/styles/**',
        ]
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
      }),
      productive && (moduleFormat === 'esm' ? uglifyES() : uglifyJS()),
      productive && gzip()
    ],
  }
}

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  for (const productive of [true, false]) {
    configs.push(createRollupConfig(format, productive))
  }
}

export default configs
