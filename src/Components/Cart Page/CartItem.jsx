import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CartItem.module.css";
import { decreamentQuantity, increamentQuantity } from "../Common/redux/productSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../Common/authContext";
import ClearIcon from '@mui/icons-material/Clear';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Row, Col, Button, Select, Form, Input } from "antd";

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
        <div style={{width:'fit-content',margin:'auto',display:'flex',flexWrap:'wrap'}}>
        <Button 
           onClick={onConfirm}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'3em 0',margin:'2em auto'}}>
            {language === 'eng' ? "Yes" : "Oui"}
          </Button>
        <Button 
           onClick={onCancel}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'3em 0',margin:'2em auto'}}>
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

  console.log(productData)
  return (
    <>
      {productData.map((props, index) => (
        <>
          <div className={classes.card} key={index}>
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
              <p style={{width:'100%',textAlign:"start",fontSize:"calc(.7rem + .3vw)",fontWeight:"600"}}>{props.title.slice(0,20)}</p>
              
            <div style={{ margin: "auto auto auto 0" }}>
              <ClearIcon
                style={{ color: "var(--secondary-color)",cursor:"pointer",margin:"0 0 -.2em 0"  }}
                onClick={() => setShowPopup(props._id)}
              /> {language === 'eng' ? 'Remove' : 'Retirer'}
            </div>
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
          </div>
          <div className={classes.cardmobile} key={props._id}>
            <div style={{ padding: "1em" }}>
              <img src={props.image} alt="" width="90%" style={{width:"90%",height:"100%",objectFit:"fill"}} />
            </div>
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "50% 50%",
                  margin: "1em 0",
                  columnGap: "0em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: ".1em",
                    textAlign: "start",
                  }}
                >
                  <p className={classes.font_size} style={{fontWeight:'700'}}>{props.title.slice(0,20)}</p>
                  <p className={classes.font_size}>{props.author.slice(0,20)}</p>
                  <p className={classes.font_size}>ISBN {props._id}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: ".1em",
                    textAlign: "start",
                    justifyContent: "end",
                  }}
                >
                  <p></p>
                  <p className={classes.font_size} style={{fontWeight:"700"}}>
                    {language === "eng" ? "price" : "prix"}:{" "}
                    {currency === "eur"
  ? `€${
      props.discount > 0
        ? (props.price - props.price * (props.discount / 100)).toFixed(2)
        : (Number(props.price)).toFixed(2)
    }`
  : `$${props.discount > 0
        ? (
            (props.price - props.price * (props.discount / 100)) * authCtx.currencyRate
          ).toFixed(2)
        : (props.price * authCtx.currencyRate).toFixed(2)
    }`}
                  </p>
                  <p className={classes.font_size} style={{fontWeight:"700"}}>
                    Total:{" "}
                    {currency === "eur"
                ? `€ ${(props.quantity * ( props.discount > 0
                  ? (props.price - props.price * (props.discount / 100))
                  : (Number(props.price)))).toFixed(2)} `
                : `$ ${(
                    props.quantity *
                    ( props.discount > 0
                      ? (props.price - props.price * (props.discount / 100))
                      : (Number(props.price))) *
                    authCtx.currencyRate
                  ).toFixed(2)}`}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "0em",
                }}
              >
                <div className={classes.quantitymobile}>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 500,
                      margin: "auto",
                      fontSize: "calc(0.5vw + 0.7rem)",
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
                            console.log(
                              "PUT request successful:",
                              response.data
                            );
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
                        setShowPopup(props._id);
                        // authCtx.deleteFromcart(props._id);
                      }
                    }}
                  >
                    -
                  </p>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "calc(0.5vw + 0.5rem)",
                      margin: "auto",
                    }}
                  >
                    {props.quantity}
                  </p>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 500,
                      margin: "auto",
                      fontSize: "calc(0.5vw + 0.7rem)",
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
              </div>
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
