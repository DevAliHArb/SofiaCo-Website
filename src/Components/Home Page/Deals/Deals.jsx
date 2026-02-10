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
import { stripHtmlTags, truncateText } from "../../Common/TextUtils";
import { Rating } from "@mui/material";

const Deals = () => {
  const catBtnsRef = React.useRef(null);
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
    const [ selectedsubCategoryId, setSelectedsubCategoryId ] = useState(null);
  const user = useSelector((state) => state.products.userInfo);
  const SelectedCategoryId = useSelector((state) => state.products.selectedCategoryId);

  // Scroll category container left/right
  const scrollCatBtns = (direction) => {
    const container = catBtnsRef.current;
    if (!container) return;
    const scrollAmount = 120; // px per click
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    fetchArticles();
  }, [ SelectedCategoryId, selectedsubCategoryId]);

  const fetchArticles = async () => {
    try {
      let articleFamilleIdParam = '';
      if (SelectedCategoryId && SelectedCategoryId !== 'null') {
        articleFamilleIdParam = `&articlefamilleparent_id=${SelectedCategoryId}`;
      }
      
      let articlefamilleSubIdParam = '';
      if (selectedsubCategoryId && selectedsubCategoryId !== 'null') {
        articlefamilleSubIdParam = `&articlefamille_id=${selectedsubCategoryId}`;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco${articleFamilleIdParam}${articlefamilleSubIdParam}&is_selected&user_id=${user?.id ? user.id : null}`
      );
      //   const filteredArticles = response?.data?.data?.filter(article => article._qte_a_terme_calcule > 0);
  
      // setArticles(filteredArticles);
      setArticles(response.data.data);
      setActiveIndex(0);
    } catch (error) {
      // console.error("Error fetching articles:", error);
      // toast.error("Failed to fetch articles.");
    }
  };
  
    // Add drag-to-scroll functionality
    const handleMouseDown = (e) => {
      e.preventDefault();
      const container = e.currentTarget;
      container.isDown = true;
      container.startX = e.pageX - container.offsetLeft;
      container.scrollLeft = container.scrollLeft;
    };
  
    const handleMouseLeave = (e) => {
      e.currentTarget.isDown = false;
    };
  
    const handleMouseUp = (e) => {
      e.currentTarget.isDown = false;
    };
  
    const handleMouseMove = (e) => {
      if (!e.currentTarget.isDown) return;
      e.preventDefault();
      const container = e.currentTarget;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - container.startX) * 2; // Scroll-fast ratio
      container.scrollLeft = container.scrollLeft - walk;
    };

    
  const handleCategoryClick = (id) => {
  setSelectedsubCategoryId(Number(id));
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

          <div className={classes.header_low}>
            <div className={classes.nav_container}>
              
      <div className={`${classes.nav_prev}`}>
        <IoMdArrowBack className={classes.nav_icon}/>
      </div>
       <div className={classes.nav_nb}>
        {activeIndex + 1}
      </div>
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack className={classes.nav_icon} style={{transform:'rotate(180deg)'}}/>
      </div>
            </div>
            <div className={classes.cat_btns_wrapper}>
              <button
                className={classes.cat_arrow}
                aria-label="Scroll categories left"
                onClick={() => scrollCatBtns('left')}
              >
                <IoMdArrowBack className={classes.cat_arrow_icon} />
              </button>
              <div
                className={classes.cat_btns}
                ref={catBtnsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}
              >
                <button
                  className={selectedsubCategoryId === null || selectedsubCategoryId === 'null' ? classes.selectedCategory : classes.cat_btns_button}
                  onClick={() => {
                    setSelectedsubCategoryId(null);
                  }}
                    style={{ fontWeight: selectedsubCategoryId === "null" || selectedsubCategoryId === null && "600", textDecoration: selectedsubCategoryId === "null" || selectedsubCategoryId === null && "underline"}}
                >
                  {language === 'eng' ? "All" : "Tous"}
                </button>
                {authCtx.articleFamille?.map((item) => (
                  <button
                    key={item.id}
                    className={selectedsubCategoryId === Number(item?.id) ? classes.selectedCategory : ""}
                    onClick={() => handleCategoryClick(item?.id)}
                    style={{ fontWeight: selectedsubCategoryId === Number(item?.id) && "600", textDecoration: selectedsubCategoryId === Number(item?.id) && "underline"}}
                  >
                    {item?.type_nom}
                  </button>
                ))}
              </div>
              <button
                className={classes.cat_arrow}
                aria-label="Scroll categories right"
                onClick={() => scrollCatBtns('right')}
              >
                <IoMdArrowBack className={classes.cat_arrow_icon} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
        <button className={classes.view_more} onClick={()=>navigate(`\products`)}>
          {language === "eng" ? "View More" : "Voir Plus"}
        </button>
          </div>
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
                        navigate(`/main/productdetails/${props.id}`);
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
                      </div>

                      <div className={classes.bookTitle}>
                        <p>{props.designation}</p>
                    <p style={{maxWidth:'100%',width:'fit-content',margin:'0',display:"flex",flexDirection:"row"}}>
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
                            Object.keys(props.editor)?.length > 0 && (
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
                                  {props?.dc_editor?.length > 8
                                    ? props?.dc_editor.slice(0, 8) + "..."
                                    : props?.dc_editor}
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
                                {props.dc_collection?.length > 10
                                  ? props.dc_collection.slice(0, 10) + "..."
                                  : props.dc_collection}
                              </p>
                            </div>
                          )}
                        </div>
                        <p className={classes.desc} style={{ fontSize: "medium", fontWeight: 400 }}>
                        {truncateText(stripHtmlTags(props.descriptif), 100)}
                        </p>
                        <p className={classes.descmob} style={{ fontSize: "medium", fontWeight: 400 }}>
                        {truncateText(stripHtmlTags(props.descriptif), 100)}
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
                                        props._prix_public_ttc -
                                        props._prix_public_ttc *
                                          (props.discount / 100)
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
                                margin: "auto 0",
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
                          {props._qte_a_terme_calcule > 0 &&<button className={classes.buttoncart} 
                        onClick={(event) => {
                          event.stopPropagation();
                              if (props.article_variant_combinations && props.article_variant_combinations.length > 0) {
                                authCtx.setaddtocartPopupOpen(true);
                                authCtx.setaddtocartPopupId(props.id);
                              } else {
                                authCtx.addToCart({ props: props });
                              } 
                        }}>
                            {data.HomePage.Deals.button[language]}
                          </button>}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>

            <div className={classes.nav_container_mobile}>

      <div className={`${classes.nav_prev}`}>
        <IoMdArrowBack className={classes.nav_icon}/>
      </div>
       <div className={classes.nav_nb}>
        {activeIndex + 1}
      </div>
      <div className={` ${classes.nav_next}`}>
        <IoMdArrowBack className={classes.nav_icon} style={{transform:'rotate(180deg)'}}/>
      </div>
            </div>
          </div>
        )}
      </div>    
        <button className={classes.view_more_mob} onClick={()=>navigate(`\products`)}>
          {language === "eng" ? "View More" : "Voir Plus"}
        </button>
    </div>
  );
};

export default Deals;
