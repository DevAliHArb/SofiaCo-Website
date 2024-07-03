import React, { useEffect, useRef, useState } from 'react'
import classes from './AccountPage.module.css'

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AccountDetails from './Account Profile Page/Account Details/AccountDetails';
import Adresses from './Account Profile Page/Addresses/Adresses';
import Payment from './Account Profile Page/Payment/Payment';
import Coupons from './Account Profile Page/Coupons/Coupons';
import { useSelector } from 'react-redux';


const AccountPage = () => {
    const navigate = useNavigate();
    const { pageId } = useParams();
    const location = useLocation();
    const userInfo = useSelector((state) => state.products.userInfo);
    

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
        <div className={classes.titlesCard} id='fomponent'>
        <h2 onClick={()=>navigate(`/account/profile`)} style={{color: pageId === 'profile' ? 'var(--forth-color)' : '#fff',fontWeight: pageId === 'profile' ? '700' : '500'}}>My WishList</h2>
        <h2 onClick={()=>navigate(`/account/addresses`)} style={{color: pageId === 'addresses' ? 'var(--forth-color)' : '#fff',fontWeight: pageId === 'addresses' ? '700' : '500'}}>My WishList</h2>
        <h2 onClick={()=>navigate(`/account/payments`)} style={{color: pageId === 'payments' ? 'var(--forth-color)' : '#fff',fontWeight: pageId === 'payments' ? '700' : '500'}}>My WishList</h2>

            <h2 onClick={()=>navigate(`/account/order-tracking`)} style={{color: pageId === 'order' ? 'var(--forth-color)' : '#fff',fontWeight: pageId === 'order' ? '700' : '500'}}>My WishList</h2>
            <h2 onClick={()=>navigate(`/account/coupons`)} style={{color: pageId === 'coupons' ? 'var(--forth-color)' : '#fff',fontWeight: pageId === 'coupons' ? '700' : '500'}}>My Coupons</h2>
        </div>
        <div className={classes.contentContainer} style={  (pageId ==='wishlist' ||pageId === 'coupons')? {width:'90%' ,margin:'0 0 0 auto'}:{}}>
            {pageId == 'profile' && <AccountDetails />}
            {pageId == 'addresses' && <Adresses />}
            {pageId == 'payments' && <Payment />}
            {pageId === 'coupons' && <Coupons/>}
        </div>
      </div>
    </div>
  )
}

export default AccountPage