import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const ADAPTER = 'react'

let additionalReplacements = {}

if (ADAPTER !== 'dyo') {
  additionalReplacements = {
    'adaption/dyo/': `adaption/${ADAPTER}/`,
    'main/js-surface': `main/js-surface.${ADAPTER}`
  }
}

export default {
  input: 'src/demo/demo.tsx',

  output: {
    file: './build/demo.js',
    format: 'umd',

    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'preact': 'preact',
      'preact/hooks': 'preactHooks',
      'dyo': 'dyo',
      'js-spec': 'jsSpec'
    }
  },

  external: ['react', 'react-dom', 'preact', 'dyo', 'js-spec'],
  
  plugins: [
    resolve(),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      
      values: Object.assign({ 
        'process.env.NODE_ENV': "'development'"
      }, additionalReplacements),
    }),
    typescript(),
    serve({
      open: true,
      contentBase: '.',
      openPage: '/src/demo/index.html'
    }),
    livereload({
      watch: ['src/demo', 'build']
    })
  ]
}
