import React from 'react'
import classes from './ViewTab.module.css'
import RatingSummary from './Rating Summary/RatingSummary'
import Reviews from './Reviews'

const ViewTab = () => {
  return (
    <div className={classes.tabview}>
        <div className={classes.tab_content}>
        <div className={classes.summary}>
            <div className={classes.vd_con}>
            <iframe
  width="100%"
  height="450"
  src={`https://www.youtube.com/embed/WhRJGaORPPw?si=fyAC9zme898YIHAD`}
  frameBorder="0"
  allowFullScreen
  title="Embedded YouTube Video"
></iframe>
            </div>
            <RatingSummary />
        </div>
        <div className={classes.review}>
            <Reviews />
        </div>
        </div>
    </div>
  )
}

export default ViewTab