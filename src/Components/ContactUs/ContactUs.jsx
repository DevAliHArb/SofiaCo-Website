import React, { useEffect, useState } from "react";
import classes from "./ContactUs.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from "../../Data.json";


const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);

  return (
    <div className={classes.events}>
      <div className={classes.header}>
        <h1 className={classes.headerh1}>{data.Event.title[language]}</h1>
        <h2 className={classes.headerh2}>{data.Event.Subtitle[language]}</h2>
      </div>
      <div className={classes.content}>
      </div>
    </div>
  );
};

export default ContactUs;

