const { UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const config = require('./config')

const testData = require('./testdata')
const pubsub = new PubSub()

const authorFilter = async (name) => {

  let filter = {}
  if(name) {
    filter = { name: name }
  }

  const authors = await Author.find(filter, {}, {lean: true})
  return authors.map(x => ({ ...x, id: x._id }))
  /*return Promise.all(authors.map(async x => {
    const bookCount = await Book.collection.countDocuments({ author: x._id })
    return { ...x, id: x._id, bookCount }
  }))*/
} 

const booksFilter = async (author, genres) => {
  let filter = {}

  if(author) {
    const authorId = await Author.findOne({name: author}, {_id: 1 })

    console.log("A id", authorId)
    if(authorId) {
      filter = { author: authorId }
    }
  }

  if(genres) {
    filter = { ...filter, genres: {$in: genres }}
  }
   
  console.log("Filter: ", genres)
  const books = await Book.find(filter).populate('author')
  //console.log("Books", books, " filter ", filter)
  return books
}

const resolvers = {
  Mutation: {
    addTestBooks: async () => {
      const initialBooks = testData.books
      let initialAuthors = testData.authors

      const countBooks = (author) => 
        initialBooks.reduce((acc, cur) => {
          const val = cur.author === author.name ? acc + 1: acc
          console.log("Acc ", acc, " cur ", cur, " val ", val)
          return val
        }, 0)
      
      initialAuthors.forEach(author => {
        const bookCount = countBooks(author)
        console.log("Bookcount: ", bookCount)
        author.bookCount = bookCount
      })

      await Author.deleteMany() 
      await Author.insertMany(initialAuthors)
      
      await Book.deleteMany({})
      const booksToAdd = await Promise.all(initialBooks.map(async x => 
        {
          const author = await Author.findOne({ name: x.author })
          //console.log("a", author, " id ", author.id)
          return {...x, author: author._id}
        }))
      
      //console.log('Books to add ', booksToAdd)
      await Book.insertMany(booksToAdd)
      return Book.find({}).populate('author')
    },
    
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({name: args.author})
      if(!author) {
        const authorToSave = new Author({ name: args.author, bookCount: 0 })
        try {
          author = await authorToSave.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const book = new Book({ ...args, author: author._id })

      try {
        const savedBook = await book.save()
        author.bookCount = author.bookCount + 1
        await author.save()
        await savedBook.populate('author').execPopulate()
        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return savedBook
      } catch (error) {
        throw new UserInputError(error.message,  {
          invalidArgs: args,
        })
      }
    },

    editAuthor: async (root, args, { currentUser }) => {

      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      const filter = { name: args.name }
      const update = { born: args.setBornTo } 

      try {
        const updatedAuthor =  await Author.findOneAndUpdate(
                                    filter, update,
                                    { returnOriginal: false }        
                                )
        return updatedAuthor
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    
    createUser: async (root, args) => {
      const saltRounds = 10

      const user = new User(
        { 
          username: args.username, 
          passwordHash: await bcrypt.hash(args.password, saltRounds),
          favoriteGenre: args.favoriteGenre
        })

      
      return user.save()
        .catch (error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })     
    },

    login: async (root, args) => {
      console.log("Login ", args.username)
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null ? false :
        await bcrypt.compare(args.password, user.passwordHash)

      if (!passwordCorrect) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { token: jwt.sign(userForToken, config.JWT_SECRET), favoriteGenre: user.favoriteGenre }
    }
  },
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },

    bookCount: () =>  Book.collection.countDocuments(),//books.length,
    authorCount: () => Author.collection.countDocuments(), //authors.length,
    allBooks: async (root, args) => booksFilter(args.author, args.genres),
    allAuthors: async (root, args) => authorFilter(args.name),
    allGenres: async () => {
      const bookGenres = (await Book.find({}, { genres: 1}))

      const genres =  [...new Set(bookGenres.map(x => x.genres).flat())]
      return { names: genres }
    } 
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

module.exports = resolvers 
