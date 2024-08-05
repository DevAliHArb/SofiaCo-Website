import React, { useContext, useEffect, useState } from "react";
import classes from "./Deals.module.css";
import data from "../../../Data.json";
import { useDispatch, useSelector } from "react-redux";
import nodata from "../../../assets/nobookfound.svg";
import img from "../../../assets/bookPlaceholder.png";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IoMdArrowBack } from "react-icons/io";
import { addSelectedBook } from "../../Common/redux/productSlice";

const Deals = () => {
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
        `https://api.leonardo-service.com/api/bookshop/articles?ecom_type=sofiaco&is_selected`
      );
      setArticles(response.data.data);
      setActiveIndex(0);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
    }
  };

  return (
    <div className={classes.big_container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <h1
            dangerouslySetInnerHTML={{
              __html: data.HomePage.Deals?.title[language],
            }}
          />
          <p>{data.HomePage.Deals?.description[language]}</p>
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
              spaceBetween={20}
              effect={"fade"}
              navigation={{
                nextEl: `.${classes.nav_next}`,
                prevEl: `.${classes.nav_prev}`,
              }}
              modules={[Navigation]}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                651: {
                  slidesPerView: 1,
                },
                951: {
                  slidesPerView: 2,
                },
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active slide index on change
            >
              {articles
                .filter((props) => props.designation.trim() !== "")
                .map((props, index) => (
                  <SwiperSlide className={classes.swiperslide} key={props.id}>
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

                      <div className={classes.bookTitle}>
                        <p>{props.designation}</p>
                        <p
                          style={{
                            height: "1em",
                            fontSize: "small",
                            fontWeight: 400,
                          }}
                        >
                          {props.dc_auteur}
                        </p>
                        <div
                          style={{
                            width:'100%',
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "1em",
                            // justifyContent:'space-between',
                            margin: "0.5em 0",
                          }}
                        >
                          {props.dc_parution && (
                            <div
                              style={{
                                width: "fit-content",
                                height:'fit-content',
                                padding: "0.5em 1em",
                                borderRadius: "1em",
                                background: "#EEBA7F",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "var(--font-family)",
                                  color: "var(--secondary-color)",
                                  fontSize: "calc(0.6rem + 0.2vw)",
                                  fontWeight: 400,
                                  margin:'auto'
                                }}
                              >
                                {props.dc_parution.slice(0, 4)}
                              </p>
                            </div>
                          )}
                          {props.editor &&
                            Object.keys(props.editor).length > 0 && (
                              <div
                                style={{
                                  width: "fit-content",
                                  height:'fit-content',
                                  padding: "0.5em 1em",
                                  borderRadius: "1em",
                                  background: "#EEBA7F",
                                }}
                              >
                                <p
                                  style={{
                                    fontFamily: "var(--font-family)",
                                    color: "var(--secondary-color)",
                                    fontSize: "calc(0.6rem + 0.2vw)",
                                    fontWeight: 400,
                                    margin:'auto'
                                  }}
                                >
                                  {props.editor._nom.length > 8
                                    ? props.editor._nom.slice(0, 8) + "..."
                                    : props.editor._nom}
                                </p>
                              </div>
                            )}
                          {props.dc_collection && (
                            <div
                            className={classes.desc}
                              style={{
                                width: "fit-content",
                                height:'fit-content',
                                padding: "0.5em 1em",
                                borderRadius: "1em",
                                background: "#EEBA7F",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "var(--font-family)",
                                  color: "var(--secondary-color)",
                                  fontSize: "calc(0.6rem + 0.2vw)",
                                  fontWeight: 400,
                                  margin:'auto'
                                }}
                              >
                                {props.dc_collection.length > 10
                                  ? props.dc_collection.slice(0, 10) + "..."
                                  : props.dc_collection}
                              </p>
                            </div>
                          )}
                        </div>
                        <p className={classes.desc} style={{ fontSize: "medium", fontWeight: 400 }}>
                          {props.descriptif.length > 100
                            ? props.descriptif.slice(0, 100) + "..."
                            : props.descriptif}
                        </p>
                        <p className={classes.descmob} style={{ fontSize: "medium", fontWeight: 400 }}>
                          {props.descriptif.length > 60
                            ? props.descriptif.slice(0, 60) + "..."
                            : props.descriptif}
                        </p>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            margin: "0",
                            columnGap: "0.5em",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "start",
                              padding: "0 ",
                              color: "var(--primary-color)",
                              fontWeight: 700,
                            }}
                          >
                            {currency === "eur"
                              ? `€${
                                  props.discount > 0
                                    ? (
                                        props.prixpublic -
                                        props.prixpublic *
                                          (props.discount / 100)
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
                                margin: "auto 0",
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
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "2em",
                            marginTop: "1em",
                          }}
                        >
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
                                onClick={(event) => {
                                  event.stopPropagation();
                                  authCtx.addToFavorite(props);
                                }}
                              />
                            )}
                          </div>
                          <button className={classes.buttoncart} 
                        onClick={(event) => {
                          event.stopPropagation();
                          authCtx.addToCart({props: props}); 
                        }}>
                            {data.HomePage.Deals.button[language]}
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        )}
      </div>
      <p className={classes.viewall} onClick={()=>navigate(`/books`)}>{language === 'eng' ? 'View all' : 'View all(fr)'}</p>
      <div className={`${classes.nav_prev}`}>
        <IoMdArrowBack className={classes.nav_icon} />
      </div>
      <div className={`${classes.nav_nb}`}>{activeIndex + 1}</div>
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack
          className={classes.nav_icon}
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
    </div>
  );
};

export default Deals;
