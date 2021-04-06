#include <Arduino.h>
#include <ArduinoJSON.h>

/*Board connections
  esp12e   Encoder
  3v3      Vcc
  Gnd      Gnd
  D2       CLK
*/  

#define CLK D2
#define BUFFER_SIZE 100
volatile bool Triggered = false;
unsigned long TriggerTime = 0;

StaticJsonDocument <500> doc;
JsonArray Readings; 

void ICACHE_RAM_ATTR myISR()
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
  sei(); //enable interupts
}

void setup()
{
  Serial.begin(115200);
  Serial.println();
  pinMode(CLK, INPUT);
  attachInterrupt(digitalPinToInterrupt(CLK), myISR, CHANGE);
}

void loop()
{
  if(Triggered && TriggerTime+100 < millis()){
    String output;
    serializeJson(doc, output);
    Serial.print(output);
    //display last reading, because I can :)
    //Serial.println((unsigned) Readings[Readings.size()-1]);
    Triggered = false;
    }  
}
