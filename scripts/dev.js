process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  console.error(err);
  throw err;
});

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const boxen = require('boxen');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const fs = require('fs-extra');
const paths = require('react-scripts/config/paths');
const webpack = require('webpack');
const webpackConfig = require('react-scripts/config/webpack.config');

const config = webpackConfig('development');

config.entry = config.entry.filter(
  (entry) => !entry.includes('react-dev-utils/webpackHotDevClient.js')
);
config.output.path = paths.appBuild;
paths.publicUrl = paths.appBuild + '/';

config.plugins.push(
  new ExtensionReloader({
    reloadPage: true,
    entries: {
      extensionPage: 'index',
    },
  })
);
config.plugins.push(
  new CopyPlugin({
    patterns: [{ from: './manifest.json' }],
  })
);
config.plugins.push(
  new CleanWebpackPlugin({
    cleanAfterEveryBuildPatterns: [
      '!static/js/*.chunk.js',
      '!static/js/*.chunk.js.map',
    ],
  })
);

let webpackCompiler;
try {
  webpackCompiler = webpack(config);
} catch (err) {
  console.log('Failed to compile.');
  console.log();
  console.log(err.message || err);
  console.log();
  process.exit(1);
}

webpackCompiler.watch({}, function (err, stats) {
  if (!err) {
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: (file) => file !== paths.appHtml, // This will break things if replaced on compile
    });
    console.clear();
    console.log(boxen('Browser Extension Kit', { padding: 1 }));
    console.log('\nDevelopment Server is Running.');
    console.log(
      "\nTo start working, navigate to chrome://extensions, Click 'Load Unpacked' and select the /build folder to begin."
    );
    console.log(
      "Note: Although you don't need to reload the extension to see changes, you'll need to re-toggle it (i.e. click extension icon again)"
    );
    console.log('\n\n');
  } else {
    console.error(err);
  }

  const statsData = stats.toJson({
    all: false,
    warnings: true,
    errors: true,
  });

  if (statsData.warnings.length) {
    console.log('Warnings:\n');
    console.log(statsData.warnings.join('\n\n'));
  }

  if (statsData.errors.length) {
    console.clear();
    console.log(boxen('Browser Extension Kit', { padding: 1 }));
    console.log('\nError! Compilation Failed:\n');
    // Only show first error
    console.log(statsData.errors[0]);
  }
});

webpackCompiler.hooks.invalid.tap('BrowserExtensionKit', () => {
  console.clear();
  console.log(boxen('Browser Extension Kit', { padding: 1 }));
  console.log('\nCompilation in progress...');
});
