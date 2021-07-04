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
        this.FONT_SIZE = '63px';
        this.FONT_FAMILY = 'arial';

        this.canvas = elemento_HTML; //Referencia do elemento
        this.canvas.sudoku = this; //Linkando objeto com a classe
        this.size = size;
        this.boardSize = boardSize;
        this.board = undefined;

        this.canvas.tabIndex = 1; //Faz o elemento ser focável
        this.canvas.addEventListener('focusout', unfocus);
        this.canvas.addEventListener('mouseup', handleMouse);
        this.canvas.addEventListener('keydown', handleKeyboard);

        this.initBoard();
    }

    initBoard(){
        /*Inicializa o Array do tabuleiro*/
        this.board = [];
        for(let i = 0; i < this.boardSize; i++){
            let row = [];
            for(let j = 0; j < this.boardSize; j++){
                row.push(undefined);
            }
            this.board.push(row);
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

        /*Sudoku Grid*/
        for(let i = 1; i < this.boardSize; i++){
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
        ctx.font = `${this.FONT_SIZE} ${this.FONT_FAMILY}`;
        ctx.textAlign = 'center';
        for(let y = 0; y < this.boardSize; y++){
            for(let x = 0; x < this.boardSize; x++){
                let text = this.board[y][x];
                //Se o quadrado não estiver vazio
                if(text){ 
                    ctx.beginPath();
                    //Faz a medição do texto
                    let metrics = ctx.measureText(text);
                    /*Calcula a altura do texto, somando a distancia da baseline do texto até o topo com a distancia até em baixo. 
                    Depois divide por 2 para pegar o meio do texto.*/
                    let textOffset = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2;
                    ctx.strokeText(this.board[y][x], x * step + offset, y * step + offset + textOffset);
                }
            }
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

    checkBoard(){
        //Checa as linhas
        for(let i = 0; i < this.boardSize; i++){
            let ok = this.checkLine(0,i);
            ok = ok && this.checkLine(i,0, true);
            if(!ok){
                return false;
            }
        }

        //Checa os quadrados grandes
        for(let y = 0; y < this.boardSize; y += 3){
            for(let x = 0; x < this.boardSize; x += 3){
                if(!this.checkSquare(x,y)){
                    return false;
                }
            }
        }

        return true;

    }

    checkNumber(x, y, ignoreUndefined = false){
        let ok = this.checkLine(x, y, true, ignoreUndefined);
        let ok2 = this.checkLine(x, y, false, ignoreUndefined);
        let ok3 =  this.checkSquare(x, y, ignoreUndefined);
        //console.log(ok, ok2, ok3);
        return ok && ok2 && ok3;
    }

    isNumberValidAt(num, x, y){
        //console.log(this.board[y][x]);
        if(this.board[y][x]){
            return false;
        }
        this.board[y][x] = num;
        let isValid = this.checkNumber(x, y, true);
        //console.log(this.board[y][x], isValid);
        this.board[y][x] = undefined;
        return isValid;
    }

    checkLine(x, y, vertical = false, ignoreUndefined = false){
        if(!this.board[y][x] && !ignoreUndefined){
            return false;
        }

        for(let i = 0; i < this.boardSize; i++){
            let _y = (y * !vertical) + (vertical * i);
            let _x = (x * vertical) + (!vertical * i);
            if(_y == y && _x == x){
                continue;
            }

            if(!this.board[_y][_x] && !ignoreUndefined){
                return false;
            }

            if(this.board[_y][_x] == this.board[y][x]){
                return false;
            }
        }
        return true;
    }

    checkSquare(x, y, ignoreUndefined = false){

        if(!this.board[y][x] && !ignoreUndefined){
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
                if(!this.board[sy][sx] && !ignoreUndefined){
                    return false;
                }
            }
        }
        return true;
    }
    gerarTabuleiro(){
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

    validSolution(){
        let maxtry = 10000;
        let maxsum = 9 * 9;
        let sum = 0;  
        do{
            sum += sudoku.gerarTabuleiro();
            console.log(maxtry--);
        }while(sum < maxsum && maxtry > 0);  
        this.drawBoard();
    }
}

function unfocus(e){
    this.sudoku.unselect();
}

function handleMouse(e){
    //Posição X dentro do objeto
    let x = e.layerX; 
    //Posição Y dentro do objeto
    let y = e.layerY; 
    //Tamanho de cada quadrado
    let tamanho = this.sudoku.size / this.sudoku.boardSize; 
    x = Math.floor(x / tamanho); //Floor -> remove casas decimais
    y = Math.floor(y / tamanho);

    this.sudoku.select(x, y);
}

function handleKeyboard(e){

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
        this.sudoku.select(this.sudoku.selected.x+1, this.sudoku.selected.y);
    }

    if(key == 'ArrowLeft'){
        this.sudoku.select(this.sudoku.selected.x-1, this.sudoku.selected.y);
    }

    if(key == 'ArrowUp'){
        this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y-1);
    }

    if(key == 'ArrowDown'){
        this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y+1);
        return false;
    }
}

