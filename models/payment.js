const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
passportLocalMongoose = require("passport-local-mongoose")

//creating payment schema
const paymentSchema = new mongoose.Schema({
    pinNo: String,
    fullName: String,
    cvv: String,
    cardType: String,
    notfnPref: String
});

//hashing plain text pin number
paymentSchema.pre('save', function(next) {
    var user = this;

    // only hash the pin number if it has been modified (or is new)
    if (!user.isModified('pinNo')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // hash the pin number using our new salt
        bcrypt.hash(user.pinNo, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext pin number with the hashed one
            user.pinNo = hash;
            next();

        });
    });
});

//hashing plain text cvv
paymentSchema.pre('save', function(next) {
    var user = this;

    // only hash the cvv if it has been modified (or is new)
    if (!user.isModified('cvv')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // hash the cvv using our new salt
        bcrypt.hash(user.cvv, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext cvv with the hashed one
            user.cvv = hash;
            next();

        });
    });
});

// CREATING AN INSTANCE FOR PAYMENT DETAILS
const payment = mongoose.model('payments', paymentSchema);

// export function to export payment model
module.exports = mongoose.model('payments', paymentSchema);
