import React, { useEffect, useState, useContext } from "react";
import classes from "./Hero.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "@hooks/useNavigate";
import AuthContext from "../../../../Components/Common/authContext";

const CatHero = ({ categoryData }) => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the title - handle different data structures
  const getTitle = () => {
    if (categoryData?.second_title) {
      return categoryData.second_title;
    }
    // Check for type_nom (subcategory) or nom (category/subsubcategory)
    return categoryData?.type_nom || categoryData?.nom || "";
  };

  return (
    <>
      <div className={classes.home_container} style={{ position: "relative" }}>
        <div
          id="new_products"
          style={{ position: "absolute", top: "60%" }}
        ></div>
        <div className={classes.swiper_container} style={{width:'100%',display:"flex"}}>
          <div className={classes.slides}>
            {/* <div style={{ position: "absolute", top: "0%",left:'0',width:'100%',height:"100%",background:"linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))",zIndex:"2" }}/> */}
            <div className={classes.data}>
              <h1>{getTitle()}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatHero;
