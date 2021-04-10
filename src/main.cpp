#include <Arduino.h>
#include <ArduinoJSON.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>

/*Board connections
  esp12e   Encoder
  3v3      Vcc
  Gnd      Gnd
  D2       CLK
  D3       DT
*/  

#define CLK D2
#define DT D3
const char* ssid = "SKYPEMHG";
const char* password = "8NHetSWQAJ75";
volatile bool Triggered = false;
volatile unsigned long TriggerTime = 0;
volatile bool lastTriggerPulse = true;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
StaticJsonDocument <2000> jsonDoc;
JsonArray Channel1;
JsonArray Channel2; 

// Initialize WiFi
void initWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi ..");
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print('.');
      delay(1000);  }
    Serial.println(WiFi.localIP());
}
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) { 
    data[len] = 0;
    //myJSONReceived = JSON.parse((char*)data);
    //setup IO from message received
    }
}
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
 void *arg, uint8_t *data, size_t len) {
 switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
    break;
  }
}
void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

void ICACHE_RAM_ATTR channel1ISR()
{
  cli(); //disable interupts
  bool tCLK = digitalRead(CLK);
  bool tDT = digitalRead(DT);
  unsigned long tMillis = millis();

  if(!Triggered && lastTriggerPulse && !tCLK){  //wait for falling edge on CLK pulse 
    TriggerTime = tMillis;
    jsonDoc.clear();
    Channel1 = jsonDoc.createNestedArray("Channel1");
    Channel2 = jsonDoc.createNestedArray("Channel2");
    Channel2.add(tMillis-TriggerTime);  //start channel2 at the same time
    Channel2.add(tDT);
    Triggered = true;
  }
  Channel1.add(tMillis-TriggerTime);
  Channel1.add(tCLK);
  lastTriggerPulse = tCLK;
  sei(); //enable interupts
}

void ICACHE_RAM_ATTR channel2ISR()
{
  cli(); //disable interupts
  if(Triggered) {
    Channel2.add(millis() - TriggerTime);
    Channel2.add(digitalRead(DT));}
  sei(); //enable interupts
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting...");
  pinMode(CLK, INPUT);
  pinMode(DT,INPUT);
  LittleFS.begin();
  initWiFi();
  initWebSocket();
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/index.html", "text/html",false); });
  server.serveStatic("/", LittleFS, "/");
  server.begin();
  
  attachInterrupt(digitalPinToInterrupt(CLK), channel1ISR, CHANGE);
  attachInterrupt(digitalPinToInterrupt(DT), channel2ISR, CHANGE);
}

void loop()
{
  String strjsonDoc;  
  if(Triggered && TriggerTime+100 < millis()){
    serializeJson(jsonDoc, strjsonDoc);
    if(ws.availableForWriteAll()) 
    {
        ws.textAll(strjsonDoc); 
    }
    Triggered = false;
    }  
}
