const canvas = document.getElementById("Axis1Canvas");

const border = 25;

function draw(color){
   // var c = document.getElementById("Axis1Canvas");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(border, border, canvas.width - (border * 2), canvas.height - (border*2));

    //draw graph lines
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "lightgray";

    for(gl = 50 + border;gl<400 - border ;gl += 50)
    {
        ctx.moveTo(border,gl);
        ctx.lineTo(600-border,gl);
    }
    for(gl = 50 + border;gl<600 - border;gl += 50)
    {
        ctx.moveTo(gl,border);
        ctx.lineTo(gl,400 - border);
    }


    ctx.stroke();

    // draw readings
    var myrnd = + Math.random() * 2
    
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";

    ctx.moveTo(border + myrnd + 2, 300 + myrnd);
    for(loop = 1;loop < 11;loop++) {

        ctx.lineTo(loop * 55 + myrnd, 300 + (loop % 2 * -200) + myrnd);

    }
     
    ctx.stroke(); // Draw it
    
}
function DrawLegend()
{
    var ctx = canvas.getContext("2d");
    ctx.font = "14px Arial";

    ctx.fillText("5.0", 5, 75);
    ctx.fillText("4.0", 5, 125);
    ctx.fillText("3.0", 5, 175);
    ctx.fillText("2.0", 5, 225);
    ctx.fillText("1.0", 5, 275);
    ctx.fillText("0.0", 5, 325);

    ctx.fillText("10mS / div", 280, 395);
    

}
    
window.addEventListener('load', onload);
function onload(event) {
    DrawLegend();
}

setInterval(draw);
