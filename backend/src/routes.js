const express = require('express');
const routes = express.Router();
const passport = require('passport');

routes.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate.'
  });
});

routes.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

routes.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: process.env.SUCCESS_REDIRECT,
    failureRedirect: process.env.FAILURE_REDIRECT,
  }),
  function(req, res) {
    console.log('success');
    res.redirect(process.env.SUCCESS_REDIRECT);
  }
);

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect(process.env.LOGOUT_REDIRECT);
});

module.exports = routes;
