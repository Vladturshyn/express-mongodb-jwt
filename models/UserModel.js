const mongoose = require('mongoose');  
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String
});

module.exports = mongoose.model('user', UserSchema);