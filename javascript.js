const resetButton = document.getElementById("resetar");
const attemptsToDom = document.getElementById("tentativas");
const timerToDom = document.getElementById("tempoParaTerminar");
const boardGame = document.getElementById("boardGame");
const modal = document.getElementById("modal");
const playAgain = document.getElementById("playAgain");
const star = document.getElementsByClassName("estrela");

/* Array of cards images */
const playingCards = [
    "imgs/basquete.png",
	"imgs/basquete.png",
    "imgs/beisebol.webp",
	"imgs/beisebol.webp",
    "imgs/futAmericano.webp",
	"imgs/futAmericano.webp",
    "imgs/futebol.png",
	"imgs/futebol.png",
    "imgs/golf.png",
	"imgs/golf.png",
    "imgs/handebol.webp",
	"imgs/handebol.webp",
    "imgs/sinuca.webp",
	"imgs/sinuca.webp",
    "imgs/volei.png",
	"imgs/volei.png",
    
]
/* One empty array to store the opened cards and one empty array to store the matched cards */
let opened = []; let matched = [];

startGame();

/* If a card is clicked call flipCard() and activate timer if is not activated */
boardGame.addEventListener("click", function(event) {
	if (event.target.className === "card") {
		if (timeStart === false) {
			timeStart = true; 
			timer();
        }
        flipCard(event);
        
	}
});

/* When the user click on the reset button, we call reset() */
resetButton.addEventListener('click', reset);

/* Initialize the game */
function startGame() {
    const playingCardsShuffled = shuffle(playingCards); 
    playingCardsShuffled.forEach(function(card, index) {
        const liTag = document.createElement('li');
		liTag.classList.add('card');
        const image = document.createElement("img");
        image.setAttribute("src", playingCardsShuffled[index]);
        image.setAttribute("alt", "");
        liTag.appendChild(image);
        boardGame.appendChild(liTag);
    });      
}

/* Shuffle the array of image cards */ 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }    
    return array;
} 

/* Displays the elasped time */
let timeStart = false; let time; let minutes = 0; let seconds = 0;

function timer() {
	time = setInterval(function() {
        seconds++;  
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        timerToDom.textContent = minutes + ":" + seconds ;
    }, 1000);
}

/* Flip the card and push this to the opened array */
function flipCard(event) {
    event.target.classList.add("flip");
    pushToOpenedArray(event);
}

/* Push the fliped cards to the opened array only when his length is 0 or 1 */
function pushToOpenedArray(event) {
    if (opened.length === 0 || opened.length === 1) {
        //console.log(event.target); console.log(event.target.firstElementChild);
        opened.push(event.target.firstElementChild);
    }
    compareCards();
}

/* Compare two cards to see if they match or not */
function compareCards() {
	/* When there are 2 cards in the opened array, we disable mouse click on other cards */
	if (opened.length === 2) {
  		document.body.style.pointerEvents = "none";
    }
    /* Compare the sources of the two images */
    if (opened.length === 2 && opened[0].src === opened[1].src) {
		match();
    }
    else if (opened.length === 2 && opened[0].src != opened[1].src) {
		noMatch();
    }
}

/* If the two cards are similar, keep them open and push into matched array */ 
function match() {
	setTimeout(function() {
		/* Push the matched cards to the matched array */
        matched.push(...opened);
        //console.log(matched); console.log(opened);
		/* Allow the click again */
        document.body.style.pointerEvents = "auto";
        
		/* Check if the game is over */
        winGame();
        
		/* Clear the opened array */
        opened = [];
        
    }, 500);
	attemptsCounter();
	starRating();
}

/* If the two cards don't match, remove the cards from the opened array and the flip class. */
function noMatch() {
	setTimeout(function() {
        /* Remove class flip on the parent element */
		opened[0].parentElement.classList.remove("flip");
        opened[1].parentElement.classList.remove("flip");
		/* Allow the click again */
        document.body.style.pointerEvents = "auto";
		/* Clear the opened array */
        opened = [];
    }, 1000);
	attemptsCounter();
	starRating();
}

/* Increment the attempts counter. */
let attempts = 0;

function attemptsCounter() {
	attemptsToDom.textContent ++; // Equal to : attemptsToDom.textContent = Number(attemptsToDom.textContent) +1 ;
	attempts ++;
}

/* Update the star rating. Depending on the number of attempts the user made to finish the game */
let starCount = 3;

function starRating() {
	if (attempts === 10) {
		/* Delete the third star by removing the icon class and decrease starCount */
		star[2].firstElementChild.classList.remove("fa-star");
		starCount--;
    }
	if (attempts === 15) {
        /* Delete the second star by removing the icon class and decrease starCount */
		star[1].firstElementChild.classList.remove("fa-star");
		starCount--;
    }
}

/* If the 16 cards are in the matched array, we stop the timer and display the modal */
function winGame() {
	if (matched.length === 16) {
		stopTime();
		updateStats();
		displayModal();
    }
}

/* Stop the timer once the user has matched all 16 cards */
function stopTime() {
	clearInterval(time);
}

/* Update the modal with the game stats */
function updateStats() {
    const statistics = document.querySelector(".modal-content");
	/* Create 3 paragraphs for the 3 stats and 1 for the playAgain button */
	for (let i = 0; i < 4; i++) {
        const stat = document.createElement("p");
		stat.classList.add("statistics");
		statistics.appendChild(stat);
    }
	/* Select all stats paragraphs to include the text and the playAgain button */ 
    const paragraphs = Array.from(document.getElementsByClassName('statistics'));
    paragraphs[0].textContent = "Tempo para concluir : " + minutes + ":" + seconds;
    paragraphs[1].textContent = "Número de tentativas : " + attempts;
    paragraphs[2].textContent = "Pontuação : " + starCount + " / 3";
    paragraphs[3].innerHTML = '<button id="playAgain" class="btn btn-info" onclick="reset()">Jogar de novo </button>';
}

/* Show or hide the modal */
function displayModal() {
    modal.style.display = "block";
    const modalClose = document.getElementById("close");
    /* When the user click on the cross or outside the modal, we close the modal */
	modalClose.addEventListener('click', function() {
		modal.style.display = "none";
    });
	window.addEventListener('click', function(event) {
        //console.log(event.target);
		if (event.target == modal) {
			modal.style.display = "none";
        }
	});
}

/* Removes all children from boardGame */
function removeCard() {
	while (boardGame.hasChildNodes()) {
		boardGame.removeChild(boardGame.firstChild);
    }    
}

/* Reset all for new game */
function reset() {
	stopTime();
	timeStart = false;
	seconds = 0;
	minutes = 0;
	timerToDom.innerHTML = "00:00";
	star[1].firstElementChild.classList.add("fa-star");
	star[2].firstElementChild.classList.add("fa-star");
	starCount = 3;
	attempts = 0;
	attemptsToDom.innerHTML = 0;
	matched = [];
	opened = [];
	removeCard();
    startGame();
    modal.style.display = "none";
}
