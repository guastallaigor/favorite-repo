const User = require('./UserModel');

module.exports = {
  async index(req, res) {
    const users = await User.find({}).sort('name');

    return res.json(users);
  },
  async store(req, res) {
    const { body } = req

    if (body.name && body.moves) {
      let user = await User.findOne({ name: body.name });

      if (user) {
        if (user.moves < body.moves) {
          user.moves = body.moves
          await user.save()
        }
      } else {
        user = await User.create(body);
      }

      return res.json(user);
    }

    return res.status(400).send('Failed');
  }
}

// *--------------------------------------*

const User = require('../user/UserModel');
const userObj = {
  login: 'guastallaigor',
  name: 'Igor Guastalla de Lima',
  location: 'Maringá',
  email: 'limaguastallaigor@gmail.com',
  company: 'Sabium Sistemas',
  html_url: 'https://github.com/guastallaigor',
  avatar_url: 'https://avatars3.githubusercontent.com/u/22016005?s=460&v=4',
};

const userx = await User.create(userObj)
