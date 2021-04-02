const canvas = document.getElementById("Axis1Canvas");
const ctx = canvas.getContext("2d");
const gridborder = 25;
const gridspacing = 50;
const yaxisRef = 325;
const xaxisMultiplier = 50;
const yaxisMultiplier = 5;

var JSONReceived =
    
        {axis1 : [
            {"time": 0 ,"reading": 0} ,
            {"time": 8,"reading": 5} ,
            {"time": 20 ,"reading": 0} ,
            {"time": 35 ,"reading": 5} ,
            {"time": 52 ,"reading": 0} ,
            {"time": 62 ,"reading": 5} ,
            {"time": 78 ,"reading": 0} ,
            {"time": 85 ,"reading": 5} ,
            {"time": 110 ,"reading": 0 } ]
        };

window.addEventListener('load', onload);
function onload(event) {
    DrawLegend("10ms / Div","1.0v / Div");

    for(dbg=0 ;dbg<JSONReceived.axis1.length; dbg++)
    {
        console.log(JSONReceived.axis1[dbg].time);
        console.log(JSONReceived.axis1[dbg].reading);    
    }
    console.log(JSONReceived.length);
}
setInterval(draw,100); //100msec test

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
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";

    //startposition
    ctx.moveTo(JSONReceived.axis1[0].time * yaxisMultiplier + gridborder,
        yaxisRef - JSONReceived.axis1[0].reading * xaxisMultiplier);
    for(drw=1 ;drw<JSONReceived.axis1.length; drw++)
    {
        ctx.lineTo(JSONReceived.axis1[drw].time * yaxisMultiplier + gridborder,
            yaxisRef - JSONReceived.axis1[drw-1].reading * xaxisMultiplier);

        ctx.lineTo(JSONReceived.axis1[drw].time * yaxisMultiplier + gridborder, 
            yaxisRef - JSONReceived.axis1[drw].reading * xaxisMultiplier);   
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
    
