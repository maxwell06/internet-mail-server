var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/maxwells_chat.html');
});
var usernames = {};
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data, socket.userid);
    });
    socket.on('sendquestion', function (data) {
        io.sockets.emit('updatequestion', socket.username, data)
    });
    socket.on('sendanswer', function (data) {
        io.sockets.emit('updateanswer', data)
    });
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username + " id:" + socket.userid] = username + " id:" + socket.userid;
        socket.emit('serverchat', 'SERVER.frontDesk.NAEM', 'you have connected, ' + username + '.');
        console.log(username + ' has connected');
        socket.broadcast.emit('serverchat', 'SERVER.console.NAEM', username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });
    socket.on('addyearold', function (yearsOld) {
        socket.yearsold = yearsOld;
        socket.emit('serverchat', 'SERVER.%system Root%/Users/' + socket.username + '/console/' + Math.random(), 'you have almost registered');
    });
    socket.on('addid',function (id) {
        socket.userid = id;
        socket.emit('serverchat', "SERVER.ids.table.NAEM",'registered.');
    });
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('serverchat', 'SERVER'
            , socket.username + ' has disconnected');
    });
});
var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);