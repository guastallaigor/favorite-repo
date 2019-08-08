const { gql } = require('apollo-server-express');

const typeDefs = gql`
  interface IResponse {
    code: Int!
    error: String
  }

  type RepositoriesResponse implements IResponse {
    code: Int!
    total_count: Int
    error: String
    incomplete_results: Boolean
    items: [Repositories]
  }

  type Repositories {
    id: ID!
    full_name: String!
    html_url: String!
    description: String!
    stargazers_count: String!
    watchers_count: String!
    forks_count: String!
    homepage: String!
    language: String
    open_issues: String
  }

  type Query {
    getRepositories(name: String, page: Int, sort: String, order: String): RepositoriesResponse
  }
`;

module.exports = typeDefs;
