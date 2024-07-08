import React, { useEffect, useRef, useState } from 'react'
import classes from './AccountPage.module.css'

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AccountDetails from './Account Profile Page/Account Details/AccountDetails';
import Adresses from './Account Profile Page/Addresses/Adresses';
import Payment from './Account Profile Page/Payment/Payment';
import Coupons from './Account Profile Page/Coupons/Coupons';
import { useSelector } from 'react-redux';
// import Commands from './Account Profile Page/Commands/Commands';
import data from '../../Data.json'
import { MenuItem, Select } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

const AccountPage = () => {
    const navigate = useNavigate();
    const { pageId } = useParams();
    const location = useLocation();
    const userInfo = useSelector((state) => state.products.userInfo);
    const language = useSelector(
      (state) => state.products.selectedLanguage[0].Language
    );
    

    useEffect(() => {
        const handleScroll = () => {
          const footer = document.getElementById('footer');
          const fixedComponent = document.getElementById('fixedComponent');
    
          if (footer && fixedComponent) {
            const footerTop = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
    
            // setIsFixed(footerTop > windowHeight);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

  return (
    <div className={classes.contactUsContainer}>
      <div className={classes.accountContainer}>
        <h1>{data.AccountProfilePage.title[language]}</h1>
        <div className={classes.titlesCard} id='fomponent'>
        <button onClick={()=>navigate(`/account/profile`)} style={{background: pageId === 'profile' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.AccountDetails.title[language]}</button>
        <button onClick={()=>navigate(`/account/addresses`)} style={{background: pageId === 'addresses' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Adresses.title[language]}</button>
        <button onClick={()=>navigate(`/account/payments`)} style={{background: pageId === 'payments' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Payment.title[language]}</button>

            <button onClick={()=>navigate(`/account/order-tracking`)} style={{background: pageId === 'order-tracking' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.orders.title[language]}</button>
            <button onClick={()=>navigate(`/account/coupons`)} style={{background: pageId === 'coupons' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Coupons.title[language]}</button>
        </div>
        <div className={classes.titlesCard_mob} id='fomponent'>
        <Select
              style={{width:'100%'}}
              displayEmpty
              value={pageId}
              onChange={(e)=>navigate(`/account/${e.target.value}`)}
              className={classes.select}
              IconComponent={() => (
                <ExpandMoreOutlinedIcon style={{ color: '#fff', marginLeft:'-1.5em' }} /> // Adjust color to white (#fff)
              )}
            >
                   <MenuItem value='profile' style={{background: pageId === 'profile' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.AccountDetails.title[language]}</MenuItem>
        <MenuItem value='addresses' style={{background: pageId === 'addresses' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Adresses.title[language]}</MenuItem>
        <MenuItem value='payments' style={{background: pageId === 'payments' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Payment.title[language]}</MenuItem>

            <MenuItem value='order-tracking' onClick={()=>navigate(`/account/order-tracking`)} style={{background: pageId === 'order-tracking' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.orders.title[language]}</MenuItem>
            <MenuItem value='coupons' onClick={()=>navigate(`/account/coupons`)} style={{background: pageId === 'coupons' ? 'var(--primary-color)' : ''}}>{data.AccountProfilePage.Coupons.title[language]}</MenuItem>
            </Select>
            </div>
        <div className={classes.contentContainer} style={  (pageId ==='wishlist' ||pageId === 'coupons')? {width:'90%' ,margin:'0 0 0 auto'}:{}}>
        <div className={classes.auth_bg} />
            {pageId == 'profile' && <AccountDetails />}
            {pageId == 'addresses' && <Adresses />}
            {/* {pageId == 'order-tracking' && <Commands />} */}
            {pageId == 'payments' && <Payment />}
            {pageId === 'coupons' && <Coupons/>}
        </div>
      </div>
    </div>
  )
}

export default AccountPage