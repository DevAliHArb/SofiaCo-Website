import React, { useContext, useEffect, useState } from 'react';
import classes from './MoreAbout.module.css';
import data from '../../../../Data.json';
import { useDispatch, useSelector } from 'react-redux';
import nodata from '../../../../assets/nobookfound.svg';
import img from "../../../../assets/bookPlaceholder.png";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IoMdArrowBack } from "react-icons/io";
import AuthContext from '../../../Common/authContext';
import { IoCartOutline } from "react-icons/io5";
import { Rating } from '@mui/material';
import { stripHtmlTags, truncateText } from '../../../Common Components/TextUtils';
import { addSelectedBook } from '../../../Common/redux/productSlice';

const MoreAbout = ({publisher_name}) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const CollaboratorData = useSelector((state) => state.products.selectedCollaborator[0]);

  const favoriteData = useSelector((state) => state.products.favorites);
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // State to track active slide index

  useEffect(() => {
    fetchArticles();
  }, [publisher_name]);

  const fetchArticles = async () => {
    try {
      const baseURL = `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco`;
      const queryParam = `&publisher=${publisher_name}`;
    const finalURL = `${baseURL}${queryParam}`;

    // Make the API request
    const response = await axios.get(finalURL);
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
          <h1>{language === "eng" ? "More for the same Publishing house":"Plus pour le même maison d'édition"}</h1>
          <p>
            {/* {data.MoreForCollab?.description[language]} */}
            </p>
        </div>

        {articles?.length === 0 ? (
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>
            {language === 'eng' ? (
  <>No products <br /> were found!</>
) : (
  <>Aucun produits <br /> n'a été trouvé !</>
)}
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
                    <div className={classes.card_img} style={{position:"relative"}}>
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
                      {props._qte_a_terme_calcule > 0 &&<div className={classes.cartIcon}>
                          <IoCartOutline
                            className={classes.fav}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToCart({props: props}); 
                            }}
                            fontSize="inherit"
                          />
                      </div>}
                    </div>
                    
                    <div className={classes.bookTitle} >
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
                      <p >{props.designation.length > 50 ? props.designation.slice(0,50) + '...' : props.designation}</p>
                      <p style={{ margin:'0em', fontSize:'small', fontWeight: 400 }}>{truncateText(stripHtmlTags(props.dc_auteur), 15)}</p>
                      <p style={{ margin:'.3em 0em', fontSize:'small', fontWeight: 400 }}>{truncateText(stripHtmlTags(props.descriptif), 40)}</p>
                      <span style={{ display: "flex", flexDirection: "row", margin:'0 auto', columnGap:'0.5em' }}>
                        <p
                          style={{ textAlign: "center", padding: "0 ",color: "var(--primary-color)",fontWeight:700 }}
                        >
                          {currency === "eur"
                            ? `€${
                                props.remise_catalogue > 0
                                  ? (
                                      props._prix_public_ttc -
                                      props._prix_public_ttc * (props.remise_catalogue / 100)
                                    ).toFixed(2)
                                  : Number(props._prix_public_ttc).toFixed(2)
                              }`
                            : `$${
                                props.remise_catalogue > 0
                                  ? (
                                      (props._prix_public_ttc -
                                        props._prix_public_ttc *
                                          (props.remise_catalogue / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                      props._prix_public_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}{" "}
                        </p>
                        {props.remise_catalogue > 0 && (
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
      {articles?.length > 2 && <div className={classes.nav_nb0}>
        {activeIndex + 1}
      </div>}
      {articles?.length > 3 && <div className={classes.nav_nb651}>
        {activeIndex + 1}
      </div>}
      {articles?.length > 5 && <div className={classes.nav_nb951}>
        {activeIndex + 1}
      </div>}
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack className={classes.nav_icon} style={{transform:'rotate(180deg)'}}/>
      </div>
    </div>
  );
};

export default MoreAbout;
