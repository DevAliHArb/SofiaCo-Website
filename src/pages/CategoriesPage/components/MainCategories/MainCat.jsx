import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import classes from './MainCat.module.css';
import { IoMdArrowBack } from 'react-icons/io';
import { FreeMode, Navigation } from 'swiper/modules';
import { useNavigate } from '@hooks/useNavigate';
import { addSelectedCategory, resetSearchData } from '../../../../Components/Common/redux/productSlice';
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

const MainCat = ({ categoryData }) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCategoryRoute, setSelectedCategoryRoute] = useState('');
  const [initialSlide, setInitialSlide] = useState(0);
  const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  
  const categoriesToShow = authCtx?.articleFamille?.filter(
    (item) => Number(item.b_usr_parentcategorie_id) === Number(categoryData?.id)
  );

  useEffect(() => {
    const selectedCategoryId = localStorage.getItem('route');
    setSelectedCategoryRoute(selectedCategoryId ? selectedCategoryId : '/main');
    
    if (selectedCategoryId) {
      const selectedIndex = authCtx.articleFamilleParents?.findIndex(item => item.route === selectedCategoryId);
      setInitialSlide(selectedIndex !== -1 ? selectedIndex + 1 : 0);
    }
  }, []);

  const handleCategoryClick = (id, name) => {
    dispatch(resetSearchData());
    localStorage.removeItem("subCategories");
    localStorage.removeItem("parentCategories");
    localStorage.removeItem("publishers");
    localStorage.removeItem("categories");
    localStorage.removeItem("collections");
    
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || [];
    if (!subCategories.includes(id)) {
      subCategories.push(id);
      localStorage.setItem("subCategories", JSON.stringify(subCategories));
    }
    
    const slugCat = slugify(categoryData?.type_nom || categoryData?.nom);
    const slug = slugify(name);
    navigate(`/main/cp/${slugCat}/${slug}/${id}`);
  };

  if (!categoriesToShow || categoriesToShow.length === 0) {
    return null;
  }

  return (
    <div className={classes.swiper_con}>
      <div className={classes.header}>
        <div className={classes.headtitle} style={{ margin: "auto" }}>
          <h1 style={{ textAlign: "center" }}>
            {categoryData.sub_cat_section_title || (language === 'eng' ? "Sub Categories" : "Sous-Catégories")}
          </h1>
        </div>
      </div>
      <Swiper
        spaceBetween={20}
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
            onClick={() => handleCategoryClick(item.id, item.type_nom || item.nom)}
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
                  {(item?.type_nom || item?.nom)?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <h3>{item?.type_nom || item?.nom}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainCat;
