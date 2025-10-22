import React, { useContext, useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import classes from './MainCat.module.css';
import { IoMdArrowBack } from 'react-icons/io';

// import required modules
import { FreeMode, Navigation } from 'swiper/modules';
import AuthContext from '../../authContext';
import allcatw from "../../../../assets/icons/all-cat-w.svg";
import allcat from "../../../../assets/icons/all-cat.svg";
import { useNavigate } from 'react-router-dom';
import { addSelectedCategory } from '../../../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const MainCat = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCategoryRoute, setSelectedCategoryRoute] = useState('');
  const [initialSlide, setInitialSlide] = useState(0); // Initialize the state for initialSlide
    const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  
  useEffect(() => {
    const selectedCategoryId = localStorage.getItem('route');
    setSelectedCategoryRoute(selectedCategoryId ? selectedCategoryId : '/');
    
    // Set the initialSlide index based on localStorage route value
    if (selectedCategoryId) {
      const selectedIndex = authCtx.articleFamille?.findIndex(item => item.route === selectedCategoryId);
      console.log(selectedIndex);
      setInitialSlide(selectedIndex !== -1 ? selectedIndex + 1 : 0); // Adjust index to account for the 'All Categories' item
    }
  }, []);
  
  const handleCategoryClick = (route, id) => {
    localStorage.setItem('route', route);
    dispatch(addSelectedCategory(id === null ? null : String(id)))
    setSelectedCategoryRoute(route);
    // navigate(`${route}`)
  };
  
  return (
    <div className={classes.swiper_con}>
      <Swiper
        spaceBetween={20}
        effect="fade"
        initialSlide={initialSlide}
        navigation={{
          nextEl: `.${classes.navButton_next}`,
          prevEl: `.${classes.navButton_prev}`,
        }}
        modules={[Navigation]}
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          951: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 6,
          },
        }}
        className={classes.swiper}
      >
        {authCtx.articleFamille?.map((item, index) => {
          return (
            <SwiperSlide
              className={classes.swiper_slide}
              onClick={() => handleCategoryClick(item.route, item.id) & console.log('iouwhr',authCtx.articleFamille)}
              key={index}
            >
          <div className={classes.iconCont}
          style={{
            background: Number(selectedCategoryId) === Number(item?.id) ? '#E3BA72' : '#FFF4E1',
          }}>
              <img
                src={Number(selectedCategoryId) === Number(item?.id) ? allcatw : allcat}
                alt=""
                className={classes.icon}
              /></div>
              <p style={{ color:'#111' }}>
                {item?.type_nom} 
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <div className={classes.customNavigation}>
                <button className={classes.navButton_prev}>
                  <IoMdArrowBack  className={classes.nav_icon}/>
                </button>
                <button className={classes.navButton_next}>
                  <IoMdArrowBack style={{ transform: 'rotate(180deg)' }}  className={classes.nav_icon}/>
                </button>
              </div> */}
    </div>
  );
};

export default MainCat;
