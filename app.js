
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	api = require('./routes/api'),
	mongoose = require('mongoose'),
	_ = require('underscore');

var app = module.exports = express();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Database
var mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sighted',
	db = require('mongoose').createConnection(mongoURI);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	var Item = require('./data/Item')(db),
		Sighting = require('./data/Sighting')(db);

	// Routes

	app.get('/', routes.index);
	app.get('/partials/:name', routes.partials);

	// JSON API
	app.get('/api/name', api.name);

	app.get('/api/items', function (req, res) {
		Item.find({}, Item.publicFields, function (err, items) {
			res.json(items);
		});
	});
	app.post('/api/item', function (req, res) {
		Item.addItem(req.body, function (err, item) {
			if (err) {
				res.json({error: err});
			} else {
				res.json(item);
			}
		});
	});

	// TODO: allow original author to modify with PUT ?

	app.get('/api/item/:id', function (req, res) {
		var id = req.params.id;

		Item.findById(id, Item.publicFields, function (err, item) {
			if (err) {
				res.json({error: err});
			} else {
				res.json(item);
			}
		});
	});

	app.post('/api/item/:itemId/sighting', function (req, res) {
		var itemId = req.params.itemId;

		Item.findById(itemId, function (err, item) {
			if (err) {
				res.json({error: err});
			} else {
				if (req.body.secretCode !== item.secretCode) {
					res.json({error: "incorrect secret code"});
					return;
				}

				var sightingData = _.omit(req.body, 'secretCode');
				sightingData.date = new Date().toISOString();
				sightingData.itemId = itemId;

				Sighting.create(sightingData, function (err, sighting) {
					if (err) {
						res.json({error: err});
					} else {
						res.json(sighting);
					}
				});
			}
		});
	});
	app.get('/api/item/:itemId/sightings', function (req, res) {
		console.log("getting sightings for " + req.params.itemId);
		Sighting.find({itemId: req.params.itemId}, function (err, sightings) {
			if (err) {
				res.json({error: err});
			} else {
				console.log("sightings: %s", JSON.stringify(sightings));
				res.json(sightings);
			}
		});
	});

	// redirect all others to the index (HTML5 history)
	app.get('*', routes.index);

	// Start server
	var port = process.env.PORT || 3000;
	app.listen(port, function(){
		console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
	});
});

