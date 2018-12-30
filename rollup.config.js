import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import uglifyES from 'rollup-plugin-uglify-es'
import gzip from 'rollup-plugin-gzip'

function createRollupConfig(moduleFormat, productive) {
  return {
    input: 'src/main/js-react-utils.ts',

    output: {
      file: productive
        ? `dist/js-react-utils.${moduleFormat}.production.js`
        : `dist/js-react-utils.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: 'jsReactUtils', 
      sourcemap: productive ? false : 'inline',

      globals: {
        'react': 'React',
        'js-spec': 'jsSpec'
      }
    },

    external: productive ? ['react', 'js-spec'] : ['react'],

    plugins: [
      resolve(),
      typescript({
        exclude: 'node_modules/**'
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
