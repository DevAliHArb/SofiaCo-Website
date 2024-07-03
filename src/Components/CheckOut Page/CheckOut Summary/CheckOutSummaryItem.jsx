import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CheckOutSummaryItem.module.css";
import bookPlaceHolder from '../../../assets/bookPlaceholder.png';
import DeleteIcon from "../../../assets/DeleteIcon.svg";
import { decreamentQuantity, deleteItem, changeQuantity } from "../../Common/redux/productSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Rate, Input } from "antd";

const CheckOutSummaryItem = ({data}) => {
      const dispatch = useDispatch();
    const productData = useSelector((state) => state.products.productData);
    return (
      <>
        {data?.map((props) => (
          
          <div className={classes.card} key={props._id}>
            <div style={{display:"flex",flexDirection:"row",gap:"0em"}}>
            <div className={classes.imageCont}>
              <img src={props.article.articleimage[0]?.link ? props.article.articleimage[0].link : bookPlaceHolder} alt="" style={{height:'100%', width: '80%',objectFit:'cover' ,maxWidth:'350px' }}/>
            </div>
            <div style={{height:'100%',justifyContent:'space-between',display:'flex', flexDirection:'column', margin:'auto 0',width:'fitcontent',fontSize:'calc(.7rem + 0.3vw)',fontFamily:'var(--font-family)'}}>
              <p style={{color:'var(--accent-color)',fontSize:'calc(.9rem + 0.3vw)',fontWeight:'700'}}>{props.article.designation}</p>
              <p style={{color:'var(--primary-color)',fontWeight:'500'}}>{props.article.dc_auteur}</p>
              <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.article.descriptif }}/> 
              {/* <p style={{color:'var(--forth-color)'}} onClick={()=>console.log(data)}>Cover: Hardcover</p> */}
            <p className={classes.price}>$ {props.article.prixpublic}</p>
            </div>
            </div>
          </div>
        ))}
      </>
    );
  };

export default CheckOutSummaryItem