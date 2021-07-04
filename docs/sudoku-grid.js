/* VARIAVEIS GLOBAIS */
let sudoku; //tabela
let canvas; //objeto

class Sudoku{
    constructor(elemento_HTML, size = 500, boardSize = 9){
        /*CONSTANTES*/
        this.SELECTED_COLOR = '#ddd';
        this.BACKGROUND_COLOR = '#fff';
        this.GRID_COLOR = '#000';
        this.FONT_SIZE = '63px';
        this.FONT_FAMILY = 'arial';

        this.canvas = elemento_HTML; //Referencia do elemento
        this.canvas.sudoku = this; //Linkando objeto com a classe
        this.size = size;
        this.boardSize = boardSize;
        this.board = undefined;

        this.canvas.addEventListener('mouseup', handleMouse);
        document.addEventListener('keyup', handleKeyboard);
        
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
        ctx.beginPath();
        ctx.fillStyle = this.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, this.size, this.size);

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
            ctx.fillStyle = this.GRID_COLOR;
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

    select(x, y){
        this.selected = {"x": x, "y": y};

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
    let key = e.key;

    //Numeros 1 ate 9
    if(key >= 1 && key <= 9){
        let number = parseInt(key);
        sudoku.inputNumber(number);
    }

    //Backspace
    if(key == 'Backspace'){
        e.stopPropagation();
        sudoku.removeNumber();
    }
}
