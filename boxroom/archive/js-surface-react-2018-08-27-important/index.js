'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-surface.production.js');
} else {
  module.exports = require('./dist/cjs/js-surface.development.js');
}
