let validate = require('jsonschema').validate;
const persistence = require('./../persistence/match.js');
const engine = require('./../engine/engine.js');

let updateSchema = {
    'type': 'object',
    'properties': {
        'id': {
            'type': 'string',
        },
        'token': {
            'type': 'string',
        },
        'action': {
            'type': 'string',
            'pattern': '^(add_team_one|add_team_two|substract_team_one|substract_team_two)$'
        }
    },
    'required': ['action', 'token', 'id'],
    'additionalProperties': false
}

function validateBody (body) {
    return validation = validate(body, updateSchema);
}

function update(matchRequest, socket, io) {
    console.log('Updating match');
    persistence.get(matchRequest.id).then((match) => {
        if (!match) {
            socket.emit('match_update', {'error': 'Match does not exists'});
        } else {
            match = JSON.parse(match)
            let validation = validateBody(matchRequest);
            if (!validation.valid) {
                socket.emit('match_update', {'error': validation.errors[0].message});
            } else {
                if (matchRequest.token === match.token) {
                    engineMatch = new engine.Match(match);
                    if (matchRequest.action === 'add_team_one') {
                        engineMatch.addPointTeam(1);
                    } else if (matchRequest.action === 'add_team_two') {
                        engineMatch.addPointTeam(2);
                    } else if (matchRequest.action === 'substract_team_one') {
                        engineMatch.substractPointTeam(1);
                    } else {
                        engineMatch.substractPointTeam(2);
                    }
                    match = engineMatch.json();
                    persistence.save(match);
                    delete match.token;
                    io.to(match.id).emit('match_update', match);
                } else {
                    socket.emit('match_update', {'error': 'Invalid token'});
                }
            }
        }
    }).catch((ex) => {
        console.log(ex.message);
        socket.emit('match_update', {'error': 'Match does not exists'});
    });;
}

exports.update = update;
