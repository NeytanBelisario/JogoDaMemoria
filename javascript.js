const botaoResetar = document.getElementById("resetar");
const tentativasParaTerminar = document.getElementById("tentativas");
const tempoParaTerminar = document.getElementById("tempoParaTerminar");
const caixa = document.getElementById("caixa");
const modal = document.getElementById("modal");
const jogarDenovo = document.getElementById("jogarDenovo");
const star = document.getElementsByClassName("estrela");

/* Array das imagens das cartas */
const jogarcartas = [
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
/* Um array vazio para guardar as cartas abertas e um array vazio para guardar as cartar iguais */
let aberto = []; let iguais = [];

comecarJogo();

/* Se uma carta é clicada chama o virarcarta() e começa o tempo se não tiver rodando */
caixa.addEventListener("click", function(event) {
	if (event.target.className === "carta") {
		if (comecarTempo === false) {
			comecarTempo = true; 
			tempo();
        }
        virarcarta(event);
        
	}
});

/* Quando o usuario clica no botão de restar, chama a função reset() */
botaoResetar.addEventListener('click', reset);

/* Inicia o jogo */
function comecarJogo() {
    const jogarcartasShuffled = shuffle(jogarcartas); 
    jogarcartasShuffled.forEach(function(carta, index) {
        const liTag = document.createElement('li');
		liTag.classList.add('carta');
        const image = document.createElement("img");
        image.setAttribute("src", jogarcartasShuffled[index]);
        image.setAttribute("alt", "");
        liTag.appendChild(image);
        caixa.appendChild(liTag);
    });      
}

/* Embaralha as imagens do array das cartas */ 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }    
    return array;
} 

/* Mostra o tempo decorrido */
let comecarTempo = false; let time; let minutes = 0; let seconds = 0;

function tempo() {
	time = setInterval(function() {
        seconds++;  
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        tempoParaTerminar.textContent = minutes + ":" + seconds ;
    }, 1000);
}

/* virar a carta e adiciona elas para a array aberta */
function virarcarta(event) {
    event.target.classList.add("virar");
    pressioneParaAbrirArray(event);
}

/* Adiciona as cartas viradas para a array aberto  apenas quando seu tamanho for 0 ou 1 */
function pressioneParaAbrirArray(event) {
    if (aberto.length === 0 || aberto.length === 1) {
        aberto.push(event.target.firstElementChild);
    }
    comparecartas();
}

/* Compare as cartas pra ver se elas combinam ou não */
function comparecartas() {
	/* Quando tem 2 cartas na array aberto desabilita o click do mouse nas outras cartas */
	if (aberto.length === 2) {
  		document.body.style.pointerEvents = "none";
    }
    /* Compara o link das duas imagens */
    if (aberto.length === 2 && aberto[0].src === aberto[1].src) {
		match();
    }
    else if (aberto.length === 2 && aberto[0].src != aberto[1].src) {
		noMatch();
    }
}

/* Se as duas cartas forem iguais, mantém elas viradas e adiciona elas na array iguais */ 
function match() {
	setTimeout(function() {
		/* adiciona as cartas na array iguais */
        iguais.push(...aberto);
		/* Permite o click de novo */
        document.body.style.pointerEvents = "auto";
		/* Confere se o jogo terminou */
        ganharJogo();
		/* Limpa a array aberto */
        aberto = [];
        
    }, 500);
	tentativascontador();
	pontuacaoEstrelas();
}

/* Se as duas cartas não combinarem remove elas da array aberto e da classe virar. */
function noMatch() {
	setTimeout(function() {
        /* Remove a classe virar do elemento pai */
		aberto[0].parentElement.classList.remove("virar");
        aberto[1].parentElement.classList.remove("virar");
		/* Permite o click de novo */
        document.body.style.pointerEvents = "auto";
		/* Limpa a array aberto */
        aberto = [];
    }, 1000);
	tentativascontador();
	pontuacaoEstrelas();
}

/* Aumenta a contador de tentativas */
let tentativas = 0;

function tentativascontador() {
	tentativasParaTerminar.textContent ++; // Iguala a : tentativasParaTerminar.textContent = Number(tentativasParaTerminar.textContent) +1 ;
	tentativas ++;
}

/* Atualiza o número de estrelas. Dependendo do número de tentativas para terminar o jogo */
let contaEstrelas = 3;

function pontuacaoEstrelas() {
	if (tentativas === 10) {
		/* Deleta a terceira estrela por meio de remover a classe do icon e diminuir o contador de estrelas */
		star[2].firstElementChild.classList.remove("fa-star");
		contaEstrelas--;
    }
	if (tentativas === 15) {
        /* Deleta a segunda estrela por meio de remover a classe do icon e diminuir o contador de estrelas */
		star[1].firstElementChild.classList.remove("fa-star");
		contaEstrelas--;
    }
}

/* Se as 16 cartas são iguais, para o tempo e mostra a mensagem de partida vencida */
function ganharJogo() {
	if (iguais.length === 16) {
		pararTempo();
		atualizarEstatisticas();
		displayModal();
    }
}

/* Para o tempo desde que as 16 cartas estejam na array iguais*/
function pararTempo() {
	clearInterval(time);
}

/* Atualiza a mensagem com as estatisticas do jogo */
function atualizarEstatisticas() {
    const estatisticas = document.querySelector(".modal-content");
	/* Cria 3 paragrafos para as estatisticas e um para o botão jogar de novo */
	for (let i = 0; i < 4; i++) {
        const stat = document.createElement("p");
		stat.classList.add("estatisticas");
		estatisticas.appendChild(stat);
    }
	/* Seleciona todos os paragrafos de estatisticas para incluir as mensagens com as estatisticas e o botão jogar de novo */ 
    const paragrafos = Array.from(document.getElementsByClassName('estatisticas'));
    paragrafos[0].textContent = "Tempo para concluir : " + minutes + ":" + seconds;
    paragrafos[1].textContent = "Número de tentativas : " + tentativas;
    paragrafos[2].textContent = "Pontuação : " + contaEstrelas + " / 3";
    paragrafos[3].innerHTML = '<button id="jogarDenovo" class="btn btn-info" onclick="reset()">Jogar de novo </button>';
}

/* Mostrar ou esconder a mensagem */
function displayModal() {
    modal.style.display = "block";
    const modalfechar = document.getElementById("fechar");
    /* Quando o usuario clica fora da mesagem ou no botao de fechar, fecha a mensagem */
	modalfechar.addEventListener('click', function() {
		modal.style.display = "none";
    });
	window.addEventListener('click', function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
        }
	});
}

/* Remove todas as criancas do caixa */
function removecarta() {
	while (caixa.hasChildNodes()) {
		caixa.removeChild(caixa.firstChild);
    }    
}

/* Reseta tudo para um novo jogo */
function reset() {
	pararTempo();
	comecarTempo = false;
	seconds = 0;
	minutes = 0;
	tempoParaTerminar.innerHTML = "00:00";
	star[1].firstElementChild.classList.add("fa-star");
	star[2].firstElementChild.classList.add("fa-star");
	contaEstrelas = 3;
	tentativas = 0;
	tentativasParaTerminar.innerHTML = 0;
	iguais = [];
	aberto = [];
	removecarta();
    comecarJogo();
    modal.style.display = "none";
}
