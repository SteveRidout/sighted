"use strict";

var mongoose = require('mongoose');

module.exports = function (db) {
	var sightingSchema = new mongoose.Schema({
		itemId: mongoose.Schema.Types.ObjectId,

		location: String,
		locationCoordinates: [],

		photoHashes: [],

		status: String,

		date: Date
	});
	sightingSchema.index({itemId: 1, date: 1});

	var Sighting = db.model('Sighting', sightingSchema);
	return Sighting;
};

