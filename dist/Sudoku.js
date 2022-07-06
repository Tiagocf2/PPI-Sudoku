"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var c = _interopRequireWildcard(require("./constants"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Sudoku = /*#__PURE__*/function () {
  function Sudoku(elemento_HTML) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

    _classCallCheck(this, Sudoku);

    /*CONSTANTES*/
    this.SELECTED_COLOR = c.DEFAULT_SELECTED_COLOR;
    this.BACKGROUND_COLOR = c.DEFAULT_BACKGROUND_COLOR;
    this.GRID_COLOR = c.DEFAULT_GRID_COLOR;
    this.FINISHED_FOREGROUND_COLOR = c.DEFAULT_FINISHED_FOREGROUND_COLOR;
    this.RIGHT_COLOR = c.DEFAULT_RIGHT_COLOR;
    this.WRONG_COLOR = c.DEFAULT_WRONG_COLOR;
    this.FONT_COLOR = c.DEFAULT_FONT_COLOR;
    this.FONT_SIZE = c.DEFAULT_FONT_SIZE;
    this.FONT_FAMILY = c.DEFAULT_FONT_FAMILY;
    this.FONT_FILL = true;
    /* Referencia o Elemento HTML Canvas com o Objeto Sudoku */

    this.canvas = elemento_HTML; //Referencia do elemento
    //this.canvas.sudoku = this; //Linkando objeto com a classe

    this.size = size;
    this.boardSize = c.DEFAULT_BOARD_SIZE;
    this.board = undefined;
    this.gameFinished = false;
    /* Adicionando Eventos do Objeto Canvas */

    this.canvas.tabIndex = 1; //Faz o elemento ser focável

    this.canvas.addEventListener("focusout", this.unselect.bind(this));
    this.canvas.addEventListener("mouseup", this.handlePointer.bind(this));
    this.canvas.addEventListener("keydown", this.handleKeyboard.bind(this));
    /* Determina as dimensões do Canvas 
       (Impossível determinar por CSS) */

    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.criarNovoJogo();
  }
  /*Cria diferentes tabuleiros padrões e escolhe um aleatório.
      Inicializa as matrizes do tabuleiro. */


  _createClass(Sudoku, [{
    key: "criarNovoJogo",
    value: function criarNovoJogo() {
      //tabuleiros
      var tabuleiro1 = [[5, 3, null, null, 7, null, null, null, null], [6, null, null, 1, 9, 5, null, null, null], [null, 9, 8, null, null, null, null, 6, null], [8, null, null, null, 6, null, null, null, 3], [4, null, null, 8, null, 3, null, null, 1], [7, null, null, null, 2, null, null, null, 6], [null, 6, null, null, null, null, 2, 8, null], [null, null, null, 4, 1, 9, null, null, 5], [null, null, null, null, 8, null, null, 7, 9]];
      var tabuleiro2 = [[8, null, null, 4, null, 6, null, null, 7], [null, null, null, null, null, null, 4, null, null], [null, 1, null, null, null, null, 6, 5, null], [5, null, 9, null, 3, null, 7, 8, null], [null, null, null, null, 7, null, null, null, null], [null, 4, 8, null, 2, null, 1, null, 3], [null, 5, 2, null, null, null, null, 9, null], [null, null, 1, null, null, null, null, null, null], [3, null, null, 9, null, 2, null, null, 5]];
      var tabuleiro3 = [[8, null, null, null, null, null, null, null, null], [null, null, 3, 6, null, null, null, null, null], [null, 7, null, null, 9, null, 2, null, null], [null, 5, null, null, null, 7, null, null, null], [null, null, null, null, 4, 5, 7, null, null], [null, null, null, 1, null, null, null, 3, null], [null, null, 1, null, null, null, null, 6, 8], [null, null, 8, 5, null, null, null, 1, null], [null, 9, null, null, null, null, 4, null, null]]; //cria o array tabuleiros e adiciona cada tabuleiro a ele

      var tabuleiros = [];
      tabuleiros.push(tabuleiro1);
      tabuleiros.push(tabuleiro2);
      tabuleiros.push(tabuleiro3); //cria a variavel de randomTabuleiro que é igual ao array tabuleiros que pega o tamanho de tabuleiros e traz números aleatórios
      //assim que randomiza os tabuleiros

      var randomTabuleiro = tabuleiros[Math.floor(Math.random() * tabuleiros.length)];
      this.boardInitial = []; //o grandão

      this.boardResult = []; //com resultados

      this.board = []; //numeros

      for (var i = 0; i < this.boardSize; i++) {
        //cria 1 linha pra cada vetor
        var initial_row = [];
        var result_row = [];
        var board_row = [];

        for (var j = 0; j < this.boardSize; j++) {
          //adiciona o valor da coluna para cada linha
          result_row.push(undefined);
          board_row.push(randomTabuleiro[i][j]);
          initial_row.push(randomTabuleiro[i][j]);
        } //bota a linha dentro do vetor


        this.boardResult.push(result_row);
        this.boardInitial.push(initial_row);
        this.board.push(board_row);
      } //volta as variáveis pro valor padrão


      this.selected = undefined;
      this.gameFinished = false; //escreve o board

      this.drawBoard();
    }
  }, {
    key: "drawBoard",
    value: function drawBoard() {
      //Tamanho do quadrado pequeno
      var step = this.size / this.boardSize;
      var ctx = this.canvas.getContext("2d");
      /* Clear Canvas 
            Pinta o quadro todo de branco*/

      ctx.beginPath();
      ctx.fillStyle = this.BACKGROUND_COLOR;
      ctx.fillRect(0, 0, this.size, this.size);
      /* Selected Square
            Pinta o quadrado selecionado */

      if (this.selected) {
        ctx.beginPath();
        var x = this.selected.x;
        var y = this.selected.y;
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
        for (var _y2 = 0; _y2 < this.boardSize; _y2++) {
          for (var _x2 = 0; _x2 < this.boardSize; _x2++) {
            /* Pula os quadrados do tabuleiro inicial */
            if (this.boardInitial[_y2][_x2]) {
              continue;
            }
            /* Pula os quadrados vazios */


            if (this.boardResult[_y2][_x2] == null) {
              continue;
            }

            ctx.beginPath();

            if (this.boardResult[_y2][_x2]) {
              ctx.fillStyle = this.RIGHT_COLOR;
            } else {
              ctx.fillStyle = this.WRONG_COLOR;
            }

            ctx.fillRect(_x2 * step, _y2 * step, step, step);
          }
        }
      }
      /* Sudoku Grid 
            Desenha as linhas verticais e horizontais da grade */


      for (var i = 0; i <= this.boardSize; i++) {
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


      var offset = step / 2;
      ctx.beginPath();
      /* Define o estilo do texto */

      ctx.font = "".concat(this.FONT_SIZE, " ").concat(this.FONT_FAMILY);
      ctx.textAlign = "center";
      ctx.strokeStyle = this.FONT_COLOR;
      ctx.fillStyle = this.FONT_FILL ? this.FONT_COLOR : "#000";
      ctx.lineWidth = 1;

      for (var _y3 = 0; _y3 < this.boardSize; _y3++) {
        for (var _x3 = 0; _x3 < this.boardSize; _x3++) {
          var text = this.board[_y3][_x3]; //Se o quadrado não estiver vazio

          if (text) {
            //Faz a medição do texto
            var metrics = ctx.measureText(text);
            /*Calcula a altura do texto, somando a distancia da baseline do texto até o topo com a distancia até em baixo. 
                        Depois divide por 2 para pegar o meio do texto.*/

            var textOffset = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2;
            /* Se o número estiver no tabuleiro inicial escreve ele com preenchimento
                        Senão escreve ele sem preenchimento. */

            if (this.boardInitial[_y3][_x3] != null) {
              ctx.fillText(this.board[_y3][_x3], _x3 * step + offset, _y3 * step + offset + textOffset);
            } else {
              ctx.strokeText(this.board[_y3][_x3], _x3 * step + offset, _y3 * step + offset + textOffset);
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

  }, {
    key: "select",
    value: function select(x, y) {
      x = (this.boardSize + x) * (x < 0) + x % this.boardSize * (x > 0);
      y = (this.boardSize + y) * (y < 0) + y % this.boardSize * (y > 0);
      this.selected = {
        x: x,
        y: y
      };
      this.drawBoard();
    }
    /* Tira a seleção atual e atualiza o quadro */

  }, {
    key: "unselect",
    value: function unselect() {
      this.selected = undefined;
      this.drawBoard();
    }
    /* Escreve o número dado na posição previamente selecionada,
        checa se o número está correto e atualiza o quadro */

  }, {
    key: "inputNumber",
    value: function inputNumber(n) {
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

  }, {
    key: "checkBoard",
    value: function checkBoard() {
      for (var y = 0; y < this.boardSize; y++) {
        for (var x = 0; x < this.boardSize; x++) {
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

  }, {
    key: "checkNumber",
    value: function checkNumber(x, y) {
      var ok = this.checkLine(x, y, true); //Linha vertical

      var ok2 = this.checkLine(x, y); //Linha horizontal

      var ok3 = this.checkSquare(x, y); //Quadrado grande

      if (ok == null) {
        this.boardResult[y][x] = ok;
      } else {
        this.boardResult[y][x] = ok && ok2 && ok3;
      }
    }
    /* Checa, para um número na posição dada, a validade dele na linha.
        O argumento 'vertical' define se a checagem será da linha horizontal ou vertical. */

  }, {
    key: "checkLine",
    value: function checkLine(x, y) {
      var vertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      /* Se o número for nulo retorna nulo */
      if (!this.board[y][x]) {
        return null;
      }
      /* Itera sobre cada elemento da linha */


      for (var i = 0; i < this.boardSize; i++) {
        /* Esta expressão lógica determina se a checagem da linha será vertical ou horizontal. 
                Para as linhas horizontais (vertical = false), o valor de Y é fixo (y * !vertical) e o de X é que muda (!vertical * i).
                Para as linhas verticais (vertical = true), o valor de Y é móvel (vertical * i) enquanto o de X é fixo (x * vertical).
                Note que o Javascript trata True como 1 e False como 0 no contexto de equações matemáticas. */
        var _y = y * !vertical + vertical * i;

        var _x = x * vertical + !vertical * i;
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

  }, {
    key: "checkSquare",
    value: function checkSquare(x, y) {
      if (!this.board[y][x]) {
        return null;
      }

      var sqrSize = this.boardSize / 3; //Tamanho do quadrado grande -> 3 x 3

      /* Determina a posição inicial do quadrado grande. */

      var sqrX = Math.floor(x / sqrSize);
      var sqrY = Math.floor(y / sqrSize);
      /* Determina a posição final do quadrado grande. */

      var sqrMaxX = sqrSize * (sqrX + 1);
      var sqrMaxY = sqrSize * (sqrY + 1);
      /* Itera sobre todas as posições do quadrado grande. */

      for (var sy = sqrY * sqrSize; sy < sqrMaxY; sy++) {
        for (var sx = sqrX * sqrSize; sx < sqrMaxX; sx++) {
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
    /** #### Gera um Tabuleiro válido para testes.
        | | | | | | | | | | | |
        |-|-|-|-|-|-|-|-|-|-|-|
        |1|2|3|  |4|5|6|  |7|8|9|  
        |4|5|6|  |7|8|9|  |1|2|3|  
        |7|8|9|  |1|2|3|  |4|5|6|  
        | | | |  | | | |  | | | |  
        |2|3|4|  |5|6|7|  |8|9|1|  
        |5|6|7|  |8|9|1|  |2|3|4|  
        |8|9|1|  |2|3|4|  |5|6|7|  
        | | | |  | | | |  | | | |  
        |3|4|5|  |6|7|8|  |9|1|2|  
        |6|7|8|  |9|1|2|  |3|4|5|  
        |9|1|2|  |3|4|5|  |6|7|8|  
        */

  }, {
    key: "generateTestBoard",
    value: function generateTestBoard() {
      for (var y = 0; y < this.boardSize; y++) {
        var of = y % 3 * 3 + Math.floor(y / 3);

        for (var x = 0; x < this.boardSize; x++) {
          this.board[y][x] = (x + of) % 9 + 1;
        }
      }

      this.drawBoard();
    }
    /** #### Termina o jogo atual.
     * Definindo a variavel de Fim de Jogo (gameFinished) como True, o que impede input no tabuleiro.
     * Também checa o tabuleiro e conta quantos acertos e erros houve. */

  }, {
    key: "finishGame",
    value: function finishGame() {
      if (this.gameFinished) {
        return false;
      }

      this.checkBoard();
      this.selected = undefined;
      this.gameFinished = true;
      this.drawBoard();
      /* Conta os erros e acertos */

      var result = {
        erros: 0,
        acertos: 0
      };

      for (var y = 0; y < this.boardSize; y++) {
        for (var x = 0; x < this.boardSize; x++) {
          if (this.boardResult[y][x]) {
            result.acertos++;
          } else {
            result.erros++;
          }
        }
      }

      return result;
    }
  }, {
    key: "exportAsImage",
    value: function exportAsImage() {
      var image = canvas.toDataURL("image/png");
      image.replace("image/png", "image/octet-stream");
      return image;
    }
  }, {
    key: "resizeCanvas",
    value: function resizeCanvas(new_size) {
      this.size = new_size;
      this.canvas.width = this.size;
      this.canvas.height = this.size;
      this.drawBoard();
    }
    /** #### Função para lidar com o evento do Pointer
     * Se o jogo não estiver terminado, ele pega a posição do mouse dentro do objeto Canvas,
     * transforma essa posição para a posição de um quadrado no tabuleiro e seleciona
     * o quadrado nessa posição. */

  }, {
    key: "handlePointer",
    value: function handlePointer(e) {
      if (this.gameFinished) {
        return;
      }

      var x = e.offsetX || e.layerX;
      var y = e.offsetY || e.layerY;
      var tamanho = this.canvas.clientWidth / this.boardSize;
      x = Math.floor(x / tamanho);
      y = Math.floor(y / tamanho);
      this.select(x, y);
      this.lastSelection = {
        x: x,
        y: y
      };
    }
    /** #### Função para lidar com evento do Teclado.
     * Processa a tecla apertada se o jogo não estiver terminado. */

  }, {
    key: "handleKeyboard",
    value: function handleKeyboard(e) {
      if (this.gameFinished) {
        return;
      }

      e.preventDefault();
      var key = e.key;

      if (key >= 1 && key <= 9) {
        var number = parseInt(key);
        this.inputNumber(number);
      }

      if (key == "Backspace") {
        /* Define o valor do número como nulo, essencialmente apagando ele. */
        this.inputNumber(null);
      }

      if (key == "ArrowRight") {
        this.select(this.selected.x + 1, this.selected.y);
      }

      if (key == "ArrowLeft") {
        this.select(this.selected.x - 1, this.selected.y);
      }

      if (key == "ArrowUp") {
        this.select(this.selected.x, this.selected.y - 1);
      }

      if (key == "ArrowDown") {
        this.select(this.selected.x, this.selected.y + 1);
        return false;
      }
    }
  }]);

  return Sudoku;
}();

var _default = Sudoku;
exports["default"] = _default;