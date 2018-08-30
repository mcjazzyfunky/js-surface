'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../../submodules/dom-factories/js-surface.dom-factories.cjs.production.js')
} else {
  module.exports = require('../../submodules/dom-factories/js-surface.dom-factories.cjs.development.js')
}
