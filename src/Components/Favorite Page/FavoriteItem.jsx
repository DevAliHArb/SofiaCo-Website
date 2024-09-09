import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import classes from "./FavoriteItem.module.css";
import TextField from '@mui/material/TextField';
import DeleteIcon from "../../assets/DeleteIcon.svg";
import {
  addTocart,
  decreamentQuantity,
  decreamentfavQuantity,
  deleteItem,
  deletefavorite,
  changeFavorite,
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
                     {props._qte_a_terme_calcule < 1 && <div onClick={(e)=>e.stopPropagation()} className={classes.out_of_stock}>
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
              <p className={classes.priceMob}>{currency === 'usd' ? `$ ${(props.favprice * authCtx.currencyRate).toFixed(2)} ` : `€ ${Number(props.favprice).toFixed(2)} `} </p> 
            </div>
            <p className={classes.price}>{currency === 'usd' ? `$ ${(props.favprice * authCtx.currencyRate).toFixed(2)} ` : `€ ${Number(props.favprice).toFixed(2)} `}</p>
            
           {props._qte_a_terme_calcule > 0 ? <div className={classes.quantity}>
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "26px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (props.favquantity != 1) {
                    dispatch(
                      decreamentfavQuantity({
                        _favid: props._favid,
                        favtitle: props.favname,
                        favauthor: props.favauthor,
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
                }}
              >
                -
              </p>
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  fontSize: "18px",
                  margin: "auto",
                }}
              >
                {props.favquantity}
              </p>
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  margin: "auto",
                  fontSize: "26px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  dispatch(
                    increamentfavQuantity({
                      _favid: props._favid,
                      favtitle: props.favname,
                      favauthor: props.favauthor,
                      favimage: props.favimage,
                      favprice: props.favprice,
                      favquantity: 1,
                      favdescription: props.favresume,
                      weight: props.weight,
                      price_ttc: props.price_ttc,
                    })
                  )
                }
              >
                +
              </p>
            </div> : <div/>}
            <p className={classes.totalPrice} >
              {currency === 'usd' ? `$ ${(props.favquantity * props.favprice * authCtx.currencyRate).toFixed(2)} ` : `€ ${(props.favquantity * props.favprice).toFixed(2)} `}
            </p>
            <div className={classes.addtocart}>
              {props._qte_a_terme_calcule > 0 &&<button
              onClick={(event)=>{ 
                event.stopPropagation();
                authCtx.addToCartWithQty(
                  props={
                    _id: props.id,
                    title: props.designation,
                    author: props.dc_auteur,
                    image: props.image,
                    price: props.prixpublic,
                    _qte_a_terme_calcule: props._qte_a_terme_calcule,
                    discount: props.discount,
                    quantity: props.quantity,
                    description: props.descriptif,
                    weight: props._poids_net,
                    cart_id: response.data.data.id,
                    price_ttc: props._prix_public_ttc,
                    article_stock: props.article_stock
                });
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
