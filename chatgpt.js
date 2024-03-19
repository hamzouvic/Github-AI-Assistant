const OpenAI = require("openai");
const fs = require('fs')
const session = JSON.parse(fs.readFileSync('./conversation.json')).session

require("dotenv").config();
console.log(process.env.OPENAI_API_KEY_)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_
});

const chatReq = async (session) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: session,
            temperature: 0,
            max_tokens: 1000,
        });
        session.push(response.choices[0].message)
        fs.writeFile('conversation.json',JSON.stringify(session),(err) => {
            if (err) {
                console.error('Error writing JSON to file:', err);
            } else {
                console.log('JSON data has been written');
            }
        })
        return (response.choices[0].message);
    } catch (err) {
        console.log(err.message);
    }
};


module.exports =  chatReq;