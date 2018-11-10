import { eslint } from 'rollup-plugin-eslint'
import alias from 'rollup-plugin-alias'
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

for (const submoduleName of ['all', 'classes', 'dom-factories', 'portal', 'util']) {
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
      exports: 'named',
      sourcemap: productive ? false : 'inline',

      globals: {
      }
    },

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        module: true,
        browser: true,
      }),
      commonjs({
      }),
      eslint({
      }),
      replace({
        exclude: 'node_modules/**',

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "import 'preact/devtools'": productive ? '' : "import 'preact/devtools'"
        }
      }),
      babel({
        //exclude: 'node_modules/**',
        //externalHelpers: true,
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
      name: 'jsSurface', 
      exports: 'named',
      //sourcemap: productive ? false : 'inline', // TODO

      globals:
        submoduleName === 'all'
          ? {}
          : { 'js-surface': 'jsSurface' }
    },

    external: submoduleName === 'all' ? [] : ['js-surface'],

    plugins: [
      alias({
        'js-surface': 'src/main/js-surface/index.js'
      }),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs({
      }),
      eslint({
      }),
      babel({
        //exclude: 'node_modules/**',
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
