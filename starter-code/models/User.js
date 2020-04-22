let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;