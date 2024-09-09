import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import classes from "./FavoriteItem.module.css";
import TextField from '@mui/material/TextField';
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import {
  addTocart,
  decreamentQuantity,
  decreamentfavQuantity,
  deleteItem,
  deletefavorite,
  changeFavorite,
  increamentfavQuantity,
  resetfavorite,
} from "../../../Common/redux/productSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../../../Common/authContext";

const FavoriteItem = ({ carttoggle }) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext)
  const [count, setCount] = React.useState(1);
  const favoriteData = useSelector((state) => state.products.favorites);
 

  return (
    <>
      {favoriteData.map((props) => (
        <>
          <div className={classes.card} key={props._id}>
            <div className={classes.imgCont}>
                {props._qte_a_terme_calcule < 1 && <div onClick={(e)=>e.stopPropagation()} className={classes.out_of_stock}>
                  <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                </div>}
              <img src={props.favimage} alt="" width="100%" />
            </div>
            <div className={classes.contentContainer}>
              <p style={{ fontSize: "calc(0.8rem + 0.2vw)",color:'var(--accent-color)',fontWeight:'600',margin:'.5em 0' }}>{props.favtitle}</p>
              <p style={{fontSize: "calc(0.6rem + 0.2vw)",margin:'.5em 0',color:'#6E90A9'}}>{props.favauthor} LE : {props.favdate}</p>
              <p style={{color:'#712A2E',fontSize:'calc(0.5rem + 0.2vw)',margin:'.5em 0',display:'flex',flex:'row'}}><Rating
                  style={{
                      color: "#712A2E",
                      margin:'0 .5em 0 0',
                  }}
                  size='small'
                  name="read-only"
                  value={props.favrate}
                  readOnly
              /><p style={{margin:'0.2em 0 0 0 ' }}>{props.favrate}/5</p></p>
              <p style={{fontSize:'calc(.8rem + 0.2vw)'}} className={classes.priceMob}>{props.favprice} $</p> 
            </div>
            <p className={classes.price} style={{fontSize:'calc(.8rem + 0.2vw)'}}>{props.favprice} $</p>
            <div className={classes.quantity}>
            <TextField
                type="number"
                value={props.favquantity}
                onChange={(e) => {
                  dispatch(
                    changeFavorite({
                      _favid: props._favid,
                      favtitle: props.favtitle,
                      favauthor: props.favauthor,
                      favimage: props.favimage,
                      favprice: props.favprice,
                      favquantity: e.target.value,
                      favdescription: props.favresume,
                    })
                  )}}
                InputProps={{ inputProps: { min: 1 }, style: { margin: '0 auto',height:'2.5em',width:'4em',backgroundColor:'#fff',color:'#194466' } }}
                className={classes.inputt}
                /> 
             </div>
            <p style={{ margin: "auto", color:'var(--forth-color)',fontWeight:'500',fontSize:'calc(.8rem + 0.2vw)' }}>
              {(props.favquantity * props.favprice).toFixed(2)} $
            </p>
            <div className={classes.addtocart}>
              <button
                onClick={(event)=>{ 
                  event.stopPropagation();
                  authCtx.addToCartWithQty(
                    props={
                      id: props._favid,
                      designation: props.favtitle,
                      dc_auteur: props.favauthor,
                      image: props.favimage,
                      prixpublic: props.favprice,
                      discount:props.discount,
                      quantity: props.favquantity,
                      _qte_a_terme_calcule: props._qte_a_terme_calcule,
                      _poids_net: props.weight,
                      _prix_public_ttc: props.price_ttc,
                      descriptif: props.favdescription,
                  });
                  }}
              >
                <FiShoppingCart style={{fontSize:'1.6em',marginTop:'.4em'}}/>
              </button>
              <button
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
