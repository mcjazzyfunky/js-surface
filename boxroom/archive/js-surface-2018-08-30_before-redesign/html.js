'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-surface.html.cjs.production.js')
} else {
  module.exports = require('./dist/js-surface.html.cjs.development.js')
}
