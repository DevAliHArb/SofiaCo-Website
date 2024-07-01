import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CartItem.module.css";
import { decreamentQuantity, increamentQuantity } from "../Common/redux/productSlice";
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

  return (
    <>
      {productData?.map((props, index) => (
        <>
          <div className={classes.card} key={index} style={{borderBottom:(index + 1) !== productData?.length && "1px solid var(--primary-color)"}}>
            <div style={{ paddingLeft: "2em" }}>
              <img src={props.image} alt="" width="100%" style={{width:'100%',height:'100%',objectFit:'fill',minHeight:'8em'}} />
            </div>
            <div
              style={{
                width:"97%",
                display: "flex",
                flexDirection: "column",
                rowGap: ".5em",
                margin: " 0 0 0 auto",
              }}
            >
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"600"}} onClick={()=>console.log(props)}>{props.title.slice(0,20)}</p>
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.6rem + .3vw)",fontWeight:"500"}}>{props.author.slice(0,20)}</p>
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.6rem + .3vw)",fontWeight:"500"}}>{new Date(props.date).toDateString()}</p>
              <p style={{color:'var(--secondary-color)',fontSize:'smaller',textAlign:'start'}}><Rate value={4} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>4.0/5</p>
            </div>
            <div className={classes.quantity}>
              <p
                style={{
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (props.quantity != 1) {
                    const item = productData.find(
                      (item) => item._id === props._id
                    );
                    const newQuantity = props.quantity - 1;
                    axios
                      .put(
                        `https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`,
                        {
                          quantity: newQuantity,
                        }
                      )
                      .then((response) => {
                        console.log("PUT request successful:", response.data);
                        dispatch(
                          decreamentQuantity({
                            _id: props._id,
                            title: props.name,
                            author: props.author,
                            image: props.image,
                            price: props.price,
                            quantity: 1,
                            description: props.resume,
                          })
                        );
                      })
                      .catch((error) => {
                        console.error("Error in PUT request:", error);
                        toast.error("Failed to add item to cart.", {
                          position: "top-right",
                          autoClose: 1500,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: 0,
                          theme: "colored",
                        });
                      });
                  } else {
                    setShowPopup(props._id)
                    // authCtx.deleteFromcart(props._id);
                  }
                }}
              >
                -
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "20px",
                  margin: "auto",
                }}
              >
                {props.quantity}
              </p>
              <p
                style={{
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const item = productData.find(
                    (item) => item._id === props._id
                  );
                  const newQuantity = props.quantity + 1;
                  axios
                    .put(
                      `https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`,
                      {
                        quantity: newQuantity,
                      }
                    )
                    .then((response) => {
                      console.log("PUT request successful:", response.data);
                      dispatch(
                        increamentQuantity({
                          _id: props._id,
                          title: props.name,
                          author: props.author,
                          image: props.image,
                          price: props.price,
                          quantity: 1,
                          description: props.resume,
                        })
                      );
                    })
                    .catch((error) => {
                      console.error("Error in PUT request:", error);
                      toast.error("Failed to add item to cart.", {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        theme: "colored",
                      });
                    });
                }}
              >
                +
              </p>
            </div>
            <span style={{display:'flex', flexDirection:'column',margin:'auto'}}>
            <p
                
              >
                {currency === "eur"
                  ? `€ ${Number(props.price).toFixed(2)} `
                  : `$ ${(
                      props.price * authCtx.currencyRate
                    ).toFixed(2)} `}
              </p>
            </span>
            <p style={{ margin: "auto", fontWeight: "600" }}>
              {" "}
              {currency === "eur"
                ? `€ ${(props.quantity * (Number(props.price))).toFixed(2)} `
                : `$ ${(
                    props.quantity *((Number(props.price))) * authCtx.currencyRate
                  ).toFixed(2)}`}
            </p>
            <div className={classes.delete_btn}><img src={DeleteIcon} style={{width:'1em'}}  onClick={() => setShowPopup(props._id)} /></div>
          </div>
          <div className={classes.cardmobile} key={index} style={{borderBottom:(index + 1) !== productData?.length && "1px solid var(--primary-color)"}}>
            <div style={{paddingRight:'.5em'}}>
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
              
           
              <div className={classes.delete_btn}><img src={DeleteIcon} style={{width:'1.5em'}}  onClick={() => setShowPopup(props._id)} /></div>
            </div>
              <p style={{margin:'0.2em 0', width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"500"}}>{props.author.slice(0,20)}</p>
              <p style={{margin:'0.2em 0', width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"500"}}>{new Date(props.date).toDateString()}</p>
              <p style={{margin:'0.2em 0', color:'var(--secondary-color)',fontSize:'smaller',textAlign:'start'}}><Rate value={4} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>4.0/5</p>
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
            > <p
            style={{textAlign:'start'}}
          >
            {currency === "eur"
              ? `€ ${Number(props.price).toFixed(2)} `
              : `$ ${(
                  props.price * authCtx.currencyRate
                ).toFixed(2)} `}
          </p>
            <div className={classes.quantity}>
              <p
                style={{
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (props.quantity != 1) {
                    const item = productData.find(
                      (item) => item._id === props._id
                    );
                    const newQuantity = props.quantity - 1;
                    axios
                      .put(
                        `https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`,
                        {
                          quantity: newQuantity,
                        }
                      )
                      .then((response) => {
                        console.log("PUT request successful:", response.data);
                        dispatch(
                          decreamentQuantity({
                            _id: props._id,
                            title: props.name,
                            author: props.author,
                            image: props.image,
                            price: props.price,
                            quantity: 1,
                            description: props.resume,
                          })
                        );
                      })
                      .catch((error) => {
                        console.error("Error in PUT request:", error);
                        toast.error("Failed to add item to cart.", {
                          position: "top-right",
                          autoClose: 1500,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: 0,
                          theme: "colored",
                        });
                      });
                  } else {
                    setShowPopup(props._id)
                    // authCtx.deleteFromcart(props._id);
                  }
                }}
              >
                -
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "20px",
                  margin: "auto",
                }}
              >
                {props.quantity}
              </p>
              <p
                style={{
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const item = productData.find(
                    (item) => item._id === props._id
                  );
                  const newQuantity = props.quantity + 1;
                  axios
                    .put(
                      `https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`,
                      {
                        quantity: newQuantity,
                      }
                    )
                    .then((response) => {
                      console.log("PUT request successful:", response.data);
                      dispatch(
                        increamentQuantity({
                          _id: props._id,
                          title: props.name,
                          author: props.author,
                          image: props.image,
                          price: props.price,
                          quantity: 1,
                          description: props.resume,
                        })
                      );
                    })
                    .catch((error) => {
                      console.error("Error in PUT request:", error);
                      toast.error("Failed to add item to cart.", {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        theme: "colored",
                      });
                    });
                }}
              >
                +
              </p>
            </div>
            <p style={{ margin: "auto 0",color:"var(--primary-color)", fontWeight: "700" }}>
              {" "}
              {currency === "eur"
                ? `€ ${(props.quantity * (Number(props.price))).toFixed(2)} `
                : `$ ${(
                    props.quantity *((Number(props.price))) * authCtx.currencyRate
                  ).toFixed(2)}`}
            </p></div>
          </div>
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
