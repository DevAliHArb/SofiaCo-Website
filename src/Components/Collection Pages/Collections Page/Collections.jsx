import React, { useContext, useEffect, useState } from "react";
import classes from "./Collections.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
// import BookHeroImage from '../../../assets/BookHeroImage.png'
import { addCollection } from "../../Common/redux/productSlice";
import { IoSearchOutline } from "react-icons/io5";

import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import placeholder from '../../../assets/Collectionplaceholder.png'
import nodata from '../../../assets/noCollabFound.svg'


const CollectionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext)
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(15); 

  // Function to handle changes in the input value
  
  
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = searchText
    ? authCtx.collections?.filter(item => item.nom.toLowerCase().includes(searchText.toLowerCase()))
    : authCtx.collections;

  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(filteredData.length / recordsPerPage);
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

  console.log(records)
  

  useEffect(() => {
    if (currentpage == pagenb) {
      setto(authCtx.collections?.length);
    } else if (authCtx.collections?.length === 0 ) {
      setto(0);
    } else{
      setto(currentpage * recordsPerPage);
    }
    if (authCtx.collections?.length === 0 ) {
      setfrom(0);
    }else {
      setfrom(currentpage * 15 - 14);
    }
  }, [currentpage, authCtx.collections, recordsPerPage]);

  const [visibleItems, setVisibleItems] = useState(4);
 
  return (
    <>
      <div className={classes.bigContainer}>
      <div className={classes.heroContainer} >
            {/* <img src={BookHeroImage} alt='HeroImage' style={{height:'100%'}} className={classes.heroImage}/> */}
            <div className={classes.imageContent}>
              <h2 style={{margin:'0'}}>Collections</h2>
              <p style={{margin:'.2em 0 0 0'}}>Home / Collections</p>
            </div>
        </div>
        
      <div style={{
        width: "80%",
        maxWidth:"25em",
        display:'flex',
        flexDirection:'row',
        borderRadius:'.5em',
        background:'var(--secondary-color)',
        marginLeft:"10%"
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
          {records.length === 0 ?  
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>No Collections <br/>were found!</h1>
          </div>
          :
        <div className={classes.data}>
        {records.map((props) => {
              return (
                    <div key={props.id} className={classes.logo_con} style={{background:`var(--secondary-color)`}} onClick={() => {
                      dispatch(addCollection(props));
                      navigate(`/collection-details/${props.id}`);
                    }}>
                       {props?.image !== null ? (
                      <img
                        src={`https://api.leonardo-service.com/img/${props.image}`}
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
                      <p style={{color:`var(--primary-color)`, fontFamily:'Montserrat',fontSize:"1em", textTransform:'capitalize'}}>{props.nom.length > 10 ? props.nom.substring(0, 10) + "..." : props.nom}</p>
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
              <button onClick={prev2page}>
                <MdKeyboardDoubleArrowLeft className={classes.icon1} />
              </button>
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
              <button onClick={next2page}>
                <MdKeyboardDoubleArrowRight className={classes.icon1} />
              </button>
            </div>
          </div>
      </div>
    </>
  );
};

export default CollectionsPage;
