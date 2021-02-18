import React, { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { ALL_GENRES } from '../queries'

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
            show={page === 'authors'} loggedIn={props.loggedIn} 
          />

          <Books
            show={page === 'books'} genres={genres}
          />

          <NewBook
            show={page === 'add'} handleBookAdded={handleBookAdded} errorMessage={props.errorMessage}
          />

          <Recommendation
            show={page === 'recommend'} favoriteGenre={props.favoriteGenre}
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