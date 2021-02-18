  
import React, { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import UpdateAuthor from './UpdateAuthor'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const [getAuthors, result] = useLazyQuery(ALL_AUTHORS)
  
  useEffect(() => {
    getAuthors()
  }, [getAuthors])

  useEffect(() => {
    if (result.data) {
      console.log("All", result.data)
      setAuthors(result.data.allAuthors)
    }
  }, [result])

  if (!props.show) {
    return null
  } else if (result.loading) { 
    return (
      <div>
        loading ...
      </div>
    )
  }
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      {props.loggedIn && <UpdateAuthor authors={authors}/>}
    </div>
  )
}

export default Authors
