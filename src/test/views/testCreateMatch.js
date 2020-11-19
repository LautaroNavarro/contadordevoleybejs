var assert = require('assert');
var createMatch = require('./../../views/createMatch.js');
const sinon = require('sinon');

let valid_schema = {
    'sets_number': 5,
    'set_points_number': 25,
    'points_difference': 2,
    'tie_break_points': 15,
    'teams': {
        'team_one': {
            'name': 'Team one',
            'color': '#ff00ff',
        },
        'team_two': {
            'name': 'Team two',
            'color': '#ff0000',
        }
    }
}

describe('TestCreateMatch', function() {

    describe('#validateBody()', function() {
        it('Valid body return .valid true', function() {
            let expected_result = true;
            assert.equal(createMatch.validateBody(valid_schema).valid, expected_result);
        });
        it('Missing sets_number return false', function() {
            let not_valid_schema = {...valid_schema};
            delete not_valid_schema.sets_number;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "sets_number"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });
        it('Missing set_points_number return false', function() {
            let not_valid_schema = {...valid_schema};
            delete not_valid_schema.set_points_number;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "set_points_number"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });
        it('Missing points_difference return false', function() {
            let not_valid_schema = {...valid_schema};
            delete not_valid_schema.points_difference;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "points_difference"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });
        it('Missing tie_break_points return false', function() {
            let not_valid_schema = {...valid_schema};
            delete not_valid_schema.tie_break_points;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "tie_break_points"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });
        it('Missing teams return false', function() {
            let not_valid_schema = {...valid_schema};
            delete not_valid_schema.teams;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "teams"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });
        it('Missing teams.team_one return false', function() {
            let not_valid_schema = {...valid_schema};
            not_valid_schema.teams = {...valid_schema.teams};
            delete not_valid_schema.teams.team_one;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "team_one"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });

        it('Missing teams.team_two return false', function() {
            let not_valid_schema = {...valid_schema};
            not_valid_schema.teams = {...valid_schema.teams};
            delete not_valid_schema.teams.team_two;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "team_two"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });

        it('Missing teams.team_two.color return false', function() {
            let not_valid_schema = {...valid_schema};
            not_valid_schema.teams = {...valid_schema.teams};
            not_valid_schema.teams.team_two = {...valid_schema.teams.team_two};
            delete not_valid_schema.teams.team_two.color;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "color"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });

        it('Missing teams.team_two.name return false', function() {
            let not_valid_schema = {...valid_schema};
            not_valid_schema.teams = {...valid_schema.teams};
            not_valid_schema.teams.team_two = {...valid_schema.teams.team_two};
            delete not_valid_schema.teams.team_two.name;
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'requires property "name"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });

        it('extra fields return false', function() {
            let not_valid_schema = {...valid_schema};
            not_valid_schema.extra_field = 'Extra field'
            let expected_result = false;
            validation = createMatch.validateBody(not_valid_schema);
            assert.equal(validation.errors[0].message, 'is not allowed to have the additional property "extra_field"');
            assert.equal(validation.errors.length, 1);
            assert.equal(validation.valid, expected_result);
        });

    });
});
