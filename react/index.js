'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-surface.react.cjs.production.js')
} else {
  module.exports = require('../dist/js-surface.react.cjs.development.js')
}
