import React, { useEffect, useState } from "react";
import classes from "./About.module.css";
// import headpage from "../../assets/Librairie/Librairie.png";
import { TbHandClick } from "react-icons/tb";
import dealsBG from '../../assets/dealsBG.png';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import data from "../../Data.json";

import axios from 'axios';
import { useSelector } from "react-redux";
import Services from "../Home Page/Services Section/Services";

const About = () => {
  
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [aboutData, setaboutData] = useState({});
  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/about?ecom_type=sofiaco`);
      // console.log('Response data:', response.data);
      setaboutData(response.data.data[0])
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    }
  };
useEffect(() => {
  fetchAbout();
}, []);

  return (
    <>
    <div className={classes.home_container} style={{position:"relative"}}>
        <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.headTitle}>
            <h1 onClick={()=>console.log(aboutData)}> SOFIACO</h1>
            <h2 onClick={()=>console.log(aboutData)}> {language === 'eng' ? aboutData.title_eng : aboutData.title_fr}</h2>
          </div>
          <div className={classes.border}></div>
        </div>
            <div className={classes.paragraph}>
            <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? aboutData.description1_eng : aboutData.description1_fr }} />
            <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? aboutData.description2_eng : aboutData.description2_fr }} />
            </div>
          <div className={classes.img_con}>
            <img src={aboutData.main_image ? `${aboutData.main_image}` : 'headpage'} alt="" />
          </div>
            <p dangerouslySetInnerHTML={{ __html: language === 'eng' ? aboutData.description3_eng : aboutData.description3_fr }} className={classes.paragraphBottom}/>
                <button className={classes.pdfbottom} onClick={()=>{ const link = document.createElement('a');
                                                                  link.href = aboutData.pdf_brochure;
                                                                  link.download = 'filename.pdf'; 
                                                                  document.body.appendChild(link);
                                                                  link.click();
                                                                  document.body.removeChild(link)}}>
                    {language === 'eng' ? 'Download Our Brochure': 'Téléchargez Notre Brochure'}                                
                 </button>
            <div className={classes.LocationContainer}>
                  <h1 className={classes.LocationContainerh1}>{data.AboutPage.LocationSection.title[language]}</h1>
                  <h2 className={classes.LocationContainerh2}>{data.AboutPage.LocationSection.subtitle[language]}</h2>
                  <div className={classes.map_con}>
                    <iframe
                      title="Google Map"
                      src={aboutData.location}
                      // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.473343284526!2d2.376251875412288!3d48.868252400013816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66de581ba72e7%3A0x3231c49eba9cdb55!2sLibrairie%20%26%20Editions%20Albouraq!5e0!3m2!1sen!2slb!4v1707835753098!5m2!1sen!2slb"
                      style={{
                        border: "none",
                        width: "100%",
                        height: "100%",
                        borderRadius: "1em",
                      }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
          </div>
      </div>
          <div className={classes.big_container}>
          <h1 className={classes.LocationContainerh1} style={{marginTop:"0"}}>{data.AboutPage.TrackersSection.title[language]}</h1>
                  <h2 className={classes.LocationContainerh2}>{data.AboutPage.TrackersSection.subtitle[language]}</h2>
          <div className={classes.details_box}>
            <div className={classes.detail_item}>
              
                <h2>{aboutData.tracker1_count}</h2>
                <p>{language == 'eng' ? aboutData.tracker1_eng : aboutData.tracker1_fr}
              </p>
            </div>
            <div className={classes.detail_item}>
              
              <h2>{aboutData.tracker2_count}</h2>
               <p> {language == 'eng' ? aboutData.tracker2_eng : aboutData.tracker2_fr}
              </p>
            </div>
            <div className={classes.detail_item}>
              
              <h2>{aboutData.tracker3_count}</h2>
              <p>  {language == 'eng' ? aboutData.tracker3_eng : aboutData.tracker3_fr}
              </p>
            </div>
          </div>
          <div className={classes.dealsBG}><img src={dealsBG} alt="" style={{width:"auto",height:"100%",zIndex:"-1",marginRight:"auto"}}/></div>
          </div>
    </div>
          <Services/>
          </>
  );
};

export default About;
