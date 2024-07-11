import React from 'react'
import BooksView from './Books View/BooksView'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import Deals from '../Home Page/Deals/Deals'

const BooksPage = ({carttoggle}) => {
  return (
    <div style={{background:'#fff', paddingTop:'2em'}}>
      <OurSelectionBanner />
      <BooksView carttoggle={carttoggle}/>
      {/* <div style={{marginTop:'-4em'}}> */}
      <Deals />
      {/* </div> */}
    </div>
  )
}

export default BooksPage