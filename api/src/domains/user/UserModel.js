const { Schema, model }  = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  repositories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Repositories'
    }
  ]

}, {
  timestamps: true
}
);

module.exports = model('User', UserSchema);
