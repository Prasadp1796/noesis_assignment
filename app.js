var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Cors Module Used Here
app.use(cors());

//Session Set Up
app.use(session({
    secret: 'thisisansecuritycode',
    saveUninitialized: true,
    resave: true,
    rolling: true,
    cookie: { maxAge: 24 * 60 * 60 * 10000 * 1000 }
}));


app.use(function(req, res, next) {
    res.locals.username = req.session.username;
    next();
});

//Database Connectivity
mongoose.connect("mongodb://127.0.0.1:27017/noesis_assignment", { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err)
        throw err;
    else
        console.log("Connected Successfully");
});

//Routes Imported Here
var normalizedPath = require("path").join(__dirname, "routes");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    app.use('/', require("./routes/" + file));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;