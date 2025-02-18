import React from 'react'
import FeaturedBooks from './Featured Books/FeaturedBooks'
import Hero from './Hero Section/Hero'
import classes from './HomePage.module.css'
import OurSelection from './Our Selection/OurSelection'
import NewReleases from './New Releases/NewReleases'
import Deals from './Deals/Deals'
import Quote from './Quote Section/Quote'
import Services from './Services Section/Services'
import NewsLetterSection from './NewsLetter/NewsLetterSection'

const HomePage = () => {
  return (
    <div className={classes.home}>
        <Hero />
        <FeaturedBooks />
        <OurSelection />
        <Deals />
        <NewReleases />
        <Quote />
        <NewsLetterSection/>
        <Services />
    </div>
  )
}

export default HomePage