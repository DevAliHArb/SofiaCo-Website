import React from 'react'
import classes from './ViewTab.module.css'
import RatingSummary from './Rating Summary/RatingSummary'
import Reviews from './Reviews'

const ViewTab = () => {
  return (
    <div className={classes.tabview}>
        <div className={classes.tab_content}>
        <div className={classes.summary}>
            <div className={classes.vd_con}></div>
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