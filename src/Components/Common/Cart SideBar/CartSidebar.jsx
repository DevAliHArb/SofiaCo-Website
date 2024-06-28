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
                <span onClick={toggle} style={{margin:'0 0 0 auto', background:'var(--primary-color)' ,borderRadius:'.3em',cursor:'pointer' }}>
                    <ClearIcon style={{width:'2em',height:'1.5em',color:'#FFF',marginBottom:"-.2em"}} />
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
              <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + 0.2rem)',fontWeight:'700'}} onClick={()=>console.log(props)}>{props.title}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'500'}}>{props.author}</p>
              <p style={{color:'var(--secondary-color)',fontWeight:'600',fontSize:'smaller'}}><Rate value={4} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>4.0/5</p>
              <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.description }} style={{color:"var(--secondary-color)"}}/>
              {/* <p style={{color:'var(--forth-color)'}}>Cover: Hardcover</p> */}
                  <p className={classes.price}>{currency === "eur"
                            ? `${(props.price *1).toFixed(2)} €`

                            : `${
                                props.discount > 0
                                  ? (
                                      (props.price) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                      props.price * authCtx.currencyRate
                                    ).toFixed(2)
                              }$`}</p>
                <Input type="number" placeholder="Quantity"
                  min={1} max={100} value={props.quantity} defaultValue={1} style={{color:'#194466',borderColor:'#194466',width:'5em'}}
                    onChange={(e) => {
                      authCtx.ChangeCartQty(
                        props={
                          id: props.cart_id,
                          _id: props._id,
                          quantity: e.target.value,
                      })
                      }}/>
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
            
            
            <p style={{margin:'0 0 .5em auto',color:'var(--primary-color)',fontSize:'calc(.9rem + 0.3vw)',fontWeight:'600'}}>${(props.quantity * props.price).toFixed(2)}</p>
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
                      ? `${(totalAmt * 1).toFixed(2)} €`
                      : `${(totalAmt * authCtx.currencyRate).toFixed(2)} $`}</p>
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
