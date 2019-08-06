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
    name: String
  }

  type Query {
    repositories: [Repositories]
  }
`;

const resolvers = {
  Query: {
    repositories: (name = 'vue') => {
      const payload = JSON.stringify({ query: `{ repository(owner: "octocat", name: "Hello-World") { issues(last:20) { edges { node { title } } } }  }` });
      const config = {
        headers: {
          'Authorization': 'Bearer 886164b8c3c7a87d5dddf5b04f3defd3fe0b413c'
        }
      };
      axios.post('https://api.github.com/graphql', payload, config)
        .then(({ data }) => {
          console.log(data, ':111');
          return data;
        })
        .catch(err => {
          console.error(err, ':222');
          return err;
        })
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
