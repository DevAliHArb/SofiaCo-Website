import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import classes from "./Cartsidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import {
  decreamentQuantity,
  deleteItem,
  increamentQuantity, changeQuantity
} from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "../../../assets/DeleteIcon.svg";
import { Rate , Input} from "antd";
import { FaRegHeart } from "react-icons/fa";
import AuthContext from "../authContext";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import axios from "axios";

export default function CartSidebar({ toggle, isOpen }) {
  const authCtx = React.useContext(AuthContext);
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const productData = useSelector((state) => state.products.productData);
  const [totalAmt, setTotalAmt] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteData = useSelector((state) => state.products.favorites);

  React.useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item?.quantity * item.price;
      return price;
    });
    setTotalAmt(price.toFixed(2));
  }, [productData]);
  const [state, setState] = React.useState({
    right: false,
  });

  const list = (anchor) => (
    <>
      <Box
        role="presentation"
        //   onClick={toggle}
        onKeyDown={toggle}
        className={classes.cartsidebar} style={{background:'#fff',borderRadius:"1.5em 0 0 1.5em"}}
      >
        <List >
          <ListItem disablePadding>
            {/* <ListItemButton> */}
            <ListItemText
              style={{
                textAlign: "start",
              }}
            >
              <div className={classes.header}>
              <h1
                  style={{  display: "flex",marginBottom:"0.3em", fontWeight: 600,color:'var(--secondary-color)' }}
                >Mon Panier
                <span onClick={toggle} style={{margin:'0 0 0 auto',height:'1em', background:'var(--primary-color)' ,borderRadius:'.2em',cursor:'pointer' }}>
                    <ClearIcon style={{width:'1.5em',height:'1.2em',color:'#FFF',marginBottom:'.4em'}} />
                  </span>
                </h1>
                <p style={{color:'var(--secondary-color)' ,fontWeight:'500',marginTop:'0'}}>Plus que 27,10 €ew pour profiter de la livraison à domicile à 0,01€</p>
              </div>
            </ListItemText>
          </ListItem>
        </List>
        <>
        {productData.map((props) => (
          
          <div className={classes.card} key={props._id}>
            <div className={classes.imageCont}>
              <img src={props.image} alt="" style={{height:'100%', width: '100%',objectFit:'cover' ,maxWidth:'350px' }}/>
            </div>
            <div style={{height:'100%',overflow:'hidden',maxWidth:'30em',justifyContent:'space-between',display:'flex', flexDirection:'column', margin:'auto 0',width:'100%',fontSize:'calc(.7rem + 0.2vw)',fontFamily:'var(--font-family)'}}>
              <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + 0.2vw)',fontWeight:'700'}} onClick={()=>console.log(props)}>{props.title.slice(0, 20)}{props.title?.length > 20 && "..."}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'500'}}>{props.author}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'600',fontSize:'smaller'}}><Rate value={props.average_rate} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>{props?.average_rate ? Number(props.average_rate)?.toFixed(1) : 0.0}/5</p>
              <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.description }} style={{color:"var(--secondary-color)"}}/>
              {/* <p style={{color:'var(--forth-color)'}}>Cover: Hardcover</p> */}
                  <p className={classes.price}>{currency === "eur"
                            ? `€${(props.price *1).toFixed(2)} `

                            : `$${
                                props.discount > 0
                                  ? (
                                      (props.price) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                      props.price * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}</p>
                
            <div className={classes.quantity1}>
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
            </div>
            <div className={classes.quantity}>
              <div style={{display:'flex',flexDirection:'column', gap:'1em'}}>
                    {/* <FaRegHeart style={{width:'1em',height:'1em',margin:'0'}} /> */}
                    
                        {favoriteData.some(
                          (book) => book._favid === props._id
                        ) ? (
                          <div
                            className={classes.delete_btn}
                            style={{ background: "var(--primary-color)" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.deleteFavorite(props._id);
                            }}
                          >
                            <IoHeartSharp style={{width:'1.3em',height:'1.3em',margin:'0',color:'#fff'}} />
                          </div>
                        ) : (
                          <div
                            className={classes.delete_btn}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToFavorite({
                                id: props._id,
                                designation: props.title,
                                dc_auteur: props.author,
                                articleimage: [{link : props.image}] ,
                                prixpublic: props.price,
                                descriptif: props.description,
                              });
                            }}
                          >
                            <IoHeartOutline style={{width:'1.3em',height:'1.3em',margin:'0',color:'#fff'}}/>
                          </div>
                        )}
                     
                     
                     
                     
                <div className={classes.delete_btn}>
                  <img src={DeleteIcon} style={{width:'1.3em'}} onClick={() =>authCtx.deleteFromcart(props._id)} />
                  </div> 
              </div>
            
            
            <p style={{margin:'0 0 .5em auto',color:'var(--primary-color)',fontSize:'calc(.9rem + 0.3vw)',fontWeight:'600'}}>
            
            {currency === "eur"
                                ? `€${(props.quantity * props.price).toFixed(2)} `
                                : `$${(
                                    (props.quantity * props.price) * authCtx.currencyRate
                                  ).toFixed(2)} `}</p>
            </div>
          </div>
        ))}
      </>
        <List>
          <ListItem disablePadding>
            {/* <ListItemButton> */}
            <ListItemText
              style={{
                textAlign: "start",
              }}
            >
              <div style={{width:'100%',margin:'0 auto',fontWeight:'600',display:'flex',flexDirection:'row',justifyContent:"space-between",fontFamily:'var(--font-family)',fontSize:'calc(1.2rem + 0.3vw)'}}>
                <p style={{color:'var(--secondary-color)' }}>Total TTC</p>
                <p style={{color:'var(--primary-color)'}}>
                    {currency === "eur"
                      ? `€${(totalAmt * 1).toFixed(2)} `
                      : `$${(totalAmt * authCtx.currencyRate).toFixed(2)} `}</p>
              </div>
                <div className={classes.btn_con}>
              <button className={classes.btn} onClick={()=>navigate(`/cart`) & toggle()}>
                  {language === "eng" ? "View Cart" : "Voir le panier"}
              </button></div>
            </ListItemText>
            {/* </ListItemButton> */}
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer anchor={anchor} open={isOpen} onClose={toggle}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
