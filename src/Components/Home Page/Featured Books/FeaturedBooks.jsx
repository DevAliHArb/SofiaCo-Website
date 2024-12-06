import React, { useContext, useEffect, useState } from 'react';
import classes from './FeaturedBooks.module.css';
import data from '../../../Data.json';
import { useDispatch, useSelector } from 'react-redux';
import nodata from '../../../assets/nobookfound.svg';
import img from "../../../assets/bookPlaceholder.png";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Common/authContext';
import { Scale } from '@mui/icons-material';
import { addSelectedBook } from '../../Common/redux/productSlice';
import { stripHtmlTags, truncateText } from '../../Common/TextUtils';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Rating } from '@mui/material';

const FeaturedBooks = () => {
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
        `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&favorites`
      );
      // console.log(response.data.data);
      setArticles(response.data.data);
      setActiveIndex(Math.floor(response.data.data.length / 2));
    } catch (error) {
      // console.error("Error fetching articles:", error);
      // toast.error("Failed to fetch articles.");
    }
  };

  return (
    <div className={classes.big_container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <h1>{data.HomePage.FeaturedBooks.title[language]}</h1>
          <p>{data.HomePage.FeaturedBooks.description[language]}</p>
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
                initialSlide={activeIndex}
              centeredSlides={true}
              effect={"fade"}
              style={{
                padding: "0 1em",
              }}
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
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active slide index on change
            >
              {articles.sort((a,b) => b.average_rate - a.average_rate).filter(
                (props) => props.designation.trim() !== ""
              ).map((props, index) => (
                <SwiperSlide  className={classes.swiperslide} key={props.id}>
                  <div
                    className={classes.card_container}
                    style={{ transform: index === activeIndex ? 'scale(1)' : index === activeIndex + 1 || index === activeIndex - 1 ? 'scale(0.85)' : 'scale(0.75)'}}
                    onClick={(event) => {
                      authCtx.setbookDetails(props);
                      event.stopPropagation();
                      dispatch(addSelectedBook(props))
                      navigate(`/bookdetails/${props.id}`);
                    }}
                  >
                    <div className={classes.card_img} style={{position:"relative"}}>
                     {props._qte_a_terme_calcule < 1 && <div  className={classes.out_of_stock}>
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
                    </div>
                      <div className={classes.bookTitle} style={{opacity: index === activeIndex ? 1 : 0}}>
                    <p style={{maxWidth:'100%',width:'fit-content',margin:'0em auto 0 auto',display:"flex",flexDirection:"row"}}>
                        <Rating
                          style={{
                              color: "#EEBA7F",
                              margin:'0 .5em 0 0',
                          }}
                          size='small'
                          name="read-only"
                          value={props.average_rate}
                          precision={0.5}
                          readOnly
                      /><p style={{margin:'0 0 0 0 ',color:"#EEBA7F"}}>{props.average_rate}/5</p>
                      </p>
                      <p style={{ margin:'0em' }}>{truncateText(stripHtmlTags(props.designation), 15)}</p>
                      <p style={{ margin:'.3em 0em', fontSize:'small', fontWeight: 400 }}>{truncateText(stripHtmlTags(props.descriptif), 40)}</p>
                        <span style={{ display: "flex", flexDirection: "row", margin:'0 auto', columnGap:'0.5em' }}>
                          <p
                            style={{ textAlign: "center", padding: "0 ",color: "#EEBA7F",fontWeight:700,fontSize:'calc(1rem + .3vw)' }}
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
                                color: "#EEBA7F",fontSize:'calc(.8rem + .3vw)',
                                textDecoration: "line-through",
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
                          {props._qte_a_terme_calcule > 0 &&<button
                            className={classes.buttoncart}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToCart({ props: props });
                            }}
                          >
                            {data.HomePage.FeaturedBooks.button[language]}
                          </button>}
                      </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedBooks;
