require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typedefs');
const getRepositories = require('./domains/repositories/RepositoriesResolvers');
const saveGroup = require('./domains/groups/GroupsResolvers');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const User = require('./domains/user/UserModel');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      await process.nextTick(async () => {
        const {
          login,
          name,
          location,
          email,
          company,
          html_url,
          avatar_url,
        } = profile._json;
        const userObj = {
          login,
          name,
          location,
          email,
          company,
          html_url,
          avatar_url,
        };
        let user = await User.findOne({ login: userObj.login });

        if (!user) {
          user = await new User(userObj).save();
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          return done(null, user);
        }

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user && user.id ? user.id : user);
});

passport.deserializeUser((id, done) => {
  if (id !== true && id !== false) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(e => {
        done(new Error('Failed to deserialize an user'));
      });
  }
  done(null, true);
});

mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

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
    saveGroup,
  },
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: ({ req }) => {
    console.log(req.user, ':req.user');
  },
});

apollo.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000`)
);
