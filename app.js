var createError = require('http-errors');
require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* Achivement routes */
var retroRouter = require('./routes/retro');
var psnRouter = require('./routes/psn');
// var steamRouter = require('./routes/steam');
// var xboxRouter = require('./routes/xbox')
const { buildAuthorization } = require('@retroachievements/api');

var app = express();

/* global vars from env */
// Retro
app.locals.retroAPIKey = process.env.retroAPIKey
app.locals.retroAdminUsername = process.env.retroUsername
app.locals.retroAuth = buildAuthorization({username: app.locals.retroAdminUsername, webApiKey: app.locals.retroAPIKey});

// PSN
app.locals.npsso = process.env.npsso
app.locals.psnAccountID = process.env.psnAccountID

// Steam
app.locals.steamUsername = process.env.steamUsername
app.locals.steamAPIKey = process.env.steamAPIKey
app.locals.steamID = process.env.steamID

// Xbox
app.locals.xboxEmail = process.env.xboxEmail
app.locals.xboxPassword = process.env.xboxPassword
app.locals.xboxUID = process.env.xboxUID

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
/* achivement platform routes */
app.use('/retro', retroRouter);
app.use('/psn', psnRouter)
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


const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);  
});