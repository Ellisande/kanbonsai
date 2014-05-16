var HtmlReporter = require('protractor-html-screenshot-reporter');


exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

    onPrepare: function() {
        require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('xmloutput', true, true));
        jasmine.getEnv().addReporter(new HtmlReporter({
           baseDirectory: 'test/screenshots'
        }));
      },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  suites: {
    home: 'home-page.js',
    submit: 'submit-phase.js',
    merge: 'merge-phase.js',
    vote: 'vote-phase.js',
    discuss: 'discuss-phase.js',
    complete: 'complete-phase.js',
    all: ['home-page.js', 'submit-phase.js', 'merge-phase.js', 'vote-phase.js', 'discuss-phase.js'],
    everythingelse: 'scenarios.js'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
