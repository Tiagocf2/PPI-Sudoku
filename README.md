<div align="center">
  <img src="logo.png" width="250px"/>
  <h1>PPI Sudoku</h1>


  <h6 color="#bbb"> 
    Projeto 1 <br> 
    Programação para Internet I <br>  
    TSIV4A - IFB 
  </h6>
  
  <br>
  <br>
  <br>
  
  [![Link](https://shields.io/static/v1?label=&message=Ir%20para%20o%20Site&color=eee&style=for-the-badge)](https://tiagocf2.github.io/PPI-Sudoku/)

</div>

<h1></h1>
<br>
<br>

> #### Integrantes  
> Tiago Civatti Frausino  
> Nikolle de Lacerda Nascimento  

<h1></h1>
<br>
<br>

> ### Como usar
> Primeiro importe o script para o seu projeto:  
> `<script type="text/javascript" src="https://tiagocf2.github.io/PPI-Sudoku/sudoku-canvas.js"></script>`  
> ou baixe o arquivo JavaScript pelo link: https://tiagocf2.github.io/PPI-Sudoku/sudoku-canvas.js  
> <br>
> Note que é preciso ter um elemento **Canvas** no HTML para executar o Sudoku.  
> Depois disso é só criar uma instância do objeto **Sudoku**.  
> `let su = new Sudoku(canvas, tamanho)`  
> `canvas` - é a referência ao elemento HTML canvas, onde o Sudoku será executado.  
> `tamanho` - é um atributo opcional que define o tamanho do canvas. Por padrão é **500**.  
> <br>
> Agora é possível selecionar um quadrado com o mouse.
> Com o quadrado selecionado é possível inserir números de 1 à 9 apertando as respectivas teclas.
> Para remover um número utilize a tecla **Backspace**.

<br>
<br>

Note que o código está incompleto, é só uma base para desenvolver o resto do sistema do Sudoku conforme a atividade pede.

<h1></h1>
<br>

 ### Outros Comandos
 |||
 |:-------------------------------|-----------------------------:|
 |`su.BACKGROUND_COLOR = 'verde'` | Muda a cor de plano de fundo.
 |`su.GRID_COLOR = 'verde'`       | Muda a cor da grade.
 |`su.SELECTED_COLOR = 'verde'`   | Muda a cor da célula selecionada.
 |`su.FONT_SIZE = '10px'`         | Muda o tamanho da fonte.
 |`su.FONT_FAMILY = 'arial'`      | Muda a fonte do texto.
 |||
 <br>
 <h1></h1>
 
