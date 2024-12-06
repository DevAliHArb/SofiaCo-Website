import React, { useContext, useEffect, useState } from 'react';
import classes from './AlsoSee.module.css';
import data from '../../../Data.json';
import { useDispatch, useSelector } from 'react-redux';
import nodata from '../../../assets/nobookfound.svg';
import img from "../../../assets/bookPlaceholder.png";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Common/authContext';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IoMdArrowBack } from "react-icons/io";
import { addSelectedBook } from '../../Common/redux/productSlice';
import { IoCartOutline } from "react-icons/io5";
import { stripHtmlTags, truncateText } from '../TextUtils';

const AlsoSee = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );

  const favoriteData = useSelector((state) => state.products.favorites);
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // State to track active slide index

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API_IMAGE}/articles?ecom_type=sofiaco&alsosee`
        // `${import.meta.env.VITE_TESTING_API_IMAGE}/articles?ecom_type=sofiaco`
      );
      // console.log(response.data.data);
      setArticles(response.data.data);
      setActiveIndex(0);
    } catch (error) {
      // console.error("Error fetching articles:", error);
      // toast.error("Failed to fetch articles.");
    }
  };

  return (
    <div className={classes.big_container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <h1>{data.AlsoSee?.title[language]}</h1>
          {/* <p>{data.AlsoSee?.description[language]}</p> */}
        </div>

        {articles?.length === 0 ? (
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>
              No Books <br />
              were found!
            </h1>
          </div>
        ) : (
          <div className={classes.swiper}>
            <Swiper
              effect={"fade"}
              navigation={{
                nextEl: `.${classes.nav_next}`,
                prevEl: `.${classes.nav_prev}`,
              }}
              modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 5,
                },
                651: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                951: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active slide index on change
            >
              {articles.filter(
                (props) => props.designation.trim() !== ""
              ).map((props, index) => (
                <SwiperSlide  className={classes.swiperslide} key={props.id}>
                  <div
                    className={classes.card_container}
                    onClick={(event) => {
                      authCtx.setbookDetails(props);
                      event.stopPropagation();
                      dispatch(addSelectedBook(props))
                      navigate(`/bookdetails/${props.id}`);
                    }}
                  >
                    <div className={classes.card_img}>
                     {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
                      {props.articleimage[0] ? (
                        <img
                          src={`${props.articleimage[0]?.link}`}
                          alt=""
                          width="100%"
                          height="100%"
                          className={classes.img}
                        />
                      ) : (
                        <img
                          src={img}
                          className={classes.img}
                          alt=""
                          width="100%"
                          height="100%"
                        />
                      )}
                      <div className={classes.favoriteIcon}>
                        {favoriteData?.some(
                          (book) => book._favid === props.id
                        ) ? (
                          <FavoriteIcon
                            className={classes.fav}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.deleteFavorite(props.id);
                            }}
                            fontSize="inherit"
                          />
                        ) : (
                          <FavoriteBorderIcon
                            className={classes.nonfav}
                            fontSize="inherit"
                            onClick={(event) =>{
                              event.stopPropagation();
                              authCtx.addToFavorite(props) ;
                            }}
                          />
                        )}
                      </div>
                      <div className={classes.cartIcon}>
                          <IoCartOutline
                            className={classes.fav}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToCart({props: props}); 
                            }}
                            fontSize="inherit"
                          />
                      </div>
                    </div>
                    
                    <div className={classes.bookTitle} >
                      <p >{props.designation.length > 15 ? props.designation.slice(0,15) + '...' : props.designation}</p>
                      <p style={{ height:'1em', fontSize:'small', fontWeight: 400 }}>{props.dc_auteur.length > 15 ? props.dc_auteur.slice(0,15) + '...' : props.dc_auteur}</p>
                      <p style={{ height:'1.5em', fontSize:'small', fontWeight: 400 }}>{truncateText(stripHtmlTags(props.descriptif), 30)}</p>
                      <span style={{ display: "flex", flexDirection: "row", margin:'0 auto', columnGap:'0.5em' }}>
                        <p
                          style={{ textAlign: "center", padding: "0 ",color: "var(--primary-color)",fontWeight:700,textShadow:'0px 0px 3px rgba(255,255,255,1)' }}
                        >
                          {currency === "eur"
                            ? `€${
                                props.discount > 0
                                  ? (
                                      props._prix_public_ttc -
                                      props._prix_public_ttc * (props.discount / 100)
                                    ).toFixed(2)
                                  : Number(props._prix_public_ttc).toFixed(2)
                              }`
                            : `$${
                                props.discount > 0
                                  ? (
                                      (props._prix_public_ttc -
                                        props._prix_public_ttc *
                                          (props.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                      props._prix_public_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}{" "}
                        </p>
                        {props.discount > 0 && (
                          <p
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "line-through",
                              fontSize: "small",
                              margin:"auto 0"
                            }}
                          >
                            {currency === "eur"
                              ? `€ ${Number(props._prix_public_ttc).toFixed(2)} `
                              : `$ ${(
                                  props._prix_public_ttc * authCtx.currencyRate
                                ).toFixed(2)} `}
                          </p>
                        )}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      <div className={`${classes.nav_prev}`}>
        <IoMdArrowBack className={classes.nav_icon}/>
      </div>
      <div className={`${classes.nav_nb}`}>
        {activeIndex + 1}
      </div>
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack className={classes.nav_icon} style={{transform:'rotate(180deg)'}}/>
      </div>
    </div>
  );
};

export default AlsoSee;
