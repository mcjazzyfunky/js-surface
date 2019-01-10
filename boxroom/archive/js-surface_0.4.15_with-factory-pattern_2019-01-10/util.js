'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.util.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.util.cjs.development.js')
}
