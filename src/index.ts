import "dotenv/config";
import { WebSocketServer } from "ws";
import { getGlobalSpeed } from "./handlerFunctions/aiSpeedDecide";

/*

EXPLAINATION OF THE CODEBASE - 

Dekh fatafat overview de deta hu code ka, toh ye hai ek websocket server, isme kya hora hai ki sabse pehle toh 2 gloobal variables defined hain ek speedlimit ka aue ek currentSpeed ka, toh isme kya hai, jaise hi banda connect karega sever se, for example jab driver gaadi start karega, aur tab data aana shuru hoga, data message ke format me aayega, aur message ka format neeche bataya hua hai maine, toh isme kya hoga jab tu message bhejega ya matlab arduino se msg aauyega current state of car ka toh kya hoga, usme se cardSPpeed extract kar lega server, ab jab message aayega toh ek function hai ai se speed limit banwaneka toh jaise hi message aayega vo uss function ko as a interval start kar dega matlab ab jab tak next msg nahi aayega car se tab tak harr 20 min me AI ka  function run hoga aur speed limit me store ho jayega aur ab ye neeche jo if ststements hain ye verify karti hain ki jo speedlimit set hui hai aur jo carSpeed hai unme aapas me kya scene hai... aur uske according user ko msg jayega... that's pretty much we wanted to accomplish atleast for the bootstrap version of this... 

*/

const wss = new WebSocketServer({ port: 8060 });

let speedLimit = 0;

wss.on("connection", async (ws) => {
  let currentSpeed = 0;

  ws.on("message", (data: any) => {
    const message = JSON.parse(data.toString());
    const carDetails = message.carNumber;
    currentSpeed = message.carSpeed;
    setInterval(getGlobalSpeed, 1200);

    /*
    
    Dekh mai  ne yaha pe carDEtails me message.carSpeed likha hai basically main expect karra hu ki jab arduino se data aayega car ka toh vo iss format me hoga kuch kuch                  

    {
    "carDriver" : "Vansh",
    "carNumber" : "UP007AT6",
    "road" : "NH-729",
    "carSpeed" : 56
    }

    */

    console.log(`Received data from: ${carDetails}, Speed: ${currentSpeed}`);
  });

  speedLimit = await getGlobalSpeed();
  console.log("New Speed limit is - ", speedLimit);

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
