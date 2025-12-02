const cardsContainer = document.querySelector('.memory-game');
const resetButton = document.getElementById('reset-button'); 
const attemptsCounter = document.getElementById('attempts-count'); // Elemento do contador
const FLIP_BACK_DELAY = 1500; 

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let attempts = 0; // Variável para contar as tentativas


const cardData = [
  { name: "aurelia", img: "galapagos.png", alt: "Galapagos" },
  { name: "vue", img: "leuser.png", alt: "Leuser" },
  { name: "angular", img: "plitvice.png", alt: "Plitvice" },
  { name: "ember", img: "serengeti.png", alt: "Serengeti" },
  { name: "backbone", img: "tjuta.png", alt: "Tjuta" },
  { name: "amazonia", img: "amazonia.png", alt: "Amazonia" },
  { name: "pantanal", img: "pantanal.png", alt: "Pantanal" },
  { name: "iguacu", img: "iguacu.png", alt: "Iguacu" },
  { name: "react", img: "yellowstone.png", alt: "Yellowstone" }
];

const gameCards = [...cardData, ...cardData];


// --- Funções de Lógica do Jogo ---

// Função para atualizar o contador no DOM
function updateAttemptsDisplay() {
    attemptsCounter.textContent = attempts;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // A partir do segundo clique (tentativa), incrementa o contador
    attempts++;
    updateAttemptsDisplay();
    
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoardState();
}

function unflipCards() {
    lockBoard = true; 

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoardState();
    }, FLIP_BACK_DELAY);
}

function resetBoardState() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- Funções de Inicialização e Reset ---

function shuffle(cards) {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * gameCards.length);
        card.style.order = randomPos;
    });
}

function createBoard() {
    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.framework = card.name;
        
        cardElement.innerHTML = `
            <img class="front-face" src="img/${card.img}" alt="${card.alt}" loading="lazy" />
            <img class="back-face" src="img/virada.png" alt="Virada" loading="lazy" />
        `;
        
        cardsContainer.appendChild(cardElement);
    });
    
    const cards = document.querySelectorAll('.memory-card');
    
    shuffle(cards);
    cards.forEach(card => card.addEventListener('click', flipCard));
}

function resetGame() {
    cardsContainer.innerHTML = ''; 
    
    resetBoardState();
    
    // Reseta o contador de tentativas
    attempts = 0;
    updateAttemptsDisplay();
    
    createBoard();
}

resetButton.addEventListener('click', resetGame);

// Inicia o jogo pela primeira vez
createBoard();
updateAttemptsDisplay(); // Garante que comece em 0