/* VARIAVEIS GLOBAIS */
let sudoku; //tabela
let canvas; //objeto

/* INICIALIZAÇÃO */
window.onload = function(){
    canvas = document.getElementById("sudoku-canvas");
    sudoku = new Sudoku(canvas);
};


class Sudoku{
    constructor(elemento_HTML, size = 500, boardSize = 9){
        /*CONSTANTES*/
        this.SELECTED_COLOR = '#ccc';
        this.BACKGROUND_COLOR = '#fff';
        this.GRID_COLOR = '#000';
        this.FINISHED_FOREGROUND_COLOR = '#000';
        this.RIGHT_COLOR = '#afa';
        this.WRONG_COLOR = '#faa';
        this.FONT_COLOR = '#000';
        this.FONT_SIZE = '63px';
        this.FONT_FAMILY = 'arial';
        this.BOARD_RIGHT = true;
        this.BOARD_WRONG = false;

        this.canvas = elemento_HTML; //Referencia do elemento
        this.canvas.sudoku = this; //Linkando objeto com a classe
        this.size = size;
        this.boardSize = boardSize;
        this.board = undefined;
        this.gameFinished = false;

        this.canvas.tabIndex = 1; //Faz o elemento ser focável
        this.canvas.addEventListener('focusout', unfocus);
        this.canvas.addEventListener('mouseup', handleMouse);
        this.canvas.addEventListener('keydown', handleKeyboard);

        /* Determina as dimensões do Canvas */
        /*  (Impossível determinar por CSS) */
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.criarNovoJogo();
    }

    //cria diferentes tabuleiros e também randomiza eles ao click do botão "novo_jogo"
    criarNovoJogo(){
        //tabuleiros
        let tabuleiro1 = [
        [5   ,3   ,null,null,7   ,null,null,null,null],
        [6   ,null,null,1   ,9   ,5   ,null,null,null],
        [null,9   ,8   ,null,null,null,null,6   ,null],
        [8   ,null,null,null,6   ,null,null,null,3   ],
        [4   ,null,null,8   ,null,3   ,null,null,1   ],
        [7   ,null,null,null,2   ,null,null,null,6   ],
        [null,6   ,null,null,null,null,2   ,8   ,null],
        [null,null,null,4   ,1   ,9   ,null,null,5   ],
        [null,null,null,null,8   ,null,null,7   ,9   ]   
        ];

        let tabuleiro2 = [
        [8   ,null,null,4   ,null,6   ,null,null,7   ],
        [null,null,null,null,null,null,4   ,null,null],
        [null,1   ,null,null,null,null,6   ,5   ,null],
        [5   ,null,9   ,null,3   ,null,7   ,8   ,null],
        [null,null,null,null,7   ,null,null,null,null],
        [null,4   ,8   ,null,2   ,null,1   ,null,3   ],
        [null,5   ,2   ,null,null,null,null,9   ,null],
        [null,null,1   ,null,null,null,null,null,null],
        [3   ,null,null,9   ,null,2   ,null,null,5   ]   
        ]

        let tabuleiro3 = [
        [8   ,null,null,null,null,null,null,null,null],
        [null,null,3   ,6   ,null,null,null,null,null],
        [null,7   ,null,null,9   ,null,2   ,null,null],
        [null,5   ,null,null,null,7   ,null,null,null],
        [null,null,null,null,4   ,5   ,7   ,null,null],
        [null,null,null,1   ,null,null,null,3   ,null],
        [null,null,1   ,null,null,null,null,6   ,8   ],
        [null,null,8   ,5   ,null,null,null,1   ,null],
        [null,9   ,null,null,null,null,4   ,null,null]   
        ] 

        //cria o array tabuleiros e adiciona cada tabuleiro a ele
        let tabuleiros = [];
        tabuleiros.push(tabuleiro1);
        tabuleiros.push(tabuleiro2);
        tabuleiros.push(tabuleiro3);

        //cria a variavel de randomTabuleiro que é igual ao array tabuleiros que pega o tamanho de tabuleiros e traz números aleatórios
        //assim que randomiza os tabuleiros
        let randomTabuleiro = tabuleiros[Math.floor(Math.random() * tabuleiros.length)];

        this.boardInitial = []; //o grandão
        this.boardResult = []; //com resultados
        this.board = []; //numeros

        //
        for(let i = 0; i < this.boardSize; i++){ 
            //cria 1 linha pra cada vetor 
            let initial_row = []; 
            let result_row = [];
            let board_row = [];
            for(let j = 0; j < this.boardSize; j++){ 
                //adiciona o valor da coluna para cada linha
                result_row.push(undefined);
                board_row.push(randomTabuleiro[i][j]);
                initial_row.push(randomTabuleiro[i][j]);
            }
            //bota a linha dentro do vetor
            this.boardResult.push(result_row);
            this.boardInitial.push(initial_row);
            this.board.push(board_row);
        }
        //volta as variáveis pro valor padrão
        this.selected = undefined;
        this.gameFinished = false;
        //escreve o board
        this.drawBoard();
    }

