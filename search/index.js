const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Webpage = require('./Webpage');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded());
app.use(require('express-session')({
    secret: 'keyboard warrior cat',
    resave: true,
    saveUninitialized: true
}));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/search-engine-crawler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.get('/search', async function (req, res, next) {
    const searchterm = req.query.q

    const result = await Webpage.find({
        $text: {
            $search: searchterm.toString()
        }
    })

    const about = {
        search: result
    }

    return res.render('search', about)
})

app.listen(3000, console.log("web server started"))