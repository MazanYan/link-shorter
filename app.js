const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Link = require('./models/link');
const shortLink = require('./shortLink');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const jsonParser = bodyParser.json();
const app = express();
const port = process.env.PORT || 3000;

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
    const originalLink = req.body.link;
    let link = (await Link.find({ originalLink }).exec())[0];
    if (!link) {
        link = new Link({
            originalLink: originalLink,
            shortLink: shortLink(originalLink),
        });
        console.log('New Link was created');
        link.save();
    }
    const links = { shortLink: `${process.env.SERVER_ADDR}/l/${link.shortLink}`, originalLink: originalLink };
    console.log(links);
    res.send(JSON.stringify(links));
});

app.get('/l/:link', async (req, res) => {
    const shortLink = req.params.link;
    const originalLink = (await Link.find({ shortLink: shortLink }).exec())[0].originalLink;
    console.log('Original Link');
    console.log(originalLink);
    if (!originalLink)
        res.status(404).send('Original link for short link not found');
    else
        res.redirect(originalLink);
});

app.listen(port, async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(port);
    } catch (error) {
        console.log(`Some error happened:\n ${error}`);
    }
});
