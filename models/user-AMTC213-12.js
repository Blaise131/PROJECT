const mongoose = require('mongoose');

//creating user schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, unique: true},
    address: String,
    userDOB: Date,
    gender: String,
    category: String,
    terms: {type: Boolean, default: false }
});



//creating payment schema
const paymentSchema = new mongoose.Schema({
    pinNo: Number,
    fullName: String,
    cvv: Number,
    cardType: String,
    notfnPref: String
});

//creating instance of observation
const obserSchema = new mongoose.Schema({
    
    firstName: String,
    lastName: String,
    cordinates: String,
    title: String,
    avatar:     { type: String },
    content: {type: String, required: true},
    /**comment:  { type: [{
        date:     {type: Date, default: Date.now },
        userId:   {type: String },
        content:  {type: String }
      }]}*/



})

// creating a model instance
const User = mongoose.model('sysusers', userSchema);

// CREATING AN INSTANCE FOR PAYMENT DETAILS
const payment = mongoose.model('payments', paymentSchema);

// CREATING AN INSTANCE FOR OBSERVATION
const Observation = mongoose.model('observations', obserSchema);

//export function to create user model
/**module.exports = mongoose.model('sysusers', userSchema);
module.exports = mongoose.model('observations', obserSchema);
module.exports = mongoose.model('payments', paymentSchema);*/

module.exports={User,payment,Observation};