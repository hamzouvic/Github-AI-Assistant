import express from 'express';
import chatReq from "./chatgpt.js";
import fs from "fs";
import {createProject} from "./github.js";

const app = express();
const port = 3000;

import bodyParser from 'body-parser';
import cors from "cors";

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
    const response = await chatReq();
    res.send(response);
});

app.get('/conversation', (req, res) => {
    const buffer = fs.readFileSync('./conversation.json');
    res.json(JSON.parse(buffer));
});

app.post('/prompt', async (req, res) => {
    const prompt = req.body.prompt;
    console.log('propmt', req.body);
    const data = {
        role: 'user',
        content: prompt
    };
    const session = JSON.parse(fs.readFileSync('conversation.json'));
    session.push(data);
    console.log(req.body);
    const response = await chatReq(session);
    fs.writeFile('conversation.json', JSON.stringify(session), (err) => {
        if (err) {
            console.error('Error writing JSON to file:', err);
        } else {
            console.log('JSON data has been written');
        }
    });
    res.json(response);
});

app.get('/github', async (req, res) => {
    const repo = await createProject('HAMZAv2','from app','R_kgDOLewzyg','U_kgDOCGQidw');
    console.log('repo ', repo);
    res.json(repo);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});