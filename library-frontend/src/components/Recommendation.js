import React, { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Recommendation = (props) => {
  const [books, setBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
 
  useEffect(() => {
      getBooks({ variables: { genres: [props.favoriteGenre] }})
  }, [getBooks, props.favoriteGenre])

  useEffect(() => {
    if(result.data) {
      const gotBooks = result.data.allBooks
      setBooks(gotBooks)
      //console.log("Books:", gotBooks)
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
      <h1>Recommendation</h1>
      <p>Books in your favorite genre <b>{props.favoriteGenre}</b></p>
      <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b => 
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr> 
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Recommendation