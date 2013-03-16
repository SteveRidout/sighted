/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};


exports.item = function (req, res) {
  res.json({
	  item1: {
	  	name: 'My first item',
	  	coordinates: [40.4167754, -3.703]
	  },
	  item2: {
	  	name: 'And another',
	  	coordinates: [40.4167754, -3.703]
	  }
	});
};
