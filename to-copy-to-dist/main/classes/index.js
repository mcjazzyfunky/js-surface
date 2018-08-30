'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../../submodules/classes/js-surface.classes.cjs.production.js')
} else {
  module.exports = require('../../submodules/classes/js-surface.classes.cjs.development.js')
}
