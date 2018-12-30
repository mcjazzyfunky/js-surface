import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: 'src/demo/demo.tsx',
  output: {
    file: './build/demo.js',
    format: 'umd',

    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'js-spec': 'jsSpec',
      'js-spec/dev-only': 'jsSpec'
    }
  },

  external: ['react', 'react-dom', 'js-spec', 'js-spec/dev-only'],
  
  plugins: [
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      
      values: {
        'process.env.NODE_ENV': "'development'"
      }
    }),
    typescript(),
    //serve({
    //  open: true,
    //  contentBase: '.',
    //  openPage: '/src/demo/demo.html'
    //}),
    //livereload({
    //  watch: ['src/demo', 'build']
    //})
  ]
}
