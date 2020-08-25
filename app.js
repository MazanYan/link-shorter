const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Link = require('./models/link');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const jsonParser = bodyParser.json();
const app = express();
const port = process.env.port || 3000;

app.use(express.static(path.resolve(__dirname, 'client')))
app.use(favicon(path.resolve(__dirname, 'public', 'favicon', 'favicon.ico')));
app.use(jsonParser);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.post('/', (req, res) => {
    res.status(403).send('Error: Forbidden to post on main page!');
});

app.get('/get_link', (req, res) => {
    res.status(400).send('Nothing to get');
});

app.post('/get_link', async (req, res) => {
    //const originalLink = req.body.link;
    const link = new Link({
        originalLink: req.body.link,
        shortLink: 'www.example.com'
    });
    await link.save();
    res.send({ shortLink: 'http://localhost:3000/l/111' });
});

app.get('/l/:link', (req, res) => {
    console.log(req.params.link);
    res.redirect('http://www.example.com');
});

app.listen(port, async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(port);
    } catch (error) {
        console.log(`Some error happened:\n ${error}`);
    }
});
