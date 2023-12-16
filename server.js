const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Servir arquivos estáticos
app.use(express.static('public'));

// Conectar-se ao WebSocket
io.on('connection', (socket) => {
    console.log('Um jogador se conectou');

    // Escutar atualizações de posição
    socket.on('updatePosition', (data) => {
        // Enviar a atualização para os outros jogadores
        socket.broadcast.emit('updatePosition', data);
    });

    // Desconectar jogador
    socket.on('disconnect', () => {
        console.log('Um jogador se desconectou');
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
