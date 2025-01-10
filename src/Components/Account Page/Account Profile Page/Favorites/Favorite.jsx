import React, { useContext, useRef, useState } from 'react'
import classes from './Favorite.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import FavoriteItem from './FavoriteItem';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import * as XLSX from "xlsx";
import { addTocart, resetfavorite } from '../../../Common/redux/productSlice';
import bg from "../../../../assets/companiesbg.svg";
import quick from "../../../../assets/cartimgs/HighQuality.png";
import customerservice from "../../../../assets/cartimgs/FreeShipping.png";
import perfect from "../../../../assets/cartimgs/Support.png";
import secure from "../../../../assets/cartimgs/WarrantyProtection.png";
import EmptyWishlist from "../../../../assets/EmptyWishlist.png";
import { MenuItem, Select } from '@mui/material';
import { FiShoppingCart } from "react-icons/fi";

import contactUsImage from '../../../../assets/contactUsImage.png'
import AuthContext from '../../../Common/authContext';
import Data from '../../../../Data.json'

const categories = [
  {id:0 , title:'All'},
  {id:1 , title:'Islam'},
  {id:2 , title:'Ebooks'},
  {id:3 , title:'Romans'},
  {id:4 , title:'Religion'},
  {id:5 , title:'Polar'},
  {id:6 , title:'Jeunesse'},
  {id:7 , title:'Soufisme'},
];


const Favorite = ({carttoggle}) => {
  const [isalertOpen, setalertOpen] = React.useState(false);
  const navigate = useNavigate(); 
  const authCtx = useContext(AuthContext)
  
  const [selectedFilter, setselectedFilter] = useState(0);
  const handleOpen = () => setalertOpen(true);
  const handleClose = () => setalertOpen(false);
  const handleConfirm = () => {
    // Perform actions on confirmation
    // console.log('Delete confirmed!');
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
          props={
            id: props._favid,
            designation: props.favtitle,
            dc_auteur: props.favauthor,
            image: props.favimage,
            prixpublic: props.favprice,
            quantity: props.favquantity,
            remise_catalogue:props.remise_catalogue,
            descriptif: props.favdescription,
            _poids_net: props.weight,
            _prix_public_ttc: props.price_ttc,
            _qte_a_terme_calcule: props._qte_a_terme_calcule,
        })
    );
    };
    
  return (
    <div className={classes.favorite_con}>
        {favoriteData.length == 0 ? <></> :
        <div className={classes.header}>
          <div className={classes.headtitle}>
          <h3 style={{fontWeight:"600",marginTop:'0.2em'}}>{Data.Favorite.title[language]} </h3>
          </div>
          <button onClick={AddAllHandler}><FiShoppingCart style={{fontSize:'1.3em',margin:'0 .5em -.15em 0'}}/> {Data.Favorite.emptyCartBtn[language]}</button>
        </div>}
        <div className={classes.cardsContainer}>
        {/* {favoriteData.length == 0 ? <></> :
        <div className={classes.topContainer}>
        {categories.map((props) => {
              return (
                  <button 
                  onClick={()=>{setselectedFilter(props.id)}}
                    key={props.id}
                    className={classes.selectedFilter} 
                    style={selectedFilter === props.id ? {backgroundColor:'var(--forth-color)'} : {backgroundColor:'transparent'}}>
                      {props.title}
                  </button>
              )}
              )}
        </div>} */}
        {favoriteData.length == 0 ? <></> : 
        <div className={classes.topContainerMob} >
        {/* <Select
                disableUnderline
                inputProps={{ 'aria-label': 'Without label' }}
                value={selectedFilter}
                onChange={(e) => setselectedFilter(e.target.value)}
                style={{height:'fit-content',backgroundColor:'var(--forth-color)',borderColor:'var(--primary-color)',textAlign:'center',color:'#fff',borderRadius:'1em',width:'100%'}}
            > 
                {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id} style={{textAlign:'center'}}>
                    {option.title}
                    </MenuItem>
                ))}
            </Select> */}
            </div>}
            {favoriteData.length == 0 ? <></> :
        <div className={classes.tableHead}>
          <p style={{textAlign:'start'}}>{language === 'eng' ? "Items" : "Articles"}</p>
          <p>{language === 'eng' ? "Price" : "Prix"}</p>
          <p>{language === 'eng' ? "Quantity" : "Quantité"}</p>
          <p>Total</p>
        </div>}
        <div className={classes.cards}>
          {favoriteData.length == 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
                marginTop:'2em'
              }}
            >
              <div style={{width:'fit-content',margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family)',fontSize:'calc(.7rem + .3vw)'}}>
                <div style={{width:'fit-content',margin:'auto'}}>
                <img alt='EmptyWishlist' src={EmptyWishlist} style={{width:"10em" , height:"auto"}}/>
                </div>
                <h1 style={{textAlign:'center'}}>{language === 'eng' ? "Your wishlist is empty!" : "Votre liste de souhaits est vide !" }</h1>
                <p  style={{textAlign:'center'}}> {language === 'eng' ? "You have no items in your shopping cart" : "Vous n'avez aucun article dans votre panier" }</p>
                <button className={classes.browseBtn}  onClick={()=>navigate('/')}>{language === 'eng' ? "Browse" : "Parcourir" }</button>
              </div>
            </div>
          ) : (
            <FavoriteItem carttoggle={carttoggle}/>
          )}
        </div>
        {favoriteData.length == 0 ? <></> : 
        <button className={classes.btnMobile}><FiShoppingCart style={{fontSize:'1.3em',margin:'0 .5em -.15em 0'}} onClick={AddAllHandler}/> {Data.Favorite.addAllBtn[language]}</button>
          }
        </div>
    </div>
  )
}

export default Favorite