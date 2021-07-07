/* VARIAVEIS GLOBAIS */
let sudoku; //tabela
let canvas; //objeto

/* INICIALIZAÇÃO */
window.onload = function(){
    let btn_finish = document.getElementById("terminar_jogo");
    canvas = document.getElementById("sudoku-canvas");
    sudoku = new Sudoku(canvas);

    btn_finish.addEventListener('click', ()=>{
        if(confirm("Deseja realmente terminar o jogo?")){
            sudoku.finishGame();
        }
    });

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
        this.gameFinished = undefined;

        this.canvas.tabIndex = 1; //Faz o elemento ser focável
        this.canvas.addEventListener('focusout', unfocus);
        this.canvas.addEventListener('mouseup', handleMouse);
        this.canvas.addEventListener('keydown', handleKeyboard);

        this.initBoard();
    }

    initBoard(){
        /*Inicializa o Array do tabuleiro*/
        this.board = [];
        this.boardResult = [];
        for(let i = 0; i < this.boardSize; i++){
            let row = [];
            for(let j = 0; j < this.boardSize; j++){
                row.push(undefined);
            }
            this.board.push(row);
            this.boardResult.push(Array.from(row));
        }

        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.drawBoard();
    }

    drawBoard(){
        let step = this.size/this.boardSize; //Tamanho do quadrado
        let ctx = this.canvas.getContext('2d');
        
        /* Clear Canvas */
        this.resetBoard();

        /*Selected Square*/
        if(this.selected){
            ctx.beginPath();
            let x = this.selected.x;
            let y = this.selected.y;
            ctx.fillStyle = this.SELECTED_COLOR;
            ctx.fillRect(x * step, y * step, step, step);
            ctx.stroke(); //comando para preencher
        }
        
        if(this.gameFinished){
            for(let y = 0; y < this.boardSize; y++){
                for(let x = 0; x < this.boardSize; x++){
                    ctx.beginPath();
                    switch(this.boardResult[y][x]){
                        case this.BOARD_RIGHT:
                            ctx.fillStyle = this.RIGHT_COLOR;
                            break;
                        case this.BOARD_WRONG:
                            ctx.fillStyle = this.WRONG_COLOR;
                            break;
                        default:
                            continue;
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
                    ctx.strokeText(this.board[y][x], x * step + offset, y * step + offset + textOffset);
                }
            }
        }

        if(this.gameFinished){
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = this.FINISHED_FOREGROUND_COLOR;
            ctx.fillRect(0, 0, this.size, this.size);
            ctx.restore();            
        }
    }  

    resetBoard(){
        /* Clear Canvas */
        let ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = this.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, this.size, this.size);
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
        this.board[this.selected.y][this.selected.x] = n;
        this.drawBoard();
    }

    removeNumber(){
        if(!this.selected){
            return;
        }
        this.board[this.selected.y][this.selected.x] = undefined;
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
        this.checkLine(x, y, true); //Linha vertical
        this.checkLine(x, y);       //Linha horizontal
        this.checkSquare(x, y);     //Quadrado grande
    }

    /*isNumberValidAt(num, x, y){
        //console.log(this.board[y][x]);
        if(this.board[y][x]){
            return false;
        }
        this.board[y][x] = num;
        let isValid = this.checkNumber(x, y, true);
        //console.log(this.board[y][x], isValid);
        this.board[y][x] = undefined;
        return isValid;
    }*/

    checkLine(x, y, vertical = false){
        if(!this.board[y][x]){
            this.boardResult[y][x] = null;
            return;
        }

        for(let i = 0; i < this.boardSize; i++){
            let _y = (y * !vertical) + (vertical * i);
            let _x = (x * vertical) + (!vertical * i);
            if(_y == y && _x == x){
                continue;
            }

            if(this.board[_y][_x] == this.board[y][x]){
                this.boardResult[y][x] = this.BOARD_WRONG;
                this.boardResult[_y][_x] = this.BOARD_WRONG;
                continue;
            }
        }

        this.boardResult[y][x] = this.BOARD_RIGHT;
    }

    checkSquare(x, y){
        if(!this.board[y][x]){
            this.boardResult[y][x] = null;
            return;
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
                    this.boardResult[y][x] = this.BOARD_WRONG;
                    this.boardResult[sy][sx] = this.BOARD_WRONG;
                    continue;
                }
            }
        }
        this.boardResult[y][x] = this.BOARD_RIGHT;
    }

    /*gerarTabuleiro(){
        let numeros = [1,2,3,4,5,6,7,8,9];
        let n = 0;

        for(let i = 0; i <= 9; i++){
            let aleatorio = Math.floor(Math.random()*9);
            let aleatorioX = Math.floor(Math.random()*9);
            let aleatorioY = Math.floor(Math.random()*9);
            if(this.isNumberValidAt(numeros[aleatorio],aleatorioX,aleatorioY)){
                this.board[aleatorioY][aleatorioX] = numeros[aleatorio];
                n++;
            }
        }
        //this.drawBoard();
        return n;
    }*/

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
        this.checkBoard();

        this.selected = undefined;
        this.gameFinished = true;
        this.drawBoard();

        /* Conta os erros e acertos */
        let result = {erros: 0, acertos: 0};
        for(let y = 0; y < this.boardSize; y++){
            for(let x = 0; x < this.boardSize; x++){
                switch(this.boardResult[y][x]){
                    case this.BOARD_RIGHT:
                        result.acertos++;
                        break;
                    case this.BOARD_WRONG || null:
                        result.erros++;
                        break;
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
    let tamanho = this.sudoku.size / this.sudoku.boardSize; 
    x = Math.floor(x / tamanho); //Floor -> remove casas decimais
    y = Math.floor(y / tamanho);
    
    this.sudoku.select(x, y);
    
    let inp = $("<input type='number' autofocus>");
    inp.on('input', () => {
        let num = $('this').val();
        $('this').val(null);
        this.sudoku.inputNumber(num);
    });
    $(this).append(inp);
    inp.trigger('focus');
    inp.focus();
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
        this.sudoku.removeNumber();
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
    $("#botao1").click(function(){
        $("#texto1").slideToggle("slow");
    });

    $("#botao2").click(function(){
        $("#texto2").slideToggle("slow");
    });

    $('#exportar').click(function(ev){
        let img = sudoku.exportAsImage();
        let download = document.createElement('a');
        download.href = img;
        download.download = "meu_sudoku.png";
        download.click();
    });
});