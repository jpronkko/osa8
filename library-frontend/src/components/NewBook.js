import React, { useState } from 'react'

import { useMutation } from '@apollo/client'

import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, ALL_GENRES } from '../queries'

const NewBook = ({show, handleBookAdded, errorMessage}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(ADD_BOOK, { 
    onError: (error) => {
      errorMessage(error.toString())
    },
    update: (store, response) => {
      const dataInBookStore = store.readQuery({ query: ALL_BOOKS })
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInBookStore,
          allBooks: [ ...dataInBookStore.allBooks, response.data.addBook ]
        }
      })
    },
    refetchQueries: [ 
      { query: ALL_AUTHORS }, 
      { query: ALL_GENRES }
    ]
  })
  
  /*const [ createBook ] = useMutation(ADD_BOOK, { 
    refetchQueries: [ 
      { query: ALL_BOOKS }, 
      { query: ALL_AUTHORS }
    ]
  })*/
  
  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')
    createBook({ variables: { title, author, published: Number(published), genres }})
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    handleBookAdded()
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook