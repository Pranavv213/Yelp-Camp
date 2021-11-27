const mongoose = require('mongoose');
const campSchema=new mongoose.Schema({
    city:String,
        growth_from_2000_to_2013:String,
        latitude: Number,
        longitude: Number,
        population:String,
        rank: String,
        state: String,

})
const Camp=mongoose.model('Camp',campSchema);


module.exports = Camp;


















