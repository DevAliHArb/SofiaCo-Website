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
import { IoMdArrowBack } from "react-icons/io";

const NewReleases = () => {
  // Ref for category buttons container
  const catBtnsRef = React.useRef(null);
  const favoriteData = useSelector((state) => state.products.favorites);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [activeIndex, setActiveIndex] = useState(0); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ selectedsubCategoryId, setSelectedsubCategoryId ] = useState(null);
  const user = useSelector((state) => state.products.userInfo);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
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
    setLoading(true);
    try {
      let articleFamilleIdParam = '';
      if (SelectedCategoryId && SelectedCategoryId !== 'null') {
        articleFamilleIdParam = `&articlefamilleparent_id=${SelectedCategoryId}`;
      }
      let articlefamilleSubIdParam = '';
      if (selectedsubCategoryId && selectedsubCategoryId !== 'null') {
        articlefamilleSubIdParam = `&articlefamille_id=${selectedsubCategoryId}`;
      }

        let url = `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco${articleFamilleIdParam}${articlefamilleSubIdParam}&page=1&user_id=${user?.id ? user.id : null}`;

        const response = await axios.get(url);
      // console.log(response.data.data)
    //   const filteredArticles = response?.data?.data?.filter(article => article._qte_a_terme_calcule > 0);

    // setArticles(filteredArticles);
    
      setArticles(response.data.data);
      setActiveIndex(0);
    } catch (error) {
      // console.error("Error fetching articles:", error);
      // toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false);
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
          <div className={classes.title}>
            <h1>{data.HomePage.NewArrivals.title[language]}</h1>
          </div>
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
        <button className={classes.view_more_mob} onClick={()=>navigate(`\products`)}>
          {language === "eng" ? "View More" : "Voir Plus"}
        </button>
    </div>
  );
};

export default NewReleases;
