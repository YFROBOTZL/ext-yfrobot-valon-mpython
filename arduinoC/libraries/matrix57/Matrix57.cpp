/*
   Matrix57.cpp
    - A library for the 5x7 Dot matrix display

   Author     : YFROBOT ZL
   Website    : www.yfrobot.com.cn
   Create Time: 2021-02-19
   Copyright (c) 2021 YFROBOT
   Change Log :

   The MIT License (MIT)

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/

#include "Matrix57.h"
#include <Arduino.h>

Matrix57::Matrix57(uint8_t Clk, uint8_t Data)
{
  Clkpin = Clk;
  Datapin = Data;
  pinMode(Clkpin, OUTPUT);
  pinMode(Datapin, OUTPUT);
}

void Matrix57::init(void)
{
  clearDisplay();
}

// write 8bit data to tm1637
int Matrix57::writeByte(int8_t wr_data)
{
  uint8_t i, count1;
  for (i = 0; i < 8; i++) //sent 8bit data
  {
    digitalWrite(Clkpin, LOW);
    if (wr_data & 0x01) digitalWrite(Datapin, HIGH); //LSB first
    else digitalWrite(Datapin, LOW);
    wr_data >>= 1;
    digitalWrite(Clkpin, HIGH);
  }
  digitalWrite(Clkpin, LOW);    //wait for the ACK
  digitalWrite(Datapin, HIGH);
  digitalWrite(Clkpin, HIGH);
  pinMode(Datapin, INPUT);

  bitDelay();
  uint8_t ack = digitalRead(Datapin);
  if (ack == 0)
  {
    pinMode(Datapin, OUTPUT);
    digitalWrite(Datapin, LOW);
  }
  bitDelay();
  pinMode(Datapin, OUTPUT);
  bitDelay();

  return ack;
}

//send start signal
void Matrix57::start(void)
{
  digitalWrite(Clkpin, HIGH); //send start signal to Matrix57
  digitalWrite(Datapin, HIGH);
  digitalWrite(Datapin, LOW);
  digitalWrite(Clkpin, LOW);
}

//End of transmission
void Matrix57::stop(void)
{
  digitalWrite(Clkpin, LOW);
  digitalWrite(Datapin, LOW);
  digitalWrite(Clkpin, HIGH);
  digitalWrite(Datapin, HIGH);
}

//display function, Write to full-screen.
void Matrix57::display(int8_t DispData[])
{
  int8_t SegData[5];
  uint8_t i;
  for (i = 0; i < 5; i ++)
    SegData[i] = DispData[i];
  start();                // start signal
  writeByte(ADDR_AUTO);   //
  stop();                 // end
  start();                // start signal
  writeByte(Cmd_SetAddr); //
  for (i = 0; i < 5; i ++)
    writeByte(SegData[i]);
  stop();                 // end
  start();                // start signal
  writeByte(Cmd_DispCtrl);//
  stop();                 // end
}

//display function, Write to Single line-screen.
void Matrix57::display(uint8_t BitAddr, int8_t DispData)
{
  int8_t SegData;
  SegData = DispData;
  start();                // start signal
  writeByte(ADDR_FIXED);  // 
  stop();                 // end
  start();                // start signal
  writeByte(BitAddr | 0xc0);  //
  writeByte(SegData);         //
  stop();                 // end
  start();                // start signal
  writeByte(Cmd_DispCtrl);//
  stop();                 // end
}

// Clear screen
void Matrix57::clearDisplay(void)
{
  display(0x00, 0x00);
  display(0x01, 0x00);
  display(0x02, 0x00);
  display(0x03, 0x00);
  display(0x04, 0x00);
}

// To take effect the next time it displays.
void Matrix57::set(uint8_t brightness, uint8_t SetData, uint8_t SetAddr)
{
  Cmd_SetData = SetData;
  Cmd_SetAddr = SetAddr;
  Cmd_DispCtrl = 0x88 + brightness;//Set the brightness and it takes effect the next time it displays.
}

void Matrix57::bitDelay(void)
{
  delayMicroseconds(50);
}
