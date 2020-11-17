var assert = require('assert');
var engine = require('./../../engine/engine.js');
const sinon = require('sinon');

describe('Engine', function() {

    describe('#generateId()', function() {
        it('should return a string with length 6', function() {
            assert.equal(
                engine.Match.generateId().length,
                6,
            );
        });

    });

    describe('#generateToken()', function() {
        it('should return a string with length 32', function() {
            assert.equal(
                engine.Match.generateToken().length,
                32,
            );
        });
    });

    describe('#constructor()', function() {
        it('Should construct object and set default values', function() {
            sinon.useFakeTimers(new Date('2020-11-16').getTime());

            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
            });

            assert.equal(match.teams.team_one.name, 'San martin');
            assert.equal(match.teams.team_one.color, '#000111');
            assert.equal(match.teams.team_two.name, 'Rivadavia');
            assert.equal(match.teams.team_two.color, '#000111');
            assert.equal(match.sets_number, engine.Match.DEFAULT_SETS_NUMBER);
            assert.equal(match.set_points_number, engine.Match.DEFAULT_SET_POINTS_NUMBER);
            assert.equal(match.points_difference, engine.Match.DEFAULT_POINTS_DIFFERENCE);
            assert.equal(match.tie_break_points, engine.Match.DEFAULT_TIE_BREAK_POINTS);
            assert.equal(match.status, engine.Match.PLAYING_STATUS);
            assert.equal(match.id.length, 6);
            assert.equal(match.token.length, 32);
            assert.equal(match.created.string, new Date('2020-11-16').string)
            assert.equal(match.changed.string, new Date('2020-11-16').string)
            assert.equal(match.sets.length, 1);
            assert.equal(match.sets[0].team_one, 0);
            assert.equal(match.sets[0].team_two, 0);
        });

        it('Should construct object not default values', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'sets_number': 3,
                'set_points_number': 27,
                'points_difference': 3,
                'tie_break_points': 13,
                'status': engine.Match.FINISHED_STATUS,
                'id': '1a12sd',
                'sets': [{
                    'team_one': 24,
                    'team_two': 23,
                }],
                'token': 'zxcasdqwe12334531erwersdfetgfrtf',
                'created': new Date('2020-11-16'),
                'changed': new Date('2020-11-16')
            });

            assert.equal(match.teams.team_one.name, 'San martin');
            assert.equal(match.teams.team_one.color, '#000111');
            assert.equal(match.teams.team_two.name, 'Rivadavia');
            assert.equal(match.teams.team_two.color, '#000111');
            assert.equal(match.sets_number, 3);
            assert.equal(match.set_points_number, 27);
            assert.equal(match.points_difference, 3);
            assert.equal(match.tie_break_points, 13);
            assert.equal(match.status, engine.Match.FINISHED_STATUS);
            assert.equal(match.id, '1a12sd');
            assert.equal(match.sets.length, 1);
            assert.equal(match.sets[0].team_one, 24);
            assert.equal(match.sets[0].team_two, 23);
            assert.equal(match.token, 'zxcasdqwe12334531erwersdfetgfrtf');
            assert.equal(match.created.string, new Date('2020-11-16').string)
            assert.equal(match.changed.string, new Date('2020-11-16').string)
        });

    });

    describe('#addPointTeam()', function() {
        it('add one point to team one', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'sets': [{
                    'team_one': 15,
                    'team_two': 12,
                }],
            });

            match.addPointTeam(1);
            assert.equal(match.sets[0].team_one, 16);
            assert.equal(match.sets[0].team_two, 12);
            assert.equal(match.sets.length, 1);
        });

        it('add one point to team two', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
            });

            match.addPointTeam(2);
            assert.equal(match.sets[0].team_one, 0);
            assert.equal(match.sets[0].team_two, 1);
            assert.equal(match.sets.length, 1);
        });

        it('add last point to team one creates new set', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'sets_number': 3,
                'set_points_number': 25,
                'points_difference': 2,
                'tie_break_points': 15,
                'status': engine.Match.PLAYING_STATUS,
                'id': '1a12sd',
                'sets': [{
                    'team_one': 24,
                    'team_two': 23,
                }],
                'token': 'zxcasdqwe12334531erwersdfetgfrtf',
                'created': new Date('2020-11-16'),
                'changed': new Date('2020-11-16')
            });

            match.addPointTeam(1);
            assert.equal(match.winner, null);
            assert.equal(match.status, engine.Match.PLAYING_STATUS);
            assert.equal(match.sets[0].team_one, 25);
            assert.equal(match.sets[0].team_two, 23);
            assert.equal(match.sets[0].team_two, 23);
            assert.equal(match.sets[0].winner, 'team_one');
            assert.equal(match.sets[1].team_one, 0);
            assert.equal(match.sets[1].team_two, 0);
            assert.equal(match.sets[1].team_two, 0);
            assert.equal(match.sets[1].winner, null);
            assert.equal(match.sets.length, 2);
        });

        it('add last point to team one does not creates new set if last set', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'sets_number': 1,
                'set_points_number': 25,
                'points_difference': 2,
                'tie_break_points': 15,
                'status': engine.Match.PLAYING_STATUS,
                'id': '1a12sd',
                'sets': [{
                    'team_one': 24,
                    'team_two': 23,
                }],
                'token': 'zxcasdqwe12334531erwersdfetgfrtf',
                'created': new Date('2020-11-16'),
                'changed': new Date('2020-11-16')
            });
            match.addPointTeam(1);
            assert.equal(match.winner, 'team_one');
            assert.equal(match.status, engine.Match.FINISHED_STATUS);
            assert.equal(match.sets[0].team_one, 25);
            assert.equal(match.sets[0].team_two, 23);
            assert.equal(match.sets.length, 1);
        });

        it('raise error if match is already finished', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'status': engine.Match.FINISHED_STATUS,
            });
            assert.throws(() => match.addPointTeam(1), new Error('Operation denied'));
        });

    it('test entire match flow', function() {
            let match = new engine.Match({
                'teams': {
                    'team_one': {'name': 'San martin', 'color': '#000111', 'sets': 0},
                    'team_two': {'name': 'Rivadavia', 'color': '#000111', 'sets': 0},
                },
                'sets_number': 3,
                'set_points_number': 25,
                'points_difference': 2,
                'tie_break_points': 15,
                'status': engine.Match.PLAYING_STATUS,
                'sets': [{
                    'team_one': 0,
                    'team_two': 0,
                }],
            });
            assert.equal(match.winner, null);
            assert.equal(match.status, engine.Match.PLAYING_STATUS);
            assert.equal(match.sets[0].team_one, 0);
            assert.equal(match.sets[0].team_two, 0);
            assert.equal(match.sets[0].winner, null);
            assert.equal(match.sets.length, 1);
            for (var i = 1; i <= 25; i++) {
                match.addPointTeam(1);
            }
            assert.equal(match.winner, null);
            assert.equal(match.status, engine.Match.PLAYING_STATUS);
            assert.equal(match.sets[0].team_one, 25);
            assert.equal(match.sets[0].team_two, 0);
            assert.equal(match.sets[0].winner, 'team_one');
            assert.equal(match.sets.length, 2);
            assert.equal(match.sets[1].team_one, 0);
            assert.equal(match.sets[1].team_two, 0);
            assert.equal(match.sets[1].winner, null);
            for (var i = 1; i <= 25; i++) {
                match.addPointTeam(2);
            }
            assert.equal(match.winner, null);
            assert.equal(match.status, engine.Match.PLAYING_STATUS);
            assert.equal(match.sets[0].team_one, 25);
            assert.equal(match.sets[0].team_two, 0);
            assert.equal(match.sets[0].winner, 'team_one');
            assert.equal(match.sets.length, 3);
            assert.equal(match.sets[1].team_one, 0);
            assert.equal(match.sets[1].team_two, 25);
            assert.equal(match.sets[1].winner, 'team_two');
            assert.equal(match.sets[2].team_one, 0);
            assert.equal(match.sets[2].team_two, 0);
            assert.equal(match.sets[2].winner, null);
            for (var i = 1; i <= 25; i++) {
                match.addPointTeam(1);
            }
            assert.equal(match.winner, 'team_one');
            assert.equal(match.status, engine.Match.FINISHED_STATUS);
            assert.equal(match.sets[0].team_one, 25);
            assert.equal(match.sets[0].team_two, 0);
            assert.equal(match.sets[0].winner, 'team_one');
            assert.equal(match.sets.length, 3);
            assert.equal(match.sets[1].team_one, 0);
            assert.equal(match.sets[1].team_two, 25);
            assert.equal(match.sets[1].winner, 'team_two');
            assert.equal(match.sets[2].team_one, 25);
            assert.equal(match.sets[2].team_two, 0);
            assert.equal(match.sets[2].winner, 'team_one');
        });

    });

});
