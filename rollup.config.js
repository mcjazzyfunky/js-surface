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
    configs.push(createCoreConfig(format, productive))
  }
}

for (const submoduleName of ['classes', 'devtools', 'dom-factories', 'portal', 'util']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createSubmoduleConfig(submoduleName, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createCoreConfig(moduleFormat, productive) {
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
      productive && gzip(),
      productive && moduleFormat === 'umd' && copy({ 'to-copy-to-dist': 'dist' })
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
