const canvas = document.getElementById("Axis1Canvas");
const ctx = canvas.getContext("2d");
const gridborder = 25;
const gridspacing = 50;

window.addEventListener('load', onload);
function onload(event) {
    DrawLegend("10ms / Div","1.0v / Div");
}
setInterval(draw);

function draw(color)
{
    ctx.clearRect(gridborder, gridborder, canvas.width - 
        (gridborder * 2), canvas.height - (gridborder*2));

    //draw graph lines
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "lightgray";
    //horizontal
    for(gl = gridspacing + gridborder;gl<canvas.height - gridborder ;gl += gridspacing)
    {
        ctx.moveTo(gridborder,gl);
        ctx.lineTo(canvas.width -gridborder,gl);
    }
    //vertical
    for(gl = gridspacing + gridborder;gl<canvas.width - gridborder;gl += gridspacing)
    {
        ctx.moveTo(gl,gridborder);
        ctx.lineTo(gl,canvas.height - gridborder);
    }
    ctx.stroke();

    // draw readings
    var myrnd = + Math.random() * 2
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";

    ctx.moveTo(gridborder + myrnd + 2, 300 + myrnd);
    for(loop = 1;loop < 11;loop++) {
        ctx.lineTo(loop * 55 + myrnd, 300 + (loop % 2 * -200) + myrnd);
    }     
    ctx.stroke(); // Draw it
}
function DrawLegend(hText,vText)
{
    ctx.font = "16px Arial";
    ctx.fillText(hText, (canvas.width - ctx.measureText(hText).width) / 2, canvas.height -5);
    ctx.save();
    ctx.translate( canvas.width - 1, 0 );
    ctx.rotate( 3 * Math.PI / 2 );
    ctx.fillText(vText, (canvas.height + ctx.measureText(vText).width) / 2 * -1 , 15 - canvas.width );
    ctx.restore();
}
    
