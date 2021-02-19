const { gql } = require('apollo-server')

const typeDefs = gql`
  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    me: User
  }

  type TokenString {
    token: String!
    favoriteGenre: String!
  }

  type Genre {
    names: [String!]!
  }

  type Mutation {
    addTestBooks: [Book]  
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
      ): Author
    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): TokenString
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: [String]): [Book!]!
    allAuthors(name: String): [Author!]!
    allGenres: Genre!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }
`
 
module.exports = typeDefs