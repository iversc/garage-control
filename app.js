var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var commandRouter = require('./routes/command');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/command', commandRouter);

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

console.log("Starting GPIO...");
const { spawnSync } = require('child_process');
const gpio = spawnSync('gpio', [ '-g','mode','4','out']);

console.log("Loading auth key...");
let key = fs.readFileSync('keyfile');
app.locals.authKey = key.toString().trim();

console.log("Loading HUE API key...");
let huekey = fs.readFileSync('hueuser');
app.locals.hueUser = huekey.toString().trim();

console.log("Loading complete.");
module.exports = app;
