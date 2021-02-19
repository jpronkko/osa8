import React, { useEffect, useState } from 'react'

import { useApolloClient, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

import Authors from './Authors'
import Books from './Books'
import LoginForm from './LoginForm'
import NewBook from './NewBook'
import Recommendation from './Recommendation'

const MainPage = (props) => {
  const [page, setPage] = useState('authors')
  const [showLogin, setShowLogin] = useState(false)

  const [getGenres, gresult] = useLazyQuery(ALL_GENRES)
  const [genres, setGenres] = useState([])
 
  const client = useApolloClient()

  useEffect(() => {
    getGenres()
  }, [getGenres])

  useEffect(() => {
    if(gresult.data) {
      let gotGenres = [...gresult.data.allGenres.names]
      gotGenres.sort()
      console.log("Got genres: ", gotGenres)
      setGenres(gotGenres)
    }
  }, [gresult])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    //console.log("Tuli kakkuun: ", addedBook)
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    //console.log("Kakussa on: ", dataInStore.allBooks)
    
    if(!includedIn(dataInStore.allBooks, addedBook)) {
      //console.log('Päätetään lisätä kakkuun: ', addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })

      /*const genresInStore = client.readQuery({ query: ALL_GENRES })
      let notInStore = []
      addedBook.genres.forEach(genre => {
        if(!genresInStore.allGenres.names.includes(genre)) {
          notInStore = notInStore.concat(genre)
        } 
      })
      
      console.log("Allgen:", genresInStore.allGenres)
      client.writeQuery({
          query: ALL_GENRES,
          data: { allGenres: genresInStore.allGenres.names.concat(notInStore)}
      });*/
      
      window.alert(`New book: ${addedBook.title}!`)
    }
  }

  const handleBookAdded = () => {
    setPage('books')
  } 

  const handleShowLogin = () => {
    setShowLogin(true)
  }

  const handleLogin = (token) => {
    setShowLogin(false)
    props.setToken(token)
  }

  const hasLoggedIn = () => {
    return (
      <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommendation</button>
        <button onClick={() => props.handleLogout()}>logout</button>
      </>
    )
  }

  const notLoggedIn = () => {
    if(showLogin) {
      return null
    }
    return (
      <>
        <button onClick={() => handleShowLogin()}>login</button>
      </>
    )
  }

  const showCommon = () => {
    if(showLogin) {
      return (
        <div>
          <LoginForm 
            errorMessage={props.errorMessage} 
            setToken={handleLogin} 
            setFavoriteGenre={props.setFavoriteGenre}
            genres={genres}
            />
        </div>
    )} else {
      return (
        <div>
          <Authors
            show={page === 'authors'} 
            loggedIn={props.loggedIn} 
          />

          <Books
            show={page === 'books'} 
            genres={genres}
            updateCacheWith={updateCacheWith}
          />

          <NewBook
            show={page === 'add'} 
            handleBookAdded={handleBookAdded}
            updateCacheWith={updateCacheWith} 
            errorMessage={props.errorMessage}
          />

          <Recommendation
            show={page === 'recommend'} 
            favoriteGenre={props.favoriteGenre}
            />
        </div>
      ) 
    } 
  }

  const gotoPage = (page) => {
    setPage(page)
    setShowLogin(false)
  }

  return (
    <div>
      <div>
        <button onClick={() => gotoPage('authors')}>authors</button>
        <button onClick={() => gotoPage('books')}>books</button>
        {props.loggedIn ? hasLoggedIn() : notLoggedIn()}
      </div>
      {showCommon()}
    </div>
  )
}

export default MainPage