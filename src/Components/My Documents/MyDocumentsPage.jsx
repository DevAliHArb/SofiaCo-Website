import React, { useEffect, useRef, useState } from 'react'
import classes from './MyDocumentsPage.module.css'

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Commands from './Account Profile Page/Commands/Commands';
import data from '../../Data.json'
import { MenuItem, Select } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import OrderTracking from './Order Tracking/OrderTracking';
import Proforma from './Proforma/Proforma';
import Factures from './Factures/Factures';
import Avoirs from './Avoirs/Avoirs';
import MyOrders from './Orders/MyOrders';

const MyDocumentsPage = () => {
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
        <h1>{data.MyDocuments.title[language]}</h1>
        <div className={classes.titlesCard} id='fomponent'>
        <button onClick={()=>navigate(`/my-documents/proforma`)} style={{background: pageId === 'proforma' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button1.title[language]}</button>
        <button onClick={()=>navigate(`/my-documents/invoices`)} style={{background: pageId === 'invoices' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button2.title[language]}</button>
        {/* <button onClick={()=>navigate(`/my-documents/returns`)} style={{background: pageId === 'returns' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button3.title[language]}</button> */}

            <button onClick={()=>navigate(`/my-documents/assets`)} style={{background: pageId === 'assets' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button4.title[language]}</button>
            <button onClick={()=>navigate(`/my-documents/orders`)} style={{background: pageId === 'orders' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button5.title[language]}</button>
        </div>
        <div className={classes.titlesCard_mob} id='fomponent'>
        <Select
              style={{width:'100%'}}
              displayEmpty
              value={pageId}
              onChange={(e)=>navigate(`/my-documents/${e.target.value}`)}
              className={classes.select}
              IconComponent={() => (
                <ExpandMoreOutlinedIcon style={{ color: '#fff', marginLeft:'-1.5em' }} /> // Adjust color to white (#fff)
              )}
            >
                   <MenuItem value='proforma' style={{background: pageId === 'proforma' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button1.title[language]}</MenuItem>
        <MenuItem value='invoices' style={{background: pageId === 'invoices' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button2.title[language]}</MenuItem>
        {/* <MenuItem value='returns' style={{background: pageId === 'returns' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button3.title[language]}</MenuItem> */}

            <MenuItem value='assets' style={{background: pageId === 'assets' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button4.title[language]}</MenuItem>
            <MenuItem value='orders' style={{background: pageId === 'orders' ? 'var(--primary-color)' : ''}}>{data.MyDocuments.button5.title[language]}</MenuItem>
            </Select>
            </div>
        <div className={classes.contentContainer} style={  (pageId ==='wishlist' ||pageId === 'coupons')? {width:'90%' ,margin:'0 0 0 auto'}:{}}>
        <div className={classes.auth_bg} />
            {pageId == 'proforma' && <Proforma />}
            {pageId == 'invoices' && <Factures />}
            {/* {pageId == 'returns' && <OrderTracking />} */}
            {pageId == 'assets' && <Avoirs />}
            {pageId === 'orders' && <MyOrders/>}
        </div>
      </div>
    </div>
  )
}

export default MyDocumentsPage