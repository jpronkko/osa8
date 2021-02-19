  
import React, { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import UpdateAuthor from './UpdateAuthor'
import { nameSort } from '../helper'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const [getAuthors, result] = useLazyQuery(ALL_AUTHORS)
  
  useEffect(() => {
    getAuthors()
  }, [getAuthors])

  useEffect(() => {
    if (result.data) {
      let gotAuthors = [...result.data.allAuthors]
      gotAuthors.sort((a1, a2) => nameSort(a1.name, a2.name))
      console.log("Got authors:", gotAuthors)
      setAuthors(gotAuthors)
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
      <h2>Authors</h2>
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
