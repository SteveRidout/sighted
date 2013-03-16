"use strict";

var request = require('request'),
	_ = require('underscore'),
	async = require('async');

var testCall = function (method, path, json, expected, callback) {
	request(
		{
			method: method,
			uri: 'http://localhost:3000' + path,
			json: json
		}, function (error, response, body) {
			// TODO: check that body matches expected
			
			console.log("req: %s %s %s", method, path, JSON.stringify(json));
			console.log("res: %s", JSON.stringify(body));
			console.log("---");
			callback(null, body);
		});
};

var ids = [],
	secrets = [];

async.series([
	// --- test items ---
	function (callback) {
		testCall('POST', '/api/item', {
			name: "Test Item",
			origin: "Madrid",
			destination: "Tokyo",
			description: "Help me visit my friend in Japan!",
			secretCode: "sushi"
		}, null, function (err, body) {
			if (body.error) {
				ids.push(body.error.item._id);
			} else {
				ids.push(body._id);
			}
			callback();
		});
	},
	function (callback) {
		testCall('POST', '/api/item', {
			name: "James",
			origin: "London",
			destination: "Paris",
			description: "Je voudrais un croissant!",
			secretCode: "onions"
		}, null, function (err, body) {
			if (body.error) {
				ids.push(body.error.item._id);
			} else {
				ids.push(body._id);
			}
			callback();
		});
	},
	function (callback) {
		testCall('GET', '/api/item/' + ids[0], {}, null, callback);
	},
	function (callback) {
		testCall('GET', '/api/item/' + ids[1], {}, null, callback);
	},
	function (callback) {
		testCall('GET', '/api/items', {}, null, callback);
	},

	// --- test sightings ---
	function (callback) {
		testCall('POST', '/api/item/' + ids[0] + '/sighting', {
			location: "Istanbul",
			status: "Now it's Istanbul not Constantinople!",
			secretCode: "sushi"
		}, null, callback);
	},
	function (callback) {
		testCall('GET', '/api/item/' + ids[0] + '/sightings', {}, null, callback);
	}
]);

