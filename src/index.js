const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
const createMatch = require('./views/createMatch.js');

app.use(express.json());

app.get('/', function(req, res) {
    res.send(200, { 'response': 'Hello world' });
});

app.post('/matches/', function(req, res) {
    let result = createMatch.createMatch(req.body);
    res.status(result.status_code).send(result.response);
});

io.on('connection', function(socket) {
    socket.emit('123', { message: {'teams': {'team_one': {'color': 'red', 'name': 'team name'}}} });
});

server.listen(3000, () => {
    console.log('Listening on port 3000')
});
