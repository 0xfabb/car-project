"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ws_1 = require("ws");
const aiSpeedDecide_1 = require("./handlerFunctions/aiSpeedDecide");
const wss = new ws_1.WebSocketServer({ port: 8060 });
let speedLimit = 0;
wss.on("connection", (ws) => __awaiter(void 0, void 0, void 0, function* () {
    let currentSpeed = 0;
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        const carDetails = message.carNumber;
        currentSpeed = message.carSpeed;
        setInterval(aiSpeedDecide_1.getGlobalSpeed, 3000);
        console.log(`Received data from: ${carDetails}, Speed: ${currentSpeed}`);
    });
    speedLimit = yield (0, aiSpeedDecide_1.getGlobalSpeed)();
    console.log("New Speed limit is - ", speedLimit);
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
    ws.on("close", () => {
        clearInterval(interval);
    });
}));
