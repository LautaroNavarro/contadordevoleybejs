let validate = require('jsonschema').validate;
let engine = require('../engine/engine.js');
let persistence = require('../persistence/match.js')

let match_schema = {
    'type': 'object',
    'properties': {
        'sets_number': {
            'type': 'integer',
            'minimum': 1,
            'maximum': 5,
        },
        'set_points_number': {
            'type': 'integer',
            'minimum': 1,
            'maximum': 25,
        },
        'points_difference': {
            'type': 'integer',
            'minimum': 1,
            'maximum': 10,
        },
        'tie_break_points': {
            'type': 'integer',
            'minimum': 1,
            'maximum': 25,
        },
        'teams': {
            'type': 'object',
            'required': ['team_one', 'team_two'],
            'additionalProperties': false,
            'properties': {
                'team_one': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string',
                            'minLength': 1,
                        },
                        'color': {
                            'type': 'string',
                            'minLength': 7,
                            'maxLength': 7,
                        },
                    },
                    'required': ['name', 'color'],
                    'additionalProperties': false,
                },
                'team_two': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string',
                            'minLength': 1,
                        },
                        'color': {
                            'type': 'string',
                            'minLength': 7,
                            'maxLength': 7,
                        },
                    },
                    'required': ['name', 'color'],
                    'additionalProperties': false,
                },
            },
        },
    },
    'required': ['sets_number', 'set_points_number', 'points_difference', 'tie_break_points', 'teams'],
    'additionalProperties': false
}

function validateBody (body) {
    return validation = validate(body, match_schema);
}

function createMatch (body) {
    let validation = validateBody(body);
    if (!validation.valid) {
        return {'status_code': 400, 'response': {'error': validation.errors[0].message}};
    }

    let matchEngine = new engine.Match(body);

    persistence.save(matchEngine.json());

    let statusCode = 200;
    let bodyResponse = {
        'match': matchEngine.json()
    };
    return {'status_code': statusCode, 'response': bodyResponse};
}

exports.validateBody = validateBody;
exports.createMatch = createMatch;
