//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import alias from 'rollup-plugin-alias'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['core', 'dom', 'html', 'svg', 'use', 'util']) {
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
    input: `src/${pkg}/main/index.ts`, 

    output: {
      file: productive
        ? `dist/${pkg}.${moduleFormat}.production.js`
        : `dist/${pkg}.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: `jsSurface.${pkg}`,
      sourcemap: productive ? false : 'inline',

      paths: {
        'js-surface': './src/core/index.ts'
      },

      globals: {
        'js-spec': 'jsSpec',
        'js-surface': 'jsSurface'
      }
    },

    external: ['js-surface'],

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      alias({
        resolve: ['.ts'],
        'js-surface': './src/core/main/index.ts'
      }),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'"
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
