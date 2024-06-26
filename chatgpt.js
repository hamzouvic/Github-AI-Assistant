import OpenAI from 'openai';
import fs from 'fs';

import { config } from 'dotenv';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const readFile = (fileName) => {
  try {
    return fs.readFileSync('./conversation.json', 'utf-8');
  } catch (e) {
    console.error('Error reading file ', e);
    return false;
  }
};

export const getSession = () => JSON.parse(readFile('conversation.json'));

export const saveSession = (session) => {
  writeFile('conversation.json', session);
};

export const writeFile = (fileName, session) => {
  fs.writeFile(fileName, JSON.stringify(session), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
      return false;
    }
    console.log('JSON data has been written');
    return true;
  });
};
export const chatReq = async (session) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: session,
      temperature: 0,
      max_tokens: 1000,
      n: 1,
    });
    return response.choices[0].message;
  } catch (err) {
    console.log(err.message);
  }
};
