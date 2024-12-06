import React, { useEffect } from "react";
import classes from "./CheckOutSummary.module.css";
import { useSelector } from "react-redux";
import { Button, Form, Input } from 'antd';
import { useState } from "react";
import Radio from '@mui/material/Radio';
import { Divider} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import CartSidebar from "../../Common/Cart SideBar/CartSidebar";

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
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/order_invoices/${id}`);
      // console.log('Response data:', response.data);
      setData(response.data.data || {})
    } catch (error) {
      // console.error('Error fetching addresses:', error);
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
            <div className={classes.imageContent}>
              <h2 style={{margin:'0'}}>{language === "eng" ? "My Basket" : "Mon Panier"}</h2>
              <p style={{margin:'.2em 0 0 0'}}>{language === "eng" ? "/ My Basket" : "Accueil /Mon Panier"}</p>
            </div>
        </div>
      <div className={classes.shopping_con}>
      <div className={classes.shopping}>
            <>
            <h2 onClick={()=>console.log(data)} style={{color:"var(--accent-color)",borderBottom:"1px solid #6E90A9",paddingBottom:'1em',fontFamily:'var(--font-family)',fontSize:'calc(1.2rem + .3vw)',marginTop:"0",fontWeight:'500'}}>{language === 'eng' ? "Commande" : "Order" } #{data.id}</h2>
              <CheckOutSummaryItem data={data.order_invoice_items}/>
            <div className={classes.container}>
                <h2 style={{color:"var(--accent-color)",fontFamily:'var(--font-family)',fontSize:'calc(1.2rem + .3vw)',marginTop:"0",fontWeight:'500'}}>{language === 'eng' ? "Shipping Address" : "Adresse de livraison" }</h2>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.8em 0 auto 0'}}/>
               <div>
                <p style={{fontSize:'calc(.9rem + .3vw)'}}>{data.user_address?.name} <button style={{cursor:"auto",border:'none',backgroundColor:'var(--secondary-color)',color:'var(--forth-color)',borderRadius:'.3em',marginLeft:'7%',padding:'.3em 1em',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'medium'}}>{data.user_address?.title}</button></p>
                <p>{data.user_address?.address}, {data.user_address?.city}, {data.user_address?.postalcode}</p>
                <p>{data.user_address?.country}</p>
               </div>
            </div>
                <h2 style={{color:"var(--accent-color)",fontFamily:'var(--font-family)',fontSize:'calc(1.2rem + .3vw)',margin:'3em 0 1em 0',fontWeight:'500'}}>{language === 'eng' ? "Payment Method" : "Mode de paiement" }</h2>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.5em 0 auto 0'}}/>
               
            </div>
            
            </div>
            </>
      </div>
      <div className={classes.total_con } id="fixed-component">
      <div className={classes.total_conCard } id="fixed-component">
        <div className={classes.total}>
          <div className={classes.totalrows}>
            <h2>{language === 'eng' ? "My Basket" : "Mon Panier" }</h2>
            <p style={{ textAlign: "end" }}>( {data.order_invoice_items?.length} {language === 'eng' ? "ITEMS" : "ARTICLES" } )</p>
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
            <p>{language === 'eng' ? "Shipping costs" : "Frais de port" }</p>
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
            <p >{language === 'eng' ? " Delivery date" : "Date de livraison" }</p>
            <p >{formatDate(data.date)}</p>
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
