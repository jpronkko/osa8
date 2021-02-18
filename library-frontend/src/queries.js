import { gql } from '@apollo/client'

export const CREATE_USER = gql`
mutation createUser($username: String!, $password: String!, $favoriteGenre: String!) {
  createUser(
    username: $username,
    password: $password,
    favoriteGenre: $favoriteGenre
  ) { username }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) { token, favoriteGenre }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author { name }
    published
    genres
    id
  }
}
`
export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!){
  editAuthor(
    name: $name, setBornTo: $setBornTo
  ) {
    name,
    born,
    id
  }
}
`
export const ALL_AUTHORS = gql`
query allAuthors($name: String){
  allAuthors(name: $name) {
    name,
    born,
    bookCount,
    id
  }
}
`

export const ALL_BOOKS = gql`
query allBooks($author: String, $genres: [String]){
  allBooks(author: $author, genres: $genres) {
    title,
    author { name },
    published,
    genres,
    id
  } 
}
`

export const ALL_GENRES = gql`
query allGenres { allGenres { names }}
`

export const BOOK_COUNT = gql`
query bookCount {
  bookCount: Int
}
`
