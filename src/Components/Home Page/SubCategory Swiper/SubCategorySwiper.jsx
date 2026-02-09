import React, { useContext, useEffect, useState } from "react";
import classes from "./SubCategorySwiper.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import placeholder from '../../../assets/subcategoryplaceholder.png';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";

import { useDispatch, useSelector } from "react-redux";
import { Navigation, Pagination } from "swiper/modules";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { resetSearchData } from "../../Common/redux/productSlice";

const SubCategorySwiper = (categoryData) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency );
  const compareData = useSelector((state) => state.products.compare);
  const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategoryRoute, setSelectedCategoryRoute] = useState('');
  const [initialSlide, setInitialSlide] = useState(0);

  // If there is no selected category (null or 'null') show the parent categories list
  const categoriesToShow = (selectedCategoryId === null || selectedCategoryId === 'null')
    ? authCtx?.articleFamilleParents
    : authCtx?.articleFamille;

  useEffect(() => {
    const selectedCategoryId = localStorage.getItem('route');
    setSelectedCategoryRoute(selectedCategoryId ? selectedCategoryId : '/');
    
    // Set the initialSlide index based on localStorage route value
    if (selectedCategoryId && authCtx.articleFamilleParents) {
      const selectedIndex = authCtx.articleFamilleParents?.findIndex(item => item.route === selectedCategoryId);
      setInitialSlide(selectedIndex !== -1 ? selectedIndex : 0);
    }
  }, [authCtx.articleFamilleParents]);

  const handleCategoryClick = ( id) => {
    dispatch(resetSearchData()); 
    localStorage.removeItem("subCategories");
    localStorage.removeItem("parentCategories");
    localStorage.removeItem("publishers");
    localStorage.removeItem("categories");
    localStorage.removeItem("collections");
    
    // Check if selectedCategoryId is null or 'null'
    if (selectedCategoryId === null || selectedCategoryId === 'null') {
      // Store in parentCategories
      const parentCategories = JSON.parse(localStorage.getItem("parentCategories")) || [];
      if (!parentCategories.includes(id)) {
        parentCategories.push(id);
        localStorage.setItem("parentCategories", JSON.stringify(parentCategories));
      }
    } else {
      // Store in subCategories
      const subCategories = JSON.parse(localStorage.getItem("subCategories")) || [];
      if (!subCategories.includes(id)) {
        subCategories.push(id);
        localStorage.setItem("subCategories", JSON.stringify(subCategories));
      }
    }
    navigate("/products");
  };

  return (
    <>
      <div className={classes.bigContainer} style={{ position: "relative" }}>
        <div id="best_sellers" style={{ position: "absolute", top: "80%" }}/>
        {!categoriesToShow || categoriesToShow.length === 0 ? (
          <div className={classes.nodata}>
          </div>
        ) : (
          <div className={classes.swiper}>
            <Swiper
              spaceBetween={20}
              effect={"fade"}
              initialSlide={initialSlide}
              navigation={{
                nextEl: `.${classes.navButton_next}`,
                prevEl: `.${classes.navButton_prev}`,
              }}
              modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                651: {
                  slidesPerView: 4,
                },
                951: {
                  slidesPerView: 5,
                },
              }}
            >
              {categoriesToShow.map((props) => (
                <SwiperSlide key={props.id} className={classes.swiperslide}
              onClick={() => { handleCategoryClick(props.id) }}>
                <div
                  className={classes.card_container}
                >
                  <div className={classes.card_img}>
                      <img
                        src={props.dark_image ? props.dark_image : placeholder}
                        alt={props?.nom || ''}
                      />
                    </div>
                  <div className={classes.bookTitle} >
                    <h3>{props?.type_nom || props?.nom}</h3>
                  </div>
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

export default SubCategorySwiper;
