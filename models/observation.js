const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title: {type: String, trim: true, required: true},
    date: {type: Date, default:Date.now},
    text: {type: String, trim: true, required: true},

})

const Comment = mongoose.model('comment', commentSchema);

//creating instance of observation
const obserSchema = new mongoose.Schema({
    
    firstName: String,
    lastName: String,
    cordinates: String,
    title: String,
    avatar:     { type: String },
    content: {type: String, required: true},
    comments:  [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
      }]



})



// CREATING AN INSTANCE FOR OBSERVATION
const Observation = mongoose.model('observations', obserSchema);

//export function to export observation model
/**module.exports = mongoose.model('observations', obserSchema);*/

module.exports={Comment,Observation}