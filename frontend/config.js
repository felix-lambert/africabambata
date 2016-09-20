exports.config = {
    "modules": {
        "definition": false,
        "wrapper": false
    },
    "files": {
        "javascripts": {
            "defaultExtension": 'js',
            "joinTo": {
                'scripts/app.js': /^app/,
                'scripts/vendor.js': /^vendor/
            },
            "order": {
                "before": [
                    'vendor/scripts/angular.js',
                    'vendor/scripts/angular-resource.min.js',
                    'vendor/scripts/angular-route.min.js',
                    'vendor/scripts/jquery.min.js',
                    'vendor/scripts/nya-bs-select.min.js',
                    'vendor/scripts/augucomplete-alt.js',
                    'vendor/scripts/ui-bootstrap-tpls.min.js'
                ]
            }
        },
        "templates": {
            "defaultExtension": 'html',
            "joinTo": 'scripts/app.js'
        },
        "stylesheets" : {
            "joinTo": {'css/app.css': /^app/}
        }
    },
    "paths": {
        "public": "public/"
    }
};