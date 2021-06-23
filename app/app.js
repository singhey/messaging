var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import MessageRoute from './routes/MessageRoute'
import dotenv from 'dotenv'
import Auth from './middleware/Auth'
import cors from 'cors'
// import ConversationRoute from './routes/ConversationLegend.routes'
import ChatRoute from './routes/Chat.routes'

dotenv.config()
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  Auth(req, res, next)
})

app.use('/messaging', MessageRoute)
app.use('/chat', ChatRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next({message: "Path not found", status: 404});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({type: "ERROR", message: err.message});
});

module.exports = app;
