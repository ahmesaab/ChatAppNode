//Imports
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var profile = require('./routes/profile');
var chats = require('./routes/chats');
var chat = require('./routes/chat');
var changeSettings = require('./rest/changeSettings');
var newConversation = require('./rest/newConversation');
var newMemberConversation = require('./rest/newMemberConversation');


//Express Application
var app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Session Settings
var sessionMiddleware = session({
  secret: 'SuperDooberSecretSexToy',
  resave: true,
  saveUninitialized: true
})

//Other Middleware Setups
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));


//Controllers
app.use('/', routes);
app.use('/chat', chat);
app.use('/profile', profile);
app.use('/chats', chats);
app.use('/rest/changeSettings', changeSettings);
app.use('/rest/newConversation',newConversation);
app.use('/rest/newMemberConversation',newMemberConversation);

//WebSocket Handler
var webSocketHandler = require('./sockets/chatHandler');

//Game WebSocket Handler
var gameSocketHandler = require('./sockets/gameHandler');

//WebSocket Settings (Socket.io)
var io = require('socket.io')(2000);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
var gameNamespace = io.of('/game');
gameNamespace.on('connection', function(socket){gameSocketHandler(socket,io)});
var chatNamespace = io.of('/chat');
chatNamespace.on('connection', function(socket){webSocketHandler(socket)});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
