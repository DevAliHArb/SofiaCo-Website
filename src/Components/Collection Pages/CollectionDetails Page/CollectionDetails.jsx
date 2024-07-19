import React, { useContext, useEffect, useState } from "react";
import classes from "./CollectionDetails.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
// import BookHeroImage from '../../../assets/BookHeroImage.png'
import nodata from "../../../assets/nobookfound.svg";
import img from "../../../assets/bookPlaceholder.png";
import data from '../../../Data.json'
import { IoSearchOutline } from "react-icons/io5";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IoMdArrowBack } from "react-icons/io";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, MenuItem, Rating, Select } from "@mui/material";
import { addSelectedBook, addTocart, addTocompare, addTofavorite, deletefavorite } from "../../Common/redux/productSlice";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import {
  PiShoppingCartSimpleFill,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";
import { HiOutlineBookOpen } from "react-icons/hi2";
import bookplaceholder from '../../../assets/bookPlaceholder.png'
import placeholder from '../../../assets/Collectionplaceholder.png'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import OurSelectionBanner from "../../Common Components/Our Selection Banner/OurSelectionBanner";
import { stripHtmlTags, truncateText } from "../../Common Components/TextUtils";


const CollectionDetailsPage = () => {
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(12); 
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const user = useSelector((state) => state.products.userInfo);
  const favoriteData = useSelector((state) => state.products.favorites);
  const collectionData = useSelector((state) => state.products.collection[0]);

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Function to handle changes in the input value
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, [collectionData]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/articles?ecom_type=sofiaco&collection=${collectionData?.nom}`
      );
      setArticles(response.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
    }
  };
  
  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = articles?.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(authCtx.articles?.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);

  

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1)
    }
  };
  const next2page = () => {
    setCurrentPage(pagenb);
    setpagenbroute(pagenb);
  };
  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id)
  };
  const prevpage = () => {
    if (currentpage !== 1) {
      setCurrentPage(currentpage - 1);
      setpagenbroute(pagenbroute - 1)
    }
  };
  const prev2page = () => {
    setCurrentPage(1);
    setpagenbroute(1);
  };
  

  useEffect(() => {
    if (currentpage == pagenb) {
      setto(articles?.length);
    } else if (authCtx.articles?.length === 0 ) {
      setto(0);
    } else{
      setto(currentpage * recordsPerPage);
    }
    if (articles?.length === 0 ) {
      setfrom(0);
    }else {
      setfrom(currentpage * 12 - recordsPerPage - 1);
    }
  }, [currentpage, articles, recordsPerPage]);

  const [visibleItems, setVisibleItems] = useState(4);
 
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = searchText
    ? records.filter(item => item.designation.toLowerCase().includes(searchText.toLowerCase()))
    : records;
  return (
    <>
      <div className={classes.bigContainer}>
        <OurSelectionBanner />
       <div className={classes.detailsContainer}>
        
      <div className={classes.cardContainer}>
        <div className={classes.colabImage}>
              <div className={classes.content}>
              {collectionData?.image !== null ? (
                      <img
                        src={`https://api.leonardo-service.com/img/${collectionData.image}`}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <img
                        src={placeholder}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                     )} 
                </div>       
           </div>
        <div className={classes.card} >
          <h1 style={{fontWeight:'600', textTransform:'capitalize'}}>{collectionData.nom}</h1>
          <p style={{color:'var(--secondary-color)',fontWeight:"500", margin:'.5em 0'}}>{collectionData.discriptif}dqdqwdq</p>
        </div>
      </div> 

       
      <div className={classes.header}>
          <h1>{data.Collections.CollectionsDetails.title[language]}</h1>
          <p>{data.Collections.CollectionsDetails.description[language]}</p>
        </div>
          {/* <div style={{
                    width: "100%",
                    display:'flex',
                    maxWidth:'25em',
                    margin:'0 auto',
                    flexDirection:'row',
                    height:'fit-content',
                    borderRadius:'.5em',
                    background:'var(--secondary-color)',
                    marginTop:'1em'
                }} 
                >
                  <input
                    type="text"
                    placeholder="Search" onChange={handleSearch}
                    className={classes.input}
                    style={{
                        padding:'1em 1em',
                        height:'100%',
                        width:'70%',
                        background:'var(--secondary-color)',
                        borderRadius:'.5em'
                    }}
                  />
                  <button className={classes.btn} style={{margin:"0 0 0 auto"}}><IoSearchOutline style={{width:'1.7em', height:'1.7em',margin:'-0.5em'}}/></button>
                </div> */}
        {records.length === 0 ? 
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>No Books <br/>were found!</h1>
          </div>
          :
        <div className={classes.booksgridview} >
                {filteredData.map((props) => {
                  return (
                    <div
                    className={classes.card_container}
                    onClick={(event) => {
                      authCtx.setbookDetails(props);
                      event.stopPropagation();
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
                    
                    <div className={classes.bookTitle} >
                      <p >{props.designation.length > 15 ? props.designation.slice(0,15) + '...' : props.designation}</p>
                      <p style={{ height:'1em', fontSize:'small', fontWeight: 400 }}>{props.dc_auteur.length > 15 ? props.dc_auteur.slice(0,15) + '...' : props.dc_auteur}</p>
                      <p
  style={{ height: '1.5em', fontSize: 'small', fontWeight: 400 }}
>{truncateText(stripHtmlTags(props.descriptif), 40)}</p>                      <span style={{ display: "flex", flexDirection: "row", margin:'0 auto', columnGap:'0.5em' }} >
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
                    </div>
                  </div>
                  );
                })}
              </div>
}
            
            
        <div className={classes.page_control}>
          <div className={classes.show}>
            <p>
              Showing {from}–{to} of {filteredData.length} results
            </p>
          </div>
          <div className={classes.control}>
            {/* <button onClick={prev2page}>
              <MdKeyboardDoubleArrowLeft className={classes.icon1} />
            </button> */}
            <button onClick={prevpage}>
              <FaArrowLeftLong className={classes.icon1} />
            </button>
            {numbers.map((n, i) => {
              if (
                n === 1 ||
                n === pagenb ||
                n === currentpage - 1 ||
                n === currentpage ||
                n === currentpage + 1 ||
                (n === currentpage + 2 && currentpage === 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => {
                      changepage(n);
                      setpagenbroute(n);
                    }}
                    className={`${
                      pagenbroute === n ? classes.selectednb : classes.nb
                    }`}
                  >
                    {n}
                  </button>
                );
              } else if (
                n === currentpage - 2 ||
                n === currentpage + 3
              ) {
                return (
                  <span key={i} className={classes.ellipsis}>...</span>
                );
              }
              return null;
            })}
            <button onClick={nextpage}>
              <FaArrowRightLong className={classes.icon1} />
            </button>
            {/* <button onClick={next2page}>
              <MdKeyboardDoubleArrowRight className={classes.icon1} />
            </button> */}
          </div>
        </div>
       </div>
      </div>
    </>
  );
};

export default CollectionDetailsPage;
