var gateway = `ws://${window.location.hostname}/ws`;
var websocket;

window.addEventListener('load', onload);
function onload(event) {
    initWebSocket();
    
    DrawLegend(scanLength/10 + "mSec / Div","Digital Signals");
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
    sendMessage();
}
function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}
function onMessage(event) {
    jsonReadings = JSON.parse(event.data);
    console.log(jsonReadings);
    DrawReadings();
}
// X -->     Y^
const canvas = document.getElementById("Axis1Canvas");
const ctx = canvas.getContext("2d");
const gridborder = 25;
const gridspacing = 50; 
Reading1YaxisBaseLine = 325;
Reading2YaxisBaseLine = 175;
xaxisMultiplier = 100;
scanLength = 1000;
yaxisMultiplier = 500 / scanLength;            //100mS 5, 200mS 2.5, 500ms 1
var jsonReadings;

//setInterval(DrawGraph,100); //100msec test
function DrawGridlines()
{
    ctx.clearRect(gridborder, gridborder, canvas.width - gridborder, canvas.height - gridborder*2);

    //draw graph lines
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "gray";
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
function DrawReadings()
{
    DrawGridlines();
    // draw reading1
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "cyan";
    
    //startposition
      ctx.moveTo(jsonReadings["Channel1"][0] * yaxisMultiplier + gridborder+1,
        Reading1YaxisBaseLine - jsonReadings["Channel1"][1] * xaxisMultiplier);
    
    for(drw=2 ;drw<jsonReadings["Channel1"].length; drw+=2)
    {
        ctx.lineTo(jsonReadings["Channel1"][drw] * yaxisMultiplier + gridborder+1,
            Reading1YaxisBaseLine - jsonReadings["Channel1"][drw-1] * xaxisMultiplier);

        ctx.lineTo(jsonReadings["Channel1"][drw] * yaxisMultiplier + gridborder+1, 
            Reading1YaxisBaseLine - jsonReadings["Channel1"][drw+1] * xaxisMultiplier);   
    }
    //run to end
    ctx.lineTo(canvas.width - gridborder, 
            Reading1YaxisBaseLine - jsonReadings["Channel1"][drw-1] * xaxisMultiplier);

    ctx.stroke(); // Draw it

    // draw reading2
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "yellow";

    //startposition
      ctx.moveTo(jsonReadings["Channel2"][0] * yaxisMultiplier + gridborder+1,
        Reading2YaxisBaseLine - jsonReadings["Channel2"][1] * xaxisMultiplier);
    
    for(drw=2 ;drw<jsonReadings["Channel2"].length; drw+=2)
    {
        ctx.lineTo(jsonReadings["Channel2"][drw] * yaxisMultiplier + gridborder+1,
            Reading2YaxisBaseLine - jsonReadings["Channel2"][drw-1] * xaxisMultiplier);

        ctx.lineTo(jsonReadings["Channel2"][drw] * yaxisMultiplier + gridborder+1, 
            Reading2YaxisBaseLine - jsonReadings["Channel2"][drw+1] * xaxisMultiplier);   
    }
    //run to end
    ctx.lineTo(canvas.width - gridborder, 
            Reading2YaxisBaseLine - jsonReadings["Channel2"][drw-1] * xaxisMultiplier);

    ctx.stroke(); // Draw it
}


function DrawLegend(hText,vText) //once only
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(hText, (canvas.width - ctx.measureText(hText).width) / 2, canvas.height -5);
    ctx.save();
    ctx.translate( canvas.width - 1, 0 );
    ctx.rotate( 3 * Math.PI / 2 );
    ctx.fillText(vText, (canvas.height + ctx.measureText(vText).width) / 2 * -1 , 15 - canvas.width );
    ctx.restore();
    DrawGridlines();
}
function sendMessage() {
    var jsonSend =  {"scanLength" : scanLength};
    websocket.send(JSON.stringify(jsonSend));
    console.log(JSON.stringify(jsonSend));
}

    
