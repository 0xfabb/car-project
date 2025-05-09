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
exports.getGlobalSpeed = void 0;
const generative_ai_1 = require("@google/generative-ai");
const APIKey = process.env.GEMINI_API;
const ai = new generative_ai_1.GoogleGenerativeAI(APIKey);
const prompt = process.env.PROMPT;
let speedLimit = 0;
const getGlobalSpeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = yield response.text();
        const match = text.match(/\d+/);
        if (match) {
            speedLimit = Number(match[0]);
        }
        else {
            console.log("No numeric speed limit found in the response.");
        }
    }
    catch (e) {
        console.error("Caught an error:", e);
    }
    return speedLimit;
});
exports.getGlobalSpeed = getGlobalSpeed;
console.log(speedLimit);
