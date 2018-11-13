var mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  profile: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
   },
});

module.exports = mongoose.model('Profile', ProfileSchema);
