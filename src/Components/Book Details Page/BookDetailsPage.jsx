import React from 'react'
import classes from './BookDetailsPage.module.css'
import BookDetails from './Book Details/BookDetails'
import AlsoSee from '../Common Components/Also See/AlsoSee'
import Deals from '../Home Page/Deals/Deals'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import Reviews from './View Tab and review/Reviews'
import ViewTab from './View Tab and review/ViewTab'

const BookDetailsPage = () => {
  return (
    <div className={classes.bookDetailsPageContaimer}>
      <OurSelectionBanner />
      <BookDetails/>
        <ViewTab />
        <AlsoSee />
        <Deals />
    </div>
  )
}

export default BookDetailsPage