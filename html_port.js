/**
 * Created by Administrator on 2016/12/11 0011.
 */
var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app);
app.use(express.static(__dirname + '/chat_service'));
var port = 8088;
server.listen(port);
console.log('Listening on port: ' + port);