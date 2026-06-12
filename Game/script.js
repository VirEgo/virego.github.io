let scores, roundScore, activePlayer, gamePlaying, finalScore, gameMode;
let errorTemplate = document.querySelector('.error-template');
const defaultWinValue = 100;
const firstDice = document.getElementById('dice-1');
const secondDice = document.getElementById('dice-2');
const rollBtn = document.querySelector('.btn-roll');
const holdBtn = document.querySelector('.btn-hold');
const startGameBtn = document.querySelector('.btn-new');
const newGameBtn = document.querySelector('.new-game');
const winnerBanner = document.querySelector('.winner-banner');
const playgroundBanner = document.querySelector('.main-playfield');
const bonusToast = document.getElementById('bonusToast');

let input = document.querySelector('.final-score');

var isNewGameStarting = false;

const modeDescriptions = {
    classic: 'Стандартные правила без модификаторов',
    bonus: 'Дополнительные очки за комбинации',
    hard: 'При выпадении 6 — теряете весь счёт раунда'
};

function selectMode(mode, btn) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('modeDesc').textContent = modeDescriptions[mode];
}

function showBonusToast(message, isError, duration) {
    bonusToast.textContent = message;
    bonusToast.style.display = 'block';
    bonusToast.className = 'bonus-toast' + (isError ? ' penalty' : '');
    setTimeout(() => {
        bonusToast.style.display = 'none';
    }, duration || 1500);
}

function generateSecureDice() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return (array[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
}

function switchPlayer() {
    activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
    roundScore = 0;
    holdBtn.setAttribute('disabled', true);

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    firstDice.style.display = 'none';
    secondDice.style.display = 'none';
}

function startGame() {
    if (input.value && !validateValue(input.value)) {
        input.value = null;
        return;
    }
    document.querySelector('.start-template').style.display = 'none';
    startGameBtn.style.display = 'none';
    rollBtn.style.display = 'block';
    holdBtn.style.display = 'block';
    document.querySelector('.points-to-win').innerText = input.value
        ? input.value
        : defaultWinValue;
    isNewGameStarting = true;
    gameMode = gameMode || 'classic';

    if (isNewGameStarting) {
        startGameBtn.style.display = 'none';
        rollBtn.style.display = 'block';
        holdBtn.style.display = 'block';
        newGameBtn.style.display = 'block';
    }
}

function rollTheQube() {
    if (gamePlaying) {
        let dice1 = generateSecureDice();
        let dice2 = generateSecureDice();
        holdBtn.removeAttribute('disabled');

        firstDice.style.display = 'block';
        secondDice.style.display = 'block';
        firstDice.src = 'img/dice-' + dice1 + '.png';
        secondDice.src = 'img/dice-' + dice2 + '.png';

        if (dice1 !== 1 && dice2 !== 1) {
            let roundPoints = dice1 + dice2;

            if (gameMode === 'hard' && (dice1 === 6 || dice2 === 6)) {
                roundScore = 0;
                showBonusToast('Выпала 6! Очки раунда сгорают!', true, 1200);
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
                setTimeout(() => switchPlayer(), 1400);
                return;
            }

            if (gameMode === 'bonus' && dice1 === dice2) {
                roundPoints *= 2;
                showBonusToast('Дубль! Очки удвоены!', false);
            }

            roundScore += roundPoints;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            showBonusToast('Глаза змеи (1+1)! Ход переходит дальше', true, 1200);
            setTimeout(() => switchPlayer(), 1400);
        }
    }
}

function newGame() {
    isNewGameStarting = false;
    playgroundBanner.style.display = 'flex';
    winnerBanner.style.display = 'none';
    resetValues();
}

function holdResults() {
    if (gamePlaying) {
        scores[activePlayer] += roundScore;

        document.querySelector('#score-' + activePlayer).textContent =
            scores[activePlayer];

        let winningScore = input.value != 0 ? input.value : defaultWinValue;

        if (scores[activePlayer] >= winningScore) {
            playgroundBanner.style.display = 'none';
            winnerBanner.style.display = 'flex';
            isNewGameStarting = false;
            rollBtn.style.display = 'none';
            holdBtn.style.display = 'none';

            document.querySelector('.winner').textContent = `Победил Игрок ${
                activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0)
            }!`;
            firstDice.style.display = 'none';
            secondDice.style.display = 'none';
            gamePlaying = false;
        } else {
            switchPlayer();
        }
    }
}

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    gameMode = 'classic';
}

function resetValues() {
    startGameBtn.style.display = 'block';
    document.querySelector('.start-template').style.display = 'flex';
    input.value = null;
    input.setAttribute('placeholder', 'Очки для победы');
    rollBtn.style.display = 'none';
    holdBtn.style.display = 'none';

    firstDice.style.display = 'none';
    secondDice.style.display = 'none';
    newGameBtn.style.display = ' none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Игрок 1';
    document.getElementById('name-1').textContent = 'Игрок 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    bonusToast.style.display = 'none';
    gameMode = 'classic';
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.mode-btn[data-mode="classic"]').classList.add('active');
    document.getElementById('modeDesc').textContent = modeDescriptions.classic;
}

function validateValue(value) {
    if (value <= 12) {
        alert('Значение должно быть больше 12');
        return false;
    }
    return true;
}

window.addEventListener('load', () => {
    resetValues();
    init();
});
