var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

var fs = require('fs');
var path = require('path');


server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname + '/public/pages/user.html'));

})
  .get('/admin', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/pages/admin.html'));

  })
  .get('/display', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/pages/display.html'));

  })
  .use(function(req, res, next) {});


/**
 * STEP:
 * 0 -> welcome
 * 100 -> yellow screen
 * 1 -> question 1
 * 2 -> question 2
 * 3 -> question 3
 * 4 -> question 4
 * 10 -> question draw logo
 * 20 -> question play video
 * 30 -> question draw signatur
 */

var idDisplay;
var step = 0;

io.on('connection', function(socket) {


  socket.on('newUser', function() {

    console.log('new user');
    socket.emit('welcome', step);
  });

  socket.on('newAdmin', function() {

    socket.emit('welcome', step);
  });

  //get the id of the display client
  socket.on('setDisplay', function() {

    idDisplay = socket.id;
    socket.emit('welcome', step);
  });

  socket.on('setStep', function(data) {

    step = data.step;

    console.log('step: ' + step);
    socket.broadcast.emit('setUserStep', step);
  });

  socket.on('sendImage', function(data) {

    var path_logo = "up_logo/";

    var img = data.img;
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');

    console.log(data.length);
    console.log(buf.length);

    socket.broadcast.to(idDisplay).emit('newImage', {
      img: img
    });

  });
});
