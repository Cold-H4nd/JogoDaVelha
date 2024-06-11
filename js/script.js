let x = document.querySelector('.x');
let o = document.querySelector('.o');
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll('#buttons-container button');
let message = document.querySelector('#message');
let messageText = document.querySelector('#message p');
let secondPlayer;

// Score counters
let playerXScore = 0;
let playerOScore = 0;

let gameEnded = false; // Variável para controlar se o jogo acabou

// Add click event to boxes
for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function () {
        if (this.childNodes.length === 0 && !gameEnded) {
            let el = checkEl(playerXScore, playerOScore);
            if (secondPlayer === 'ai-player' && el.className === 'o') {
                return;
            }
            let cloneEl = el.cloneNode(true);
            this.appendChild(cloneEl);

            if (playerXScore === playerOScore) {
                playerXScore++;
            } else {
                playerOScore++;
            }
            checkWinCondition();

            if (secondPlayer === 'ai-player' && playerXScore > playerOScore && !gameEnded) {
                setTimeout(computerPlay, 500);
            }
        }
    });
}

// Event for selecting 2 players or AI
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        secondPlayer = this.getAttribute('id');
        buttons.forEach(button => button.style.display = 'none');

        setTimeout(() => {
            let container = document.querySelector('#container');
            container.classList.remove('hide');
        }, 500);

        playerXScore = 0;
        playerOScore = 0;
        gameEnded = false; // Reiniciar o controle de fim de jogo

        if (secondPlayer === 'ai-player') {
            setTimeout(computerPlay, 500);
        }
    });
}

function checkEl(playerXScore, playerOScore) {
    if (playerXScore === playerOScore) {
        return x;
    } else {
        return o;
    }
}

function computerPlay() {
    if (!gameEnded) { // Only play if the game has not ended
        let availableBoxes = Array.from(boxes).filter(box => box.childNodes.length === 0);
        if (availableBoxes.length > 0 && playerXScore !== playerOScore) {
            let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
            let cloneO = o.cloneNode(true);
            randomBox.appendChild(cloneO);
            if (!gameEnded) {
                playerOScore++;
            }
            checkWinCondition();
        }
    }
}

// Check for winner
function checkWinCondition() {
    let combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let winnerFound = false;

    combos.forEach((combo) => {
        if (
            boxes[combo[0]].childNodes.length > 0 &&
            boxes[combo[1]].childNodes.length > 0 &&
            boxes[combo[2]].childNodes.length > 0 &&
            boxes[combo[0]].childNodes[0].className === boxes[combo[1]].childNodes[0].className &&
            boxes[combo[1]].childNodes[0].className === boxes[combo[2]].childNodes[0].className
        ) {
            declareWinner(boxes[combo[0]].childNodes[0].className);
            winnerFound = true;
        }
    });

    if (!winnerFound && Array.from(boxes).every(box => box.childNodes.length > 0)) {
        declareWinner('draw');
    }
}

function declareWinner(winner) {
    let scoreboardX = document.querySelector('#scoreboard-1');
    let scoreboardO = document.querySelector('#scoreboard-2');

    if (winner === 'x') {
        scoreboardX.textContent = parseInt(scoreboardX.textContent) + 1;
        messageText.innerHTML = 'Jogador 1 venceu!';
    } else if (winner === 'o') {
        scoreboardO.textContent = parseInt(scoreboardO.textContent) + 1;
        messageText.innerHTML = 'Jogador 2 venceu!';
    } else {
        messageText.innerHTML = 'Deu velha!';
    }
    message.classList.remove('hide');

    // Set gameEnded to true to prevent further plays
    gameEnded = true;

    // Reset the game after 3 seconds
    setTimeout(() => {
        message.classList.add('hide');
        resetGame();
    }, 3000);
}

function resetGame() {
    boxes.forEach(box => {
        if (box.childNodes.length > 0) {
            box.removeChild(box.childNodes[0]);
        }
    });
    playerXScore = 0;
    playerOScore = 0;
    gameEnded = false; // Reset gameEnded for the next game

    buttons.forEach(button => button.style.display = 'block');
    document.querySelector('#container').classList.add('hide');
}
