var gateway = `ws://${window.location.hostname}/ws`;
var websocket;

window.addEventListener('load', onload);
function onload(event) {
    initWebSocket();
    DrawLegend("10ms / Div","1.0v / Div");
}
function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}
function onOpen(event) {
    console.log('Connection opened');
    websocket.send('hi');
}
function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}
function onMessage(event) {
    jsonReadings = JSON.parse(event.data);
    console.log(jsonReadings);
    DrawGraph();
}

const canvas = document.getElementById("Axis1Canvas");
const ctx = canvas.getContext("2d");
const gridborder = 25;
const gridspacing = 50;
const yaxisRef = 325;
const xaxisMultiplier = 250;
const yaxisMultiplier = 5;

var jsonReadings;

//setInterval(DrawGraph,100); //100msec test
function DrawGridlines()
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
}
function DrawGraph()
{
    DrawGridlines();

    // draw readings
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";

    //startposition

    
    ctx.moveTo(jsonReadings["Reading"][0] * yaxisMultiplier + gridborder+1,
        yaxisRef - jsonReadings["Reading"][1] * xaxisMultiplier);
    
    for(drw=2 ;drw<jsonReadings["Reading"].length; drw+=2)
    {
        ctx.lineTo(jsonReadings["Reading"][drw] * yaxisMultiplier + gridborder+1,
            yaxisRef - jsonReadings["Reading"][drw-1] * xaxisMultiplier);

        ctx.lineTo(jsonReadings["Reading"][drw] * yaxisMultiplier + gridborder+1, 
            yaxisRef - jsonReadings["Reading"][drw+1] * xaxisMultiplier);   
    }
    ctx.lineTo(canvas.width - gridborder, 
            yaxisRef - jsonReadings["Reading"][drw-1] * xaxisMultiplier);

    ctx.stroke(); // Draw it
}
function DrawLegend(hText,vText) //once only
{
    ctx.font = "16px Arial";
    ctx.fillText(hText, (canvas.width - ctx.measureText(hText).width) / 2, canvas.height -5);
    ctx.save();
    ctx.translate( canvas.width - 1, 0 );
    ctx.rotate( 3 * Math.PI / 2 );
    ctx.fillText(vText, (canvas.height + ctx.measureText(vText).width) / 2 * -1 , 15 - canvas.width );
    ctx.restore();
    DrawGridlines();
}
    
