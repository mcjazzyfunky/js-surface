'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.experimental.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.experimental.cjs.development.js')
}
