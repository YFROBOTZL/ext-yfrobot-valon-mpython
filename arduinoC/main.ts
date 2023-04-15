/** 
 * @file yfrobot
 * @brief YFROBOT's sensors Mind+ library.
 * @n This is a MindPlus graphics programming extension for YFROBOT's module.
 * 
 * @copyright    YFROBOT,2022
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2022-03-05
*/

enum LEDONOFF {
    //% block="OFF"
    LOW,
    //% block="ON"
    HIGH
}

enum LEDN {
    //% block="D1"
    P5,
    //% block="D2"
    P11
}

enum CARDIR {
    //% block="ADVANCE"
    0,
    //% block="BACKWARD"
    1,
    //% block="TURNRIGHT"
    2,
    //% block="TURNLEFT"
    3
}

enum MOTORN {
    //% block="RIGHT"
    0,
    //% block="LEFT"
    1
}

enum MOTORDIR {
    //% block="FORWARD"
    0,
    //% block="REVERSE"
    1
}

enum ENDIS {
    //% block="ENABLE"
    HIGH,
    //% block="DISABLE"
    LOW
}

enum PINP {
    //% block="left"
    P0,
    //% block="middle"
    P2,
    //% block="right"
    P3
}

enum PSSTATE {
    //% block="○●○"
    S0,
    //% block="●○○"
    S1,
    //% block="○○●"
    S2,
    //% block="●●●"
    S3,
    //% block="○○○"
    S4,
    //% block="●●○"
    S5,
    //% block="○●●"
    S6,
}

//% color="#0eb83a" iconWidth=50 iconHeight=40
namespace valon {

    //% block="set [LED] output [LEDSTATE]" blockType="command"
    //% LED.shadow="dropdown" LED.options="LEDN" LED.defl="LEDN.P5"
    //% LEDSTATE.shadow="dropdown" LEDSTATE.options="LEDONOFF" LEDSTATE.defl="LEDONOFF.HIGH"
    export function LED(parameter: any, block: any) {
        let led = parameter.LED.code;
        let ledState = parameter.LEDSTATE.code;
        Generator.addCode(`digitalWrite(${led},${ledState});`);
    }

    // // block="set [OUTPUTMODULEANALOG] on [OAMPIN] output [OAMSTATE]" blockType="command"
    // // OUTPUTMODULEANALOG.shadow="dropdown" OUTPUTMODULEANALOG.options="OMAANALOG" OUTPUTMODULEANALOG.defl="OMAANALOG.LED"
    // // OAMPIN.shadow="dropdown" OAMPIN.options="PIN_AnalogWrite"
    // // OAMSTATE.shadow="range"   OAMSTATE.params.min=0    OAMSTATE.params.max=255    OAMSTATE.defl=200
    // export function outputAnalogModule(parameter: any, block: any) {
    //     let outputModule = parameter.OUTPUTMODULEANALOG.code;
    //     let outputModulePin = parameter.OAMPIN.code;
    //     let outputModuleState = parameter.OAMSTATE.code;
    //     if(Generator.board === 'esp32'){//如果是掌控板，生成如下代码
    //         Generator.addCode(`pwmv = map(${outputModuleState}, 0, 255, 0, 1023);`);
    //         Generator.addCode(`analogWrite(${outputModulePin},pwmv);`);
    //     }else{
    //         Generator.addCode(`analogWrite(${outputModulePin},${outputModuleState});`);
    //     }
    // }

