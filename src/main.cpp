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
*/  

const char* ssid = "SKYPEMHG";
const char* password = "8NHetSWQAJ75";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

#define CLK D2
#define DT D3
#define BUFFER_SIZE 100
volatile bool Triggered = false;
unsigned long TriggerTime = 0;

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
void notifyClients(String state) {
  ws.textAll(state);
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

StaticJsonDocument <1000> doc;
JsonArray Readings; 

void ICACHE_RAM_ATTR D2ISR()
{
  cli(); //disable interupts
  if(!Triggered){
    TriggerTime = millis();
    doc.clear();
    Readings = doc.createNestedArray("Reading");
    Triggered = true;
  }
  Readings.add(millis()-TriggerTime);
  Readings.add(digitalRead(CLK));
  Readings.add(digitalRead(DT));
  sei(); //enable interupts
}

void ICACHE_RAM_ATTR D3ISR()
{
  cli(); //disable interupts
  if(!Triggered){
    TriggerTime = millis();
    doc.clear();
    Readings = doc.createNestedArray("Reading");
    Triggered = true;
  }
  Readings.add(millis()-TriggerTime);
  Readings.add(digitalRead(CLK));
  Readings.add(digitalRead(DT));
  sei(); //enable interupts
}

void setup()
{
  Serial.begin(115200);
  Serial.println();
  pinMode(CLK, INPUT);

  LittleFS.begin();
  initWiFi();
  initWebSocket();
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/index.html", "text/html",false); });
  server.serveStatic("/", LittleFS, "/");
 // Start server
  server.begin();
  attachInterrupt(digitalPinToInterrupt(CLK), D2ISR, CHANGE);
  attachInterrupt(digitalPinToInterrupt(DT), D3ISR, CHANGE);
}

void loop()
{
  if(Triggered && TriggerTime+100 < millis()){
    String output;
    serializeJson(doc, output);
    notifyClients(output);
    Triggered = false;
    }  
}
