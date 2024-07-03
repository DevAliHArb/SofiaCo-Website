import React, { useContext, useRef, useState } from 'react'
import classes from './Favorite.module.css'
import { useDispatch, useSelector } from 'react-redux';
import FavoriteItem from './FavoriteItem';
import * as XLSX from "xlsx";
import { addTocart, resetfavorite } from '../Common/redux/productSlice';
import EmptyWishlist from "../../assets/EmptyWishlist.png";
import { FiShoppingCart } from "react-icons/fi";

import AuthContext from '../Common/authContext';
import AlsoSee from '../Common Components/Also See/AlsoSee';
import { useNavigate } from 'react-router-dom';
import Data from '../../Data.json'


const Favorite = ({carttoggle}) => {
  const [isalertOpen, setalertOpen] = React.useState(false);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const navigate = useNavigate(); 
  const authCtx = useContext(AuthContext)
  
  const [selectedFilter, setselectedFilter] = useState(0);
  const handleOpen = () => setalertOpen(true);
  const handleClose = () => setalertOpen(false);
  const handleConfirm = () => {
    // Perform actions on confirmation
    console.log('Delete confirmed!');
    // Additional logic...
    dispatch(resetfavorite())
    // Close the modal
    handleClose();
  };
  const dispatch = useDispatch()
    const favoriteData = useSelector((state) => state.products.favorites);
    const inputRef = useRef(null);
    const downloadExcelFile = () => {
      const ws = XLSX.utils.json_to_sheet(favoriteData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.xlsx';
      document.body.appendChild(a);
      a.click();
  
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };
  
    const AddAllHandler = () => {
      favoriteData.forEach( props => 
        authCtx.addToCartWithQty(
          props={id: props._favid,
          designation: props.favtitle,
          dc_auteur: props.favauthor,
          image: props.favimage,
          prixpublic: props.favprice,
          quantity: props.favquantity,
          descriptif: props.favdescription
        })
    );
    };
    
  return (
    <div className={classes.cart_container}>
      <div className={classes.headTitles}>
        <h1>{Data.Favorite.title[language]}</h1>
      </div>
          {favoriteData?.length == 0 ? (
           <div className={classes.shopping_con}
           style={{
            width:'70%',
             display: "flex",
             flexDirection: "column",
             rowGap: "2em",
             padding: "2%",
             margin: "auto",
             overflow:'hidden'
           }}
         >
         <div className={classes.auth_bg1}></div>
           <div style={{width:'fit-content',zIndex:"2",margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family)',fontSize:'calc(.7rem + .3vw)'}}>
             <div style={{width:'fit-content',margin:'auto'}}>
             <img alt='EmptyCart' src={EmptyWishlist} style={{width:"15em" , height:"auto"}}/>
             </div>
             <h1 style={{textAlign:'center',fontFamily: "var(--font-family)",margin:"2em auto 0em auto"}}>{Data.Favorite.emptyCart[language]}</h1>
             {/* <p  style={{textAlign:'center'}}> You have no items in your shopping cart</p> */}
             <button className={classes.browseBtn}  onClick={()=>navigate('/')}>{Data.Favorite.emptyCartBtn[language]}</button>
           </div>
         </div> 
          ) : (
      <div className={classes.shopping_con}>
        <div className={classes.auth_bg}></div>
      <div className={classes.shopping}>
      <div className={classes.header}>
          <p style={{textAlign:'start',paddingLeft:"6%"}}>{language === 'eng' ? "Items" : "Articles"}</p>
          <p className={classes.MobDisplayNone}>{language === 'eng' ? "Price" : "Prix"}</p>
          <p className={classes.MobDisplayNone}>{language === 'eng' ? "Quantity" : "Quantité"}</p>
          <p className={classes.MobDisplayNone}>Total</p>
          <button onClick={AddAllHandler} className={classes.allToCartbtn}> {Data.Favorite.addAllBtn[language]}</button>
        </div>
            <FavoriteItem carttoggle={carttoggle}/>
      </div>
      </div>
          )}
      <AlsoSee/>
    </div>
  )
}

export default Favorite