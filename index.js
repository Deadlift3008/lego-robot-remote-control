const PoweredUP = require("node-poweredup");
const { Actions: Actions42140 } = require("./transformer-42140/actions");
const poweredUP = new PoweredUP.PoweredUP();

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
    console.log(`Discovered ${hub.name}!`);
    await hub.connect(); // Connect to the Hub
    const motorA = await hub.waitForDeviceAtPort("A"); // Make sure a motor is plugged into port A
    const motorB = await hub.waitForDeviceAtPort("B"); // Make sure a motor is plugged into port B
    console.log("Connected");

    const actions = new Actions42140(motorA, motorB, hub);
    actions.setHoldBrakingStyle();

    await actions.rotateLeftOnMove(100, 100);
    await actions.rotateRightOnMove(100, 100);
    await actions.rotateLeftOnMove(100, 100);
    await actions.rotateRightOnMove(100, 100);
    console.log('Completed');
});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");