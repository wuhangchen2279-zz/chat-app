var config = require('config.json');
var express = require('express');
var router = express.Router();
//var chatService = require('services/chat.service');



router.get('/', function(req, res) {
	res.send('Express Rest API');
});

module.exports = router;