var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://127.0.0.1/cashdemo');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//     res.send('Hello World!');
// });
//
// app.post('/user/signup',)

require('./router/router')(app);

app.listen(3050, function () {
    console.log('Example app listening on port 3050!');
});