    drawBoard(){
        let step = this.size/this.boardSize; //Tamanho do quadrado
        let ctx = this.canvas.getContext('2d');
        
        /* Clear Canvas */
        ctx.beginPath();
        ctx.fillStyle = this.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, this.size, this.size);

        /*Selected Square*/
        if(this.selected){
            ctx.beginPath();
            let x = this.selected.x;
            let y = this.selected.y;
            //mostrar em tempo real se o num está correto
            if(this.boardResult[this.selected.y][this.selected.x] == true){
               ctx.fillStyle = this.RIGHT_COLOR; 
            }else if(this.boardResult[this.selected.y][this.selected.x] == false){
                ctx.fillStyle = this.WRONG_COLOR;
            }else{
                ctx.fillStyle = this.SELECTED_COLOR;
            }

            ctx.fillRect(x * step, y * step, step, step);
            ctx.stroke(); //comando para preencher
        }
        
        if(this.gameFinished){
            for(let y = 0; y < this.boardSize; y++){
                for(let x = 0; x < this.boardSize; x++){
                    ctx.beginPath();
                    if(this.boardResult[y][x]){
                        ctx.fillStyle = this.RIGHT_COLOR;
                    } else {
                        ctx.fillStyle = this.WRONG_COLOR;
                    }
                    ctx.fillRect(x * step, y * step, step, step);                   
                }
            }
            ctx.stroke();
        }

        /*Sudoku Grid*/
        for(let i = 0; i <= this.boardSize; i++){
            ctx.beginPath();
            ctx.strokeStyle = this.GRID_COLOR;
            ctx.lineWidth = 1;
            if(i % 3 == 0){ //Linha grossa
                ctx.lineWidth = 4;
            }

            ctx.moveTo(step * i, 0);
            ctx.lineTo(step * i, this.size);
            ctx.stroke();

            ctx.moveTo(0, step * i);
            ctx.lineTo(this.size, step * i);
            ctx.stroke();
        }


        /*Numbers*/
        let offset = step / 2;
        ctx.beginPath();
        ctx.font = `${this.FONT_SIZE} ${this.FONT_FAMILY}`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = this.FONT_COLOR;
        ctx.fillStyle = this.FONT_COLOR;
        ctx.lineWidth = 1;
        for(let y = 0; y < this.boardSize; y++){
            for(let x = 0; x < this.boardSize; x++){
                let text = this.board[y][x];
                //Se o quadrado não estiver vazio
                if(text){ 
                    
                    //Faz a medição do texto
                    let metrics = ctx.measureText(text);
                    /*Calcula a altura do texto, somando a distancia da baseline do texto até o topo com a distancia até em baixo. 
                    Depois divide por 2 para pegar o meio do texto.*/
                    let textOffset = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2;
                    if(this.boardInitial[y][x] != null){
                        ctx.fillText(this.board[y][x], x * step + offset, y * step + offset + textOffset);
                    }else{
                        ctx.strokeText(this.board[y][x], x * step + offset, y * step + offset + textOffset);
                    }
                }
            }
        }

