import React, { useContext, useEffect } from "react";
import classes from "./Cart.module.css";
import { useSelector } from "react-redux";
import { Button, Form, Input } from 'antd';
import  EmptyCart from "../../assets/EmptyCart.png";
import Data from '../../Data.json'
import { GoTag } from "react-icons/go";
import { useState } from "react";
import { Divider, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CartSidebar from "../Common/Cart SideBar/CartSidebar";
import CartItem from "./CartItem";
// import CoupsDeCoeur from "../Common/CoupsDeCoeur Section/CoupsDeCoeur";
import AuthContext from "../Common/authContext";
import AlsoSee from "../Common Components/Also See/AlsoSee";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Cart = () => {

  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const authCtx = useContext(AuthContext)
  const productData = useSelector((state) => state.products.productData);
  const [totalAmt, setTotalAmt] = useState(""); 
  const [value, setValue] = React.useState('standard');
  const [TVA, setTVA] = useState(0);  
  const [totalWeight, settotalWeight] = useState(0); 
  const [isFixed, setIsFixed] = React.useState(true);
  const [order_invoice_items, setorder_invoice_items] = useState([]); 
  const [isContainerVisible, setContainerVisible] = useState(true);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleCheckout = () => {
    const outOfStockItems = productData.filter(item => item._qte_a_terme_calcule < 1);
    const removedItems = productData.filter(item => item?.removed);
    // console.log(productData)
    if (removedItems.length > 0) {
      toast.error(language === 'eng' ? "Please remove all items that are deleted!" : "Veuillez supprimer tous les éléments qui ont été supprimés !", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } else if (outOfStockItems.length > 0) {
      toast.error(language === 'eng' ? "Please remove all items that are out of stock!" : "Veuillez retirer tous les articles HORS STOCK !", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } else {
      navigate('/checkout');
    }
    
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => { 
    let updatedOrderInvoiceItems = []; 
    let totalPrice = 0;
    let totalWeight = 0;
    let totalTVA = 0;
    let totalPricedollar = 0;
    let totalTVAdollar = 0;
  
    productData.forEach((item) => {
      // Skip the item if _qte_a_terme_calcule is less than 1
      if (item._qte_a_terme_calcule < 1) {
        return;
      }
  
      // Calculate the price considering the discount
      const discountedPrice = item.discount > 0
        ? (item.price - (item.price * (item.discount / 100))).toFixed(2)
        : Number(item.price).toFixed(2);
      const price = discountedPrice ;
      const priceTTC = item.price_ttc;
      const priceNet = item.price * 1;

      // Calculate the cost and TVA
      const cost = price - (priceTTC - priceNet);
      const tva = item.discount > 0
        ? (priceTTC - priceNet) - ((priceTTC - priceNet) * (item.discount / 100))
        : priceTTC - priceNet;
  
      updatedOrderInvoiceItems.push({
        article_id: item._id,
        name: item.title,
        quantity: item.quantity,
        cost: parseFloat(cost.toFixed(2)),
        tva: parseFloat(tva.toFixed(2)),
        total_tva: parseFloat((tva * 1).toFixed(2) * item.quantity),
        total_cost: parseFloat((cost * 1).toFixed(2) * item.quantity),
        total_price: parseFloat((price * 1).toFixed(2) * item.quantity),
        review: item.note || "-",
        price: price,
      });
  
      totalPrice +=  (price * 1).toFixed(2) * item.quantity;
      totalWeight += item.quantity * item.weight;
      totalTVA += (tva * 1).toFixed(2) * item.quantity;
      totalPricedollar +=  (price * authCtx.currencyRate).toFixed(2) * item.quantity;
      totalTVAdollar += (Number(tva).toFixed(2) * authCtx.currencyRate).toFixed(2) * item.quantity;
    });
  
    setorder_invoice_items(updatedOrderInvoiceItems);
    settotalWeight(totalWeight);
  
    if (currency === "usd") {
      const sum = (totalPricedollar + totalTVAdollar);
      
      // For EUR, keep the original values
      setTotalAmt(Number(sum).toFixed(2));
      setTVA(parseFloat((totalTVAdollar)));
    } else {
      const sum = (totalPrice + totalTVA);
      // For EUR, keep the original values
      setTotalAmt(Number(sum));
      setTVA(parseFloat((totalTVA * 1)));
      }
  }, [productData, currency]);

  return (
    <div className={classes.cart_container}>
      <div className={classes.headTitles}>
        <h1>Cart</h1>
        <div style={{width:'fit-content',margin:"2em auto",display:'flex',flexDirection:"row",gap:"2em"}}>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'default',borderBottom:".2em solid var(--primary-color)"}}><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>1</span> {Data.Cart.title1[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'pointer'}} onClick={handleCheckout}><span style={{padding:'.3em .5em',backgroundColor:'#EEBA7F',color:'#fff',borderRadius:'50%'}}>2</span> {Data.Cart.title2[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'not-allowed'}}><span style={{padding:'.3em .5em',backgroundColor:'#EEBA7F',color:'#fff',borderRadius:'50%'}}>3</span> {Data.Cart.title3[language]}</h4>
        </div>
      </div>
          {productData?.length == 0 ? (
           <div className={classes.shopping_con}
           style={{
            width:'70%',
             display: "flex",
             flexDirection: "column",
             rowGap: "2em",
             padding: "2%",
             margin: "auto",
             overflow:'hidden'
           }}
         >
         <div className={classes.auth_bg1}></div>
           <div style={{width:'fit-content',zIndex:"2",margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family)',fontSize:'calc(.7rem + .3vw)'}}>
             <div style={{width:'fit-content',margin:'auto'}}>
             <img alt='EmptyCart' src={EmptyCart} style={{width:"15em" , height:"auto"}}/>
             </div>
             <h1 style={{textAlign:'center',fontFamily: "var(--font-family)",margin:"2em auto 0em auto"}}>{Data.Cart.emptyCart[language]}</h1>
             {/* <p  style={{textAlign:'center'}}> You have no items in your shopping cart</p> */}
             <button className={classes.browseBtn}  onClick={()=>navigate('/')}>{Data.Cart.emptyCartBtn[language]}</button>
           </div>
         </div> 
          ) : (
      <div className={classes.shopping_con}>
      <div className={classes.shopping}>
      <div className={classes.header}>
          <p>Items</p>
          <p></p>
          <p onClick={()=>console.log(9782490681228)}>{language === 'eng' ? "Quantity" : "Quantité"}</p>
          <p>{language === 'eng' ? "Price" : "Prix"}</p>
          <p>Total</p>
          <p></p>
        </div>
            <CartItem />
      </div>
      <div className={classes.bigContainer} >
        <div className={classes.auth_bg}></div>
      <div className={classes.total_con } id="fixed-component">
        <div className={classes.total}>
          <div className={classes.totalrows}>
            <h2 style={{width:'200%'}}>{language === 'eng' ? 'Cart summary' : 'Mon Panier'}</h2>
            {/* <p style={{ textAlign: "end" }}>( {productData?.length} ITEMS )</p> */}
          </div>
          <div className={classes.totalrows}>
            <p>{language == 'eng' ? "Weight" : "Poids"}</p>
            <p style={{ textAlign: "end" }}>{totalWeight} g</p>
          </div>
          {/* <div className={classes.totalrows}>
            <p>Total TTC</p>
            <p style={{ textAlign: "end" }}>{(totalAmt * 1).toFixed(2)} {currency == 'eur' ? `€` : `$`}</p>
          </div> */}
          <div className={classes.totalrows}>
            <p>Total HT</p>
            <p style={{ textAlign: "end" }}>{(totalAmt - TVA).toFixed(2)}{currency === 'eur' ? ` €` : ` $`}</p>
          </div>
          <div className={classes.totalrows}>
            <p>Total TVA</p>
            <p style={{ textAlign: "end" }}> {Number(TVA).toFixed(2)}{currency === 'eur' ? ` €` : ` $`}</p>
          </div>
          {/* <div className={classes.totalrows}>
            <p>Frais de port</p>
            <p style={{ textAlign: "end" }}>Free</p>
          </div>
          <div className={classes.totalrows}>
            <p>Remise</p>
            <p style={{ textAlign: "end" }}>$ 0.00</p>
          </div>
              <Form
                    layout="vertical"
                    name="nest-messages"
                    form={form}
                    // onFinish={handleSubmit}
                    className={classes.totalrows}
                    style={{marginTop:'2em'}}
          >
            <Form.Item
              name="name"
            >
              <Input
              suffix={<GoTag style={{ color: 'var(--accent-color)' }} />}
              name="name"
                    placeholder="Ajouter un code promo" 
                    style={{border:'none',backgroundColor:"#DED8CC",height:'2.5em',borderRadius:'.7em',fontSize:'calc(.7rem + 0.3vw)' }}
                    // onChange={handleChange}
              />
            </Form.Item>
            <Form.Item >
                <Button 
              size="large"
              htmlType="submit"  
              className={classes.checkout_btn}>
                Submit 
              </Button>
            </Form.Item> 
          </Form> */}
          <Divider
            className={classes.divider} style={{margin:'1em 0'}}
          />
          <div className={classes.totalrows}>
            <p>Total</p>
            <p style={{ textAlign: "end" }}>{(totalAmt * 1).toFixed(2)}{currency === 'eur' ? ` €` : ` $`}</p>
          </div>
        </div>
          <button className={classes.checkout_btn} id="footer" onClick={handleCheckout} style={{margin:'2em 0'}}>{language === 'eng' ? 'Checkout' : 'Valider mon panier'}</button>
          
      </div>
      </div>
      </div>
          )}
        {/* <CoupsDeCoeur/> */}
      <CartSidebar />
      <AlsoSee/>
    </div>
  );
};

export default Cart;
