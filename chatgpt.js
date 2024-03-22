import OpenAI from "openai";
import fs from 'fs';

import { config } from "dotenv";
config();

console.log(process.env.OPENAI_API_KEY);

const session = JSON.parse(fs.readFileSync('./conversation.json', 'utf-8')).session;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const chatReq = async (session) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: session,
            temperature: 0,
            maxTokens: 1000,
        });

        session.push(response.choices[0].message);

        fs.writeFile('conversation.json', JSON.stringify({ session }), (err) => {
            if (err) {
                console.error('Error writing JSON to file:', err);
            } else {
                console.log('JSON data has been written');
            }
        });

        return response.choices[0].message;
    } catch (err) {
        console.log(err.message);
    }
};

export default chatReq;
