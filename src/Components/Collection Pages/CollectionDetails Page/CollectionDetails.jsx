import React, { useContext, useEffect, useState } from "react";
import classes from "./CollectionDetails.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
// import BookHeroImage from '../../../assets/BookHeroImage.png'
import nodata from "../../../assets/nobookfound.svg";
import { IoSearchOutline } from "react-icons/io5";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
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


const CollectionDetailsPage = () => {
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(12); 

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Function to handle changes in the input value
  
  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = authCtx.articles?.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(authCtx.articles?.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);


  
  const user = useSelector((state) => state.products.userInfo);
  const favoriteData = useSelector((state) => state.products.favorites);
  const collectionData = useSelector((state) => state.products.collection[0]);
  

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

  
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken();
  
  const handleSuivreClick = async (id) => {
    if (!user) {
      // If user is not defined, throw an error
      toast.error('Please log in first');
      return;
  }
    try {
      const response = await axios.post(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`, {
        collection_id: id,
      }, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
      console.log(response.data);
      toast.success(`${collectionData.nom} subscribed successfully!`) // You can handle the response here
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.error)
    }
  };
  

  useEffect(() => {
    if (currentpage == pagenb) {
      setto(authCtx.articles?.length);
    } else if (authCtx.articles?.length === 0 ) {
      setto(0);
    } else{
      setto(currentpage * recordsPerPage);
    }
    if (authCtx.articles?.length === 0 ) {
      setfrom(0);
    }else {
      setfrom(currentpage * 12 - recordsPerPage - 1);
    }
  }, [currentpage, authCtx.articles, recordsPerPage]);

  const [visibleItems, setVisibleItems] = useState(4);
 
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  
  const filteredBooks = records?.filter((book) => book.dc_collection === collectionData.nom);

  const filteredData = searchText
    ? filteredBooks.filter(item => item.designation.toLowerCase().includes(searchText.toLowerCase()))
    : filteredBooks;
  return (
    <>
      <div className={classes.bigContainer}>
      <div className={classes.heroContainer} >
            <img src={BookHeroImage} alt='HeroImage' style={{height:'100%'}} className={classes.heroImage}/>
            <div className={classes.imageContent}>
              <h2 style={{margin:'0'}}>{collectionData.name}</h2>
              <p style={{margin:'.2em 0 0 0', textTransform:'capitalize'}}>Collections / {collectionData.nom}</p>
            </div>
        </div>
       <div className={classes.detailsContainer}>
        
      <div className={classes.cardContainer}>
        <div className={classes.colabImage} style={{background:`var(--secondary-color)`}}>
                      
                       {collectionData?.image !== null ? (
                      <img
                        src={`https://api.leonardo-service.com/img/${collectionData.image}`}
                        alt=""
                        width="100%"
                        height="100%"
                        className={classes.imggg}
                      />
                    ) : (
                      <img
                        src={placeholder}
                        alt=""
                        className={classes.imggg}
                        width="100%"
                        height="100%"
                      />
                     )} 
                      {/* <p style={{color:`#fff`, fontFamily:'Montserrat',fontSize:"1em", textTransform:'capitalize'}}>{collectionData.nom}</p> */}
           </div>
        <div className={classes.card} >
          <h1 style={{fontWeight:'600', textTransform:'capitalize'}}>{collectionData.nom}</h1>
          <p style={{color:'var(--accent-color)',fontWeight:"500", margin:'.5em 0'}}>{collectionData.discriptif}</p>
          <button className={classes.suivreBtn} onClick={()=>handleSuivreClick(collectionData.id)}>Subscribe</button>
        </div>
      </div> 

       <div className={classes.header} >
          <div className={classes.title}>
            <h1>De la Collection </h1>
          </div>
          <div className={classes.line}></div>
          <div style={{
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
                </div>
        </div>
        {filteredBooks.length === 0 ? 
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
                    <div className={classes.card_container}
                        onClick={(event) => {
                          event.stopPropagation();
                          dispatch(addSelectedBook(props));
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
                          className={classes.imggg}
                        />
                      ) : (
                        <img
                          src={bookplaceholder}
                          alt=""
                          className={classes.imggg}
                          width="100%"
                          height="100%"
                        />
                      )}
                        <div className={classes.iconsContainer}>
                          {favoriteData.some(
                            (book) => book._favid === props.id
                          ) ? (
                            <div
                              className={classes.icon_con}
                              style={{ background: "var(--forth-color)" }}
                              onClick={(event) => {
                                event.stopPropagation();
                                authCtx.deleteFavorite(props.id);
                              }}
                            >
                              <IoHeartOutline className={classes.icon} />
                            </div>
                          ) : (
                            <div
                              className={classes.icon_con}
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
                          <div
                            className={classes.icon_con}
                            style={{
                              width: "70%",
                              height: "70%",
                              margin: "15% auto",
                              alignSelf: "center",
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToCart({props: props}); 
                            }}
                          >
                            <PiShoppingCartSimpleLight className={classes.icon} />
                          </div>
                        </div>
                      </div> 
                        {/* <p className={classes.rate} style={{maxWidth:'100%',width:'fit-content',margin:'0% auto 1% auto'}}>
                            <Rating
                              style={{
                                  color: "#712A2E",
                                  margin:'0 .5em 0 0',
                              }}
                              size='small'
                              name="read-only"
                              value={props.rate}
                              readOnly
                          /><p style={{margin:'0.2em 0 0 0 '}}>{props.rate}/5</p>
                          </p> */}
                        <div className={classes.bookTitle}>
                        <h3>{props.designation.length > 20 ? props.designation.substring(0, 20) + "..." : props.designation}</h3>
                        <p>{props.dc_auteur.length > 20 ? props.dc_auteur.substring(0, 20) + "..." : props.dc_auteur}</p>
                          <p
                            style={{
                              color: "var(--forth-color)",
                              fontWeight: 600,
                              fontSize: " calc(0.9rem + 0.4vw)",
                            }}
                          >
                        ${(props.prixpublic * 1).toFixed(2)}
                          </p>
                          <p dangerouslySetInnerHTML={{ __html: props.descriptif && props.descriptif.length > 20 ? props.descriptif.substring(0, 20) + "..." : props.descriptif }} />
                        </div>
                      </div>
                  );
                })}
              </div>
}
            
            <div className={classes.page_control}>
                <div className={classes.show}>
                  <p>
                    Showing {from}–{to} of {authCtx.articles?.length} results
                  </p>
                </div>
                <div className={classes.control}>
                  <button onClick={prev2page}>
                    <MdKeyboardDoubleArrowLeft className={classes.icon1} />
                  </button>
                  <button onClick={prevpage}>
                    <MdKeyboardArrowLeft className={classes.icon1} />
                  </button>
                  {numbers.map((n, i) => {
        // Check if it's the last two numbers or the first three numbers
        if (
          (pagenbroute >= pagenb - 1 && n >= pagenb - 2) ||
          (pagenbroute <= 3 && n <= 3)
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
        // If it's neither the last two nor the first three numbers, and it's within the range, display ellipsis
        else if (
          pagenbroute > 3 &&
          pagenbroute < pagenb - 2 &&
          (n === pagenbroute - 1 || n === pagenbroute || n === pagenbroute + 1)
        ) {
          return (
            <button key={i} className={classes.nb}>
              ...
            </button>
          );
        }
        // Otherwise, return null to skip rendering
        return null;
      })}
                  <button onClick={nextpage}>
                    <MdKeyboardArrowRight className={classes.icon1} />
                  </button>
                  <button onClick={next2page}>
                    <MdKeyboardDoubleArrowRight className={classes.icon1} />
                  </button>
                </div>
              </div>
       </div>
      </div>
    </>
  );
};

export default CollectionDetailsPage;
