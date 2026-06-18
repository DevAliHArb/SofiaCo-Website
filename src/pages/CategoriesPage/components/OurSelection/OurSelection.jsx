import React, { useContext, useEffect, useState } from "react";
import classes from "./OurSelection.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from '@hooks/useNavigate';
import AuthContext from "../../../../Components/Common/authContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addSelectedBook } from "../../../../Components/Common/redux/productSlice";
import LibraryProductCard from "../LibraryProductCard/LibraryProductCard";
import nodata from "../../../../assets/nobookfound.svg";

const OurSelection = ({ catId, subcatId, subsubcatId }) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&bestsellers`
      );
      const fetchedArticles = response.data.data;
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (subsubcatId && article.b_usr_articlesouscategorie_id != null) {
      return Number(article.b_usr_articlesouscategorie_id) === Number(subsubcatId);
    }
    if (subcatId && article.b_usr_articlecategorie_id != null) {
      return Number(article.b_usr_articlecategorie_id) === Number(subcatId);
    }
    if (catId && article.b_usr_parentcategorie_id != null) {
      return Number(article.b_usr_parentcategorie_id) === Number(catId);
    }
    return true;
  });

  if (filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className={classes.bigContainer}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h2>{language === 'eng' ? "RECOMMENDATIONS" : "Nos meilleures ventes"}</h2>
        </div>
      </div>
      <div className={classes.swiper_con}>
        {filteredArticles.length === 0 ? (
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h2>
              {language === 'eng' ? "No Products were found!" : "Aucun article n'a été trouvé !"}
            </h2>
          </div>
        ) : (
          <div className={classes.swiper}>
            <Swiper
              initialSlide={activeIndex}
              centeredSlides={true}
              spaceBetween={20}
              navigation={{
                nextEl: `.${classes.nav_next}`,
                prevEl: `.${classes.nav_prev}`,
              }}
              modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                651: {
                  slidesPerView: 3,
                },
                951: {
                  slidesPerView: 5,
                },
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {filteredArticles.slice(0, 15).map((product, index) => (
                <SwiperSlide className={classes.swiperslide} key={product.id}>
                  <LibraryProductCard
                    product={product}
                    isActive={index === activeIndex}
                    index={index}
                    activeIndex={activeIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurSelection;
