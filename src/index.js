const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT

// Define path for Express config
const puplicDirectoryPath = path.join(__dirname, '../public');

// Setup static directory to serve
app.use(express.static(puplicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log('New WebSocket Connection');

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log("Server is up to on port " + port);
})