        if(this.gameFinished){
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = this.FINISHED_FOREGROUND_COLOR;
            ctx.fillRect(0, 0, this.size, this.size);
            ctx.globalAlpha = 1;            
        }
    }  

    select(x, y){
        x = (this.boardSize + x) * (x < 0) + (x % this.boardSize) * (x > 0);
        y = (this.boardSize + y) * (y < 0) + (y % this.boardSize) * (y > 0);
        this.selected = {"x": x, "y": y};

        this.drawBoard();
    }

    unselect(){
        this.selected = undefined;

        this.drawBoard();
    }

    inputNumber(n){
        if(!this.selected){
            return;
        }
        if(this.boardInitial[this.selected.y][this.selected.x] != null){
            return;
        }
        this.board[this.selected.y][this.selected.x] = n;
        this.checkNumber(this.selected.x, this.selected.y);
        this.drawBoard();
    }

    /* Checa o estado do tabuleiro */
    checkBoard(){
        for(let y = 0; y < this.boardSize; y++){
            for(let x = 0; x < this.boardSize; x++){
                /* Checa cada elemento do tablueiro para saber se há erros */
                if(this.boardResult[y][x]){
                    /* Se o elemento já tiver sido checado ele é pulado */
                    continue;
                }
                this.checkNumber(x, y);
            }
        }
    }

    checkNumber(x, y){
        let ok = 
            this.checkLine(x, y, true)  //Linha vertical
            && this.checkLine(x, y)     //Linha horizontal
            && this.checkSquare(x, y);  //Quadrado grande
        this.boardResult[y][x] = ok;
    }

    checkLine(x, y, vertical = false){
        if(!this.board[y][x]){
            this.boardResult[y][x] = null;
            return false;
        }

        for(let i = 0; i < this.boardSize; i++){
            let _y = (y * !vertical) + (vertical * i);
            let _x = (x * vertical) + (!vertical * i);
            if(_y == y && _x == x){
                continue;
            }

            if(this.board[_y][_x] == this.board[y][x]){
                return false;
            }
        }

        return true;
    }

    checkSquare(x, y){
        if(!this.board[y][x]){
            this.boardResult[y][x] = null;
            return false;
        }

        let sqrSize = this.boardSize / 3;
        let sqrX = Math.floor(x / sqrSize);
        let sqrY = Math.floor(y / sqrSize);
        let sqrMaxX = sqrSize * (sqrX + 1);
        let sqrMaxY = sqrSize * (sqrY + 1);

        for(let sy = sqrY * sqrSize; sy < sqrMaxY; sy++){
            for(let sx = sqrX * sqrSize; sx < sqrMaxX; sx++){
                if(sx == x && sy == y){
                    continue;
                }
                if(this.board[y][x] == this.board[sy][sx]){
                    return false;
                }
            }
        }
        return true;
    }

    generateTestBoard(){
        for(let y = 0; y < this.boardSize; y++){
            let of = y % 3 * 3 + Math.floor(y / 3);
            for(let x = 0; x < this.boardSize; x++){
                this.board[y][x] = (x + of) % 9 + 1;
            }
        }
        this.drawBoard();
    }

    finishGame(){
        if(this.gameFinished){
            return false;
        }
        this.checkBoard();

        this.selected = undefined;
        this.gameFinished = true;
        this.drawBoard();

        /* Conta os erros e acertos */
        let result = {erros: 0, acertos: 0};
        for(let y = 0; y < this.boardSize; y++){
            for(let x = 0; x < this.boardSize; x++){
                if(this.boardResult[y][x]){
                    result.acertos++;
                }else{
                    result.erros++;
                }
            }
        }
        return result;
    }

    exportAsImage(){
        var image = canvas.toDataURL("image/png");
        image.replace("image/png", "image/octet-stream");
        return image;
    }
}

