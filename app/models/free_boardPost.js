// app/models/free_boardPost.js
var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: String, 
	text: String,
	nickname: String,
	posted: { type: Date, default: Date.now },
	freeBoardComments: [{
		userBoardPost: String
	}]

     });

     postSchema.plugin(mongoosePaginate);
     module.exports = mongoose.model('free_boardPost', postSchema);