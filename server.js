const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar uma rota para a rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Array para armazenar as posições dos jogadores
const playerPositions = {
    player1: { x: 0, y: 0 },
    player2: { x: 4, y: 4 },
};

// Lógica para manipular conexões de clientes
io.on('connection', (socket) => {
    console.log('Um jogador se conectou');

    // Enviar a posição inicial do jogador para o cliente recém-conectado
    socket.emit('initialPosition', playerPositions);

    // Escutar atualizações de posição do cliente
    socket.on('updatePosition', (data) => {
        // Atualizar a posição do jogador
        playerPositions[data.player] = data.position;

        // Transmitir a atualização de posição para os outros jogadores
        socket.broadcast.emit('updatePosition', data);
    });

    // Lidar com a desconexão do jogador
    socket.on('disconnect', () => {
        console.log('Um jogador se desconectou');
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
