import React from 'react'
import classes from './OurSelectionBanner.module.css'
import img from '../../../assets/ouselectionbanner.png'
import data from '../../../Data.json'
import { useSelector } from 'react-redux'

const OurSelectionBanner = () => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  return (
    <div className={classes.banner}>
      <div className={classes.content}>
        <div className={classes.img_con}>
          <img src={img} alt='banner' />
        </div>
        <div className={classes.data}>
          <h1>{data.OurSelectionBanner.title[language]}</h1>
          <p>{data.OurSelectionBanner.description[language]}</p>
          <button className={classes.buttoncart}>{data.OurSelectionBanner.button[language]}</button>
        </div>
      </div>
    </div>
  )
}

export default OurSelectionBanner