import createError from 'http-errors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// import indexRouter from './routes/index.js';

/* Achivement routes */
import retroRouter from './routes/retro.js';
import psnRouter from './routes/psn.js';
// var steamRouter = require('./routes/steam');
// import xboxRouter = require('./routes/xbox')
import { buildAuthorization } from '@retroachievements/api';
/* create file path to match the commonJS dirpath. */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

/* global vars from env */
// Retro
app.locals.retroAPIKey = process.env.retroAPIKey
app.locals.retroAdminUsername = process.env.retroUsername
// app.locals.retroAuth = buildAuthorization({
//   username: app.locals.retroAdminUsername, 
//   webApiKey: app.locals.retroAPIKey
// });

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
console.log('before app.use()');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log('After')
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
/* achivement platform routes */
app.use('/retro', retroRouter);
app.use('/psn', psnRouter);
// app.use ('/xbox', xboxRouter);

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

export default app;

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);  
});