process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');

const config = defaults.__get__('config');
config.optimization.minimize = false;
defaults.__set__('config', config);
