#!/usr/bin/env node

//Imports
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./data/db')

var home = require('./routes/home');
var profile = require('./routes/profile');
var game = require('./routes/game');
var login = require('./routes/login');
var logout = require('./routes/logout');

var changeSettings = require('./rest/changeSettings');
var chatHistory =require('./rest/chatHistory')

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
app.use('/', home);
app.use('/game', game);
app.use('/profile', profile);
app.use('/login', login);
app.use('/logout', logout);
app.use('/rest/changeSettings', changeSettings);
app.use('/rest/chatHistory', chatHistory);


//Game WebSocket Handler
var gameSocketHandler = require('./sockets/gameHandler');


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


var debug = require('debug')('ChatApp:server');
var http = require('http');


/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
* Listen on provided port, on all network interfaces.
*/


//WebSocket Settings (Socket.io)
var io = require('socket.io')(server);
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
var gameNamespace = io.of('/game');
gameNamespace.on('connection', function(socket){gameSocketHandler(socket,io)});




/**
 * Get port from environment and store in Express.
 */
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server_port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '3000');
app.set('port', server_port);

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    server.listen(server_port, server_ip_address, function(){
      console.log("Listening on " + server_ip_address + ", port " + server_port)
    });
  }
})



server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

