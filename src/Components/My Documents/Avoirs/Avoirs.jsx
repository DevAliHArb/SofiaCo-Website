import React, { useContext, useEffect, useState } from "react";
import classes from "./Avoirs.module.css";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EmptyCart from "../../../assets/EmptyOrder.png";

import { Button, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CommonCard from "../Common Card/CommonCard";
import AuthContext from "../../Common/authContext";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import SearchIcon from "@mui/icons-material/Search";


const { RangePicker } = DatePicker;

const Avoirs = () => {
  const getcat = () => {
    const storedValue = localStorage.getItem("selectedOrderCategory");
    if (storedValue) {
      return parseInt(storedValue, 10); // Convert the stored value to an integer
    }
    return 0;
  };

  const cat = getcat();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentpage, setCurrentPage] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [pagenbroute, setpagenbroute] = useState(1);


  useEffect(() => {
    const nonHistoryOrders = authCtx.mydocuments?.filter(
      (item) => item.b_usr_documenttype_id === 21 || item.b_usr_documenttype_id === 22
    );
    setData(nonHistoryOrders);
  }, [authCtx.mydocuments]);

 
  const filtereddata = data.filter((item) => {
    const itemDate = new Date(item.datecreation);
    const normalizedItemDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
  
    const matchesSearch =
      searchQuery === "" ||
      item.numero.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesDateRange =
      (!startDate || normalizedItemDate >= new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) &&
      (!endDate || normalizedItemDate <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
  
  
    return matchesSearch && matchesDateRange;
  });


  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filtereddata?.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(filtereddata?.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1);
    }
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
  return (
    <div className={classes.ordertrack_con}>
    <div className={classes.filters}>
      
    <div
          style={{
            width: "100%",
            borderRadius: "20px",
            background: "#fff",
            border: "1px solid #f3f3f3",
            // padding: "1% 0",
          }}
          className={classes.custom_select_mob}
        >
          <input
            type="text"
            placeholder={language === 'eng' ? "Search" : "Recherche" }
            value={searchQuery}
            className={classes.input}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              borderRadius: "20px",
              padding: "0em 0em 0 1em",
              background: "var(--accent-color)",
              margin: "auto 0",
            }}
          />
          <button
            className={classes.btn1}
          >
            <SearchIcon />
          </button>
        </div>
        
      <RangePicker
        onChange={(dates) => {
          setStartDate(dates ? new Date(dates[0]) : null);
          setEndDate(dates ? new Date(dates[1]) : null);
        }}
        style={{ marginLeft: "1em" }}
      />
    </div>
      { (
        <>
          <div style={{ margin: "0 0 3em 0" }}>
            {/* {loading && <CircularProgress style={{marginTop:"5em",color:'var(--primary-color)'}}/>} */}
            {records?.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "2em",
                  padding: "5%",
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    width: "fit-content",
                    margin: "auto",
                    color: "#fff",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.7rem + .3vw)",
                  }}
                >
                  <div style={{ width: "fit-content", margin: "auto" }}>
                    <img
                      alt="EmptyCart"
                      src={EmptyCart}
                      style={{ width: "13em", height: "auto" }}
                    />
                  </div>
                  <h1
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {language === "fr"
                      ? "Vous n'avez pas encore passé de commande !"
                      : "You haven’t made any orders yet!"}
                  </h1>
                  <button
                    className={classes.btn}
                    onClick={() => navigate("/books")}
                  >
                    {language === "fr"
                      ? "Commencer vos achats"
                      : "Start shopping"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={classes.headerss}>
                  <h3>
                    {language === "eng"
                      ? "Reference Number"
                      : "Numéro de référence"}
                  </h3>
                  <h3>{language === "eng" ? "Date" : "Date"}</h3>
                  <h3>{language === "eng" ? "Total" : "Total"}</h3>
                  <h3>{language === "eng" ? "Download" : "Télécharger"}</h3>
                </div>
                {records?.map((props) => {
                  return (
                    <>
                      <div
                        // onClick={() =>
                        //   setisSelected(true) &
                        //   setselectedOrder(props) &
                        //   setcategoryId(props.status_id) &
                        //   window.scrollTo({ top: 0 })
                        // }
                      >
                        <CommonCard data={props} />
                      </div>
                    </>
                  );
                })}

                <div className={classes.page_control}>
                  <div className={classes.control}>
                    <button
                      onClick={prevpage}
                      style={{ background: "transparent" }}
                    >
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
                              pagenbroute === n
                                ? classes.selectednb
                                : classes.nb
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
                          <span key={i} className={classes.ellipsis}>
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={nextpage}
                      style={{ background: "transparent" }}
                    >
                      <FaArrowRightLong className={classes.icon1} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {/* {showPopup && (
        <ConfirmationPopup
          message={"Are you sure you want to delete this Order?"}
          onConfirm={CancleOrderHandler}
          onCancel={() => setShowPopup(false)}
          showPopup={showPopup}
        />
      )} */}
    </div>
  );
};

export default Avoirs;
