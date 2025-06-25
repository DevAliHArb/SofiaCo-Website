import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import classes from "./FavoriteItem.module.css";
import TextField from '@mui/material/TextField';
import DeleteIcon from "../../assets/DeleteIcon.svg";
import {
  addTocart,
  changeFavorite,
  decreamentQuantity,
  decreamentfavQuantity,
  deletefavorite,
  increamentQuantity,
  increamentfavQuantity,
  resetfavorite,
} from "../Common/redux/productSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../Common/authContext";

const FavoriteItem = ({ carttoggle }) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext)
  const [count, setCount] = React.useState(1);
  const favoriteData = useSelector((state) => state.products.favorites);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency );
 

  return (
    <>
      {favoriteData?.map((props, index) => (
        <>
          <div className={classes.card} key={props._id} style={{borderBottom: (index + 1) < favoriteData?.length && "1.5px solid var(--primary-color)",position:'relative',overflow:'hidden'}}>
          {props?.removed && <div className={classes.removed_item}>
             <p>{language === "eng" ? "NOT AVAILABLE ANYMORE!" : "N'EST PLUS DISPONIBLE !"}</p>
           </div>}
            <div className={classes.imgCont}>
                     {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
              <img src={props.favimage} alt="" width="100%" />
            </div>
            <div className={classes.contentContainer}>
              <p style={{ fontSize: "calc(0.8rem + 0.3vw)",color:'var(--secondary-color)',fontWeight:'600',margin:'.5em 0' }}>{props.favtitle}</p>
              <p style={{fontSize: "calc(0.6rem + 0.2vw)",margin:'.5em 0',color:'var(--secondary-color)'}}>{props.favauthor} {props.date && `LE : ${new Date(props.date).toDateString()}`}</p>
              <p style={{color:'var(--primary-color)',fontSize:'calc(0.6rem + 0.2vw)',margin:'.5em 0',display:'flex',flex:'row'}}><Rating
                  style={{
                      color: "var(--primary-color)",
                      margin:'0 .5em 0 0',
                  }}
                  size='small'
                  name="read-only"
                  value={props.favrate}
                  readOnly
              /><p style={{margin:'0.2em 0 0 0 '}}>{props.favrate}/5</p></p>
              <p className={classes.priceMob}>{currency === "eur"
                            ? `${
                              props.discount > 0
                                  ? (
                                    props.favprice -
                                    props.favprice * (props.discount / 100)
                                    ).toFixed(2)
                                  : Number(props.favprice).toFixed(2)
                              } €`
                            : `${
                              props.discount > 0
                                  ? (
                                      (props.favprice -
                                        props.favprice *
                                          (props.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    props.favprice * authCtx.currencyRate
                                    ).toFixed(2)
                              } $`}  {" "}                   
                     {props.discount > 0 && <span style={{opacity: "0.8",textDecoration:'line-through'}} >
                      {currency === "eur" ? `${Number(props.favprice).toFixed(2)} € `: `${(props.favprice * authCtx.currencyRate ).toFixed(2)} $ `}</span>}  </p> 
            </div>
            <p className={classes.price}>{currency === "eur"
                            ? `${
                              props.discount > 0
                                  ? (
                                    props.favprice -
                                    props.favprice * (props.discount / 100)
                                    ).toFixed(2)
                                  : Number(props.favprice).toFixed(2)
                              } €`
                            : `${
                              props.discount > 0
                                  ? (
                                      (props.favprice -
                                        props.favprice *
                                          (props.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    props.favprice * authCtx.currencyRate
                                    ).toFixed(2)
                              } $`}  {" "}                   
                     {props.discount > 0 && <span style={{opacity: "0.8",textDecoration:'line-through'}} >
                      {currency === "eur" ? `${Number(props.favprice).toFixed(2)} € `: `${(props.favprice * authCtx.currencyRate ).toFixed(2)} $ `}</span>} </p>
            
           {props._qte_a_terme_calcule > 0 ? 
           <div style={{margin:'auto 0'}}>
            <p style={{ margin: "-2em auto .5em auto",color:props._qte_a_terme_calcule > 0 ? "#2DB224" : "#EE5858",fontWeight:"600" }}>{props._qte_a_terme_calcule > 0 ? `${Number(props._qte_a_terme_calcule).toFixed(0)} in stock` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
            <div className={classes.quantity}>
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "26px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (props._qte_a_terme_calcule > 0) {
                    if (props.favquantity != 1) {
                    dispatch(
                      decreamentfavQuantity({
                        _favid: props._favid,
                        favtitle: props.favname,
                        favauthor: props.favauthor,
                        favrate: props.average_rate,
                        favimage: props.favimage,
                        favprice: props.favprice,
                        favquantity: 1,
                        favdescription: props.favresume,
                        weight: props.weight,
                        price_ttc: props.price_ttc,
                      })
                    );
                  } else {
                    authCtx.deleteFavorite(props._favid);
                  }
                    
                  }
                }}
              >
                -
              </p>
              <p
                style={{
                  margin: "auto",
                }}
              >
                <input
                  type="number"
                  value={props.favquantity}
                  // min="1"
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    console.log(newQuantity)
                    if (!isNaN(newQuantity) && newQuantity >= 1 ) {
                      if (newQuantity <= props._qte_a_terme_calcule) {
                        dispatch(
                          changeFavorite({
                            _favid: props._favid,
                            favtitle: props.favname,
                            favrate: props.average_rate,
                            favauthor: props.favauthor,
                            favimage: props.favimage,
                            favprice: props.favprice,
                            favquantity: newQuantity,
                            favdescription: props.favresume,
                            weight: props.weight,
                            price_ttc: props.price_ttc,
                          })
                        );
                      } else {
                        dispatch(
                          changeFavorite({
                            _favid: props._favid,
                            favtitle: props.favname,
                            favauthor: props.favauthor,
                            favrate: props.average_rate,
                            favimage: props.favimage,
                            favprice: props.favprice,
                            favquantity: Number(props._qte_a_terme_calcule).toFixed(0),
                            favdescription: props.favresume,
                            weight: props.weight,
                            price_ttc: props.price_ttc,
                          })
                        );
                        
                      }
                    }
                  }}
                  style={{
                    color: "var(--secondary-color)",
                    fontWeight: 500,
                    fontSize: "20px",
                    margin: "auto",
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                />
              </p>
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "26px",
                  cursor: "pointer",
                }}
                onClick={() =>{
                  if (props._qte_a_terme_calcule > 0  && props.favquantity < props._qte_a_terme_calcule) {
                    dispatch(
                      increamentfavQuantity({
                        _favid: props._favid,
                        favtitle: props.favname,
                        favauthor: props.favauthor,
                        favrate: props.average_rate,
                        favimage: props.favimage,
                        favprice: props.favprice,
                        favquantity: 1,
                        favdescription: props.favresume,
                        weight: props.weight,
                        price_ttc: props.price_ttc,
                      })
                    )
                  }
                }}
              >
                +
              </p>
            </div>
            </div> : <div/>}
            <p className={classes.totalPrice} >
            {currency === "eur"
                ? `${(props.favquantity * (props.discount > 0
                  ? (props.favprice - props.favprice * (props.discount / 100))
                  : (Number(props.favprice)))).toFixed(2)} €`
                : `${(
                    props.favquantity *
                    (props.discount > 0
                      ? (props.favprice - props.favprice * (props.discount / 100))
                      : (Number(props.favprice))) *
                    authCtx.currencyRate
                  ).toFixed(2)} $`}
            </p>
            <div className={classes.addtocart}>
              {props._qte_a_terme_calcule > 0 &&<button
              onClick={(event)=>{ 
                event.stopPropagation();
                console.log({
                  id: props._favid,
                  designation: props.favtitle,
                  dc_auteur: props.favauthor,
                  image: props.favimage,
                  prixpublic: props.favprice,
                  _qte_a_terme_calcule: props._qte_a_terme_calcule,
                  _code_barre: props._code_barre,
                  quantity: props.favquantity,
                  discount:props.discount,
                  descriptif: props.favdescription,
                  _poids_net: props.weight,
                  _prix_public_ttc: props.price_ttc,
                });
                authCtx.addToCartWithQty(
                  (props = {
                    id: props._favid,
                    designation: props.favtitle,
                    dc_auteur: props.favauthor,
                    image: props.favimage,
                    prixpublic: props.favprice,
                    _qte_a_terme_calcule: props._qte_a_terme_calcule,
                    _code_barre: props._code_barre,
                    quantity: props.favquantity,
                    discdiscountount:props.discount,
                    descriptif: props.favdescription,
                    _poids_net: props.weight,
                    _prix_public_ttc: props.price_ttc,
                  })
                );
                }}
              >
                <FiShoppingCart style={{fontSize:'1.6em',marginTop:'.4em'}}/>
              </button>}
              <button style={{zIndex:'50'}}
                onClick={(event) => {
                  event.stopPropagation();
                  authCtx.deleteFavorite(props._favid);
                }}
              >
                <img src={DeleteIcon} style={{width:'1.6em',marginTop:'.4em'}}/>
              </button>
            </div>
          </div>
          {/* */}
        </>
      ))}
    </>
  );
};

export default FavoriteItem;
