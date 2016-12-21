/**
 * Created by Administrator on 2016/11/29 0029.
 */
// <reference path="jquery-3.1.0.min.js" />
var socket;
$(document).ready(function () {
    var open = false;
    $('.chatLog').hide();
    $('.openChat').on('click', function () {
        if (open == true) {
            $('.chatLog').hide();
            open = false;
        } else {
            $('.chatLog').show();
            open = true
        }
    });
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    socket.on('serverchat', processServerMessage);
    socket.on('updatequestion', processQuestion);
    socket.on('updateanswer', answer);
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);
    $('#send').click(sendQuestion);
    $('.data').keypress(processPress);
});
function addUser() {
    socket.emit('addid',prompt('your ID?', "a number (like 10023)"));
    socket.emit('adduser', prompt("What's your name?"));
    socket.emit('addyearold', prompt("how old are you?"));
}
function processMessage(username, data, id) {
    var Data = decode(id, data);
    $('<b>' + username + ':</b> ' + Data + '<br />')
        .insertAfter($('#conversation'));
    var a = $('<div><b>' + username + ':</b> ' + Data + '<br /></div>');
    a.insertAfter($('.messages'));
    function hideMessage() {
        a.hide()
    }

    setTimeout(hideMessage, 1000)
}
function processQuestion(username, data) {
    $('<b>' + username + ':</b> ' + data + '<br />' +
        '<div id="answers" style="border: black;background: rgba(10000,10000,10000,0);height: 20px;">answer:<textarea cols="10" rows="10" class="answer" style="border: black;background: linear-gradient(white,wheat);"></textarea><button class="sendanswer">send answer</button><br><br><br><br><br><br><br><br><br><br></div>')
        .insertAfter($('.log'));
    $('.sendanswer').on('click', sendAnswer)
}
function answer(data) {
    var a = $('<div style="border: black;height: 20px;">' + data + '<br /></div>');
    a.insertAfter($("#answers"))
}
function sendAnswer() {
    var ans = $('.answer');
    var message = ans.val();
    socket.emit('sendanswer', message);
    ans.val("");
    ans.focus()
}
function processServerMessage(username, data) {
    $('<b>' + username + ':</b> ' + data + '<br />')
        .insertAfter($('#conversation'));
}
function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
}
function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    var Data = encode(window.prompt('Who do you want to send this message to?: (id)', 'number'), message);
    socket.emit('sendchat', Data);
    $('#data').focus();
}
function sendQuestion() {
    var message = $('.data').val();
    $('.data').val('');
    socket.emit('sendquestion', message);
    $('.data').focus();
}
function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}
function processPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#send').focus().click();
    }
}

function Rand() {
    var seedNum = 0;
    return {
        seed: function (seed) {
            seedNum = seed;
        },
        next: function () {
            seedNum = (seedNum * 9301 + 49297) % 233280;
            return seedNum;
        }
    };
}

function getCodeSet(code) {
    var codeAry = ' abcdefghijklmnopqrstuvwxyz@!#$%^&*()_-{}[]":;~`.,<>?/|+=-*/ABCDEFGHIJKLMNOPQRSTUVWYZ\\'.split("");
    var codeAry2 = codeAry.slice();
    var len = codeAry.length;
    var rnd = new Rand();
    rnd.seed(code);
    for (var i = 0; i < len * 5; i++) {
        var m = rnd.next() % len;
        var n = rnd.next() % len;

        var v = codeAry[n];
        codeAry[n] = codeAry[m];
        codeAry[m] = v;
    }

    var codeSet = {};
    for (var i2 = 0; i2 < len; i2++) {
        codeSet[codeAry2[i2]] = codeAry[i2];
    }
    return codeSet;
}

function getDecodeSet(code) {
    var codeSet = getCodeSet(code);
    var decodeSet = {};
    Object.keys(codeSet)
        .forEach(function (k) {
            decodeSet[codeSet[k]] = k;
        });
    return decodeSet;
}

function encode(code, text) {
    var codeSet = getCodeSet(code);
    return text
        .split("")
        .map(function (x) {
            return codeSet[x]
        })
        .join("");
}

function decode(code, text) {
    var codeSet = getDecodeSet(code);
    return text
        .split("")
        .map(function (x) {
            return codeSet[x]
        })
        .join("");
}
