const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: Object
});

const UserModel = mongoose.model('Users', userSchema);///Users is collectionname in database
module.exports = UserModel;
