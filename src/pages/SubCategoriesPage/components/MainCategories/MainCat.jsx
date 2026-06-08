import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import classes from './MainCat.module.css';
import { FreeMode, Navigation } from 'swiper/modules';
import { useNavigate } from '@hooks/useNavigate';
import { resetSearchData } from '../../../../Components/Common/redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../../Components/Common/authContext';

// Helper function to slugify and sanitize text
const slugify = (text, placeholder = 'product') => {
  if (!text || text.trim() === '') return placeholder;
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const MainCat = ({ categoryData, subCategoryData }) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoriesToShow = authCtx?.categories?.filter(
    (item) => Number(item.b_usr_articlecategorie_id) === Number(subCategoryData?.id)
  );

  const handleCategoryClick = (id, name) => {
    dispatch(resetSearchData());
    localStorage.removeItem("subCategories");
    localStorage.removeItem("parentCategories");
    localStorage.removeItem("publishers");
    localStorage.removeItem("categories");
    localStorage.removeItem("collections");
    
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    if (!categories.includes(id)) {
      categories.push(id);
      localStorage.setItem("categories", JSON.stringify(categories));
    }
    
    const slugParent = slugify(categoryData?.nom);
    const slugSub = slugify(subCategoryData?.type_nom || subCategoryData?.nom);
    const slug = slugify(name);
    navigate(`/main/cp/${slugParent}/${slugSub}/${slug}/${id}`);
  };

  if (!categoriesToShow || categoriesToShow.length === 0) {
    return null;
  }

  return (
    <div className={classes.swiper_con}>
      <div className={classes.header}>
        <div className={classes.headtitle} style={{ margin: "auto" }}>
          <h1 style={{ textAlign: "center" }}>
            {subCategoryData?.sub_cat_section_title || (language === 'eng' ? "Categories" : "Catégories")}
          </h1>
        </div>
      </div>
      <Swiper
        spaceBetween={20}
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
            slidesPerView: 5,
          },
          1200: {
            slidesPerView: 7,
          },
        }}
        className={classes.swiper}
      >
        {categoriesToShow.map((item, index) => (
          <SwiperSlide
            className={classes.swiper_slide}
            onClick={() => handleCategoryClick(item.id, item.nom)}
            key={index}
          >
            <div className={classes.iconCont}>
              {item?.dark_image ? (
                <img
                  src={item.dark_image}
                  alt={item?.nom || ''}
                  className={classes.icon}
                />
              ) : (
                <div className={classes.iconPlaceholder}>
                  {item?.nom?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <h3>{item?.nom}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainCat;
