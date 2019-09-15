import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['js-surface', 'js-surface/react']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createConfig(pkg, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  const
    name = pkg.replace(/\//g, '.'),

    adapter =
      pkg === 'js-surface'
        ? 'dyo'
        : pkg.replace('js-surface/', '')

  let additionalReplacements = {}

  if (pkg !== 'js-surface') {
    additionalReplacements = {
      'adaption/dyo/': `adaption/${adapter}/`,
    }
  }

  return {
    input: 'src/main/index.js', 

    output: {
      file: productive
        ? `dist/${name}.${moduleFormat}.production.js`
        : `dist/${name}.${moduleFormat}.development.js`,

      format: moduleFormat,
      
      name: {
        'js-surface': 'jsSurface',
        'js-surface/react': 'jsSurfaceReact'
      }[pkg],

      sourcemap: productive ? false : 'inline',

      globals: {
        'js-surface': 'jsSurface',
        'js-surface/react': 'jsSurfaceReact',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'js-spec': 'jsSpec'
      }
    },

    external: ['js-surface', 'react', 'react-dom', 'preact'].concat(productive ? 'js-spec' : []), 

    plugins: [
      resolve(),
      commonjs(),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: Object.assign({
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
        }, additionalReplacements)
      }),
      babel({
        presets: ['@babel/preset-env'],
        exclude: 'node_modules/**',
      }),
      productive && (moduleFormat === 'esm' ? terser() : uglify()),
      productive && gzip()
    ],
  }
}
