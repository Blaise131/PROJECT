const mongoose = require('mongoose')
const mongodb = 'mongodb+srv://blaise12:mco1crt@cluster0.tv4xk.mongodb.net/project?retryWrites=true&w=majority';

mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    console.log("Connected successfully to MongoDB!")
});

module.exports = mongoose;