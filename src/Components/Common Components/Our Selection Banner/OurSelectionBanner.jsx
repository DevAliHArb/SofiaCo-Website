import React, { useEffect, useState } from 'react'
import classes from './OurSelectionBanner.module.css'
import img from '../../../assets/ouselectionbanner.png'
import data from '../../../Data.json'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const OurSelectionBanner = () => {
  const navigate = useNavigate()
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const [webNewsData, setwebNewsData] = useState({});

  
  const fetchWebNewsData = async () => {
    try {
      const response = await axios.get('https://api.leonardo-service.com/api/bookshop/website-sections?ecom_type=sofiaco&section_id=common-hero');
      setwebNewsData(response.data.data[0])
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
useEffect(() => {
  fetchWebNewsData();
}, []);
  return (
    <div className={classes.banner}>
      <div className={classes.content}>
        <div className={classes.img_con}>
          <img src={webNewsData?.image1} alt='banner' />
        </div>
        <div className={classes.data}>
          <h1>{language === 'eng' ? webNewsData?.title_en : webNewsData?.title_fr }</h1>
          <p>{language === 'eng' ? webNewsData?.subtitle_en : webNewsData?.subtitle_fr }</p>
          <button onClick={()=>navigate(`/books`)} className={classes.buttoncart}>{data.OurSelectionBanner.button[language]}</button>
        </div>
      </div>
    </div>
  )
}

export default OurSelectionBanner