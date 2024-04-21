const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/socket', express.static('./node_modules/socket.io/client-dist'))

app.get('/home', (req, res) => {
    res.render('home');
});

let serverMsg = ``;
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        serverMsg = msg;
        io.of('/demo').emit('message', msg);
    });
});

app.get('/demo', (req, res) => {
    console.log("Message : "+serverMsg);
    res.render('demo', { message: serverMsg || '' });
});

const PORT = 9001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});