import React, { useEffect, useState } from 'react'

import { useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { nameSort } from '../helper'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [genresFilter, setGenresFilter] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  
 
  useEffect(() => {
    if(genresFilter.length > 0) {
      getBooks({ variables: { genres: genresFilter }})
    } else {
      getBooks()
    }
    //getBooks({ variables: { author: null }})
  }, [getBooks, genresFilter])

  useEffect(() => {
    if(result.data) {
      let gotBooks = [...result.data.allBooks]
      gotBooks.sort((b1, b2) => nameSort(b1.title, b2.title))
      setBooks(gotBooks)
      //console.log("Books:", gotBooks)
    }
  }, [result])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      //console.log('use sub: book added:', subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      props.updateCacheWith(addedBook)
    }
  })

  const onFilter = (genre) => {
    if(genresFilter.includes(genre)) {
      setGenresFilter(genresFilter.filter(x => x !== genre))
    } else { 
      setGenresFilter([...genresFilter, genre])
    }
  }

  if (!props.show) {
    return null
  } else if (result.loading) { 
    return (
      <div>
        loading ...
      </div>
    )
  }
  
  const selectedStyle = {
    backgroundColor: 'green'
  }

  const nonSelectedStyle = {
    color: 'blue'
  }

  const toggleButton = (genre) => {
    let style = nonSelectedStyle
    if(genresFilter.includes(genre)) {
      style = selectedStyle
    }

    return (
      <button key={genre} style={style} onClick={() => onFilter(genre)}>{genre}</button>  
    )
  } 

  return (
    <div>
      <h2>Books</h2>

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
      <div>
        {props.genres.map(genre => toggleButton(genre))}
      </div>
     </div>
  )
}

export default Books