'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.hooks.production.js')
} else {
  module.exports = require('./dist/js-surface.hooks.cjs.development.js')
}
