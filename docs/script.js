/* VARIAVEIS GLOBAIS */
let sudoku; //tabela
let canvas; //objeto

/* INICIALIZAÇÃO */
window.onload = function () {
  canvas = document.getElementById("sudoku-canvas");
  sudoku = new Sudoku(canvas);
};

class Sudoku {
  constructor(elemento_HTML, size = 500, boardSize = 9) {
    /*CONSTANTES*/
    this.SELECTED_COLOR = "#ccc";
    this.BACKGROUND_COLOR = "#fff";
    this.GRID_COLOR = "#000";
    this.FINISHED_FOREGROUND_COLOR = "#000";
    this.RIGHT_COLOR = "#afa";
    this.WRONG_COLOR = "#faa";
    this.FONT_COLOR = "#000";
    this.FONT_SIZE = "63px";
    this.FONT_FAMILY = "arial";

    /* Referencia o Elemento HTML Canvas com o Objeto Sudoku */
    this.canvas = elemento_HTML; //Referencia do elemento
    this.canvas.sudoku = this; //Linkando objeto com a classe

    this.size = size;
    this.boardSize = boardSize;
    this.board = undefined;
    this.gameFinished = false;

    /* Adicionando Eventos do Objeto Canvas */
    this.canvas.tabIndex = 1; //Faz o elemento ser focável
    this.canvas.addEventListener("focusout", unfocus);
    this.canvas.addEventListener("pointerup", handleMouse);
    this.canvas.addEventListener("keydown", handleKeyboard);

    /* Determina as dimensões do Canvas */
    /*  (Impossível determinar por CSS) */
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    this.criarNovoJogo();
  }

  /*Cria diferentes tabuleiros padrões e escolhe um aleatório.
    Inicializa as matrizes do tabuleiro. */
  criarNovoJogo() {
    //tabuleiros
    let tabuleiro1 = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];

    let tabuleiro2 = [
      [8, null, null, 4, null, 6, null, null, 7],
      [null, null, null, null, null, null, 4, null, null],
      [null, 1, null, null, null, null, 6, 5, null],
      [5, null, 9, null, 3, null, 7, 8, null],
      [null, null, null, null, 7, null, null, null, null],
      [null, 4, 8, null, 2, null, 1, null, 3],
      [null, 5, 2, null, null, null, null, 9, null],
      [null, null, 1, null, null, null, null, null, null],
      [3, null, null, 9, null, 2, null, null, 5],
    ];

    let tabuleiro3 = [
      [8, null, null, null, null, null, null, null, null],
      [null, null, 3, 6, null, null, null, null, null],
      [null, 7, null, null, 9, null, 2, null, null],
      [null, 5, null, null, null, 7, null, null, null],
      [null, null, null, null, 4, 5, 7, null, null],
      [null, null, null, 1, null, null, null, 3, null],
      [null, null, 1, null, null, null, null, 6, 8],
      [null, null, 8, 5, null, null, null, 1, null],
      [null, 9, null, null, null, null, 4, null, null],
    ];

    //cria o array tabuleiros e adiciona cada tabuleiro a ele
    let tabuleiros = [];
    tabuleiros.push(tabuleiro1);
    tabuleiros.push(tabuleiro2);
    tabuleiros.push(tabuleiro3);

    //cria a variavel de randomTabuleiro que é igual ao array tabuleiros que pega o tamanho de tabuleiros e traz números aleatórios
    //assim que randomiza os tabuleiros
    let randomTabuleiro =
      tabuleiros[Math.floor(Math.random() * tabuleiros.length)];

    this.boardInitial = []; //o grandão
    this.boardResult = []; //com resultados
    this.board = []; //numeros

