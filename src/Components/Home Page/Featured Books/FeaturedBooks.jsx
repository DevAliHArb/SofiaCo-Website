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
        `https://api.leonardo-service.com/api/bookshop/articles?ecom_type=bookshop&favorites`
      );
      console.log(response.data.data);
      setArticles(response.data.data);
      setActiveIndex(Math.floor(response.data.data.length / 2));
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
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
                      navigate(`bookdetails/${props.id}`);
                    }}
                  >
                    <div className={classes.card_img}>
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
                    </div>
                      <div className={classes.bookTitle} style={{opacity: index === activeIndex ? 1 : 0}}>
                        <p >{props.designation.length > 20 ? props.designation.slice(0,20) + '...' : props.designation}</p>
                        <span style={{ display: "flex", flexDirection: "row", margin:'0 auto', columnGap:'0.5em' }}>
                          <p
                            style={{ textAlign: "center", padding: "0 ",color: "var(--primary-color)",fontWeight:700 }}
                          >
                            {currency === "eur"
                              ? `€${
                                  props.discount > 0
                                    ? (
                                        props.prixpublic -
                                        props.prixpublic * (props.discount / 100)
                                      ).toFixed(2)
                                    : Number(props.prixpublic).toFixed(2)
                                }`
                              : `$${
                                  props.discount > 0
                                    ? (
                                        (props.prixpublic -
                                          props.prixpublic *
                                            (props.discount / 100)) *
                                        authCtx.currencyRate
                                      ).toFixed(2)
                                    : (
                                        props.prixpublic * authCtx.currencyRate
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
                                ? `€ ${Number(props.prixpublic).toFixed(2)} `
                                : `$ ${(
                                    props.prixpublic * authCtx.currencyRate
                                  ).toFixed(2)} `}
                            </p>
                          )}
                        </span>
                          <button
                            className={classes.buttoncart}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToCart({ props: props, carttoggle });
                            }}
                          >
                            {data.HomePage.FeaturedBooks.button[language]}
                          </button>
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
