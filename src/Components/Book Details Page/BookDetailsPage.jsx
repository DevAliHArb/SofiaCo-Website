import React, { useEffect, useState } from 'react'
import classes from './BookDetailsPage.module.css'
import BookDetails from './Book Details/BookDetails'
import AlsoSee from '../Common Components/Also See/AlsoSee'
import Deals from '../Home Page/Deals/Deals'
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import Reviews from './View Tab and review/Reviews'
import ViewTab from './View Tab and review/ViewTab'
import abs from '../../assets/collab-abs.png'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addSelectedBook } from '../Common/redux/productSlice'
import { useParams } from 'react-router-dom'

const BookDetailsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  
  const [heroData, setHeroData] = useState({});

  const fetchBook = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/articles?id=${id}&ecom_type=sofiaco`);
      const book = response.data;
      dispatch(addSelectedBook(book))
      
    } catch (error) {
      // console.error('Error fetching the book:', error);
    }
  };
  
    const fetchHero = async () => {
      try {
        const response = await axios.get('https://api.leonardo-service.com/api/bookshop/website-sections?ecom_type=sofiaco&section_id=product-details-hero');
        setHeroData(response.data.data[0])
      } catch (error) {
        // console.error('Error fetching services:', error);
      }
    };
  useEffect(() => {
    fetchHero();
    fetchBook()
  }, []);
  return (
    <div className={classes.bookDetailsPageContaimer}>
      <img src={abs} alt="" className={classes.img_abs}/>
      <OurSelectionBanner  props={heroData}/>
      <BookDetails/>
        <ViewTab />
        <AlsoSee />
      <div className={classes.deals_con}>
      <Deals />
      </div>
    </div>
  )
}

export default BookDetailsPage