import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CheckOutItem.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { decreamentQuantity, deleteItem, changeQuantity } from "../Common/redux/productSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Rate, Input } from "antd";
import AuthContext from "../Common/authContext";

const CheckOutItem = () => {
  const authCtx = useContext(AuthContext);
      const dispatch = useDispatch();
    const productData = useSelector((state) => state.products.productData);
    return (
      <>
        {productData.map((props) => (
          
          <div className={classes.card} key={props._id}>
            <div style={{display:"flex",flexDirection:"row",gap:"1em"}}>
            <div className={classes.imageCont}>
              <img src={props.image} alt="" style={{height:'100%',objectFit:'cover' ,maxWidth:'350px' }}/>
            </div>
            <div style={{height:'100%',justifyContent:'space-between',maxWidth:'30em',display:'flex', flexDirection:'column', margin:'auto 0',width:'fitcontent',fontSize:'calc(.7rem + 0.3vw)',fontFamily:'montserrat'}}>
              <div className={classes.infoCont}>
              <p style={{color:'var(--accent-color)',fontSize:'calc(.9rem + 0.3vw)',fontWeight:'700',width:"97%"}}>{props.title}</p>
              <div className={classes.delete_btnMob}><img src={DeleteIcon} style={{width:'1em'}} onClick={() =>
                      dispatch(deleteItem(props._id)) &
                      toast.error(`${props.title} is removed`)
                    } /></div>
              </div>
              <p style={{color:'var(--primary-color)',fontWeight:'500'}}>{props.author}</p>
              <p style={{color:'#712A2E',fontSize:'smaller'}}><Rate value={4} disabled  style={{color:'#712A2E',fontSize:'small'}}/>4.0/5</p>
              <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.description }}/>
              {/* <p style={{color:'var(--forth-color)'}}>Cover: Hardcover</p> */}
            <p className={classes.price}>$ {props.price}</p>
            </div>
            </div>
            <div className={classes.quantity}>
            <div className={classes.delete_btn}><img src={DeleteIcon} style={{width:'1em'}}  onClick={() =>authCtx.deleteFromcart(props._id)} /></div>
            <Input type="number" placeholder="Quantity" size="large"  
                 min={1} max={100} value={props.quantity} defaultValue={1} style={{color:'#194466',borderColor:'#194466',marginLeft:'auto',width:'80%'}}
          onChange={(e) => {
            authCtx.ChangeCartQty(
              props={
                id: props.cart_id,
                _id: props._id,
                quantity: e.target.value,
            })
            }}/>
            <p style={{margin:'0 0 0 auto',fontWeight:'600',color:'var(--forth-color)',fontSize:'large'}}>${(props.quantity * props.price).toFixed(2)}</p>
            </div>
            <div className={classes.quantitymobile}>
            <p style={{color:'var(--forth-color)',fontSize:'large',fontFamily:"montserrat",fontWeight:'500'}}>$ {props.price}</p>
            <div style={{display:'flex',flexDirection:'row',gap:'1em'}}>
              <Input type="number" placeholder="Quantity"  min={1} max={100} defaultValue={props.quantity}  style={{color:'#194466',borderColor:'#194466',width:'4em'}}
                onChange={(e) => {
                  authCtx.ChangeCartQty(
                    props={
                      id: props.cart_id,
                      _id: props._id,
                      quantity: e.target.value,
                  })
                  }}/>
              <p style={{margin:'auto 0',fontWeight:'600',color:'var(--forth-color)',fontSize:'large',fontFamily:"montserrat"}}>${(props.quantity * props.price).toFixed(2)}</p>
            </div>
            
            </div>
          </div>
        ))}
      </>
    );
  };

export default CheckOutItem