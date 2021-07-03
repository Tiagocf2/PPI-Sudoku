window.onload=function(){
    montarFigura();
};

function montarFigura() {

    const width = 500;
    const step = width/5;

    canvas = document.getElementById("canvasQuadrado");
    canvas.style.width = width + "px";
    canvas.style.jeight = width + "px";

    console.log("Capturando canvasQuadrado em formato 2D");
    ctx = canvas.getContext('2d');

    for(let i = 0; i < step; i++){
        
    }     


}