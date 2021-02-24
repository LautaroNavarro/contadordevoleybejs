
let redis = require('redis');

// redis://:password@host:port
let re = new RegExp('redis:\/\/:(.*)@(.*):(.*)')

let redisConnectionKeys = re.exec(process.env.REDIS_URL)

let client = redis.createClient(redisConnectionKeys[3], redisConnectionKeys[2], {no_ready_check: true});
client.auth(redisConnectionKeys[1], function (err) {
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
    return new Promise((fullfill, reject)=>{
        client.get(matchId, (err, data)=>{
            if(err)
                reject(err);
            else
                fullfill(data);
        });
    });
}

exports.save = save;
exports.get = get;
