import React, { useContext, useEffect, useState } from "react";
import classes from "./Hero.module.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import './styles.css'
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import nodata from "../../../assets/nobookfound.svg";

import img from "../../../assets/bookPlaceholder.png";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoGitCompare } from "react-icons/io5";
import AuthContext from "../../Common/authContext";
import data from "../../../Data.json";
import axios from "axios";
import SearchBox from "../../Common/Search box/SearchBox";
import { addSelectedBook } from "../../Common/redux/productSlice";

const Hero = ({ carttoggle }) => {
  const authCtx = useContext(AuthContext);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const [name, setname] = useState("");
  const [author, setauthor] = useState("");
  const [description, setdescription] = useState("");
  const [constantValue, setconstantValue] = useState("");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/articles?ecom_type=albouraq&hero_slider`
      );
      
      setArticles(response.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
    }
  };

  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.activeIndex);
    setconstantValue(articles[swiper.activeIndex].id);
  };

  useEffect(() => {
    // Set initial values for name, author, and description
    if (articles.length > 0) {
      const initialItem = articles[0];
      setname(initialItem.designation);
      setauthor(initialItem.dc_auteur);
      setdescription(initialItem.descriptif);
      setconstantValue(initialItem.id);
    }
  }, [articles]);

  useEffect(() => {
    articles.forEach((item) => {
      if (item.id === constantValue) {
        setname(item.designation);
        setauthor(item.dc_auteur);
        setdescription(item.descriptif);
      }
    });
    console.log(name);
  }, [constantValue, articles]);

  const favoriteData = useSelector((state) => state.products.favorites);

  return (
    <>
      <div className='bigContainer'>
        <div className={classes.header}>
          <h1
            dangerouslySetInnerHTML={{
              __html: data.HomePage.Hero.title[language],
            }}
          />
          <div style={{marginTop:'1em'}}>
          <SearchBox />
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
              onSlideChange={handleSlideChange}
              spaceBetween={0}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              breakpoints={{
                0: {
                  slidesPerView: 1.5,
                },
                651: {
                  slidesPerView: 2,
                },
                951: {
                  slidesPerView: 2.5,
                },
              }}
            >
              {articles
                ?.slice(0, 5)
                .filter((props) => props.designation.trim() !== "")
                .map((props) => (
                  <SwiperSlide
                    style={{
                      width: "10vw",
                      height: "fit-content",
                      backgroundColor: "transparent",
                      paddingBottom: "5%",
                    }}
                  >
                    <div
                      className={classes.card_container}
                      onClick={() => {
                        authCtx.setbookDetails(props);
                        dispatch(addSelectedBook(props))
                        navigate(`/bookdetails/${props.id}`);
                      }}
                    >
                      <div className={classes.card_img} style={{position:"relative"}}>
                     {props._qte_a_terme_calcule < 1 && <div onClick={(e)=>e.stopPropagation()} className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
                        {props.articleimage[0] ? (
                          <img
                            src={`${props.articleimage[0].link}`}
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
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
