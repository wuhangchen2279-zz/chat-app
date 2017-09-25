/*
'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt'); //jason web token
const cors = require('cors');

const socketEvents = require();
const routes = require();
const config = require();

class Server{

    constructor() {
        this.port = process.env.NODE_ENV === 'production' ? 80 : 4000;
        this.host = `localhost`;

        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig() {
        this.app.use(
               cors() 
            );

        this.app.use(
                bodyParser.urlencoded({ extended: false })
            );

        this.app.use(
                bodyParser.json()
            );

        this.app.use(
                expressJwt({
                    secret: config.secret,
                    getToken: function fromHeaderOrQuerystring (req) {
                        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                            return req.headers.authorization.split(' ')[1];
                        } else if (req.query && req.query.token) {
                            return req.query.token;
                        }
                        return null;
                    }
                }).unless({ path: ['/users/authenticate', '/users/register'] })        
            );

        new config(this.app);
    }

    //include app routes
    includeRoutes() {
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }

    appExecute() {
        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();

*/

require('rootpath')();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var cors = require('cors'); //Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt'); //jason web token
var config = require('config.json');
var socket = require('socket.io').listen(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api , the token can be passed in the authroization header or query string
app.use(expressJwt({
    secret: config.secret,
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

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
server.listen(port, function() {
	console.log('Server listening on port ' + port);
})