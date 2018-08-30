'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../../submodules/devtools/js-surface.devtools.cjs.production.js')
} else {
  module.exports = require('../../submodules/devtools/js-surface.devtools.cjs.development.js')
}
