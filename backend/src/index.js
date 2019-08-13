require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached');
const typeDefs = require('./typedefs');
const getRepositories = require('./domains/repositories/RepositoriesResolvers');
const saveGroup = require('./domains/groups/GroupsResolvers');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const User = require('./domains/user/UserModel');

passport.serializeUser((user, done) => {
  done(null, user && user.id ? user.id : user);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        const profileJson = profile._json
        const userObj = {
          login: profileJson.login,
          name: profileJson.name,
          location: profileJson.location,
          email: profileJson.email,
          company: profileJson.company,
          html_url: profileJson.html_url,
          avatar_url: profileJson.avatar_url,
        };
        User.findOne({ login: userObj.login },
          async function(err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              await new User(userObj).save();
              return done(null, true);
            }
            return done(null, true);
          }
        );
        return done(null, false);
      });
    }
  )
);

mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.CLIENT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return next();
});
app.use(express.json());
app.use(require('./routes'));

const resolvers = {
  Query: {
    getRepositories,
  },
  Mutation: {
    saveGroup
  }
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    cache: new MemcachedCache(
      ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
      { retries: 10, retry: 10000 }
    ),
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: (all) => {
    // console.log(all)
  },
});

apollo.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000`)
);
