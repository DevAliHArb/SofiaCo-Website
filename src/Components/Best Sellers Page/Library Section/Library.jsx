import React, { useContext, useEffect, useState } from "react";
import classes from "./Library.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import placeholder from "../../../assets/bookPlaceholder.png";
import { useNavigate } from "@hooks/useNavigate";
import AuthContext from "../../Common/authContext";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedBook } from "../../Common/redux/productSlice";
import { Rating } from "@mui/material";
import { IoHeartOutline } from "react-icons/io5";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import axios from "axios";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Library = ({ title_en, title_fr, id }) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const favoriteData = useSelector((state) => state.products.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const navigationScopeClass = `best-seller-nav-${id}`;

  useEffect(() => { fetchArticles(); }, [id]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/articles/most-selling/parent-category/${id}?ecom_type=sofiaco`
      );
      setArticles(response.data.data || []);
    } catch (error) {}
  };

  const getDisplayPrice = (props) => {
    const discount = Number(props?.discount || 0);
    const base = Number(props?._prix_public_ttc || 0);
    const discounted = discount > 0 ? base - base * (discount / 100) : base;
    const max = Number(props?._prix_public_ttc_max || 0);
    const discountedMax = discount > 0 ? max - max * (discount / 100) : max;
    const format = (v) => currency === "eur" ? `${v.toFixed(2)}€` : `${(v * (authCtx.currencyRate || 1)).toFixed(2)}$`;
    if (max && max !== base) return `${format(discounted)} - ${format(discountedMax)}`;
    return format(discounted);
  };

  const getOriginalPrice = (props) => {
    const base = Number(props?._prix_public_ttc || 0);
    const max = Number(props?._prix_public_ttc_max || 0);
    const format = (v) => currency === "eur" ? `${v.toFixed(2)}€` : `${(v * (authCtx.currencyRate || 1)).toFixed(2)}$`;
    if (max && max !== base) return `${format(base)} - ${format(max)}`;
    return format(base);
  };

  // if (articles.length === 0) return null;

  return (
    <div className={classes.bigContainer}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h2>{language === "eng" ? title_en : title_fr}</h2>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div className={classes.swiper}>
          <Swiper
            navigation={{ nextEl: `.${navigationScopeClass}.${classes.navButton_next}`, prevEl: `.${navigationScopeClass}.${classes.navButton_prev}` }}
            modules={[Navigation]}
            breakpoints={{ 0: { slidesPerView: 2, spaceBetween: 8 }, 651: { slidesPerView: 3, spaceBetween: 10 }, 951: { slidesPerView: 5, spaceBetween: 20 } }}
          >
            {articles.slice(0, 20).map((props, index) => (
              <SwiperSlide key={props.id} className={classes.swiperslide}>
                <div className={classes.card_container} onClick={(e) => { e.stopPropagation(); dispatch(addSelectedBook(props)); navigate(`/main/productdetails/${props.id}`); }}>
                  <p className={classes.bestSellerNb}>#{index + 1}</p>
                  <div className={classes.card_img}>
                    {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}><p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p></div>}
                    {props.discount > 0 && <div className={classes.tagsCont}>{props.discount}%</div>}
                    <img src={props.articleimage?.[0] ? props.articleimage[0].link : placeholder} alt="" className={classes.bookImg} />
                    <div className={classes.iconsContainer}>
                      {favoriteData.some((b) => b._favid === props.id) ? (
                        <div className={classes.icon_con} style={{ background: "var(--primary-color)" }} onClick={(e) => { e.stopPropagation(); authCtx.deleteFavorite(props.id); }}><IoHeartOutline className={classes.icon} /></div>
                      ) : (
                        <div className={classes.icon_con} onClick={(e) => { e.stopPropagation(); authCtx.addToFavorite(props); }}><IoHeartOutline className={classes.icon} /></div>
                      )}
                      {props._qte_a_terme_calcule > 0 && (
                        <div className={classes.icon_con} onClick={(e) => { e.stopPropagation(); authCtx.addToCart({ props }); }}><PiShoppingCartSimpleLight className={classes.icon} /></div>
                      )}
                    </div>
                  </div>
                  <div className={classes.bookTitle}>
                    <h3>{props.designation}</h3>
                    <p className={classes.author}>{props?.collaborators?.filter((c) => c.type_id === 22)?.map((c, i, arr) => <span key={i}>{c.nom}{i < arr.length - 1 ? ", " : ""}</span>)}</p>
                    <p className={classes.price}>{getDisplayPrice(props)}{props.discount > 0 && <span className={classes.originalPrice}>{getOriginalPrice(props)}</span>}</p>
                    <Rating style={{ color: "var(--primary-color)" }} size="small" name="read-only" value={props.average_rate} precision={0.5} readOnly />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={classes.customNavigation}>
          <button className={`${navigationScopeClass} ${classes.navButton_prev}`}><KeyboardArrowLeftIcon className={classes.nav_icon} /></button>
          <button className={`${navigationScopeClass} ${classes.navButton_next}`}><KeyboardArrowLeftIcon style={{ transform: "rotate(180deg)" }} className={classes.nav_icon} /></button>
        </div>
      </div>
    </div>
  );
};
export default Library;
