const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const auth = require('./routes/api/auth');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// BD config
const db = require('./config/keys').mongoURI;
// Connect to MongoBD
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(()=>{console.log('connected succsess')})
    .catch(()=>{console.log('error')});

app.use('/api', auth);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port}`));