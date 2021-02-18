import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER, LOGIN } from '../queries'

const LoginForm = ({ errorMessage, setToken, setFavoriteGenre, genres }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  const [ login, loginResult ] = useMutation(LOGIN, {
    onError: (error) => {
      const err = error.toString()
      console.log("Error:", err)
      if(err.includes('wrong credentials')) {
        errorMessage("Could not login, check your username and password! ")
      } else {
        errorMessage("Unknown error!")
      }
      //setError(error.graphQLErrors[0].message)
    }
  })

  const [ createUser, newUserResult ] = useMutation(CREATE_USER, {
    onError: (error) => {
      const err = error.toString()
      console.log("Error creating user", err)
      errorMessage("Error creating user", err)
    }
  })

  useEffect(() => {
    if(genres.length > 0) {
      console.log("Selecting default genre for a new user: ", genres[0])
      setSelectedGenre(genres[0])
    }
  }, [genres])

  useEffect(() => {
    if( loginResult.data ) {
      const token = loginResult.data.login.token
      setToken(token)
      localStorage.setItem('librarytoken', token)

      const favorite = loginResult.data.login.favoriteGenre
      setFavoriteGenre(favorite)
      localStorage.setItem('libraryfavorite', favorite)
    
    } else {
      console.log("No data in login result!")
    }
  }, [loginResult.data, setToken, setFavoriteGenre])

  useEffect(() => {
    if( newUserResult.data ) {
      console.log("New user:", newUserResult.data, "newuser: ", newUsername, " newP ", newPassword)
      console.log("Login in the new user: ", newUsername)
      login({ variables: { username: newUsername, password: newPassword }})
    }
  }, [newUserResult.data, login, newUsername, newPassword])
 
  const submitLogin = async (event) => {
    event.preventDefault()

    login({ variables: { username, password }})
  }

  const submitNewUser = async (event) => {
    event.preventDefault()

    createUser({ variables: { 
      username: newUsername, 
      password: newPassword, 
      favoriteGenre: selectedGenre }})
  }

  const handleSelectGenre = (event) => {
    setSelectedGenre(event.target.value)
  }

  return (
    <div>
      <div>
        <h1>Login</h1>
        <form onSubmit={submitLogin}>
          <div>
            username <input 
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            password <input 
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
      <div>
        <h1>Or create new account</h1>
        <form onSubmit={submitNewUser}>
          <div>
            username <input
              value={newUsername}
              onChange={({ target }) => setNewUsername(target.value)}
              />
            password <input
              type='password'
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              />
              favorite genre
              <select value={selectedGenre} onChange={handleSelectGenre}>
                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
              </select>
          </div>
          <button type='submit'>Create</button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm