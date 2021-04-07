# Browser-oscilloscope
The idea is to use the ESP8266 as the oscilloscope source and transfer data via web sockets over WiFi. This will isolate 
the laptop from any possible damage!

The main questions are:
1) Is web socket protocol fast and rebust enough?
2) Are the browser drawing tools (Canvas) fast enough?
3) Could it display ESP8266 variables too for debuging?
3) Could be a useful traning tool?

At this stage I think yes for all questions and no real problems. 100ms between websockets messages and screen updates looks good. 

Plenty of testing still to do.