    //% block="Valon robot at [SPEED] speed [DIR]" blockType="command"
    //% SPEED.shadow="range"   SPEED.params.min=0    SPEED.params.max=255    SPEED.defl=200
    //% DIR.shadow="dropdown" DIR.options="CARDIR" DIR.defl="CARDIR.0"
    export function carDrive(parameter: any, block: any) {
        let speed = parameter.SPEED.code;
        let dir = parameter.DIR.code;
        Generator.addInclude(`definevaloncar`, `PROGMEM void carDrive(int dir, int speed); // valon car 控制函数`)
        Generator.addInclude(`definevaloncarFun`, `// valon car 控制函数\n`+
            `void carDrive(int dir, int speed) {\n`+
            `  if (dir == 0) {          // 前进\n`+
            `    motorDrive(0, speed, 0);\n`+
            `    motorDrive(1, speed, 0);\n`+
            `  } else if (dir == 1) {   // 后退\n`+
            `    motorDrive(0, speed, 1);\n`+
            `    motorDrive(1, speed, 1);\n`+
            `  } else if (dir == 2) {   // 右转\n`+
            `    motorDrive(0, speed/2, 0);\n`+
            `    motorDrive(1, speed, 0);\n`+
            `  } else if (dir == 3) {   // 左转\n`+
            `    motorDrive(0, speed, 0);\n`+
            `    motorDrive(1, speed/2, 0);\n`+
            `  }\n`+
            `}`
        );

        Generator.addInclude(`definevalonmotor`, `PROGMEM void motorDrive(int mot, int speed, int dir); // valon motor 控制函数`)
        Generator.addInclude(`definevalonmotorFun`, `// valon motor 控制函数\n`+
            `void motorDrive(int mot, int speed, int dir) {\n`+
            `  int sp = map(speed, 0, 255, 0, 1023);\n`+
            `  if (mot == 0) {    // 右电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P16, LOW);\n`+
            `      analogWrite(P15, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P16, HIGH);\n`+
            `      analogWrite(P15, sp);\n`+
            `    }\n`+
            `  } else {           // 左电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P13, LOW);\n`+
            `      analogWrite(P14, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P13, HIGH);\n`+
            `      analogWrite(P14, sp);\n`+
            `    }\n`+
            `  }\n`+
            `}`
        );

        Generator.addCode(`carDrive(${dir},${speed});`);
    }
    
    //% block="Valon robot STOP" blockType="command"
    export function carStop(parameter: any, block: any) {
        Generator.addInclude(`definevaloncar`, `PROGMEM void carDrive(int dir, int speed); // valon car 控制函数`)
        Generator.addInclude(`definevaloncarFun`, `// valon car 控制函数\n`+
            `void carDrive(int dir, int speed) {\n`+
            `  if (dir == 0) {          // 前进\n`+
            `    motorDrive(0, speed, 0);\n`+
            `    motorDrive(1, speed, 0);\n`+
            `  } else if (dir == 1) {   // 后退\n`+
            `    motorDrive(0, speed, 1);\n`+
            `    motorDrive(1, speed, 1);\n`+
            `  } else if (dir == 2) {   // 右转\n`+
            `    motorDrive(0, speed/2, 0);\n`+
            `    motorDrive(1, speed, 0);\n`+
            `  } else if (dir == 3) {   // 左转\n`+
            `    motorDrive(0, speed, 0);\n`+
            `    motorDrive(1, speed/2, 0);\n`+
            `  }\n`+
            `}`
        );

        Generator.addInclude(`definevalonmotor`, `PROGMEM void motorDrive(int mot, int speed, int dir); // valon motor 控制函数`)
        Generator.addInclude(`definevalonmotorFun`, `// valon motor 控制函数\n`+
            `void motorDrive(int mot, int speed, int dir) {\n`+
            `  int sp = map(speed, 0, 255, 0, 1023);\n`+
            `  if (mot == 0) {    // 右电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P16, LOW);\n`+
            `      analogWrite(P15, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P16, HIGH);\n`+
            `      analogWrite(P15, sp);\n`+
            `    }\n`+
            `  } else {           // 左电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P13, LOW);\n`+
            `      analogWrite(P14, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P13, HIGH);\n`+
            `      analogWrite(P14, sp);\n`+
            `    }\n`+
            `  }\n`+
            `}`
        );

        Generator.addCode(`carDrive(0,0);`);
    }

