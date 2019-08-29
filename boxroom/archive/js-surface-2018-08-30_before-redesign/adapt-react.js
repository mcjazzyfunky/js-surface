'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.adapt-react.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.adapt-react.cjs.development.js')
}
