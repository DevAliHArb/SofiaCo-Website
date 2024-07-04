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
        `https://api.leonardo-service.com/api/bookshop/services?ecom_type=albouraq`
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

        <div className={classes.hex_container}>
          {services.slice(0,9).map((item, index) => {
            return (
              <div className={classes.hex_item}>
                <div className={classes.hex_content}>
                  <div className={classes.img_con}>
                  <img src={item.icon} alt="Icon 1" />
                  </div>
                  <h2 style={{color: index % 2 === 0 ? "var(--primary-color)" : "var(--secondary-color)"}}>
                    {language === "eng"
                      ? item.title_en.length > 14
                        ? item.title_en.slice(0, 14) + "..."
                        : item.title_en
                      : item.title_fr.length > 14
                      ? item.title_fr.slice(0, 14) + "..."
                      : item.title_fr}
                  </h2>
                  <p style={{color: index % 2 === 0 ? "var(--primary-color)" : "var(--secondary-color)"}}>
                    {language === "eng"
                      ? item.description_en.length > 40
                        ? item.description_en.slice(0, 40) + "..."
                        : item.description_en
                      : item.description_fr.length > 20
                      ? item.description_fr.slice(0, 20) + "..."
                      : item.description_fr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
