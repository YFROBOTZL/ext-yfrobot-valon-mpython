/*
   Matrix57.h
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

#ifndef Matrix57_h
#define Matrix57_h
#include <inttypes.h>
#include <Arduino.h>

/************definitions for Matrix57***************/
#define ADDR_AUTO  0x40 // automatically address increases 1 mode
#define ADDR_FIXED 0x44 // Fixed address mode
#define STARTADDR  0xc0 // starting address

/***********definitions for brightness(0-7)***********/
#define  BRIGHT_DARKEST 0 // Darkest
#define  BRIGHT_TYPICAL 2 // Typical
#define  BRIGHTEST      7 // Brightest

class Matrix57
{
  public:
    uint8_t Cmd_SetData;
    uint8_t Cmd_SetAddr;
    uint8_t Cmd_DispCtrl;
    Matrix57(uint8_t, uint8_t);
    void init(void);                  // initialization, clear the display
    int  writeByte(int8_t wr_data);   // write 8bit data to tm1637
    void start(void);                 // send start bits
    void stop(void);                  // send stop bits
    void display(int8_t DispData[]);
    void display(uint8_t BitAddr, int8_t DispData);
    void clearDisplay(void);          // To clear the display
    void set(uint8_t = BRIGHT_TYPICAL, uint8_t = 0x40, uint8_t = 0xc0); //To take effect the next time it displays.
  private:
    uint8_t Clkpin;
    uint8_t Datapin;
    void bitDelay(void);
};
#endif
