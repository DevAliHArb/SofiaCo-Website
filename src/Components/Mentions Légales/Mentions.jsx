import React, { useEffect, useState } from "react";
import classes from "./Mentions.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import OurSelectionBanner from '../Common Components/Our Selection Banner/OurSelectionBanner'
import abs from '../../assets/collab-abs.png'

const Mentions = () => {
  
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [policyData, setpolicyData] = useState({});
  const [heroData, setHeroData] = useState({});

  
    const fetchHero = async () => {
      try {
        const response = await axios.get('https://api.leonardo-service.com/api/bookshop/website-sections?ecom_type=sofiaco&section_id=policies-hero');
        setHeroData(response.data.data[0])
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
  useEffect(() => {
    fetchHero();
  }, []);
  const fetchPolicy = async () => {
    try {
      const response = await axios.get('https://api.leonardo-service.com/api/bookshop/policy_conditions?ecom_type=sofiaco');
      console.log('Response data:', response.data);
      setpolicyData(response.data.data[0])
    } catch (error) {
      console.error('Error fetching metaverse:', error);
    }
  };

useEffect(() => {
  fetchPolicy();
}, []);


  return (
    <div className={classes.mentions}>
      {/* <img src={abs} alt="" className={classes.img_abs}/> */}
      <OurSelectionBanner props={heroData}/>
      <div className={classes.content}>
       <div className={classes.top}>
        <h3>{language === 'eng' ? policyData?.title1_en : policyData?.title1_fr}</h3>
        <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? policyData?.description1_en : policyData?.description1_fr }}></p>
      </div>
      <div className={classes.middle}>
        <h3>{language === 'eng' ? policyData?.title2_en : policyData?.title2_fr}</h3>
        <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? policyData?.description2_en : policyData?.description2_fr }}></p>
      </div> 
      <div className={classes.middle}>
        <h3>{language === 'eng' ? policyData?.title3_en : policyData?.title3_fr}</h3>
        <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? policyData?.description3_en : policyData?.description3_fr }}></p>
      </div> 
      {/* <div className={classes.bottom}>
        <h3>{language === 'eng' ? policyData?.title4_en : policyData?.title4_fr}</h3>
        <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? policyData?.description4_en : policyData?.description4_fr }}></p>
      </div> */}
       </div>
    </div>
  );
};

export default Mentions;
