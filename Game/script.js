let scores, roundScore, activePlayer, gamePlaying, finalScore;
let activePlayerName = document.querySelector('.active-player-name');
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

let input = document.querySelector('.final-score');

var isNewGameStarting = false;

function startGame() {
	if (!validateValue(input.value)) {
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

	if (isNewGameStarting) {
		startGameBtn.style.display = 'none';
		rollBtn.style.display = 'block';
		holdBtn.style.display = 'block';
		newGameBtn.style.display = 'block';
	}
}

function rollTheQube() {
	if (gamePlaying) {
		// Random number
		let dice1 = Math.floor(Math.random() * 6) + 1;
		let dice2 = Math.floor(Math.random() * 6) + 1;
		holdBtn.removeAttribute('disabled');

		console.log(dice1, dice2);

		// Display the result
		firstDice.style.display = 'block';
		secondDice.style.display = 'block';
		firstDice.src = 'img/dice-' + dice1 + '.png';
		secondDice.src = 'img/dice-' + dice2 + '.png';

		//3.Update the round score IF the rolled number was NOT a 1
		if (dice1 !== 1 && dice2 !== 1) {
			//Add score
			roundScore += dice1 + dice2;
			document.querySelector('#current-' + activePlayer).textContent =
				roundScore;
		} else {
			//Next player
			// nextPlayer();
			setError(activePlayer);
		}
	}
}

function newGame() {
	isNewGameStarting = false;
	playgroundBanner.style.display = 'flex';
	winnerBanner.style.display = 'none';
	resetValues();
}

function setError(playerName) {
	firstDice.src = 'img/dice-1.png';
	secondDice.src = 'img/dice-1.png';
	errorTemplate.style.display = 'flex';

	activePlayerName.innerText = activePlayer === 0 ? 2 : 1;
}

function toggleTurn() {
	nextPlayer();
	errorTemplate.style.display = 'none';
}

function holdResults() {
	if (gamePlaying) {
		//Add CURRENT score to GLOBAL score
		scores[activePlayer] += roundScore;

		//Update the UI
		document.querySelector('#score-' + activePlayer).textContent =
			scores[activePlayer];

		let winningScore = input.value != 0 ? input.value : defaultWinValue;

		//Check if player won the game
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
			nextPlayer();
		}
	}
}

function nextPlayer() {
	//Next player
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

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
	scores = [0, 0];
	roundScore = 0;
	activePlayer = 0;
	gamePlaying = true;
}

function resetValues() {
	console.log('Reset values');
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
	errorTemplate.style.display = 'none';
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
