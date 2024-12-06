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
  increamentQuantity, changeQuantity,
  addTocart
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [localQuantities, setLocalQuantities] = React.useState({});

  
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
        .put(`${import.meta.env.VITE_TESTING_API_IMAGE}/cart/${item.cart_id}`, {
          quantity: newQuantity,
        })
        .then(() => {
          dispatch(
            addTocart({
              _id: item._id,
              title: item.name,
              average_rate: item.average_rate,
              author: item.author,
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

  React.useEffect(() => {
    const initialQuantities = productData.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    setLocalQuantities(initialQuantities);
  }, [productData]);
  
  const handleInputChange = (id, value, maxQuantity) => {
    // Ensure only numeric values are parsed
    let numericValue = parseInt(value.replace(/\D/g, ''), 10) || 1; // Remove non-numeric characters
    let adjustedValue = Math.max(1, Math.min(maxQuantity, numericValue));
    
    // If the value exceeds maxQuantity, show a toast message
    if (parseFloat(adjustedValue) > parseFloat(maxQuantity)) {
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

  React.useEffect(() => {  
    let totalPrice = 0;
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
  
      totalPrice +=  (price * 1).toFixed(2) * item.quantity;
      totalTVA += (tva * 1).toFixed(2) * item.quantity;
      totalPricedollar +=  (price * authCtx.currencyRate).toFixed(2) * item.quantity;
      totalTVAdollar += (Number(tva).toFixed(2) * authCtx.currencyRate).toFixed(2) * item.quantity;
    });
  
  
    if (currency === "usd") {
      const sum = (totalPricedollar + totalTVAdollar);
      
      // For EUR, keep the original values
      setTotalAmt(Number(sum).toFixed(2));
    } else {
      const sum = (totalPrice + totalTVA);
      // For EUR, keep the original values
      setTotalAmt(Number(sum));
      }
  }, [productData, currency]);
  const [state, setState] = React.useState({
    right: false,
  });

  const list = (anchor) => (
    <>
      <Box
        role="presentation"
        //   onClick={toggle}
        // onKeyDown={toggle}
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
                >{language === 'eng' ? 'Shopping Cart' : 'Mon Panier'}
                <span onClick={toggle} style={{margin:'0 0 0 auto',height:'1em', background:'var(--primary-color)' ,borderRadius:'.2em',cursor:'pointer' }}>
                    <ClearIcon style={{width:'1.5em',height:'1.2em',color:'#FFF',marginBottom:'.4em'}} />
                  </span>
                </h1>
                <p style={{color:'var(--secondary-color)' ,fontWeight:'500',marginTop:'0'}}>
                  {/* Plus que 27,10 €ew pour profiter de la livraison à domicile à 0,01€ */}
                  </p>
              </div>
            </ListItemText>
          </ListItem>
        </List>
        <>
        {productData.map((props) => (
          
          <div className={classes.card} key={props?._id}style={{  position:'relative'}} >
          {props?.removed && <div className={classes.removed_item}>
             <p>{language === "eng" ? "NOT AVAILABLE ANYMORE!" : "N'EST PLUS DISPONIBLE !"}</p>
           </div>} 
            <div className={classes.imageCont} style={{position:"relative"}}>
                     {props?._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
              <img src={props?.image} alt="" style={{height:'100%', width: '100%',objectFit:'cover' ,maxWidth:'350px' }}/>
            </div>
            <div style={{height:'100%',overflow:'hidden',maxWidth:'30em',justifyContent:'space-between',display:'flex', flexDirection:'column', margin:'auto 0',width:'100%',fontSize:'calc(.7rem + 0.2vw)',fontFamily:'var(--font-family)'}}>
              <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + 0.2rem)',fontWeight:'700'}}>{props?.title}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'500'}}>{props?.author}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'600',fontSize:'smaller'}}><Rate value={props.average_rate} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>{props?.average_rate ? Number(props.average_rate)?.toFixed(1) : 0.0}/5</p>
              <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.description }} style={{color:"var(--secondary-color)"}}/>
              {/* <p style={{color:'var(--forth-color)'}}>Cover: Hardcover</p> */}
              <p style={{ margin: ".5em auto .5em 0",color:props._qte_a_terme_calcule > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600" }}>{props._qte_a_terme_calcule > 0 ? `${(props._qte_a_terme_calcule * 1).toFixed(0)} in stock` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
              <div style={{display:'flex',flexDirection:'row',gap:'1em'}}>
                  <p className={classes.price}>
                              {/* {language === "eng" ? "price" : "prix"}:{" "} */}
                              {currency === "eur"
                            ? `${
                                props.discount > 0
                                  ? (
                                      props.price_ttc -
                                      props.price_ttc * (props.discount / 100)
                                    ).toFixed(2)
                                  : Number(props.price_ttc).toFixed(2)
                              }€`
                            : `${
                                props.discount > 0
                                  ? (
                                      (props.price_ttc -
                                        props.price_ttc *
                                          (props.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                      props.price_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              }$`}{" "}     {props.discount > 0 && <span
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
                              </span>}    
                           </p>
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
              </div>
            </div>
            <div className={classes.quantity}>
              <div style={{display:'flex',flexDirection:'column', gap:'1em'}}>
                    {/* <FaRegHeart style={{width:'1em',height:'1em',margin:'0'}} /> */}
                    
                        {favoriteData.some(
                          (book) => book._favid === props?._id
                        ) ? (
                          <div
                            className={classes.delete_btn}
                            style={{ background: "var(--primary-color)" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.deleteFavorite(props?._id);
                            }}
                          >
                            <IoHeartSharp style={{width:'1em',height:'1em',margin:'0',color:'#fff'}} />
                          </div>
                        ) : (
                          <div
                            className={classes.delete_btn}
                            onClick={(event) => {
                              event.stopPropagation();
                              authCtx.addToFavorite({
                                id: props?._id,
                                designation: props?.title,
                                dc_auteur: props?.author,
                                articleimage: [{link : props?.image}] ,
                                prixpublic: props?.price,
                                descriptif: props?.description,
                              });
                            }}
                          >
                            <IoHeartOutline style={{width:'1em',height:'1em',margin:'0',color:'#fff'}}/>
                          </div>
                        )}
                     
                     
                     
                     
                <div className={classes.delete_btn} style={{backgroundColor:props?.removed &&"rgb(255, 66, 66)",zIndex:'50'}}>
                  <img src={DeleteIcon} style={{width:'1em'}} onClick={() =>authCtx.deleteFromcart(props?._id)} /></div> 
              </div>
            
            
            <p style={{margin:'0 0 .5em auto',color:'var(--forth-color)',fontSize:'calc(.7rem + 0.3vw)',fontWeight:'600'}}>
            {currency === "eur"
  ? ` ${(props.quantity * (props.discount > 0
      ? parseFloat((props.price_ttc - props.price_ttc * (props.discount / 100)).toFixed(2))
      : (Number(props.price_ttc))).toFixed(2)).toFixed(2)}€`
  : `${(props.discount > 0
      ? ((props.price_ttc - props.price_ttc * (props.discount / 100)) * authCtx.currencyRate).toFixed(2) * props.quantity
      : (props.price_ttc * authCtx.currencyRate) * props.quantity).toFixed(2)}$`}
                                      </p>
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
                {Number(totalAmt)?.toFixed(2)}{currency === "eur" ? `€`: `$`}</p>
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
