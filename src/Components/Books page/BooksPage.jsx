import React from 'react'
import BooksView from './Books View/BooksView'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'

const BooksPage = ({carttoggle}) => {
  return (
    <div style={{background:'#fff'}}>
      <OurSelectionBanner />
      <BooksView carttoggle={carttoggle}/>
    </div>
  )
}

export default BooksPage