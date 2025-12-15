import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import classes from './HomeBanner.module.css'
import img from '../../../assets/homeherobg.png'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination, Autoplay } from 'swiper/modules';
import './styles.css'

const HomeBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [data, setData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const openInNewTab = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  const fetchHero = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/website-sections?ecom_type=sofiaco&section_id=home-hero`);
      setBanners(response.data.data[0]?.hero_sections)
      setData(response.data.data[0]?.hero_sections?.[0] || {})
    } catch (error) {
      // console.error('Error fetching services:', error);
    }
  };
  useEffect(() => {
    fetchHero();
  }, []);

  useEffect(() => {
    if (banners?.length > 0) {
      // Always set data on banners load and activeIndex change
      setData(banners[activeIndex] || banners[0] || {});
    }
  }, [activeIndex, banners]);

  // Show active banner's text/data, images in Swiper
  return (
    <div className='banner'>
      <div className={classes.content}>
        <div className={classes.overlay}></div>
        <div className={classes.data}>
          <h1>{language === 'eng' ? data?.title_en : data?.title_fr}</h1>
          <p style={{ width: '100%' }}>{language === 'eng' ? data?.subtitle_en : data?.subtitle_fr}</p>
          <button onClick={() => openInNewTab(data?.button_url)} className={classes.buttoncart}>
            {language === 'eng' ? data?.button_label_en : data?.button_label_fr}
          </button>
        </div>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          style={{ width: '100%', height: '100%' }}
          className={classes.img_con}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
        >
          {(banners || []).map((props, idx) => (
            <SwiperSlide key={idx}>
              <img src={props?.image1 ? props?.image1 : img} alt='banner' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HomeBanner