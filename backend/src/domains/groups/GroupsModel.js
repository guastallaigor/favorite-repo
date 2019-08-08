const { Schema, model } = require('mongoose');

const GroupsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    repositories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Repositories'
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model('Groups', GroupsSchema);
