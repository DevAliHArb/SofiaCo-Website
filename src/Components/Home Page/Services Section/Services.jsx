import React, { useContext, useEffect, useState } from "react";
import classes from "./Services.module.css";
import data from "../../../Data.json";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Common/authContext";

const Services = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );

  const favoriteData = useSelector((state) => state.products.favorites);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/services`
      );
      console.log(response.data?.data);
      setServices(response.data?.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
    }
  };

  return (
    <div className={classes.big_container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <h1>{data.HomePage.OurServices?.title[language]}</h1>
          <p>{data.HomePage.OurServices?.description[language]}</p>
        </div>

        <div class="hex_container">
          {services.map((item, index)=>{
            return(
              <div class="hex_item">
    <div class="hex_content"> 
      <img src={item.icon} alt="Icon 1"/>
      <p>Text 1</p>
    </div>
  </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
