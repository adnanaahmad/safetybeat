// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 11000,
  // Tests will run in sequence in below array. Other wise files which comes first in tests folder will be executed, if we uncomment first line in array.
  specs: [
    // './src/tests/**/*.e2e-spec.ts'
    './src/tests/**/signup.e2e-spec.ts'
    // './src/tests/**/login.e2e-spec.ts',
    // './src/tests/**/dashboard.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};