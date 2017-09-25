"use strict";

/*require mongodb node modules*/
const mongodb = require('mongodb');
const assert = require('assert');
const config = require('../config.json');

class Db {

	constructor() {
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
		this.mongoURL = config.connectionString;
	}

	onConnect(callback) {
		this.mongoClient.connect(this.mongoURL, (err, db) => {
			assert.equal(null, err);
			callback(db, this.ObjectID);
		})
	}

}

module.exports = new Db();