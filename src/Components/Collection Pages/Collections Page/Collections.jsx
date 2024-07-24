import React, { useContext, useEffect, useState } from "react";
import classes from "./Collections.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";
import { addCollection } from "../../Common/redux/productSlice";
import { IoSearchOutline } from "react-icons/io5";
import data from '../../../Data.json'
import Deals from "../../Home Page/Deals/Deals";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import placeholder from '../../../assets/Collectionplaceholder.png'
import nodata from '../../../assets/noCollabFound.svg'

const CollectionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const [recordsPerPage, setrecordsPerPage] = useState(20);

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
      setpagenbroute(pagenbroute + 1);
    }
  };
  const next2page = () => {
    setCurrentPage(pagenb);
    setpagenbroute(pagenb);
  };
  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id);
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

  useEffect(() => {
    if (currentpage === pagenb) {
      setto(authCtx.collections?.length);
    } else if (authCtx.collections?.length === 0) {
      setto(0);
    } else {
      setto(currentpage * recordsPerPage);
    }
    if (authCtx.collections?.length === 0) {
      setfrom(0);
    } else {
      setfrom(currentpage * 20 - 19);
    }
  }, [currentpage, authCtx.collections, recordsPerPage]);

  const [visibleItems, setVisibleItems] = useState(4);

  return (
    <>
      <div className={classes.bigContainer}>
        <div className={classes.header}>
          <h1>{data.Collections.CollectionsPage.title[language]}</h1>
          <p>{data.Collections.CollectionsPage.description[language]}</p>
        </div>

        {records.length === 0 ? (
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>No Collections <br />were found!</h1>
          </div>
        ) : (
          <div className={classes.data}>
            {records.map((props) => {
              return (
                <div key={props.id} className={classes.logo_con} onClick={() => {
                  dispatch(addCollection(props));
                  navigate(`/collections/${props.id}/details`);
                }}>
                  <div className={classes.content}>
                    {props?.image !== null ? (
                      <img
                        src={`${props.image}`}
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
                    <p>{props.nom.length > 10 ? props.nom.substring(0, 10) + "..." : props.nom}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
        <Deals />
      </div>
    </>
  );
};

export default CollectionsPage;
