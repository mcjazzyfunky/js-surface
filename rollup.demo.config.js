import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const ADAPTER = 'dyo'

let additionalReplacements = {}

if (ADAPTER !== 'dyo') {
  additionalReplacements = {
    'adaption/dyo/': `adaption/${ADAPTER}/`,
    'main/js-surface': `main/js-surface.${ADAPTER}`
  }
}

export default {
  input: 'src/demo/demo.jsx',

  output: {
    file: './build/demo.js',
    format: 'umd',

    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'preact': 'preact',
      'preact/hooks': 'preactHooks',
      'preact/compat': 'preactCompat',
      'dyo': 'dyo',
      'js-spec': 'jsSpec'
    }
  },

  external: ['react', 'react-dom', 'preact', 'preact/hooks', 'preact/compat', 'dyo', 'js-spec'],
  
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      
      values: Object.assign({ 
        'process.env.NODE_ENV': "'development'"
      }, additionalReplacements),
    }),
    babel({
      presets: [
        '@babel/preset-env',
        [
          '@babel/preset-react',
          {
            pragma: 'h',
            pragmaFrag: 'Fragment'
          }
        ]
      ],
      exclude: 'node_modules/**',
    }),
    serve({
      open: true,
      contentBase: '.',
      openPage: '/src/demo/index.html'
    }),
    livereload({
      watch: ['src']
    })
  ]
}
