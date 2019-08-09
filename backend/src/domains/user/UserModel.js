const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    login: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    html_url: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', UserSchema);