function unfocus(e){
    this.sudoku.unselect();
}

function handleMouse(e){
    if(this.sudoku.gameFinished){
        return;
    }

    //Posição X dentro do objeto
    let x = e.layerX; 
    //Posição Y dentro do objeto
    let y = e.layerY; 
    //Tamanho de cada quadrado
    let tamanho = this.clientWidth / this.sudoku.boardSize; 
    x = Math.floor(x / tamanho); //Floor -> remove casas decimais
    y = Math.floor(y / tamanho);
    
    this.sudoku.select(x, y);
    this.sudoku.lastSelection = {x: x, y: y};
}

function handleKeyboard(e){
    if(this.sudoku.gameFinished){
        return;
    }

    //Impede o input do teclado de afetar a página
    e.preventDefault(); 
    let key = e.key;

    //Numeros 1 ate 9
    if(key >= 1 && key <= 9){
        let number = parseInt(key);
        this.sudoku.inputNumber(number);
    }

    //Backspace
    if(key == 'Backspace'){
        this.sudoku.inputNumber(null);
    }

    if(key == 'ArrowRight'){
        this.sudoku.select(this.sudoku.selected.x + 1, this.sudoku.selected.y);
    }
    if(key == 'ArrowLeft'){
        this.sudoku.select(this.sudoku.selected.x - 1, this.sudoku.selected.y);
    }
    if(key == 'ArrowUp'){
        this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y - 1);
    }
    if(key == 'ArrowDown'){
        this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y + 1);
        return false;
    }
}

//PARTE DE INSTRUÇÕES E "SOBRE NÓS"
$(document).ready(function(){
    //ao clique mostra as informações (instruções e sobre nós respectivamente)
    $("#botao1").click(function(){
        $("#texto1").slideToggle("slow");
    });
    
    $("#botao2").click(function(){
        $("#texto2").slideToggle("slow");
    });

    $("#novo_jogo").on('click', function(){
        setTimeout(() => {
            if(confirm("Deseja realmente começar um Novo jogo?\nIsso apagará todo seu progresso atual.")){
                sudoku.criarNovoJogo();
                $('#terminar_jogo')[0].disabled = false;
            }
        },150);
        
    });

    $('#terminar_jogo').on('click', (ev)=>{
        setTimeout(() => {
            if(confirm("Deseja realmente terminar o jogo?")){          
                r = sudoku.finishGame();
                resultado(r);
                console.log(r);
                ev.target.disabled = true;
            }
        }, 150);
    });


    $('#exportar').click(function(ev){
        let img = sudoku.exportAsImage();
        let download = document.createElement('a');
        download.href = img;
        download.download = "meu_sudoku.png";
        download.click();
    });

    let isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if(isMobile) {
        let keydiv = $('#mobile_keyboard');
        /* Botoes de 1 a 9 */
        for(let i = 1; i <= 9; i++){
            let btn = $(`<button>${i}</button>`);
            btn.on('click', ()=>{
                sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
                sudoku.inputNumber(i);
            });
            keydiv.append(btn);
            
        }
        /* Botao de apagar */
        let btn = $(`<button>&#x2421;</button>`);
        btn.on('click', ()=>{
            sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
            sudoku.inputNumber(null);
        });
        keydiv.append(btn);
    }
});


// Função que mostrar as imagens de "vencedor" ou "perdedor" com base no erro
function resultado(r){
    if(r.erros == 0 ){
            $("#wonGame").slideToggle("slow");
        }else if(r.erros > 0){
            $("#loseGame").slideToggle("slow");
        }
}

//ao pressionar o botão "novo_jogo" as imagens irão desaparecer sem precisar de f5
function refresh(){
    $("#wonGame").slideUp("slow");
    $("#loseGame").slideUp("slow");
}