// app/models/incheonAirportPost.js
var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    nickname: String, 
	text: String,
	posted: { type: Date, default: Date.now },
	password: String
 });


 postSchema.plugin(mongoosePaginate);
 module.exports = mongoose.model('incheonAirportPost', postSchema);