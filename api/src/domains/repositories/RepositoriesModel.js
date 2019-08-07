const { Schema, model }  = require('mongoose');

const RepositoriesSchema = new Schema({
  full_name: {
    type: String,
    required: true
  },
  html_url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stargazers_count: {
    type: String,
    required: true
  },
  watchers_count: {
    type: String,
    required: true
  },
  forks_count: {
    type: String,
    required: true
  },
  homepage: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  open_issues: {
    type: String,
    required: true
  }
}, {
  timestamps: true
}
);

module.exports = model('Repositories', RepositoriesSchema);
