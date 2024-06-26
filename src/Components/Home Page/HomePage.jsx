import React from 'react'
import FeaturedBooks from './Featured Books/FeaturedBooks'
import Hero from './Hero Section/Hero'
import classes from './HomePage.module.css'
import OurSelection from './Our Selection/OurSelection'
import NewReleases from './New Releases/NewReleases'

const HomePage = () => {
  return (
    <div className={classes.home}>
        <Hero />
        <FeaturedBooks />
        <OurSelection />
        <NewReleases />
    </div>
  )
}

export default HomePage