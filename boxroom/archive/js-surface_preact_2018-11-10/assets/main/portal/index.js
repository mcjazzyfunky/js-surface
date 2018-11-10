'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../../submodules/portal/js-surface.portal.cjs.production.js')
} else {
  module.exports = require('../../submodules/portal/js-surface.portal.cjs.development.js')
}