    //% block="Valon robot [MOT] Motor at [SPEED] speed [DIR]" blockType="command"
    //% MOT.shadow="dropdown" MOT.options="MOTORN" MOT.defl="MOTORN.0"
    //% SPEED.shadow="range"   SPEED.params.min=0    SPEED.params.max=255    SPEED.defl=200
    //% DIR.shadow="dropdown" DIR.options="MOTORDIR" DIR.defl="MOTORDIR.0"
    export function motorDrive(parameter: any, block: any) {
        let mot = parameter.MOT.code;
        let speed = parameter.SPEED.code;
        let dir = parameter.DIR.code;

        Generator.addInclude(`definevalonmotor`, `PROGMEM void motorDrive(int mot, int speed, int dir); // valon motor 控制函数`)
        Generator.addInclude(`definevalonmotorFun`, `// valon motor 控制函数\n`+
            `void motorDrive(int mot, int speed, int dir) {\n`+
            `  int sp = map(speed, 0, 255, 0, 1023);\n`+
            `  if (mot == 0) {    // 右电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P16, LOW);\n`+
            `      analogWrite(P15, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P16, HIGH);\n`+
            `      analogWrite(P15, sp);\n`+
            `    }\n`+
            `  } else {           // 左电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P13, LOW);\n`+
            `      analogWrite(P14, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P13, HIGH);\n`+
            `      analogWrite(P14, sp);\n`+
            `    }\n`+
            `  }\n`+
            `}`
        );

        Generator.addCode(`motorDrive(${mot},${speed},${dir});`);
    }
    
    //% block="Valon robot [MOT] Motor Stop" blockType="command"
    //% MOT.shadow="dropdown" MOT.options="MOTORN" MOT.defl="MOTORN.0"
    export function motorStop(parameter: any, block: any) {
        let mot = parameter.MOT.code;
        Generator.addInclude(`definevalonmotor`, `PROGMEM void motorDrive(int mot, int speed, int dir); // valon motor 控制函数`)
        Generator.addInclude(`definevalonmotorFun`, `// valon motor 控制函数\n`+
            `void motorDrive(int mot, int speed, int dir) {\n`+
            `  int sp = map(speed, 0, 255, 0, 1023);\n`+
            `  if (mot == 0) {    // 右电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P16, LOW);\n`+
            `      analogWrite(P15, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P16, HIGH);\n`+
            `      analogWrite(P15, sp);\n`+
            `    }\n`+
            `  } else {           // 左电机\n`+
            `    if (dir == 0) {  // 正转\n`+
            `      digitalWrite(P13, LOW);\n`+
            `      analogWrite(P14, sp);\n`+
            `    } else {         // 反转\n`+
            `      digitalWrite(P13, HIGH);\n`+
            `      analogWrite(P14, sp);\n`+
            `    }\n`+
            `  }\n`+
            `}`
        );

        Generator.addCode(`motorDrive(${mot},0,0);`);
    }

    //% block="Valon robot Patrol sensor [ENABLE]" blockType="command"
    //% ENABLE.shadow="dropdown" ENABLE.options="ENDIS" ENABLE.defl="ENDIS.HIGH"
    export function patrolSensorEnable(parameter: any, block: any) {
        let en = parameter.ENABLE.code;
        Generator.addCode(`digitalWrite(P1, ${en});`);
    }

    //% block="[PSN] patrol sensor on black line" blockType="boolean"
    //% PSN.shadow="dropdown" PSN.options="PINP"" PSN.defl="PINP.P0"
    export function readPatrolSensor(parameter: any, block: any) {
        let psn = parameter.PSN.code;
        if(psn === `P3`){
            Generator.addCode(`(analogRead(${psn}) == 0)`);
        } else {
            Generator.addCode(`(digitalRead(${psn}) == 0)`);
        }
    }

