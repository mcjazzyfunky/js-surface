'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.adapt-dyo.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.adapt-dyo.cjs.development.js')
}
