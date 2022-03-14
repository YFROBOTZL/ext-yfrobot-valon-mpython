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

}
