const express = require('express');
const routes = express.Router();
const passport = require('passport');

routes.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate.',
  });
});

routes.get(
  '/auth/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] }),
  function(req, res) {}
);

routes.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.FAILURE_REDIRECT,
  }),
  function(req, res) {
    let redirect = process.env.SUCCESS_REDIRECT;

    if (req.user && req.user.accessToken) {
      redirect += '?access_token=' + req.user.accessToken;

      if (req.user.refreshToken) {
        redirect += '&refresh_token=' + req.user.refreshToken;
      }
    }

    res.redirect(redirect);
  }
);

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect(process.env.LOGOUT_REDIRECT);
});

module.exports = routes;
