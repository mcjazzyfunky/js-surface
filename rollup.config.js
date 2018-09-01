import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import { uglify as uglifyJS} from 'rollup-plugin-uglify'
import uglifyES from 'rollup-plugin-uglify-es'
import gzip from 'rollup-plugin-gzip'
import copy from 'rollup-plugin-copy'

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  for (const productive of [false, true]) {
    const copyAssets = format === 'esm' && productive === true

    configs.push(createCoreConfig(format, productive, copyAssets))
  }
}

for (const submoduleName of ['classes', 'dom-factories', 'portal', 'util']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createSubmoduleConfig(submoduleName, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createCoreConfig(moduleFormat, productive, copyAssets) {
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
      }
    },

    external: [],

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
      replace({
        exclude: 'node_modules/**',

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "import 'preact/devtools'": productive ? '' : "import 'preact/devtools'"
        }
      }),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: true,
        presets: [['@babel/preset-env', { modules: false }]],
      }),
      productive && (moduleFormat === 'esm' ? uglifyES() : uglifyJS()),
      productive && gzip(),
      copyAssets && copy({ 'assets': 'dist' })
    ],
  }
}

function createSubmoduleConfig(submoduleName, moduleFormat, productive) {
  return {
    input: `src/main/js-surface.${submoduleName}/index.js`,

    output: {
      file: productive
        ? `dist/submodules/${submoduleName}/js-surface.${submoduleName}.${moduleFormat}.production.js`
        : `dist/submodules/${submoduleName}/js-surface.${submoduleName}.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: 'jsSurface.' + submoduleName, 
      sourcemap: productive ? false : 'inline',

      globals: {
        'js-surface': 'jsSurface',
        'preact': 'preact',
        'preact-portal': 'preactPortal'
      }
    },

    external: ['preact', 'preact-portal', 'js-surface'],

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
