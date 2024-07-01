import React, { useContext, useEffect, useState } from "react";
import classes from "./BooksList.module.css";
import gridview from "../../../../assets/gridview.svg";
import rowsview from "../../../../assets/rowsview.svg";
import filterIcon from "../../../../assets/filter.svg";
import { InputNumber } from 'antd';
import { useActionData, useNavigate } from "react-router-dom";
import { FormControl, MenuItem, Rating, Select } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { addSelectedBook, addTocart, addTocompare, addTofavorite, deletefavorite } from "../../../Common/redux/productSlice";
import AuthContext from "../../../Common/authContext";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import {
  PiShoppingCartSimpleFill,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";
import { HiOutlineBookOpen } from "react-icons/hi2";
import img from "../../../../assets/bookPlaceholder.png";
import nodata from "../../../../assets/nobookfound.svg";


const BooksList = ({ toggle, carttoggle, filteredartciles, fetchArticles, catChemin, selectedRate, selectedPrice }) => {
   const authCtx = useContext(AuthContext);
  const [filter, setFilter] = useState("Public");
  const [listview, setListview] = useState("grid");
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recordsPerPage, setrecordsPerPage] = useState(12); 
  const [arraypage, setarraypage] = useState(1);

  // Function to handle changes in the input value
  
  useEffect(() => {
  }, [filteredartciles]);
  
  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredartciles.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(filteredartciles.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);
  const searchData = useSelector((state) => state.products.searchData);
  
  const favoriteData = useSelector((state) => state.products.favorites);
  
  const cat = localStorage.getItem('category')
  const storedRate = localStorage.getItem('rate')
 
  useEffect(() => {
    setpagenbroute(1)
    setCurrentPage(1)
  }, [cat, storedRate, selectedPrice]);

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1);
    }
    if (currentpage === pagenb - 2) {
      setarraypage(arraypage +1)
      fetchArticles(selectedRate, null, null, arraypage);
    }
  };

  const next2page = () => {
    setCurrentPage(pagenb);
    setpagenbroute(pagenb);
  };


  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id);
    if (currentpage === pagenb - 2 || currentpage === pagenb - 1) {
      setarraypage(arraypage +1)
      fetchArticles(selectedRate, null, null, arraypage);
    }
  };


  const prevpage = () => {
    if (currentpage !== 1) {
      setCurrentPage(currentpage - 1);
      setpagenbroute(pagenbroute - 1);
    }
  };
  const prev2page = () => {
    setCurrentPage(1);
    setpagenbroute(1);
  };
  
  const handleChange = (value) => {
    if (value > 0) {
    setrecordsPerPage(value); // Update the state with the new value
    }
  };

  useEffect(() => {
    if (currentpage == pagenb) {
      setto(filteredartciles.length);
    } else if (filteredartciles.length === 0) {
      setto(0);
    } else {
      setto(currentpage * 12);
    }
    if (filteredartciles.length === 0) {
      setfrom(0);
    } else {
      setfrom(currentpage * 12 - 11);
    }
  }, [currentpage, filteredartciles, recordsPerPage]);

  const compareData = useSelector((state) => state.products.compare);
  
  const [sortBy, setSortBy] = useState('default');

  const sortBooks = (sortBy) => {
    switch (sortBy) {
      case 'titleAZ':
        return [...records].sort((a, b) => a.designation.localeCompare(b.designation));
      case 'titleZA':
        return [...records].sort((a, b) => b.designation.localeCompare(a.designation));
      case 'priceLow':
        return [...records].sort((a, b) => a.prixpublic - b.prixpublic);
      case 'priceHigh':
        return [...records].sort((a, b) => b.prixpublic - a.prixpublic);
      default:
        return records;
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const language = 'eng';
  const chain = () => {
    if (catChemin !== '') {
      return language === 'eng' ? `Category: ${catChemin}` : `Category: ${catChemin}`;
    } else if (searchData[0]?.author) {
      return language === 'eng' ? `Author: ${searchData[0]?.author}` : `Auteur: ${searchData[0]?.author}`;
    } else if (searchData[0]?.collection) {
      return  language === 'eng' ? `Collection: ${searchData[0]?.collection}` : `Collection: ${searchData[0]?.collection}`;
    } else if (searchData[0]?.editor) {
      return language === 'eng' ? `Editor: ${searchData[0]?.editor}` : `Editeur: ${searchData[0]?.editor}`;
    } else {
      return 'All books';
    }
  };

  return (
    <div className={classes.bigContainer}>
      <div className={classes.header}>
        <div style={{display:'flex',flexDirection:'row'}}>
        <div className={classes.categoryMob}>
          <p style={{ display: "flex", flexDirection: "row" }} >
            {/* Books
            <span style={{ margin: ".2em .3em 0 .3em" }}>
              <IoIosArrowForward />
            </span>{" "}
            Collection 2{" "} */}
            {chain()}
          </p>
        </div>
        <div className={classes.gridrowviews}>
          <div className={classes.viewBtnContainer} style={{backgroundColor: listview === "grid" && 'var(--forth-color)'}}><img src={gridview} style={{width:"60%",margin:"auto"}} alt="grid" onClick={() => {setListview("grid"); setpagenbroute(1)}} /></div>
          <div className={classes.viewBtnContainer} style={{backgroundColor: listview === "list" && 'var(--forth-color)'}}><img src={rowsview} style={{width:"60%",margin:"auto"}} alt="grid" onClick={() => {setListview("list"); setpagenbroute(1)}} /></div>
        </div>
        <div className={classes.category}>
          <p style={{ display: "flex", flexDirection: "row" }} >
            {/* Books
            <span style={{ margin: ".2em .3em 0 .3em" }}>
              <IoIosArrowForward />
            </span>{" "}
            Collection 2{" "} */}
            {chain()}
          </p>
        </div>
        </div>
        <div
          style={{
            justifyContent: "end",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div onClick={toggle} className={classes.btn}><img src={filterIcon} style={{width:"70%",margin:"0 auto -0.73em auto"}} alt="grid" onClick={() => {setListview("grid"); setpagenbroute(1)}} /></div>
          <span className={classes.showFilter} style={{margin:'auto 0'}}>
            <p style={{margin:'auto 0'}}>
              Show
            </p></span>
            <div>
            <span className={classes.showFilter}>
              <InputNumber min={1} max={100} value={recordsPerPage} controls={false} onChange={handleChange} style={{width:'3em',margin:'0 .5em',height:'2.5em',borderRadius:'.5em'}}/>
            </span>
            <Select
                disableUnderline
                inputProps={{ 'aria-label': 'Without label' }}
                value={sortBy}
                onChange={handleSortChange}
                style={{height:'2.2em',width:"10em",borderColor:'var(--primary-color)',textAlign:'center',color:'#fff',backgroundColor:'var(--forth-color)',borderRadius:'.5em',margin:'0'}}
            > 
                <MenuItem value="default" style={{textAlign:'center'}}>Default Sorting</MenuItem>
                    <MenuItem value="titleAZ" style={{textAlign:'center'}}>Sort A-Z </MenuItem>
                    <MenuItem value="titleZA" style={{textAlign:'center'}}>Sort Z-A </MenuItem>
                    <MenuItem value="priceLow" style={{textAlign:'center'}}>Price Low To High </MenuItem>
                    <MenuItem value="priceHigh" style={{textAlign:'center'}}>Price High To Low </MenuItem>
            </Select>
          </div>
            
        </div>
      </div>
          <div className={classes.page_control} style={{border:'none'}}>
            <div className={classes.show}>
              <p>
                Showing {from}–{to} of {filteredartciles.length} results
              </p>
            </div>
            <div className={classes.control}>
              {/* <button onClick={prev2page}>
                <MdKeyboardDoubleArrowLeft className={classes.icon1} />
              </button> */}
              <button onClick={prevpage}>
                <MdKeyboardArrowLeft className={classes.icon1} />
              </button>
              {numbers.map((n, i) => {
  if (pagenbroute === 1) {
    if (n === pagenbroute || n === pagenbroute + 1 || n === pagenbroute + 2) {
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
    }
  } else {
    if (
      n === pagenbroute - 1 ||
      n === pagenbroute ||
      n === pagenbroute + 1
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
    }
  }
  return null;
})}
              <button onClick={nextpage}>
                <MdKeyboardArrowRight className={classes.icon1} />
              </button>
              {/* <button onClick={next2page}>
                <MdKeyboardDoubleArrowRight className={classes.icon1} />
              </button> */}
            </div>
          </div>
          {sortBooks(sortBy).length === 0 ? 
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>No Books <br/>were found!</h1>
          </div>
          :
      <div style={{width:'100%'}}>
        {listview === "grid" && (
          <div className={classes.booksgridview} >
            {sortBooks(sortBy).map((props) => {
              const calculateAverageRating = () => {
                if (
                  !props.bookreview ||
                  !Array.isArray(props.bookreview) ||
                  props.bookreview.length === 0
                ) {
                  return 0; // Return 0 if there are no reviews or if bookreview is not an array
                }

                const validRatings = props.bookreview.filter(
                  (review) => !isNaN(parseFloat(review.rate))
                );

                if (validRatings.length === 0) {
                  return 0; // Return 0 if there are no valid ratings
                }

                const totalRatings = props.bookreview.reduce(
                  (accumulator, review) =>
                    accumulator + parseFloat(review.rate),
                  0
                );
                let reviewsCount = props.bookreview.length;

                return totalRatings / reviewsCount;
              };

              const averageRate = calculateAverageRating();
              return (
                <div className={classes.card_container}
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(addSelectedBook(props));
                      navigate(`/bookdetails/${props.id}`);
                    }}
                  >
                    <div className={classes.card_img} style={{borderRadius:'1em'}}>
                    {props.articleimage[0] ? (
                      <img
                        src={`${props.articleimage[0]?.link}`}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <img
                        src={img}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    )}{" "}
                      <div className={classes.iconsContainer}>
                      {favoriteData.some(
                              (book) => book._favid === props.id
                            ) ? (
                              <div className={classes.icon_con} style={{background:'var(--forth-color)'}} onClick={(event) => {
                                event.stopPropagation();
                                authCtx.deleteFavorite(props.id);
                              }}>
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            ) : (
                              <div className={classes.icon_con} 
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.addToFavorite(props);
                              }}
                                    >
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            )}
                        <div className={classes.icon_con}>
                          <HiOutlineBookOpen className={classes.icon} />
                        </div>
                        <div className={classes.icon_con} style={{width:'70%',height:'70%', margin:'15% auto',alignSelf:'center'}} 
                        onClick={(event) => {
                          event.stopPropagation();
                          authCtx.addToCart({props: props}); 
                        }}
                        >
                          <PiShoppingCartSimpleLight className={classes.icon} />
                        </div>
                      </div>
                    </div> 
                    <p className={classes.rate} style={{maxWidth:'100%',width:'fit-content',margin:'5% auto 1% auto'}}>
                        <Rating
                          style={{
                              color: "#712A2E",
                              margin:'0 .5em 0 0',
                          }}
                          size='small'
                          name="read-only"
                          value={averageRate}
                          precision={0.5}
                          readOnly
                      /><p style={{margin:'0.2em 0 0 0 '}}>{averageRate}/5</p>
                      </p>
                    <div className={classes.bookTitle}>
                    <h3 style={{ margin: "0" }}>{props.designation.length > 20 ? props.designation.substring(0, 30) + "..." : props.designation}</h3>
                      <p>
                        {props.dc_auteur.length > 20 ? props.dc_auteur.substring(0, 20) + "..." : props.dc_auteur}
                        </p>
                      <p
                        style={{
                          color: "var(--forth-color)",
                          fontWeight: 600,
                          fontSize: " calc(0.9rem + 0.4vw)",
                        }}
                      >
                        ${(props.prixpublic * 1).toFixed(2)}
                      </p>
                      <p style={{color:'#002B7D'}} 
                        dangerouslySetInnerHTML={{ __html: props.descriptif.length > 20 ? props.descriptif.substring(0, 20) + "..." : props.descriptif }} />
                    </div>
                  </div>
              );
            })}
          </div>
        )}
        {listview === "list" && (
          <div className={classes.booksrowview} >
            {sortBooks(sortBy).map((props) => {
              const calculateAverageRating = () => {
                if (
                  !props.bookreview ||
                  !Array.isArray(props.bookreview) ||
                  props.bookreview.length === 0
                ) {
                  return 0; // Return 0 if there are no reviews or if bookreview is not an array
                }

                const validRatings = props.bookreview.filter(
                  (review) => !isNaN(parseFloat(review.rate))
                );

                if (validRatings.length === 0) {
                  return 0; // Return 0 if there are no valid ratings
                }

                const totalRatings = props.bookreview.reduce(
                  (accumulator, review) =>
                    accumulator + parseFloat(review.rate),
                  0
                );
                let reviewsCount = props.bookreview.length;

                return totalRatings / reviewsCount;
              };

              const averageRate = calculateAverageRating();
              return (
                <div className={classes.listCard} key={props._id}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(addSelectedBook(props));
                  navigate(`/bookdetails/${props.id}`);
                }}>
                  <div className={classes.leftContainer}>
                     <div className={classes.imgCont}>
                    {props.articleimage[0] ? (
                      <img
                        src={`${props.articleimage[0]?.link}`}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <img
                        src={img}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    )}{" "}
                    </div>
                    <div className={classes.contentContainer}>
                      <p className={classes.bookRowTitle}>{props.designation}
                      <p className={classes.rate}>
                        <Rating
                          style={{
                              color: "#712A2E",
                              margin:'0 .5em 0 0',
                          }}
                          size='small'
                          name="read-only"
                          value={averageRate}
                          readOnly
                      /><p style={{margin:'0.2em 0 0 0 '}}>{averageRate}/5</p>
                      </p>
                      </p>
                      <p className={classes.bookRowAuthor}>{props.dc_auteur} LE : {props.dc_parution}</p>
                      <p className={classes.rateMob}>
                        <Rating
                          style={{
                              color: "#712A2E",
                              margin:'0 .5em 0 0',
                          }}
                          size='small'
                          name="read-only"
                          value={averageRate}
                          readOnly
                      /><p style={{margin:'0.3em 0 0 0 '}}>{averageRate}/5</p>
                      </p>
                      <p className={classes.bookRowDescription} 
                              dangerouslySetInnerHTML={{ __html: props.descriptif.length > 250 ? props.descriptif.substring(0, 250) + "..." : props.descriptif }}
                      />
                      <p className={classes.priceMob}>{(props.prixpublic * 1).toFixed(2)} $</p> 
                    </div>
                  </div>
            
            <div className={classes.rightContainer}>
            <div className={classes.iconslistContainer}>
                      {favoriteData.some(
                              (book) => book._favid === props.id
                            ) ? (
                              <div className={classes.icon_con} style={{background:'var(--forth-color)'}} 
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.deleteFavorite(props.id);
                              }}>
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            ) : (
                              <div className={classes.icon_con} 
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.addToFavorite(props);
                              }}
                                    >
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            )}
                        <div className={classes.icon_con}>
                          <HiOutlineBookOpen className={classes.icon} />
                        </div>
                        <div className={classes.icon_con}  
                        onClick={(event) => {
                          event.stopPropagation();
                          authCtx.addToCart({props: props}); 
                        }}
                        >
                          <PiShoppingCartSimpleLight className={classes.icon} />
                        </div>
                      </div>
            <p className={classes.price}>{(props.prixpublic * 1).toFixed(2)} $</p>
            <div className={classes.iconslistContainerMob} >
                      {favoriteData.some(
                              (book) => book._favid === props.id
                            ) ? (
                              <div className={classes.icon_con} style={{background:'var(--forth-color)'}} 
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.deleteFavorite(props.id);
                              }}>
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            ) : (
                              <div className={classes.icon_con} 
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.addToFavorite(props);
                              }}
                                    >
                                <IoHeartOutline className={classes.icon} />
                              </div>
                            )}
                        <div className={classes.icon_con}>
                          <HiOutlineBookOpen className={classes.icon} />
                        </div>
                        <div className={classes.icon_con}  
                        onClick={(event) => {
                          event.stopPropagation();
                          authCtx.addToCart({props: props}); 
                        }}
                        >
                          <PiShoppingCartSimpleLight className={classes.icon} />
                        </div>
                      </div>
             </div>
            
          </div>
              );
            })}
          </div>
        )}
        
      </div>

          }
          <div className={classes.page_control}>
            <div className={classes.show}>
              <p>
                Showing {from}–{to} of {filteredartciles.length} results
              </p>
            </div>
            <div className={classes.control}>
              {/* <button onClick={prev2page}>
                <MdKeyboardDoubleArrowLeft className={classes.icon1} />
              </button> */}
              <button onClick={prevpage}>
                <MdKeyboardArrowLeft className={classes.icon1} />
              </button>
              {numbers.map((n, i) => {
  if (pagenbroute === 1) {
    if (n === pagenbroute || n === pagenbroute + 1 || n === pagenbroute + 2) {
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
    }
  } else {
    if (
      n === pagenbroute - 1 ||
      n === pagenbroute ||
      n === pagenbroute + 1
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
    }
  }
  return null;
})}
              <button onClick={nextpage}>
                <MdKeyboardArrowRight className={classes.icon1} />
              </button>
              {/* <button onClick={next2page}>
                <MdKeyboardDoubleArrowRight className={classes.icon1} />
              </button> */}
            </div>
          </div>
    </div>
  );
};

export default BooksList;
