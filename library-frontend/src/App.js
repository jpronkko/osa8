
import { useApolloClient } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import MainPage from './components/MainPage'

const App = () => {
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState('')

  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('librarytoken')
    if(token) {
      setToken(token)
    }
    const favoriteGenre = localStorage.getItem('libraryfavorite')
    if(favoriteGenre) {
      setFavoriteGenre(favoriteGenre)
    }
  }, [])

  
  const errorMsg = (msg) => {
    setError(msg)
    setTimeout(() => setError(null), 3000)
  }

  const handleLogout = () => {
    setToken(null)
    setFavoriteGenre('')
    localStorage.clear()
    client.resetStore()
  }

  const isLoggedId = () => { return token !== null}
  
  const errorDisplayStyle = {
    border: '10px solid red',
    borderRadius: 10,
    backgroundColor: 'yellow',
    padding: 5,
    margin: 5,
  }

  const noDisplayStyle = {
    display: 'no'
  }

  return (
    <div>
      <div style={error ? errorDisplayStyle : noDisplayStyle}>{error}</div>
      <div>
        <MainPage 
          handleLogout={handleLogout} 
          setToken={setToken}
          setFavoriteGenre={setFavoriteGenre}
          favoriteGenre={favoriteGenre} 
          loggedIn={isLoggedId()}
          errorMessage={errorMsg}
          />
      </div>
    </div>
  )
}

export default App