import React, { useEffect, useState } from 'react'
import BooksView from './Books View/BooksView'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import Deals from '../Home Page/Deals/Deals'
import classes from './BooksPage.module.css'
import axios from 'axios'

const BooksPage = ({carttoggle}) => {
  
  const [heroData, setHeroData] = useState({});

  
    const fetchHero = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/api/bookshop/website-sections?ecom_type=sofiaco&section_id=products-hero`);
        setHeroData(response.data.data[0])
      } catch (error) {
        // console.error('Error fetching services:', error);
      }
    };
  useEffect(() => {
    fetchHero();
  }, []);
  return (
    <div className={classes.container}>
      <OurSelectionBanner props={heroData} />
      <BooksView carttoggle={carttoggle}/>
      {/* <div style={{marginTop:'-4em'}}> */}
      <Deals />
      {/* </div> */}
    </div>
  )
}

export default BooksPage