    for (let i = 0; i < this.boardSize; i++) {
      //cria 1 linha pra cada vetor
      let initial_row = [];
      let result_row = [];
      let board_row = [];
      for (let j = 0; j < this.boardSize; j++) {
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

  drawBoard() {
    //Tamanho do quadrado pequeno
    let step = this.size / this.boardSize;
    let ctx = this.canvas.getContext("2d");

    /* Clear Canvas 
        Pinta o quadro todo de branco*/
    ctx.beginPath();
    ctx.fillStyle = this.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, this.size, this.size);

    /* Selected Square
        Pinta o quadrado selecionado */
    if (this.selected) {
      ctx.beginPath();
      let x = this.selected.x;
      let y = this.selected.y;
      /* Mostrar em tempo real se o numero está correto 
            Se estiver correto muda a cor para verde.
            Se estiver errado muda a cor para vermelho.
            Senão usa a cor padrão cinza. */
      if (this.boardResult[this.selected.y][this.selected.x] == true) {
        ctx.fillStyle = this.RIGHT_COLOR;
      } else if (this.boardResult[this.selected.y][this.selected.x] == false) {
        ctx.fillStyle = this.WRONG_COLOR;
      } else {
        ctx.fillStyle = this.SELECTED_COLOR;
      }

      /* Pinta o quadrado na posição selecionada 
            Tamanho do quadrado * posição do quadrado selecionado */
      ctx.fillRect(x * step, y * step, step, step);
    }

    /* Quando o jogo termina, colore os quadrados com verde ou vermelho
        dependendo se estão certo ou errado. */
    if (this.gameFinished) {
      for (let y = 0; y < this.boardSize; y++) {
        for (let x = 0; x < this.boardSize; x++) {
          /* Pula os quadrados do tabuleiro inicial */
          if (this.boardInitial[y][x]) {
            continue;
          }
          /* Pula os quadrados vazios */
          if (this.boardResult[y][x] == null) {
            continue;
          }
          ctx.beginPath();
          if (this.boardResult[y][x]) {
            ctx.fillStyle = this.RIGHT_COLOR;
          } else {
            ctx.fillStyle = this.WRONG_COLOR;
          }
          ctx.fillRect(x * step, y * step, step, step);
        }
      }
    }

    /* Sudoku Grid 
        Desenha as linhas verticais e horizontais da grade */
    for (let i = 0; i <= this.boardSize; i++) {
      ctx.beginPath();
      ctx.strokeStyle = this.GRID_COLOR;
      /* Tamanho padrao da linha é 1.
            Mas a cada 3 linhas muda o tamanho para 4. */
      ctx.lineWidth = 1;
      if (i % 3 == 0) {
        ctx.lineWidth = 4;
      }

      /* Vertical 
            Move o começo da linha para X = tamanho do quadrado * i e Y = 0.
            Move o fim da linha para Y = tamanho do quadro */
      ctx.moveTo(step * i, 0);
      ctx.lineTo(step * i, this.size);
      ctx.stroke();

      /* Horizontal 
            Igual ao vertical com os valores invertidos */
      ctx.moveTo(0, step * i);
      ctx.lineTo(this.size, step * i);
      ctx.stroke();
    }

    /* Numbers 
        Desenha cada número do 'board' no tabuleiro em seus respectivos quadrados*/
    let offset = step / 2;
    ctx.beginPath();
    /* Define o estilo do texto */
    ctx.font = `${this.FONT_SIZE} ${this.FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.strokeStyle = this.FONT_COLOR;
    ctx.fillStyle = this.FONT_COLOR;
    ctx.lineWidth = 1;
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        let text = this.board[y][x];
        //Se o quadrado não estiver vazio
        if (text) {
          //Faz a medição do texto
          let metrics = ctx.measureText(text);
          /*Calcula a altura do texto, somando a distancia da baseline do texto até o topo com a distancia até em baixo. 
                    Depois divide por 2 para pegar o meio do texto.*/
          let textOffset =
            (metrics.actualBoundingBoxAscent +
              metrics.actualBoundingBoxDescent) /
            2;
          /* Se o número estiver no tabuleiro inicial escreve ele com preenchimento
                    Senão escreve ele sem preenchimento. */
          if (this.boardInitial[y][x] != null) {
            ctx.fillText(
              this.board[y][x],
              x * step + offset,
              y * step + offset + textOffset
            );
          } else {
            ctx.strokeText(
              this.board[y][x],
              x * step + offset,
              y * step + offset + textOffset
            );
          }
        }
      }
    }
    if (this.gameFinished) {
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = this.FINISHED_FOREGROUND_COLOR;
      ctx.fillRect(0, 0, this.size, this.size);
      ctx.globalAlpha = 1;
    }
  }

  /* Seleciona um quadrado e atualiza o quadro*/
  select(x, y) {
    x = (this.boardSize + x) * (x < 0) + (x % this.boardSize) * (x > 0);
    y = (this.boardSize + y) * (y < 0) + (y % this.boardSize) * (y > 0);
    this.selected = { x, y };

    this.drawBoard();
  }

  /* Tira a seleção atual e atualiza o quadro */
  unselect() {
    this.selected = undefined;

    this.drawBoard();
  }

  /* Escreve o número dado na posição previamente selecionada,
    checa se o número está correto e atualiza o quadro */
  inputNumber(n) {
    if (!this.selected) {
      return;
    }
    if (this.boardInitial[this.selected.y][this.selected.x] != null) {
      return;
    }
    this.board[this.selected.y][this.selected.x] = n;
    this.checkNumber(this.selected.x, this.selected.y);
    this.drawBoard();
  }

  /* Checa todos os números do tabuleiro individualmente. */
  checkBoard() {
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        /* Checa o númeoro na posição X, Y */
        this.checkNumber(x, y);
      }
    }
  }

  /* Checa um número na posição dada 
    e define o estado dele no Resultado do Tabuleiro (boardResult).
    true = certo.
    false = errado.
    null = quadrado vazio. */
  checkNumber(x, y) {
    let ok = this.checkLine(x, y, true); //Linha vertical
    let ok2 = this.checkLine(x, y); //Linha horizontal
    let ok3 = this.checkSquare(x, y); //Quadrado grande
    if (ok == null) {
      this.boardResult[y][x] = ok;
    } else {
      this.boardResult[y][x] = ok && ok2 && ok3;
    }
  }

  /* Checa, para um número na posição dada, a validade dele na linha.
    O argumento 'vertical' define se a checagem será da linha horizontal ou vertical. */
  checkLine(x, y, vertical = false) {
    /* Se o número for nulo retorna nulo */
    if (!this.board[y][x]) {
      return null;
    }

    /* Itera sobre cada elemento da linha */
    for (let i = 0; i < this.boardSize; i++) {
      /* Esta expressão lógica determina se a checagem da linha será vertical ou horizontal. 
            Para as linhas horizontais (vertical = false), o valor de Y é fixo (y * !vertical) e o de X é que muda (!vertical * i).
            Para as linhas verticais (vertical = true), o valor de Y é móvel (vertical * i) enquanto o de X é fixo (x * vertical).
            Note que o Javascript trata True como 1 e False como 0 no contexto de equações matemáticas. */
      let _y = y * !vertical + vertical * i;
      let _x = x * vertical + !vertical * i;

      /* Se a posição que está sendo checada (_x, _y) for igual à posição
             do número dado (x, y) então pula a checagem para evitar falsos negativos. */
      if (_y == y && _x == x) {
        continue;
      }

      /* Se o houver um número igual na linha retorna Falso (errado) */
      if (this.board[_y][_x] == this.board[y][x]) {
        return false;
      }
    }

    /* Se o número passar por todas as checagens sem a função retornar,
        então retorna True (correto). */
    return true;
  }

  /* Checa, para um número na posição dada, a validade dele na quadrado grande.*/
  checkSquare(x, y) {
    if (!this.board[y][x]) {
      return null;
    }

    let sqrSize = this.boardSize / 3; //Tamanho do quadrado grande -> 3 x 3
    /* Determina a posição inicial do quadrado grande. */
    let sqrX = Math.floor(x / sqrSize);
    let sqrY = Math.floor(y / sqrSize);
    /* Determina a posição final do quadrado grande. */
    let sqrMaxX = sqrSize * (sqrX + 1);
    let sqrMaxY = sqrSize * (sqrY + 1);

    /* Itera sobre todas as posições do quadrado grande. */
    for (let sy = sqrY * sqrSize; sy < sqrMaxY; sy++) {
      for (let sx = sqrX * sqrSize; sx < sqrMaxX; sx++) {
        /* Se a posição que está sendo checada (sx, sy) for igual à posição
                 do número dado (x, y) então pula a checagem para evitar falsos negativos.. */
        if (sx == x && sy == y) {
          continue;
        }

        /* Se o houver um número igual na linha retorna Falso (errado) */
        if (this.board[y][x] == this.board[sy][sx]) {
          return false;
        }
      }
    }

    /* Se o número passar por todas as checagens sem a função retornar,
        então retorna True (correto). */
    return true;
  }

  /* Gera um Tabuleiro válido para testes.

    1 2 3  4 5 6  7 8 9
    4 5 6  7 8 9  1 2 3
    7 8 9  1 2 3  4 5 6

    2 3 4  5 6 7  8 9 1
    5 6 7  8 9 1  2 3 4
    8 9 1  2 3 4  5 6 7

    3 4 5  6 7 8  9 1 2
    6 7 8  9 1 2  3 4 5
    9 1 2  3 4 5  6 7 8

    */
  generateTestBoard() {
    for (let y = 0; y < this.boardSize; y++) {
      let of = (y % 3) * 3 + Math.floor(y / 3);
      for (let x = 0; x < this.boardSize; x++) {
        this.board[y][x] = ((x + of) % 9) + 1;
      }
    }
    this.drawBoard();
  }

  /* Termina o jogo atual.
    Definindo a variavel de Fim de Jogo (gameFinished) como True, o que impede
    input no tabuleiro.
    Também checa o tabuleiro e conta quantos acertos e erros houve. */
  finishGame() {
    if (this.gameFinished) {
      return false;
    }
    this.checkBoard();

    this.selected = undefined;
    this.gameFinished = true;
    this.drawBoard();

    /* Conta os erros e acertos */
    let result = { erros: 0, acertos: 0 };
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (this.boardResult[y][x]) {
          result.acertos++;
        } else {
          result.erros++;
        }
      }
    }
    return result;
  }

  exportAsImage() {
    var image = canvas.toDataURL("image/png");
    image.replace("image/png", "image/octet-stream");
    return image;
  }

  resizeCanvas(new_size) {
    this.size = new_size;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.drawBoard();
  }
}

function unfocus(e) {
  this.sudoku.unselect();
}

/* Função para lidar com o Input do Mouse.
Se o jogo não estiver terminado, ele pega a posição do mouse dentro do objeto Canvas,
transforma essa posição para a posição de um quadrado no tabuleiro e seleciona 
o quadrado nessa posição. */
function handleMouse(e) {
  if (this.sudoku.gameFinished) {
    return;
  }

  let x = e.offsetX || e.layerX;
  let y = e.offsetY || e.layerY;
  
  let tamanho = this.clientWidth / this.sudoku.boardSize;
  x = Math.floor(x / tamanho);
  y = Math.floor(y / tamanho);

  this.sudoku.select(x, y);
  this.sudoku.lastSelection = { x, y };
}

/* Função para lidar com Input do Teclado.
Se o jogo não estiver terminado, ele pega a tecla apertada. */
function handleKeyboard(e) {
  if (this.sudoku.gameFinished) {
    return;
  }

  e.preventDefault();
  let key = e.key;

  if (key >= 1 && key <= 9) {
    let number = parseInt(key);
    this.sudoku.inputNumber(number);
  }

  if (key == "Backspace") {
    /* Define o valor do número como nulo, essencialmente apagando ele. */
    this.sudoku.inputNumber(null);
  }

  if (key == "ArrowRight") {
    this.sudoku.select(this.sudoku.selected.x + 1, this.sudoku.selected.y);
  }
  if (key == "ArrowLeft") {
    this.sudoku.select(this.sudoku.selected.x - 1, this.sudoku.selected.y);
  }
  if (key == "ArrowUp") {
    this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y - 1);
  }
  if (key == "ArrowDown") {
    this.sudoku.select(this.sudoku.selected.x, this.sudoku.selected.y + 1);
    return false;
  }
}

//PARTE DE INSTRUÇÕES E "SOBRE NÓS"
$(document).ready(function () {
  //ao clique mostra as informações (instruções e sobre nós respectivamente)
  $("#botao1").click(function () {
    $("#texto1").slideToggle("slow");
  });

  $("#botao2").click(function () {
    $("#texto2").slideToggle("slow");
  });

  $("#novo_jogo").on("click", function () {
    /* Adiciona um delay de 150ms para o botão poder completar a animação sem travar. */
    setTimeout(() => {
      if (
        confirm(
          "Deseja realmente começar um Novo jogo?\nIsso apagará todo seu progresso atual."
        )
      ) {
        sudoku.criarNovoJogo();
        $("#terminar_jogo")[0].disabled = false;
      }
    }, 150);
  });

  $("#terminar_jogo").on("click", () => {
    /* Adiciona um delay de 150ms para o botão poder completar a animação sem travar. */
    setTimeout(() => {
      if (confirm("Deseja realmente terminar o jogo?")) {
        r = sudoku.finishGame();
        resultado(r);
        $("#terminar_jogo")[0].disabled = true;
      }
    }, 150);
  });

  $("#exportar").click(function (ev) {
    let img = sudoku.exportAsImage();
    let download = document.createElement("a");
    download.href = img;
    download.download = "meu_sudoku.png";
    download.click();
  });

  let isMobile =
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) {
    let keydiv = $("#mobile_keyboard");
    /* Botoes de 1 a 9 */
    for (let i = 1; i <= 9; i++) {
      let btn = $(`<button>${i}</button>`);
      btn.on("click", () => {
        sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
        sudoku.inputNumber(i);
      });
      keydiv.append(btn);
    }
    /* Botao de apagar */
    let btn = $(`<button>&#x2421;</button>`);
    btn.on("click", () => {
      sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
      sudoku.inputNumber(null);
    });
    keydiv.append(btn);
  }
});

// Função que mostrar as imagens de "vencedor" ou "perdedor" com base no erro
function resultado(r) {
  if (r.erros == 0) {
    $("#wonGame").slideToggle("slow");
  } else if (r.erros > 0) {
    $("#loseGame").slideToggle("slow");
  }
}

//ao pressionar o botão "novo_jogo" as imagens irão desaparecer sem precisar de f5
function refresh() {
  $("#wonGame").slideUp("slow");
  $("#loseGame").slideUp("slow");
}
