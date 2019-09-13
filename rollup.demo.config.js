import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const ADAPTER = 'react'

export default {
  input: 'src/demo/demo.tsx',

  output: {
    file: './build/demo.js',
    format: 'umd',

    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'preact': 'preact',
      'preact/hoooks': 'preactHooks',
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
      
      values: {
        'process.env.NODE_ENV': "'development'",
        'adaption/dyo/': `adaption/${ADAPTER}/`
      }
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
