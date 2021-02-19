import React, { useEffect, useState } from 'react'

import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'


const UpdateAuthor = ({authors}) => {

  const [yearOfBirth, setYearOfBirth] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')

  const [ setBirth ] = useMutation(
    EDIT_AUTHOR,
    { refetchQueries: [{ query: ALL_AUTHORS }]}
  )
  
  useEffect(() => {
    if(authors.length > 0) {
      setSelectedAuthor(authors[0].name)
    }
  }, [authors])

  const submit = async (event) => {
    event.preventDefault()
    
    let author = selectedAuthor

    if(!author && authors.length) {
      author = authors[0].name
    }
    setBirth({ variables: { name: author, setBornTo:  Number(yearOfBirth) }})

    setYearOfBirth('')
  }

  const handleSelectAuthor = (event) => {
    const author = event.target.value
    console.log("Author:", author)
    setSelectedAuthor(author)
  }

  return (
    <div>
       <h3>Author to update</h3>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="authors">Choose from</label>
          <select value={selectedAuthor} onChange={handleSelectAuthor}>
            {authors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          Year of Birth
           <input 
            value={yearOfBirth}
            onChange={({ target }) => setYearOfBirth(target.value)}
            />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default UpdateAuthor