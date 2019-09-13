//import tslint from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['js-surface']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createConfig(pkg, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  return {
    input: 'src/main/index.ts', 

    output: {
      file: productive
        ? `dist/js-surface.${moduleFormat}.production.js`
        : `dist/js-surface.${moduleFormat}.development.js`,

      format: moduleFormat,
      
      name: {
        'js-surface': 'jsSurface',
      }[pkg] || 'jsSurface',
     
      sourcemap: productive ? false : 'inline',

      globals: {
        'js-surface': 'jsSurface',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'dyo': 'Dyo',
        'js-spec': 'jsSpec'
      }
    },

    external: ['js-surface', 'react', 'react-dom', 'preact'].concat(productive ? 'js-spec' : []), 

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
      // TODO: Configure "tslint.json" properly and fix all errors
      //tslint({
      //  throwOnError: true
      //}),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "'../main/index'": "'js-surface'",
          "'../../main/index'": "'js-surface'",
          "'../../../main/index'": "'js-surface'",
          "'../../../../main/index'": "'js-surface'",
          "'../../../../../main/index'": "'js-surface'",
        }
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      productive && (moduleFormat === 'esm' ? terser() : uglify()),
      productive && gzip()
    ],
  }
}
