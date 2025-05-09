import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8060 });

let speedLimit = 50;

wss.on("connection", (ws) => {
 
  let currentSpeed = 0;

  ws.on("message", (data: any) => {
    const message = JSON.parse(data.toString());
    const carDetails = message.carNumber;
    currentSpeed = message.carSpeed;

    console.log(`Received data from: ${carDetails}, Speed: ${currentSpeed}`);
  });

  
  const interval = setInterval(() => {
    if (currentSpeed < speedLimit) {
      ws.send(
        JSON.stringify({
          type: "warning",
          warning: "You are under the safe speed limit. Great job!",
        })
      );
    } else if (currentSpeed === speedLimit) {
      ws.send(
        JSON.stringify({
          type: "warning",
          warning: "You are on the edge. Please slow down.",
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "warning",
          warning: "You broke the speed limit. Slow down within 1 minute!",
        })
      );
    }
  }, 1000);

  ws.on("close", () => {
    clearInterval(interval);
  });
});
