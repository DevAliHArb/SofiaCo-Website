import React, { useEffect } from "react";
import classes from "./CheckOutSummary.module.css";
import { useSelector } from "react-redux";
import { Button, Form, Input } from 'antd';
import bg from "../../../assets/companiesbg.svg";
import  EmptyCart from "../../../assets/EmptyCart.png";
import quick from "../../../assets/cartimgs/HighQuality.png";
import customerservice from "../../../assets/cartimgs/FreeShipping.png";
import contactUsImage from '../../../assets/contactUsImage.png'
import perfect from "../../../assets/cartimgs/Support.png";
import secure from "../../../assets/cartimgs/WarrantyProtection.png";
import { GoTag } from "react-icons/go";
import { useState } from "react";
import Radio from '@mui/material/Radio';
import visa from '../../../assets/visa_logo.png';
import master from "../../../assets/master_logo.png";
import { Divider} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import CartSidebar from "../../Common/Cart SideBar/CartSidebar";

// import PopupAdressesModal from "./Popups/PopupAdressesModal";
// import PopupPaymentModal from "./Popups/PopupPaymentModal";
import CheckOutSummaryItem from "./CheckOutSummaryItem";
import axios from "axios";

const { TextArea } = Input;

const CheckOutSummary = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const productData = useSelector((state) => state.products.productData);
  const userInfo = useSelector((state) => state.products.userInfo);
  const [totalAmt, setTotalAmt] = useState(""); 
  const [value, setValue] = React.useState('standard');
  const [isFixed, setIsFixed] = React.useState(true);
  const [isContainerVisible, setContainerVisible] = useState(true);
  const [addressmodalopen, setAdressModalOpen] = React.useState(false);
  const handleAdressOpen = () =>{ setAdressModalOpen(true);console.log('testtt')}
  const [paymentmodalopen, setPaymentModalOpen] = React.useState(false);
  const handlePaymentOpen = () => setPaymentModalOpen(true);
  const [data, setData] = useState({});

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toDateString();
    return `${formattedDate}`;
  };

  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/order_invoices/${id}`);
      console.log('Response data:', response.data);
      setData(response.data.data || {})
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
useEffect(() => {
  fetchOrder();
}, []);


  useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item?.quantity * item.price;
      return price;
    });
    setTotalAmt(price.toFixed(2));
  }, [productData]);

  function calculateTotalPrice(orderInvoiceItems) {
    let totalPrice = 0;

    orderInvoiceItems?.forEach(item => {
        totalPrice += item.quantity * parseFloat(item.price);
    });

    return totalPrice.toFixed(2);
}
const maskConstant = (constant) => {
  if (typeof constant === "string") {
    const visibleChars = constant.slice(-4); // Extract last four characters
    const hiddenChars = "*".repeat(Math.max(0, constant.length - 4)); // Replace rest with asterisks
    return hiddenChars + visibleChars;
  } else {
    // Handle other types as needed
    return constant;
  }
};
  return (
    <div className={classes.cart_container}>
      <div className={classes.contactImageCont} >
            <img src={contactUsImage} alt='registerImage' style={{height:'100%'}} className={classes.contactImage}/>
            <div className={classes.imageContent}>
              <h2 style={{margin:'0'}}>Mon Panier</h2>
              <p style={{margin:'.2em 0 0 0'}}>Home / Mon Panier</p>
            </div>
        </div>
      <div className={classes.shopping_con}>
      <div className={classes.shopping}>
            <>
            <h2 onClick={()=>console.log(data)} style={{color:"var(--accent-color)",borderBottom:"1px solid #6E90A9",paddingBottom:'1em',fontFamily:'Montserrat',fontSize:'calc(1.2rem + .3vw)',marginTop:"0",fontWeight:'500'}}>Order #{data.id}</h2>
              <CheckOutSummaryItem data={data.order_invoice_items}/>
            <div className={classes.container}>
                <h2 style={{color:"var(--accent-color)",fontFamily:'Montserrat',fontSize:'calc(1.2rem + .3vw)',marginTop:"0",fontWeight:'500'}}>Shipping Address</h2>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.8em 0 auto 0'}}/>
               <div>
                <p style={{fontSize:'calc(.9rem + .3vw)'}}>{data.user_address?.name} <button style={{cursor:"auto",border:'none',backgroundColor:'var(--secondary-color)',color:'var(--forth-color)',borderRadius:'.3em',marginLeft:'7%',padding:'.3em 1em',fontWeight:'500',fontFamily:'Montserrat',fontSize:'medium'}}>{data.user_address?.title}</button></p>
                <p>{data.user_address?.address}, {data.user_address?.city}, {data.user_address?.postalcode}</p>
                <p>{data.user_address?.country}</p>
               </div>
            </div>
                <h2 style={{color:"var(--accent-color)",fontFamily:'Montserrat',fontSize:'calc(1.2rem + .3vw)',margin:'3em 0 1em 0',fontWeight:'500'}}>Payment Method</h2>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.5em 0 auto 0'}}/>
               <div>
                <p style={{fontSize:'calc(.8rem + .3vw)'}}>
                  <img alt='visa' src={data.user_payment?.card_type === 'Master' ? master : visa} style={{width:'auto',height:'1.5em',margin:'0 1em -.5em 1em'}}/>
                  {maskConstant(data.user_payment?.card_number)}<span style={{color:'var(--primary-color)',paddingLeft:'2em',fontWeight:'400'}}>Expires {data.user_payment?.month}/{data.user_payment?.year}</span> </p>
                  
               </div>
            </div>
            
            </div>
            </>
      </div>
      <div className={classes.total_con } id="fixed-component">
      <div className={classes.total_conCard } id="fixed-component">
        <div className={classes.total}>
          <div className={classes.totalrows}>
            <h2>Mon Panier</h2>
            <p style={{ textAlign: "end" }}>( {data.order_invoice_items?.length} ITEMS )</p>
          </div>
          {/* <div className={classes.totalrows}>
            <p>Total TTC</p>
            <p style={{ textAlign: "end" }}>$ 319.98</p>
          </div> */}
          <div className={classes.totalrows}>
            <p>Total HT</p>
            <p style={{ textAlign: "end" }}>{data.base_price}{data.currency === 'usd' ? '$' : '€' }</p>
          </div>
          <div className={classes.totalrows}>
            <p>Total TVA</p>
            <p style={{ textAlign: "end" }}>{(data.base_price - calculateTotalPrice(data.order_invoice_items)).toFixed(2)}{data.currency === 'usd' ? '$' : '€' }</p>
          </div>
          <div className={classes.totalrows}>
            <p>Frais de port</p>
            <p style={{ textAlign: "end" }}>{(data.total_price - calculateTotalPrice(data.order_invoice_items)).toFixed(2)}{data.currency === 'usd' ? '$' : '€' }</p>
          </div>
          {/* <div className={classes.totalrows}>
            <p>Remise</p>
            <p style={{ textAlign: "end" }}>$ 0.00</p>
          </div> */}
          <Divider
            className={classes.divider}
          />
          <div className={classes.totalrows} >
            <p>TOTAL </p>
            <p style={{ textAlign: "end" }}>{data.total_price}{data.currency === 'usd' ? '$' : '€' }</p>
          </div>
        </div>
        <div className={classes.totalrows} style={{display:"flex",flexWrap:'wrap',justifyContent:'space-between',gap:'0',marginBottom:'1.5em'}}>
            <p >Date de livraison prévue</p>
            <p >{formatDate(data.date)}</p>
          </div>
          
      </div>
      </div>
      </div>
      <div className={classes.char_container}>
        <div style={{position:'absolute',width:'100%',height:'100%',zIndex:'-1',top:'0',left:'0'}}>
          <img src={bg} alt="" style={{height:'100%',objectFit:'cover',minWidth:'100%',width:'auto'}}/>
        </div>
      <div className={classes.char} >
        <div style={{display:'flex',flexDirection:'row'}}>
          <img src={quick} alt="" className={classes.char_img} style={{ margin: "2% auto" }} /> 
          <div style={{flex:'1',paddingLeft:'1em'}}>
          <h3>High Quality</h3>
          <p >crafted from top materials </p>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <img src={secure} alt="" className={classes.char_img} style={{ margin: "3.5% auto" }} />
          <div style={{flex:'1',paddingLeft:'1em'}}>
          <h3>Warranty Protection</h3>
          <p >Over 2 years</p>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <img src={customerservice} alt="" className={classes.char_img} style={{ margin: "3.5% auto" }} />
          <div style={{flex:'1',paddingLeft:'1em'}}>
          <h3>Free Shipping</h3>
          <p >Order over 150 $</p>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <img src={perfect} alt="" className={classes.char_img} style={{ margin: "2% auto" }} />
          <div style={{flex:'1',paddingLeft:'1em'}}>
          <h3>24 / 7 Support</h3>
          <p>Dedicated support</p>
          </div>
        </div>
        </div>
      </div>
      <CartSidebar />
      {/* <PopupAdressesModal  open={addressmodalopen} handleClose={handleAdressClose} isselectedPayment={(data)=>setselectedPayment(data)} isselectedAddress={(data)=>setselectedAddress(data)}/> */}
      {/* <PopupPaymentModal  open={paymentmodalopen} handleClose={handlePaymentClose} isselectedPayment={(data)=>setselectedPayment(data)} isselectedAddress={(data)=>setselectedAddress(data)}/> */}
    </div>
  );
};

export default CheckOutSummary;
