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

io.on('connection', (socket) => {
    console.log('New WebSocket Connection');

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user joined!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log("Server is up to on port " + port);
})