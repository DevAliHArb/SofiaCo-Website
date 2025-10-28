import React, { useContext, useEffect, useState } from "react";
import classes from "./SocialMedia.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import nodata from "../../../assets/nobookfound.svg";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import  SocialImg from "../../../assets/SocialImg.png";
import { Navigation } from "swiper/modules";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const SocialMedia = (categoryData) => {
    const authCtx = useContext(AuthContext);
    const language = useSelector((state) => state.products.selectedLanguage[0].Language);
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  
  const fetchInstagramPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/social-posts?ecom_type=hanoot`
      );
      const data = response.data.sort((a, b) => b.id - a.id);
      
      console.log(data);
      setInstagramPosts(data);
    } catch (error) {
      // //console.error('Error fetching Instagram posts:', error);
    }
  };

  
useEffect(() => {
    fetchInstagramPost();
  }, []);
  useEffect(() => {
    // Function to check localStorage and update state
    const checkCategoryId = () => {
      const selected_category_id = localStorage.getItem('category_id');
      setSelectedCategoryId(selected_category_id ? Number(selected_category_id) : 0);
    };

    // Initial check
    checkCategoryId();

    // Set up an interval to check localStorage periodically
    const intervalId = setInterval(checkCategoryId, 1000); // Check every second

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
 // Filter subCategories based on selectedCategoryId and item visibility
useEffect(() => {
  const filtered = instagramPosts;
  setFilteredData(filtered);
}, [selectedCategoryId, instagramPosts]);

  const handleClick = (link) => {
    
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <>
      <div className={classes.bigContainer} style={{ position: "relative" }}>
        <div id="best_sellers" style={{ position: "absolute", top: "80%" }}/>
        <div className={classes.header} style={{display:'flex', flexDirection:'column', justifyContent:'center', marginBottom:'2em'}}>
          <div className={classes.title} style={{margin:'auto'}}>
            <h1 style={{textAlign:'center'}} onClick={fetchInstagramPost}>{language === "eng" ? "As Seen on Social Media" : "Vu Sur Les Médias Sociaux"}</h1>
          </div>
        </div>
        {filteredData?.length === 0 ? (
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>{language === 'eng' ? "No Videos" : "Aucun vidéo" } <br/>{language === 'eng' ? "were found!" : "n'a été trouvé !" }</h1>
          </div>
        ) : (
          <div className={classes.swiper}>
            <Swiper
              effect={"fade"}
              navigation={{
                nextEl: `.${classes.navButton_next}`,
                prevEl: `.${classes.navButton_prev}`,
              }}
              // modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                651: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                951: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
              }}
            >
              {filteredData?.map((props, index) => (
                <SwiperSlide key={props.id} className={classes.swiperslide}>
                    
                    <div className={classes.card_img} onClick={() => handleClick(props?.link)}>
                      {/* Default Image */}
                      <img
                        src={props?.image ? props?.image : SocialImg }
                        alt=""
                        className={classes.default}
                      />
                    </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        
      <div className={classes.customNavigation}>
                <button className={classes.navButton_prev}>
                  <KeyboardArrowLeftIcon  className={classes.nav_icon}/>
                </button>
                <button className={classes.navButton_next}>
                  <KeyboardArrowLeftIcon style={{ transform: 'rotate(180deg)' }}  className={classes.nav_icon}/>
                </button>
              </div>
      </div>
      
    </>
  );
};

export default SocialMedia;
