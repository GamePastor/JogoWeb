const gameContainer = document.getElementById('game-container');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// Conecte-se ao servidor de WebSocket
const socket = io('http://192.168.0.104:3000');

// Posições iniciais dos jogadores
let player1Position = { x: 0, y: 0 };
let player2Position = { x: 4, y: 4 };

// Atualiza a posição dos jogadores no jogo
function updatePlayers() {
    player1.style.gridArea = `${player1Position.y + 1} / ${player1Position.x + 1}`;
    player2.style.gridArea = `${player2Position.y + 1} / ${player2Position.x + 1}`;
}

// Movimenta um jogador na direção especificada
function movePlayer(player, direction) {
    const position = player === 'player1' ? player1Position : player2Position;

    switch (direction) {
        case 'up':
            if (position.y > 0) position.y--;
            break;
        case 'down':
            if (position.y < 4) position.y++;
            break;
        case 'left':
            if (position.x > 0) position.x--;
            break;
        case 'right':
            if (position.x < 4) position.x++;
            break;
    }

    // Atualiza a posição no servidor e nos clientes
    socket.emit('updatePosition', { player, position });
}

// Adiciona escuta de eventos para o teclado
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer('player1', 'up');
            break;
        case 'ArrowDown':
            movePlayer('player1', 'down');
            break;
        case 'ArrowLeft':
            movePlayer('player1', 'left');
            break;
        case 'ArrowRight':
            movePlayer('player1', 'right');
            break;
        case 'w':
            movePlayer('player2', 'up');
            break;
        case 's':
            movePlayer('player2', 'down');
            break;
        case 'a':
            movePlayer('player2', 'left');
            break;
        case 'd':
            movePlayer('player2', 'right');
            break;
    }
});

// Escute as atualizações de posição do servidor
socket.on('updatePosition', ({ player, position }) => {
    if (player === 'player1') {
        player1Position = position;
    } else if (player === 'player2') {
        player2Position = position;
    }

    updatePlayers();
});
