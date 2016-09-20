var elasticsearch = require("elasticsearch");
var logger        = require("../../utils/logger");

var ES = new elasticsearch.Client({
    host: "localhost:9200",
    log: 'info',
    requestTimeout: 6000
});

if (process.env.NODE_ENV == 'prod') {
    var ingredient        = "ingredient_prod";
    var recipe_ingredient = "recipe_ingredient_prod";
    var shipt             = "shipt_prod";
    var freshdirect       = "freshdirect_prod";
    var instacart         = "instacart_prod";
    var peapod            = "peapod_prod";
    var safeway           = "safeway_prod";
    var walmart           = "walmart_prod";
} else if (process.env.NODE_ENV == 'preprod') {
    var ingredient        = "ingredient_pre";
    var recipe_ingredient = "recipe_ingredient_pre";
    var shipt             = "shipt_pre";
    var freshdirect       = "freshdirect_pre";
    var instacart         = "instacart_pre";
    var peapod            = "peapod_pre";
    var safeway           = "safeway_pre";
    var walmart           = "walmart_pre";
} else {
    var ingredient        = "ingredient";
    var recipe_ingredient = "recipe_ingredient";
    var shipt             = "shipt";
    var freshdirect       = "freshdirect";
    var instacart         = "instacart";
    var peapod            = "peapod";
    var safeway           = "safeway";
    var walmart           = "walmart";
}

ES.indices.create({
    index: ingredient,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: ingredient,
        type: 'ing',
        body: {
            'ing': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES ingredient');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: recipe_ingredient,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: recipe_ingredient,
        type: 'rin',
        body: {
            'rin': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES recipe_ingredient');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});



ES.indices.create({
    index: shipt,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: shipt,
        type: 'shi',
        body: {
            'shi': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES shipt');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: freshdirect,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: freshdirect,
        type: 'fre',
        body: {
            'fre': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES fresh direct');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: instacart,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: instacart,
        type: 'ins',
        body: {
            'ins': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES instacart');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: peapod,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: peapod,
        type: 'pea',
        body: {
            'pea': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES peapod');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: walmart,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: walmart,
        type: 'wal',
        body: {
            'wal': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES walmart');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});

ES.indices.create({
    index: safeway,
    body: {
        "settings": {
            "number_of_shards": 1,
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 20,
                        "token_chars": [
                            "letter",
                            "digit",
                            "punctuation",
                            "symbol"
                       ]
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "asciifolding",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        }
    }
}, function(err, resp, respcode) {
    ES.indices.putMapping({
        index: safeway,
        type: 'saf',
        body: {
            'saf': {
                "properties": {
                    "name": {
                        "type": "string",
                        "analyzer": "autocomplete"
                    }
                }
            }
        }
    }, function(err, resp, respcode) {
        logger.debug('response ES safeway');
        logger.info(err ? err : 'No error', resp, respcode);
    });
});


module.exports = ES;