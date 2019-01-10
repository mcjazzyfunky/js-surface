'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.use.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.use.cjs.development.js')
}
