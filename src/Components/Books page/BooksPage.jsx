import React from 'react'
import BooksView from './Books View/BooksView'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import Deals from '../Home Page/Deals/Deals'
import classes from './BooksPage.module.css'

const BooksPage = ({carttoggle}) => {
  return (
    <div className={classes.container}>
      <OurSelectionBanner />
      <BooksView carttoggle={carttoggle}/>
      {/* <div style={{marginTop:'-4em'}}> */}
      <Deals />
      {/* </div> */}
    </div>
  )
}

export default BooksPage