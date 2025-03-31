const { gql } = require('apollo-server-express');

const typeDefs = gql`
  """
  User type definition
  """
  type User {
    id: ID!
    name: String!
    email: String!
  }

  """
  Task type definition
  """
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    userId: ID!
  }

  """
  Queries
  """
  type Query {
    """
    Retrieve all tasks of the authenticated user
    """
    getTasks: [Task]

    """
    Retrieve a single task by its ID
    """
    getTask(id: ID!): Task

    """
    Retrieve authenticated user from the database using the session ID
    """
    me: User
  }

  """
  Mutations
  """
  type Mutation {
    """
    Create a new task
    """
    createTask(title: String!, description: String!, status: String!): Task

    """
    Update an existing task
    """
    updateTask(id: ID!, title: String, description: String, status: String): Task

    """
    Delete a task by its ID
    """
    deleteTask(id: ID!): String

    """
    Register a new user
    """
    signup(name: String!, email: String!, password: String!): User

    """
    Authenticate user and return session
    """
    login(email: String!, password: String!): String!

    """
    Logout the current user
    """
    logout: String!
  }
`;

module.exports = typeDefs;
