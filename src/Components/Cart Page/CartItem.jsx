import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CartItem.module.css";
import { addTocart, decreamentQuantity, increamentQuantity } from "../Common/redux/productSlice";
import DeleteIcon from "../../assets/DeleteIcon.svg";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../Common/authContext";
import ClearIcon from '@mui/icons-material/Clear';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Rate, Col, Button, Select, Form, Input } from "antd";

const ConfirmationPopup = ({ message, onConfirm, onCancel, showPopup }) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #ACACAC",
    borderRadius: "1em",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className="confirmation-popup">
      <Modal
        open={showPopup}
        onClose={onCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "hidden" }}
      >
        <Box sx={style}>
        <p>{message}</p>
        <div style={{width:'fit-content',margin:'auto',display:'flex',flexWrap:'wrap',gap:'.4em'}}>
        <Button 
           onClick={onConfirm}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'.5em',margin:'2em auto'}}>
            {language === 'eng' ? "Yes" : "Oui"}
          </Button>
        <Button 
           onClick={onCancel}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'.5em',margin:'2em auto'}}>
            {language === 'eng' ? "No" : "Non"}
          </Button></div>
        </Box>
      </Modal>
    </div>
    
  );
};

const CartItem = () => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const authCtx = React.useContext(AuthContext);
  const productData = useSelector((state) => state.products.productData);
  const handleDelete = (itemId) => {
    authCtx.deleteFromcart(itemId);
    setShowPopup(false);
  };
  
  const [localQuantities, setLocalQuantities] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  
  React.useEffect(() => {
    const initialQuantities = productData.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    setLocalQuantities(initialQuantities);
  }, [productData]);

  
  const updateQuantity = (item) => {
    if (!isLoading) {
    const newQuantity = localQuantities[item._id];
    if (newQuantity !== item.quantity) {
    setIsLoading(true)
      axios
        .put(`${import.meta.env.VITE_TESTING_API}/api/bookshop/cart/${item.cart_id}`, {
          quantity: newQuantity,
        })
        .then(() => {
          dispatch(
            addTocart({
              _id: item._id,
              title: item.name,
              author: item.author,
              average_rate: item.average_rate,
              image: item.image,
              price: item.price,
              quantity: newQuantity - item.quantity, // The difference in quantities
              description: item.resume,
            })
          );
        })
        .catch((error) => {
          // console.log(error)
          toast.error(
            language === "eng"
              ? "Failed to update item quantity."
              : "Échec de la mise à jour de la quantité.",
            {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }).finally(
          setTimeout(() => {
            setIsLoading(false);
          }, 1000)
        );
    }

    }
  };

  const handleKeyPress = (e, item) => {
    if (e.key === "Enter" || e.key === "Tab") {
      updateQuantity(item);
    }
  };

  const handleBlur = (item) => {
    updateQuantity(item);
  };
    
  const handleInputChange = (id, value, maxQuantity) => {
    // Ensure only numeric values are parsed
    let numericValue = parseInt(value.replace(/\D/g, ''), 10) || 1; // Remove non-numeric characters
    let adjustedValue = Math.max(1, Math.min(maxQuantity, numericValue));
    
    // If the value exceeds maxQuantity, show a toast message
    if (adjustedValue > maxQuantity) {
      // Uncomment this for toast notifications
      toast.info(
        language === "eng"
          ? "No more items in stock"
          : "Plus d'articles en stock",
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          theme: "colored",
        }
      );
    }

    setLocalQuantities((prev) => ({
      ...prev,
      [id]: adjustedValue,
    }));
  };

  return (
    <>
      {productData?.map((props, index) => (
        <>
          <div className={classes.card} key={index} onClick={()=>console.log(props)} style={{borderBottom:(index + 1) !== productData?.length && "1px solid var(--primary-color)",position:'relative'}}>
          {props?.removed && <div className={classes.removed_item}>
             <p>{language === "eng" ? "NOT AVAILABLE ANYMORE!" : "N'EST PLUS DISPONIBLE !"}</p>
           </div>}
            <div style={{ marginLeft: "2em",position:"relative",overflow:'hidden' }}>
                     {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
              <img src={props.image} alt="" width="100%" style={{width:'100%',height:'100%',objectFit:'fill',minHeight:'8em'}} />
            </div>
            <div
              style={{
                width:"97%",
                display: "flex",
                flexDirection: "column",
                rowGap: ".5em",
                margin: " 0 0 0 auto",
                justifyContent:'space-between'
              }}
            >
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"600",margin:'0'}} onClick={()=>console.log(props)}>{props.title.slice(0,20)}</p>
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.6rem + .3vw)",fontWeight:"500",margin:'0'}}>{props.author.slice(0,20)}</p>
              {/* <p style={{width:'100%',textAlign:"start",fontSize:"calc(.6rem + .3vw)",fontWeight:"500",margin:'0'}}>{new Date(props.date).toDateString()}</p> */}
              <p style={{color:'var(--secondary-color)',fontSize:'smaller',textAlign:'start'}}><Rate value={props.average_rate} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>{props?.average_rate ? Number(props.average_rate)?.toFixed(1) : 0.0}/5</p>
              <p style={{ margin: ".5em auto .5em 0",color:props._qte_a_terme_calcule > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600" }}>{props._qte_a_terme_calcule > 0 ? `${(props._qte_a_terme_calcule * 1).toFixed(0)} in stock` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
              </div>
           
              {props?._qte_a_terme_calcule > 0 && 
                <Input 
                  type="number" 
                  placeholder="Quantity"
                  min={1} 
                  max={99999} 
                  defaultValue={1} 
                  disabled={isLoading}
                  className={classes.quantity1}
                  value={localQuantities[props._id] || ""}
                  onChange={(e) =>
                    handleInputChange(props._id, e.target.value, props._qte_a_terme_calcule)
                  }
                  onBlur={() => handleBlur(props)} 
                  onKeyPress={(e) => handleKeyPress(e, props)}
                  />}
            <span style={{display:'flex', flexDirection:'column',margin:'auto'}}>
            <p style={{color:'var(--forth-color)',fontFamily:"var(--font-family-primary)",fontWeight:'500'}}>
            {currency === "eur"
  ? `${
      props.discount > 0
        ? (props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2)
        : (Number(props.price_ttc)).toFixed(2)
    }€`
  : `${props.discount > 0
        ? (
            (props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2) * authCtx.currencyRate
          ).toFixed(2)
        : (props.price_ttc * authCtx.currencyRate).toFixed(2)
    }$`}
            {props.discount > 0 && <span
                style={{
                  color: "var(--primary-color)",
                  textDecoration: "line-through",
                  fontSize: "small",
                  margin:'0'
                }}
              >
                {currency === "eur"
                  ? ` ${Number(props.price_ttc).toFixed(2)}€`
                  : ` ${(
                      props.price_ttc * authCtx.currencyRate
                    ).toFixed(2)}$`}
              </span>}</p>
            </span>
            <p style={{ margin: "auto", fontWeight: "600" }}>
              {" "}
              {currency === "eur"
  ? ` ${(props.quantity * (props.discount > 0
      ? parseFloat((props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2))
      : (Number(props.price_ttc))).toFixed(2)).toFixed(2)}€`
  : `${(props.discount > 0
      ? ((props.price_ttc - props.price_ttc * (props.discount / 100)) * authCtx.currencyRate).toFixed(2) * props.quantity
      : (props.price_ttc * authCtx.currencyRate) * props.quantity).toFixed(2)}$`}
            </p>
            <div className={classes.delete_btn} style={{zIndex:'50'}}><img src={DeleteIcon} style={{width:'1em'}}  onClick={() => setShowPopup(props._id)} /></div>
          </div>
          <div className={classes.cardmobile} key={index} style={{borderBottom:(index + 1) !== productData?.length && "1px solid var(--primary-color)",position:'relative',overflow:'hidden'}}>
          {props?.removed && <div className={classes.removed_item}>
             <p>{language === "eng" ? "NOT AVAILABLE ANYMORE!" : "N'EST PLUS DISPONIBLE !"}</p>
           </div>}
            <div className={classes.mobcard_content}>
            <div  style={{ marginRight: ".5em",position:"relative",overflow:'hidden' }}>
                     {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
              <img src={props.image} alt="" width="100%" style={{width:'100%',height:'100%',objectFit:'fill',minHeight:'8em'}} />
            </div>
            <div style={{width:"100%",height:"100%",display:'flex',flexDirection:"column"}}>
            <div
              style={{
                width:"97%",
                height:'fit-content',
                display: "flex",
                flexDirection: "row",
                justifyContent:'space-between',
                margin: " 0",
              }}
            >
              <p style={{width:'80%',textAlign:"start",fontSize:"calc(.8rem + .3vw)",fontWeight:"600"}}>{props.title.slice(0,20)}</p>
              
           
              <div className={classes.delete_btn} style={{zIndex:'50'}}><img src={DeleteIcon} style={{width:'1.5em'}}  onClick={() => setShowPopup(props._id)} /></div>
            </div>
              <p style={{margin:'0.2em 0', width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"500"}}>{props.author.slice(0,20)}</p>
              {/* <p style={{margin:'0.2em 0', width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"500"}}>{new Date(props.date).toDateString()}</p> */}
              <p style={{color:'var(--secondary-color)',fontSize:'smaller',textAlign:'start'}}><Rate value={props.average_rate} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>{props.average_rate}/5</p>
              <p style={{ margin: ".5em auto .5em 0",color:props._qte_a_terme_calcule > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600", fontSize:"calc(.7rem + .3vw)", }}>{props._qte_a_terme_calcule > 0 ? `${(props._qte_a_terme_calcule * 1).toFixed(0)} in stock` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
          </div>
            </div>
          <div
              style={{
                width:"100%",
                height:'fit-content',
                display: "flex",
                flexDirection: "row",
                justifyContent:'space-between',
                margin: "auto 0 0 0",
                fontFamily:'var(--font-family)',
                color:'var(--secondary-color)'
              }}
            > <p style={{textAlign:'start',color:'var(--primary-color)'}}>
            {currency === "eur"
  ? `${
      props.discount > 0
        ? (props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2)
        : (Number(props.price_ttc)).toFixed(2)
    }€`
  : `${props.discount > 0
        ? (
            (props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2) * authCtx.currencyRate
          ).toFixed(2)
        : (props.price_ttc * authCtx.currencyRate).toFixed(2)
    }$`}
            {props.discount > 0 && <span
                style={{
                  color: "var(--primary-color)",
                  textDecoration: "line-through",
                  fontSize: "small",
                  margin:'0'
                }}
              >
                {currency === "eur"
                  ? ` ${Number(props.price_ttc).toFixed(2)}€`
                  : ` ${(
                      props.price_ttc * authCtx.currencyRate
                    ).toFixed(2)}$`}
              </span>}</p>
              {props?._qte_a_terme_calcule > 0 && 
                <Input 
                  type="number" 
                  placeholder="Quantity"
                  min={1} 
                  max={99999} 
                  defaultValue={1} 
                  disabled={isLoading}
                  className={classes.quantity1}
                  value={localQuantities[props._id] || ""}
                  onChange={(e) =>
                    handleInputChange(props._id, e.target.value, props._qte_a_terme_calcule)
                  }
                  onBlur={() => handleBlur(props)} 
                  onKeyPress={(e) => handleKeyPress(e, props)}
                  />}
            <p style={{ margin: "auto 0",color:"var(--secondary-color)", fontWeight: "700" }}>
              {" "}
             
              {currency === "eur"
  ? ` ${(props.quantity * (props.discount > 0
      ? parseFloat((props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2))
      : (Number(props.price_ttc))).toFixed(2)).toFixed(2)}€`
  : `${(props.discount > 0
      ? ((props.price_ttc - props.price_ttc * (props.discount / 100)) * authCtx.currencyRate).toFixed(2) * props.quantity
      : (props.price_ttc * authCtx.currencyRate) * props.quantity).toFixed(2)}$`}
            </p></div>
          </div>
          {showPopup && (
        <ConfirmationPopup
        message= {language === 'eng' ? "Are you sure you want to delete this item?" : "Êtes-vous sûr de bien vouloir supprimer cet article?"}
        onConfirm={() => handleDelete(showPopup)}
        onCancel={() => setShowPopup(false)}
        showPopup={showPopup === props._id}
      />
      )}
        </>
      ))}
    </>
  );
};

export default CartItem;
