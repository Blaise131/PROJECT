const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
passportLocalMongoose = require("passport-local-mongoose")

//creating user schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true, unique: true},
    address: String,
    userDOB: Date,
    gender: String,
    category: String,
    accountStatus: {type: String, default: "Active"},
    roles: {type: String, required: true},
    terms: {type: Boolean, default: false }
    /**accountStatus: {type: String, default: "Active"} */
});

userSchema.plugin(passportLocalMongoose);

//hashing plain text password
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});






//creating instance of comment data
/**const commentSchema = new mongoose.Schema({
    title: {type: String, trim: true, required: true},
    date: {type: Date, default:Date.now},
    text: {type: String, trim: true, required: true},

    observation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'observations'
    }
})*/



// creating a model instance
const User = mongoose.model('sysusers', userSchema);


// CREATING AN INSTANCE FOR OBSERVATION
/**const Comment = mongoose.model('comment', commentSchema);*/

//export function to create user model
module.exports = mongoose.model('sysusers', userSchema);


/**module.exports={User,payment,Observation};*/