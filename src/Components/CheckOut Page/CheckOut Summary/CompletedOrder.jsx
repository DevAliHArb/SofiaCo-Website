import React, { useContext, useEffect, useState } from 'react'
import classes from './CompletedOrder.module.css'
import bookPlaceHolder from '../../../assets/bookPlaceholder.png';
import "react-toastify/dist/ReactToastify.css";
import Data from '../../../Data.json'
import AlsoSee from '../../Common Components/Also See/AlsoSee';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CompletedOrder = () => {
  const { id } = useParams();
  const [language, setLanguage] = React.useState('eng');
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API_IMAGE}/order_invoices/${id}`);
      // console.log('Response data:', response.data);
      setData(response.data.data || {})
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    }
  };
useEffect(() => {
  fetchOrder();
}, []);
  return (
    <div className={classes.auth_con}>
      <div className={classes.headTitles}>
        <h1 onClick={()=>console.log(data)}>Completed!</h1>
        <div style={{width:'fit-content',margin:"2em auto",display:'flex',flexDirection:"row",gap:"2em"}}>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'default'}}><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>1</span> {Data.Cart.title1[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'default'}} ><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>2</span> {Data.Cart.title2[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'default',borderBottom:".2em solid var(--primary-color)"}}><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>3</span> {Data.Cart.title3[language]}</h4>
        </div>
      </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
          <p style={{marginBottom:'0'}}>Thank you! 🎉</p>
          <p style={{marginTop:'0.2em'}}>Your order has been received</p>
          <div className={classes.imageContainer}>
            {(data?.order_invoice_items || []).map((props)=>{
              return (
                <div style={{position:'relative',width:'fit-content'}}>
                  <img src={props.article.articleimage[0]?.link ? props.article.articleimage[0].link : bookPlaceHolder} alt="" />
                  <p style={{position:'absolute',top:'0',right:"0",background:'var(--primary-color)',margin:'0',padding:".2em .45em",borderRadius:"50%",color:'#fff',fontSize:'calc(.9rem + .3vw)'}}>{props.quantity}</p>
                </div>
              )
            })}
          </div>
          <div className={classes.contentContainer}>
            <p>Order code:</p>
            <p style={{paddingLeft:'1em'}}>#{data?.id}</p>
            <p>Date:</p>
            <p style={{paddingLeft:'1em'}}>{new Date(data?.date).toDateString()}</p>
            <p>Total:</p>
            <p style={{paddingLeft:'1em'}}> {data?.currency === 'usd' ? '$' : '€'} {data.total_price}</p>
            <p style={{width:"9em"}}>Payment method:</p>
            <p style={{paddingLeft:'1em'}}>{data?.user_payment?.card_type}</p>
          </div>
          <button className={classes.btn} onClick={()=>navigate(`/account/order-tracking`)}> Track Order</button>
        </div>
        <AlsoSee/>
    </div>
  )
}

export default CompletedOrder