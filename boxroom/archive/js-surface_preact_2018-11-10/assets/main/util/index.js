'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../../submodules/util/js-surface.util.cjs.production.js')
} else {
  module.exports = require('../../submodules/util/js-surface.util.cjs.development.js')
}
