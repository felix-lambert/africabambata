exports.config = {
    specs: [
        'Scenario.test.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    framework: 'jasmine',
    baseUrl: 'https://localhost:3000',

    framework: 'jasmine',
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 9000000
    }

};    


// multiCapabilities: [
// {
// 'browserName': 'chrome'
// }
// , {
// 'browserName': 'safari'
// }
// , {
// 'browserName': 'firefox'
// }
// ],
// maxSessions: 1,