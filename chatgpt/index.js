const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

chatReq = async () => {
    try {
        const message = "Which is the capital of Albania?";
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            temperature: 0,
            max_tokens: 1000,
        });
        console.log(response.message);
    } catch (err) {
        console.log(err.message);
    }
};