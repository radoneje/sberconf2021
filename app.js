var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const axios=require('axios')
const config = require('./config.json')
const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection:config.pgConnection,
  pool: { min: 0, max: 40 }
});

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');

let app = express();
app.config=config;
var session = require('express-session', {maxAge:60*60*1000})
app.use(session({
  secret: 'you secrefevefvt key',
  saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("",express.static(path.join(__dirname, 'public')));
app.use("/conf",express.static(path.join(__dirname, 'public')));

app.use("/", (req,res, next)=>{req.knex=knex;next();});

app.use('/', indexRouter);
app.use('/conf', indexRouter);

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