    //% block="patrol sensors state [PSNS]" blockType="boolean"
    //% PSNS.shadow="dropdown" PSNS.options="PSSTATE"" PSNS.defl="PSSTATE.S0"
    export function readPatrolSensors(parameter: any, block: any) {
        let psns = parameter.PSNS.code;
        if(psns === `S0`) {
            Generator.addCode(`(digitalRead(P0) != 0)&&(digitalRead(P2) == 0)&&(analogRead(P3) != 0)`);
        } else if(psns === `S1`) {
            Generator.addCode(`(digitalRead(P0) == 0)&&(digitalRead(P2) != 0)&&(analogRead(P3) != 0)`);
        } else if(psns === `S2`) {
            Generator.addCode(`(digitalRead(P0) != 0)&&(digitalRead(P2) != 0)&&(analogRead(P3) == 0)`);
        } else if(psns === `S3`) {
            Generator.addCode(`(digitalRead(P0) == 0)&&(digitalRead(P2) == 0)&&(analogRead(P3) == 0)`);
        } else if(psns === `S4`) {
            Generator.addCode(`(digitalRead(P0) != 0)&&(digitalRead(P2) != 0)&&(analogRead(P3) != 0)`);
        } else if(psns === `S5`) {
            Generator.addCode(`(digitalRead(P0) == 0)&&(digitalRead(P2) == 0)&&(analogRead(P3) != 0)`);
        } else if(psns === `S6`) {
            Generator.addCode(`(digitalRead(P0) != 0)&&(digitalRead(P2) == 0)&&(analogRead(P3) == 0)`);
        }
    }

    
    //% block="read ulrasonic sensor Unit cm" blockType="reporter"
    export function readUlrasonicSensor(parameter: any, block: any) {
        Generator.addInclude("include_DFRobot_URM10", `#include <DFRobot_URM10.h>`);
        Generator.addObject("object_DFRobot_URM10_valon", `DFRobot_URM10`, `valon_sr04;`);
        Generator.addCode(`valon_sr04.getDistanceCM(P8,P9)`);
    }

    /*
    //% block="MpythonBT init name [NAME]" blockType="command"
    //% NAME.shadow="string"  NAME.defl="Valon-BT"
    export function MpythonBTInit(parameter: any, block: any) {
        let name=parameter.NAME.code;
        console.log(name);
        Generator.addInclude('MpythonBTInitinclude', '#include "BluetoothSerial.h"');
        Generator.addObject("MpythonBTInitobject", "BluetoothSerial", "SerialBT");
        Generator.addSetup("MpythonBTInitsetup", `SerialBT.begin(${name});`);
        
        Generator.addInclude('MpythonBT_Inbuf', 'static uint8_t inBuf[5]; // 数据接收数组变量');
        

    }

    //% block="MpythonBT available" blockType="boolean"
    export function MpythonBTAvailable(parameter: any, block: any) {
        Generator.addCode(["SerialBT.available()",Generator.ORDER_UNARY_POSTFIX]);
    }

    //% block="MpythonBT read " blockType="reporter"
    export function MpythonBTRead(parameter: any, block: any) {
        Generator.addCode(["SerialBT.read()",Generator.ORDER_UNARY_POSTFIX]);
    }

     //% block="MpythonBT write [STR]" blockType="command"
     //% STR.shadow="number" STR.defl="1"
    export function MpythonBTWrite(parameter: any, block: any) {
        let str = parameter.STR.code;
        Generator.addCode(`SerialBT.write(${str});`);
    }
    */
    
