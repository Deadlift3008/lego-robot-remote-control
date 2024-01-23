const ANGLE_TO_DEGREES_CONST = 8.43;
const ANGLE_TO_DEGREES_ON_PLACE_CONST = 4.36;
const ANGLE_TO_DEGREES_ON_MOVE_CONST = ANGLE_TO_DEGREES_ON_PLACE_CONST * 3;

const MOVE_TYPES = {
    simpleRotate: 'simpleRotate',
    rotateOnPlace: 'rotateOnPlace',
    rotateOnMove: 'rotateOnMove'
};

class Actions {
    constructor(motorA, motorB, hub) {
        this.motorA = motorA;
        this.motorB = motorB;
        this.hub = hub;
    }

    setHoldBrakingStyle() {
        this.motorA.setBrakingStyle('HOLD');
        this.motorB.setBrakingStyle('HOLD');
    }

    async goForward(ms = 500, speed = 50, options = {}) {
        this.motorA.setPower(speed * -1);
        this.motorB.setPower(speed);
        await this.hub.sleep(ms);

        if (options.stopAfter) {
            await this.fullStop();
        }
    }

    async goBackward(ms = 500, speed = 50, options = {}) {
        this.motorA.setPower(speed);
        this.motorB.setPower(speed * -1);
        await this.hub.sleep(ms);

        if (options.stopAfter) {
            await this.fullStop();
        }
    }

    async turnAround(direction = 'right', speed = 40) {
        switch(direction) {
            case 'right':
                await this.rotateRight(180, 40);
                return;
            case 'left':
                await this.rotateLeft(180, 40);
                return;
            case 'rightBack':
                throw new Error('Not implemented');
            case 'leftBack': 
                throw new Error('Not implemented');   
            default:
                console.log(`>>>>No direction got for turn around, applying 'right'`);
                await this.rotateRight(180, 40);
                break;            
        }
    }

    async rotateRight(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_CONST;
        this.motorB.rotateByDegrees(degrees, speed);
        await this.waitForEnd(MOVE_TYPES.simpleRotate, degrees, speed);
    }

    async rotateLeft(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_CONST;
        this.motorA.rotateByDegrees(degrees, speed * -1);
        await this.waitForEnd(MOVE_TYPES.simpleRotate, degrees, speed);
    }

    async rotateRightOnPlace(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_ON_PLACE_CONST;
        this.motorB.rotateByDegrees(degrees, speed);
        this.motorA.rotateByDegrees(degrees, speed);
        await this.waitForEnd(MOVE_TYPES.rotateOnPlace, degrees, speed);
    }

    async rotateLeftOnPlace(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_ON_PLACE_CONST;
        this.motorA.rotateByDegrees(degrees, speed * -1);
        this.motorB.rotateByDegrees(degrees, speed * -1);
        await this.waitForEnd(MOVE_TYPES.rotateOnPlace, degrees, speed);
    }

    // TODO: Пересмотреть все параметры
    async rotateRightOnMove(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_ON_MOVE_CONST;
        this.motorB.rotateByDegrees(degrees, speed);
        this.motorA.rotateByDegrees(degrees/2, (speed/2) * -1);
        await this.waitForEnd(MOVE_TYPES.rotateOnMove, degrees, speed);
    }

    async rotateLeftOnMove(angle = 90, speed = 40) {
        const degrees = angle * ANGLE_TO_DEGREES_ON_MOVE_CONST;
        this.motorA.rotateByDegrees(degrees, speed * -1);
        this.motorB.rotateByDegrees(degrees/2, speed/2);
        await this.waitForEnd(MOVE_TYPES.rotateOnMove, degrees, speed);
    }

    async waitForEnd(typeOfMove, degrees, speed) {
        switch(typeOfMove) {
            case MOVE_TYPES.simpleRotate:
                await this.hub.sleep(degrees * (speed/15));
                return;
            case MOVE_TYPES.rotateOnPlace:
                await this.hub.sleep(degrees * (speed/15));
                return;
            case MOVE_TYPES.rotateOnMove:
                await this.hub.sleep(degrees/3 * (speed/15));  
                return;    
            default: 
                throw new Error('Default path in waitForEnd is not supported');      
        }
    }

    async fullStop(ms = 100) {
        this.motorA.brake();
        this.motorB.brake();
        await this.hub.sleep(ms);
    }
}

module.exports = {
    Actions
}
