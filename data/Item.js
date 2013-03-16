"use strict";

var mongoose = require('mongoose'),
	randomstring = require('randomstring'),
	slugs = require('slugs');

module.exports = function (db) {
	var itemSchema = new mongoose.Schema({
		name: String,
		slug: String,

		secretCode: String,

		origin: String,
		originCoordinates: [],

		destination: String,
		destinationCoordinates: [],

		photoHash: String,
		description: String,

		createdDate: Date
	});
	itemSchema.index({creationDate: 1});
	itemSchema.index({name: 1});

	itemSchema.statics.publicFields =
		"name origin originCoordinates destination destinationCoordinates photoHash description createdDate";

	itemSchema.statics.addItem = function (itemData, callback) {
		console.log("item data = %s", JSON.stringify(itemData));
		Item.findOne({name: itemData.name}, function (err, item) {
			if (item) {
				callback({error: "item with same name exists", item: item});
			} else {
				if (!itemData.secretCode) {
					callback({error: "no secret code"});
					return;
					//itemData.secretCode = randomstring.generate(6);
				}
				itemData.slug = slugs(itemData.name);
				itemData.createdDate = new Date().toISOString();

				Item.create(itemData, callback);
			}
		});
	};

	var Item = db.model('Item', itemSchema);
	return Item;
};

