const express = require('express')
const chatReq = require("./chatgpt");
const fs = require("fs");
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    const response = await chatReq()
    res.send(response)
})

app.get('/conversation', (req,res)=>{
    const buffer = fs.readFileSync('./conversation.json')
    res.json(JSON.parse(buffer))
})

app.post('/prompt', async (req, res) => {
    const prompt = req.body.prompt
    const data = {
        role: 'user',
        content: prompt
    }
    const session = JSON.parse(fs.readFileSync('conversation.json'))
    session.push(data)
    console.log(req.body)
    const response = await chatReq(session)
    fs.writeFile('conversation.json',JSON.stringify(session),(err) => {
        if (err) {
            console.error('Error writing JSON to file:', err);
        } else {
            console.log('JSON data has been written');
        }
    })
    res.json(response)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})