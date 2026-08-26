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
import { useNavigate } from "@hooks/useNavigate";
import { addSelectedCategory, resetSearchData } from '../../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';

// Helper function to slugify and sanitize text
const slugify = (text, placeholder = 'product') => {
  if (!text || text.trim() === '') return placeholder;
  const slug = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || placeholder;
};

const MainCat = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCategoryRoute, setSelectedCategoryRoute] = useState('');
  const [initialSlide, setInitialSlide] = useState(0); // Initialize the state for initialSlide
  const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  
  useEffect(() => {
    const selectedCategoryId = localStorage.getItem('route');
    setSelectedCategoryRoute(selectedCategoryId ? selectedCategoryId : '/main');
    
    // Set the initialSlide index based on localStorage route value
    if (selectedCategoryId) {
      const selectedIndex = authCtx.articleFamilleParents?.findIndex(item => item.route === selectedCategoryId);
      setInitialSlide(selectedIndex !== -1 ? selectedIndex + 1 : 0); // Adjust index to account for the 'All Categories' item
    }
  }, []);
  
  const handleCategoryClick = (id, name) => {
    dispatch(resetSearchData());
    localStorage.removeItem("stock");
    localStorage.removeItem("subCategories");
    localStorage.removeItem("subSubCategories");
    localStorage.removeItem("parentCategories");
    localStorage.removeItem("publishers");
    localStorage.removeItem("categories");
    localStorage.removeItem("collections");
    localStorage.removeItem("multiproductids");
    localStorage.removeItem("min_price");
    localStorage.removeItem("max_price");

    // Add parentcategorie_id to parentCategories in localStorage
    const parentCategories = JSON.parse(localStorage.getItem("parentCategories")) || [];
    if (!parentCategories.includes(id)) {
      parentCategories.push(id);
      localStorage.setItem("parentCategories", JSON.stringify(parentCategories));
    }
    
    dispatch(addSelectedCategory(id === null ? null : String(id)));
    const slug = slugify(name);
    navigate(`/main/cp/${slug}/${id}`);
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
        {authCtx.articleFamilleParents?.map((item, index) => {
          return (
            <SwiperSlide
              className={classes.swiper_slide}
              onClick={() => handleCategoryClick(item.id, item.nom)}
              key={index}
            >
              <div className={classes.iconCont}
                style={{
                  background: Number(selectedCategoryId) === Number(item?.id) ? '#E3BA72' : '#FFF4E1',
                }}>
                <img
                  src={Number(selectedCategoryId) === Number(item?.id) ? (item?.light_image || allcatw) : (item?.dark_image || allcat)}
                  alt={item?.nom || ''}
                  className={classes.icon}
                />
              </div>
              <p style={{ color:'#111' }}>
                {item?.nom} 
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainCat;
