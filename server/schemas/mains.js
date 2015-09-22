var mongoose = require('mongoose');

var mainschema = new mongoose.Schema({
	text: String
});

module.exports = mongoose.model('main', mainschema);