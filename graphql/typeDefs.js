const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    userId: ID!
  }

  type Query {
    getTasks: [Task]
    getTask(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!, description: String!, status: String!): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): String
  }
`;

module.exports = typeDefs;
