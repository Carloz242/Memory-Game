import gameLogic from './gameLogic.js'; 
import pokemones from './pokemones.js'; 

// DOM Elements
const playBtn = document.querySelector('.play-btn');
const cardBackImages = document.querySelectorAll('.card-back img');
const allImages = document.querySelectorAll('img');
const cards = document.querySelectorAll('.card');
const hitsBtn = document.querySelector('.hits-btn');
const missesBtn = document.querySelector('.misses-btn');
const timerDisplay = document.querySelector('.timer h3');
const soundBtn = document.querySelector('.volume');

// Game Data
const pokemonList = Object.values(pokemones);
const pokemonCards = [...pokemonList, ...pokemonList]; 

// Audio Files
let lossMusic = new Audio('music/loose.mp3');
let flipSound = new Audio('music/flipcard.mp3');
let playBtnSound = new Audio('music/playBtnSound.mp3');
let backgroundMusic = new Audio('music/playMusic.mp3');
let hoverSound = new Audio('music/hoverBtn.mp3');
let errorSound = new Audio('music/error.mp3');
let victoryMusic = new Audio('music/victoryMusic.mp3');
let whistleSound = new Audio('music/silbato.mp3');

// Sound Management Array
let allSounds = [flipSound, playBtnSound, backgroundMusic, hoverSound, errorSound, victoryMusic, lossMusic, whistleSound];

// Game State Variables
let timerInterval;
let seconds = 120;
let currentCards = [];
let selectedCards = [];
let gameStarted = false;
let isMatch = false;
let hits = 0;
let misses = 0;
let audioEnabled = true; 

const stopBackgroundMusic = () => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    const index = allSounds.indexOf(backgroundMusic);
    if (index > -1) {
        allSounds.splice(index, 1);
    }
};

const startNewGame = () => {
    const randomCards = gameLogic.shuffleCards(pokemonCards);

    cardBackImages.forEach((img, index) => {
        img.setAttribute('src', randomCards[index].img);
    });
    
    flipCards(randomCards);
    setTimeout(() => startClock(), 1800);
};

const startClock = () => {
    timerInterval = setInterval(() => {
        seconds--;

        if (seconds === 0) {
            gameStarted = false;
            audioEnabled = false; 
            clearInterval(timerInterval);
            stopBackgroundMusic();
            
            lossMusic.volume = 0.3;
            whistleSound.volume = 0.3;
            whistleSound.play();
            
            setTimeout(() => lossMusic.play(), 1400);
            setTimeout(() => alert('SE ACABÓ EL TIEMPO. PERDISTE...'), 1600);
            cards.forEach(card => card.classList.remove('selected'));
        }

        if (seconds < 10) {
            timerDisplay.textContent = `00${seconds}`;
        } else if (seconds < 100) {
            timerDisplay.textContent = `0${seconds}`;
        } else {
            timerDisplay.textContent = `${seconds}`;
        }
    }, 1000);
}

const flipCards = (randomCards) => {
    cards.forEach((card, index) => {
        card.classList.add('flipped');
        
        setTimeout(() => {
            card.classList.remove('flipped');
            gameStarted = true;
            card.classList.add('selected');
        }, 2000);
        
        card.addEventListener('click', e => {
            if (!gameStarted) return;
        
            if (!selectedCards.includes(index) && selectedCards.length !== 2 && !e.currentTarget.classList.contains('flipped')) {
                flipSound.currentTime = 0; 
                flipSound.volume = 0.3;
                flipSound.play();
                
                e.currentTarget.classList.add('flipped');
                currentCards.push(e.currentTarget);
                selectedCards.push(index);
            }

            if (selectedCards.length === 2) {
                gameStarted = false;
                const matchedPairs = gameLogic.checkMatchCards(selectedCards, randomCards);

                if (matchedPairs[0].nombre !== matchedPairs[1].nombre) {
                    isMatch = false;
                    setTimeout(() => {
                        errorSound.volume = 0.6;
                        errorSound.play();
                        currentCards.forEach(card => card.classList.remove('flipped'));
                        currentCards = [];
                        selectedCards = [];
                        gameStarted = true;
                    }, 1000);
                } else {
                    if (audioEnabled) {
                        let pokemonSound = new Audio(matchedPairs[0].sound);
                        pokemonSound.volume = 0.6;
                        if (soundBtn.classList.contains('muted')) pokemonSound.muted = true;
                        setTimeout(() => pokemonSound.play(), 100);
                    }
                    currentCards.forEach(card => card.classList.remove('selected'));
                    selectedCards = [];
                    currentCards = [];
                    gameStarted = true;
                    isMatch = true;
                }
                updateScore();
            }
        });
    });
};

const updateScore = () => {
    if (isMatch) {
        hits++;
        hitsBtn.textContent = `ACIERTOS: ${hits}`;

        if (hits === 6) {
            gameStarted = false;
            audioEnabled = false;
            clearInterval(timerInterval);
            stopBackgroundMusic();

            victoryMusic.volume = 0.3;
            setTimeout(() => victoryMusic.play(), 1200);
            setTimeout(() => alert('¡GANASTE!'), 1400);
        }
    } else {
        misses++;
        missesBtn.textContent = `DESACIERTOS: ${misses}`;
    }
}

playBtn.addEventListener('click', () => {
    if (playBtn.textContent === 'JUGAR') {
        playBtn.textContent = 'REINICIAR';
        allImages.forEach(img => img.setAttribute('class', 'allowed'));
        playBtnSound.volume = 0.4;
        playBtnSound.play();
        startNewGame();
        
        setTimeout(() => {
            backgroundMusic.volume = 0.2;
            backgroundMusic.play();
        }, 300);
    } else {
        location.reload();
    }
});

playBtn.addEventListener('mouseenter', () => {
    hoverSound.volume = 0.3;
    hoverSound.play();
});

soundBtn.addEventListener('click', () => {
    soundBtn.classList.toggle('muted');
    const isMuted = soundBtn.classList.contains('muted');
    
    soundBtn.setAttribute('name', isMuted ? 'volume-mute' : 'volume-high');
    
    allSounds.forEach(sound => {
        sound.muted = isMuted;
    });
});


