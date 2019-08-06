const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const { MemcachedCache } = require('apollo-server-cache-memcached');

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

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => {
      fetch('https://api.github.com/graphql')
        .then(res => res.json())
        .then(data => data)
    },
  },
};

// app.use(express.json());
// app.use(require('./routes'));
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
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
