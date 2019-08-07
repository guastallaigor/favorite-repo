const express = require('express')
const routes = express.Router()
const passport = require('passport')

routes.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function(req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
)

routes.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.FAILURE_REDIRECT,
  }),
  function(req, res) {
    res.redirect(process.env.SUCCESS_REDIRECT)
  }
)

routes.get('/logout', function(req, res) {
  req.logout()
  res.redirect(process.env.LOGOUT_REDIRECT)
})

module.exports = routes
