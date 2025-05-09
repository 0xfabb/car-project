"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8060 });
let speedLimit = 50;
wss.on("connection", (ws) => {
    // Store latest speed per client
    let currentSpeed = 0;
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        const carDetails = message.carNumber;
        currentSpeed = message.carSpeed;
        console.log(`Received data from: ${carDetails}, Speed: ${currentSpeed}`);
    });
    // Send warnings every 1 second based on latest speed
    const interval = setInterval(() => {
        if (currentSpeed < speedLimit) {
            ws.send(JSON.stringify({
                type: "warning",
                warning: "You are under the safe speed limit. Great job!",
            }));
        }
        else if (currentSpeed === speedLimit) {
            ws.send(JSON.stringify({
                type: "warning",
                warning: "You are on the edge. Please slow down.",
            }));
        }
        else {
            ws.send(JSON.stringify({
                type: "warning",
                warning: "You broke the speed limit. Slow down within 1 minute!",
            }));
        }
    }, 1000);
    // Clean up on disconnect
    ws.on("close", () => {
        clearInterval(interval);
    });
});
