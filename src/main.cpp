#include <Arduino.h>
#include <ArduinoJSON.h>

/*Board connections
  esp12e   Encoder
  3v3      Vcc
  Gnd      Gnd
  D2       CLK
  D3       DT
  Tested on D0,D1 and D6,D7 
  All GPIO can be used except D16  */

#define CLK D2
//volatile int intCount = MIN_COUNT;
volatile bool Triggered = false;
unsigned long TriggerTime = 0;
StaticJsonDocument <200> jsonWrite;

void ICACHE_RAM_ATTR myISR()
{
  cli(); //disable interupts
  if(!Triggered){
    Triggered = true;
    TriggerTime = millis();
  }

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
    Triggered = false;
    Serial.println("Finished");
  }  


}
