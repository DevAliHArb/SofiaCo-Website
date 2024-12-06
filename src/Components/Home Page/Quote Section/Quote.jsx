import React, { useEffect, useState } from "react";
import box from "../../../assets/quote.svg";
import classes from "./Quote.module.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from "../../../Data.json";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoMdArrowBack } from "react-icons/io";

const Quote = () => {
  const navigate = useNavigate()
  const [quote,setQuote] = useState('')
  const [image,setImage] = useState(null)
  const [author,setAuthor] = useState('')
  const [thequote,setTheQuote] = useState([])
  const [constantValue, setconstantValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // State to track active slide index
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);

  
  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API_IMAGE}/quotes?ecom_type=sofiaco`);
      setTheQuote(response.data.data);
      setconstantValue(response.data.data[0]?.id)
    } catch (error) {
      // console.error('Error fetching articles:', error);
      error('Failed to fetch articles.');
    }
  };
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    setconstantValue(thequote[swiper.activeIndex].id);
  };

  
  useEffect(() => {
    thequote.forEach((item) => {
      if (item.id === constantValue) {
        setQuote(item.the_quote);
        setAuthor(item.author);
        setImage(item.image);
      }
    });
  }, [thequote, constantValue]);
  
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className={classes.quote_con}>
      <div className={classes.content}>
        
      <div className={classes.article}>
            <div className={classes.header}>
              <p dangerouslySetInnerHTML={{__html: data.HomePage.Quote.title[language]}}/>
            </div>
              <div className={classes.quote}>
                <div className={classes.quote_content}>
                <p style={{ fontSize: "calc(0.8rem + 0.5vw)" }}>
                  {quote}
                </p>
                <img src={box} alt="" className={classes.box1}/>
                <img src={box} alt="" className={classes.box2}/>
                </div>
                <p
                  style={{fontStyle:'italic', marginTop: "1em", fontSize: "calc(1rem + 0.4vw)",textAlign:'end',fontWeight:'500',color:'var(--secondary-color)', paddingRight:'5em' }}
                >
                  - {author}
                </p>
              </div>
          </div>
          <Swiper
              spaceBetween={20}
              effect={"fade"}
              navigation={{
                nextEl: `.${classes.nav_next}`,
                prevEl: `.${classes.nav_prev}`,
              }}
              modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                651: {
                  slidesPerView: 1,
                },
                951: {
                  slidesPerView: 1,
                },
              }}
              onSlideChange={handleSlideChange}
              className={classes.swiper}
            >
        {thequote.map((item, index)=>{
          return(
            <SwiperSlide className={classes.swiperslide} key={item.id}>
            <div className={classes.box_con} key={index}>
          <div className={classes.img_con}>
            <img src={`https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${item.image}`} alt=""/>
            
      
          </div>
          
        </div>
        </SwiperSlide>
          )
        })
        }
        </Swiper>
        <div className={`${classes.nav_prev}`}>
        <IoMdArrowBack className={classes.nav_icon} />
      </div>
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack
          className={classes.nav_icon}
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
      </div>
    </div>
  );
};

export default Quote;
