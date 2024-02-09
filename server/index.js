const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  socket.on('click', (data) => {
    console.log(data);
    const { player, roomName } = data;
    io.to(roomName).emit('click', !player);
  });

  socket.on('start', (data) => {
    const { room } = data;
    io.to(room).emit('start');
  });

  socket.on('finished', (data) => {
    // Usa data.player per ottenere il giocatore
    const player = data ? 'black' : 'white';
    io.emit('finished', { msg: `${player} wins` });
  });

  socket.on('createRoom', (data) => {
    io.emit('createRoom', data);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
}

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
