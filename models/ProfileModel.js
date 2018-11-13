const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
    },
  profile: String,
});

module.exports = mongoose.model('profile', ProfileSchema);
