import React, { useEffect, useState } from 'react'
import classes from './OurSelectionBanner.module.css'
import img from '../../../assets/ouselectionbanner.png'
import data from '../../../Data.json'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const OurSelectionBanner = ({props}) => {
  const navigate = useNavigate()
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const openInNewTab = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <div className={classes.banner} onClick={()=>console.log(props)}>
      <div className={classes.content}>
        <div className={classes.img_con}>
          <img src={props?.image1 ? props?.image1 : img} alt='banner' />
        </div>
        <div className={classes.data}>
          <h1>{language === 'eng' ? props?.title_en : props?.title_fr }</h1>
          <p style={{width:'100%'}}>{language === 'eng' ? props?.subtitle_en : props?.subtitle_fr }</p>
          <button onClick={()=>openInNewTab(props?.button_url)} className={classes.buttoncart}>{language === 'eng' ? props?.button_label_en : props?.button_label_fr }</button>
        </div>
      </div>
    </div>
  )
}

export default OurSelectionBanner