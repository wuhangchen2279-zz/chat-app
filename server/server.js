require('rootpath')();
var express = require('express');
var app = express();
//var server = require('http').createServer(app);
var cors = require('cors'); //Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt'); //jason web token
var config = require('config.json');
//var io = require('socket.io').listen(server)

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api , the token can be passed in the authroization header or query string
app.use(expressJwt({
    secret: config.secret,
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));

//routes
app.use('/users', require('./controllers/users.controller'));
//app.use('/chat', require('./controllers/chat.controller'));

//configure socket.io instacne here
/*
io.sockets.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('join', function(data) {
        socket.join(data.email);
    })
});
*/

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function() {
	console.log('Server listening on port ' + port);
})