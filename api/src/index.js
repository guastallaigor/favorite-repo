const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached');
const axios = require('axios');

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

const typeDefs = gql`
  type Repositories {
    full_name: String,
    html_url: String,
    description: String,
    stargazers_count: String,
    watchers_count: String,
    forks_count: String,
    homepage: String,
    language: String,
    open_issues: String
  }

  type Query {
    repositories: [Repositories]
  }
`;

const resolvers = {
  Query: {
    repositories: async () => {
      const params = { page: 1, per_page: 9, q: 'vuejs' };
      const { data } = await axios.get('https://api.github.com/search/repositories', { params });
      return data.items;
    },
  },
};

// app.use(express.json());
// app.use(require('./routes'));
const server = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    cache: new MemcachedCache(
      ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
      { retries: 10, retry: 10000 }, // Options
    ),
  },
});

server.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000`),
);
