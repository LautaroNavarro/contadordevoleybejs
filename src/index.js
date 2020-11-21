const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
const createMatch = require('./views/createMatch.js');
const persistence = require('./persistence/match.js');
const watchsocket = require('./sockets/watch.js');
const updatesocket = require('./sockets/update.js');
const cors = require('cors')

app.use(express.json());
app.use(cors());

app.post('/matches/', (req, res) => {
    console.log('POST /matches/');
    let result = createMatch.createMatch(req.body);
    res.status(result.status_code).send(result.response);
});

io.on('connection', (socket) => {
    console.log('New socket connection');
    socket.on('watch', (msg) => {watchsocket.watch(msg, socket)});
    socket.on('update', (msg) => {updatesocket.update(msg, socket, io)});
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});