    //% block="MpythonBT [NAME] receive data is valid?" blockType="boolean"
    //% NAME.shadow="string"  NAME.defl="Valon-BT"
    export function MpythonBTReceiveDataValid(parameter: any, block: any) {  
        
        let name=parameter.NAME.code;
        console.log(name);
        Generator.addInclude('MpythonBTInitinclude_object', `#include "BluetoothSerial.h" \n`+
        `BluetoothSerial SerialBT;\n`+
        `static uint8_t inBuf[5]; // 数据接收数组变量\n`+
        `uint8_t SerialBTReceiveData();\n`);
        
        Generator.addSetup("MpythonBTInitsetup", `SerialBT.begin(${name});`);

        Generator.addInclude(`defineSerialBTReceiveDataFun`, ``+
            `uint8_t SerialBTReceiveData() {\n`+
            `  uint8_t c;\n`+
            `  static uint8_t offset, dataSize;\n`+
            `  static uint32_t checksum;\n`+
            `  static enum _serial_state {IDLE, HEADER_START, HEADER_M, HEADER_ARROW, HEADER_SIZE, HEADER_CMD, }  c_state = IDLE;\n`+
            `  while (SerialBT.available()) {\n`+
            `    c = SerialBT.read();                             // 读串口缓冲区\n`+
            `    if (c_state == IDLE) {                           // 串口状态空闲,等待 HEADER_START 状态的到来\n`+
            `      c_state = (c == '$') ? HEADER_START : IDLE;    // 判定是$字符吗？是则进入 HEADER_START 状态 \n`+
            `      if (c_state == IDLE) {}                        // evaluate all other incoming serial data\n`+
            `    } else if (c_state == HEADER_START) {\n`+
            `      c_state = (c == 'M') ? HEADER_M : IDLE;        // 判定是M字符吗？是则进入HEADER_M状态\n`+
            `    } else if (c_state == HEADER_M) {\n`+
            `      c_state = (c == '>') ? HEADER_ARROW : IDLE;    // 判定是>字符吗？是则进入HEADER_ARROW状态\n`+
            `    } else if (c_state == HEADER_ARROW) {            // 是ARROW字符，进入HEADER_ARROW状态，判定缓冲区的大小\n`+
            `      if (c > 10) {                                  // now we are expecting the payload size 我们期望足够的数据占用缓冲区\n`+
            `        c_state = IDLE;                              // 数据位置不够 退出循环\n`+
            `        continue;                                    // 不执行该while循环包含的后面的语句，跳出开始下一轮循环 \n`+
            `      }\n`+
            `      dataSize = c;\n`+
            `      offset = 0;\n`+
            `      checksum = 0;\n`+
            `      checksum ^= c;                                 // 校验和 1  -  dataSize\n`+
            `      c_state = HEADER_SIZE;                         // the command is to follow 接收到数据长度，进入HEADER_SIZE状态\n`+
            `    } else if (c_state == HEADER_SIZE) {\n`+
            `      inBuf[offset] = c;                             // 接收 指令(code)\n`+
            `      offset = 1;                                    // offset 标记加一\n`+
            `      checksum ^= c;                                 // 校验和 2  -  code\n`+
            `      c_state = HEADER_CMD;                          // 接收到指令，进入HEADER_CMD状态\n`+
            `    } else if (c_state == HEADER_CMD && offset < dataSize) {\n`+
            `      checksum ^= c;                                 // 校验和 2  -  data\n`+
            `      inBuf[offset] = c;\n`+
            `      offset++;\n`+
            `    } else if (c_state == HEADER_CMD && offset >= dataSize) {\n`+
            `      if ((checksum & 0xFF) == c) {\n`+
            `        return 0x01;              // 数据有效\n`+
            `      }\n`+
            `      c_state = IDLE;             // 返回IDLE状态\n`+
            `    }\n`+
            `  }\n`+
            `  return 0x00;                    // 数据无效，返回0x00\n`+
            `}`
        );

        Generator.addCode('SerialBTReceiveData()');
    }

    //% block="MpythonBT receive data" blockType="reporter"
    export function MpythonBTReceiveData(parameter: any, block: any) {
        Generator.addCode(`inBuf[0]`);
    }

}
