const express = require('express');
const mongoose = require('mongoose'); //ODM for MongoDB
const ShortUrl = require('./models/shorturl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    //setup options
    useNewUrlParser: true, useUnifiedTopology: true //removes deprecation errors
})

app.set('view engine', 'ejs'); //template engine. Read express docs
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
})

app.post('/shorturls', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullURL
    })
    
    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running");
});