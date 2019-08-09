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

  type GroupsResponse implements IResponse {
    code: Int!
    error: String
    group: Groups
  }

  type User {
    login: String!
    name: String!
    location: String
    email: String!
    company: String
    html_url: String!
    avatar_url: String!
  }

  type Groups {
    name: String!
    user: User!
    repositories: [Repositories]
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

  type Mutation {
    saveGroup(name: String, user: String): GroupsResponse
  }
`;

module.exports = typeDefs;
