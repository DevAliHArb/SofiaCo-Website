import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CheckOutItem.module.css";
import DeleteIcon from "../../assets/DeleteIcon.svg";
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
            <div style={{height:'100%',justifyContent:'space-between',width:'20em',display:'flex', flexDirection:'column', margin:'auto 0',fontSize:'calc(.7rem + 0.3vw)',fontFamily:'var(--font-family)'}}>
              <div className={classes.infoCont}>
              <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + 0.3vw)',fontWeight:'700',width:"97%",textAlign:'start',marginBottom:'.3em'}} onClick={()=>console.log(props)}>{props.title}</p>
              <div className={classes.delete_btnMob}><img src={DeleteIcon} style={{width:'1em'}} onClick={() =>
                      dispatch(deleteItem(props._id)) &
                      toast.error(`${props.title} is removed`)
                    } /></div>
              </div>
              <p style={{color:'var(--secondary-color)',fontSize:'.6rem + .2vw',fontWeight:'400',margin:'0',textAlign:'start'}}>{props.author}</p>
              <p style={{color:'var(--secondary-color)',fontSize:'.6rem + .2vw',fontWeight:'400',margin:'0',textAlign:'start'}}>{new Date(props.date).toDateString() }</p>
              <p style={{color:'var(--secondary-color)',fontSize:'smaller',textAlign:'start'}}><Rate value={4} disabled  style={{color:'var(--primary-color)',fontSize:'small'}}/>4.0/5</p>
              {/* <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.description }}/> */}
              <div style={{display:'flex',flexDirection:'row'}}>
            <p className={classes.price} style={{textAlign:'start'}}>$ {props.price}</p>
            <p style={{margin:'auto 0 auto auto',fontWeight:'600',color:'var(--primary-color)',fontFamily:"var(--font-family)"}}className={classes.totalPriceMob}>${(props.quantity * props.price).toFixed(2)}</p>
            </div>
            </div>
            <p style={{margin:'auto 0',fontWeight:'700',color:'var(--secondary-color)',fontSize:'larger',fontFamily:"var(--font-family)"}}className={classes.totalPrice}>${(props.quantity * props.price).toFixed(2)}</p>
            </div>
            {/* <div className={classes.quantity}> */}
            <div className={classes.delete_btn}><img src={DeleteIcon} style={{width:'1.5em'}}  onClick={() =>authCtx.deleteFromcart(props._id)} /></div>
            {/* <Input type="number" placeholder="Quantity" size="large"  
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
            </div>*/}
            {/* <div className={classes.quantitymobile}>
            <p style={{color:'var(--forth-color)',fontSize:'large',fontFamily:"var(--font-family)",fontWeight:'500'}}>$ {props.price}</p>
            <div style={{display:'flex',flexDirection:'row',gap:'1em'}}>
            </div>
            
            </div> */}
          </div>
        ))}
      </>
    );
  };

export default CheckOutItem