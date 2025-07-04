import React, { useContext, useEffect, useState } from "react";
import classes from "./NewReleases.module.css";
import AuthContext from "../../Common/authContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import data from "../../../Data.json";
import img from "../../../assets/bookPlaceholder.png";
import axios from "axios";
import nodata from '../../../assets/nobookfound.svg';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { addSelectedBook } from "../../Common/redux/productSlice";
import { IoCartOutline } from "react-icons/io5";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Rating } from "@mui/material";

const NewReleases = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("NewarrivalCat") || "categories"
  );
  const favoriteData = useSelector((state) => state.products.favorites);
  const [selectedCatFilter, setselectedCatFilter] = useState(null);
  const [selectedEdtrFilter, setselectedEdtrFilter] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.products.userInfo);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  useEffect(() => {
    if (authCtx.categories.length > 0) {
      setselectedCatFilter(authCtx.categories[0]?.id);
    }
  }, [authCtx.categories]); // Dependency array ensures this effect runs whenever authCtx.categories changes

  useEffect(() => {
    fetchArticles();
    // console.log('done')
  }, [selectedCatFilter, selectedEdtrFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
        let url = `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&page=1&user_id=${user?.id ? user.id : null}`;

        if (selectedCategory === 'categories') {
          url += `&category=${selectedCatFilter}`;
        } else if (selectedCategory === 'editors') {
          url += `&editor=${selectedEdtrFilter}`;
        }
    
        const response = await axios.get(url);
      // console.log(response.data.data)
    //   const filteredArticles = response?.data?.data?.filter(article => article._qte_a_terme_calcule > 0);

    // setArticles(filteredArticles);
    
    setArticles(response.data.data);
    } catch (error) {
      // console.error("Error fetching articles:", error);
      // toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.big_container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.title}>
            <h1>{data.HomePage.NewArrivals.title[language]}</h1>
          </div>
          <div className={classes.categories}>
            <div className={classes.parent_cat}>
              <button
                className={classes.buttoncart}
                style={{
                  background:
                    selectedCategory === "categories"
                      ? "var(--primary-color)"
                      : "transparent",
                  color:
                    selectedCategory === "categories"
                      ? "#fff"
                      : "var(--secondary-color)",
                }}
                onClick={() => {
                  localStorage.setItem("NewarrivalCat", "categories");
                  setSelectedCategory("categories");
                  setselectedEdtrFilter('')
                }}
              >
                {data.HomePage.NewArrivals.Cat1[language]}
              </button>
              <button
                className={classes.buttoncart}
                style={{
                  background:
                    selectedCategory === "editors"
                      ? "var(--primary-color)"
                      : "transparent",
                  color:
                    selectedCategory === "editors"
                      ? "#fff"
                      : "var(--secondary-color)",
                }}
                onClick={() => {
                  localStorage.setItem("NewarrivalCat", "editors");
                  setSelectedCategory("editors");
                  setselectedCatFilter(null)
                }}
              >
                {data.HomePage.NewArrivals.Cat2[language]}
              </button>
            </div>
            <div className={classes.child_cat}>
              {selectedCategory === "categories" ? (
                <>
                  {authCtx.categories
                    .filter((category) => category.niveau === 1).slice(0,5)
                    .map((category) => {
                      return (
                        <p style={{color: selectedCatFilter === category.id ? 'var(--primary-color)' : 'var(--secondary-color)'}} onClick={() => setselectedCatFilter(category.id)}>
                          {category._nom}
                        </p>
                      );
                    })}
                </>
              ) : (
                <>
                  {authCtx.editors.slice(0,5).map((editor) => {
                    return (
                      <p style={{color: selectedEdtrFilter === editor.nom ? 'var(--primary-color)' : 'var(--secondary-color)'}} onClick={() => setselectedEdtrFilter(editor.nom)}>
                        {editor.nom}
                      </p>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        {
            articles?.length === 0 ? 
            <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>No Books <br/>were found!</h1>
          </div>

            :
            <>
                {loading ? 
                 <div>
                 <h1 style={{ color: "Var(--secondary-color)" }}>Loading...</h1>
               </div>
               :
                <>
                <div className={classes.books_list}>
                {articles?.slice(0, 8).map((props) => {
                  return (
                    <div
                      className={classes.card_container}
                      onClick={(event) => {
                        authCtx.setbookDetails(props);
                        event.stopPropagation();
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
      
                      <div className={classes.bookTitle}>
                        <p style={{ fontSize: "large" }}>
                          {props.designation.length > 50
                            ? props.designation.slice(0, 50) + "..."
                            : props.designation}
                        </p>
                    <p style={{maxWidth:'100%',width:'fit-content',margin:'0 auto 0 auto',display:"flex",flexDirection:"row"}}>
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
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            margin: "0 auto",
                            columnGap: "0.5em",
                          }}
                        >
                          <p className={classes.price}>
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
                                          props._prix_public_ttc * (props.discount / 100)) *
                                        authCtx.currencyRate
                                      ).toFixed(2)
                                    : (
                                        props._prix_public_ttc * authCtx.currencyRate
                                      ).toFixed(2)
                                }`}{" "}
                          </p>
                          {props.discount > 0 && (
                            <p
                              className={classes.price}
                              style={{
                                textDecoration: "line-through",
                                fontSize: "small",
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
                  );
                })}
              </div>
              
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
                      </div>
      
                      <div className={classes.bookTitle}>
                        <p style={{ fontSize: "small" }}>
                          {props.designation.length > 50
                            ? props.designation.slice(0, 50) + "..."
                            : props.designation}
                        </p>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            margin: "0 auto",
                            columnGap: "0.5em",
                          }}
                        >
                          <p className={classes.price}>
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
                                          props._prix_public_ttc * (props.discount / 100)) *
                                        authCtx.currencyRate
                                      ).toFixed(2)
                                    : (
                                        props._prix_public_ttc * authCtx.currencyRate
                                      ).toFixed(2)
                                }`}{" "}
                          </p>
                          {props.discount > 0 && (
                            <p
                              className={classes.price}
                              style={{
                                textDecoration: "line-through",
                                fontSize: "small",
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
                </>
              }
            </>
        }
      </div>
    </div>
  );
};

export default NewReleases;
