// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
         random: true,
         seed: 2791,
         oneFailurePerSpec: false,
         failFast: true,
         timeoutInterval: 20000,
         // https://jasmine.github.io/api/edge/Configuration.html
      },
    },
    browsers: ['ChromeHeadless'],
      customLaunchers: {
         ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox', '--disable-gpu']
         },
         FirefoxHeadless: {
            base: 'Firefox',
            flags: ['--headless', '--no-sandbox', '--disable-gpu']
         }
      },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/product_web'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    restartOnFileChange: true
  });
};
