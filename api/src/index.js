const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached');
const typeDefs = require('./typedefs');
const getRepositories = require('./domains/repositories/RepositoriesResolvers');

mongoose
  .connect(
    'mongodb://mongo:27017/expressmongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return next();
});

const resolvers = {
  Query: {
    getRepositories
  },
};

// app.use(express.json());
// app.use(require('./routes'));
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    cache: new MemcachedCache(
      ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
      { retries: 10, retry: 10000 }, // Options
    ),
  },
});

apollo.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000`),
);
