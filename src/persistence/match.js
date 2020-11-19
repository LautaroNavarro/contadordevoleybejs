
let redis = require('redis');
let client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
client.auth(process.env.REDISPASSWORD, function (err) {
    if (err) {
        throw err;
    }
});

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log('Connected to Redis');
});

function save(matchJson){
    return client.set(matchJson.id, JSON.stringify(matchJson));
}

function get(matchId){
    let match;
    client.get(matchId, (err, value) => {match = value});
    if (match) {
        match = JSON.parse(match);
    }
    return match;
}

exports.save = save;
exports.get = get;
