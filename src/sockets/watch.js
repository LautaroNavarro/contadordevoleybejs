const persistence = require('./../persistence/match.js');

function watch(msg, socket) {
    console.log(`New consumer at room ${msg.match_id}`);
    socket.join(msg.match_id);
    persistence.get(msg.match_id).then((match) => {
        if (!match) {
            socket.emit('match_update', {'error': 'Match does not exists'});
        } else {
            match = JSON.parse(match)
            delete match.token;
            socket.emit('match_update', match);
        }
    }).catch((ex) => {
        console.log(ex.message);
        socket.emit('match_update', {'error': 'Match does not exists'});
    });;
}

exports.watch = watch;
