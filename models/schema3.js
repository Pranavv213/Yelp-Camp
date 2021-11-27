const mongoose = require('mongoose');
const reviewSchema=new mongoose.Schema({
    city:String,
        username:String,
        rating: Number,
        comment: String,

})
const Comment=mongoose.model('Comment',reviewSchema);


module.exports = Comment;


















