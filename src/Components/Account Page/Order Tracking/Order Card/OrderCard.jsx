import React, { useContext, useEffect, useState } from 'react'
import classes from './OrderCard.module.css'
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { Row, Col, Button, Select, Form, Input } from "antd";
import './styles.css'
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import AuthContext from '../../../Common/authContext';
import bookPlaceHolder from '../../../../assets/bookPlaceholder.png';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';


const ConfirmationPopup = ({ message, onConfirm, onCancel, showPopup }) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #ACACAC",
    borderRadius: "1em",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className="confirmation-popup">
      <Modal
        open={showPopup}
        onClose={onCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "hidden" }}
      >
        <Box sx={style}>
        <p>{message}</p>
        <div style={{width:'fit-content',margin:'auto',display:'flex',flexWrap:'wrap'}}>
        <Button 
           onClick={onConfirm}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'0.5em',margin:'1em '}}>
            {language === 'eng' ? "Yes" : "Oui"}
          </Button>
        <Button 
           onClick={onCancel}
          style={{backgroundColor:'var(--secondary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'.5em',margin:'1em '}}>
            {language === 'eng' ? "No" : "Non"}
          </Button></div>
        </Box>
      </Modal>
    </div>
    
  );
};

const OrderCard = ({data ,reviewHandler}) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [filtereddata, setFiltereddata] = useState([])
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [showPopup, setShowPopup] = useState(false);

  useEffect(()=>{
    setFiltereddata(data)
    const items = data.order_invoice_items?.map(item => {
      // const article = EnArticles.find(article => article.id === item.article_id);
      
      // Return the desired object format
      return {
        id: item.article_id,
        order_invoice_item_id: item.id,
        price: item.price,
        quantity:item.quantity,
        date: data.date,
        article_id: item.article_id,
        is_gift: item.is_gift,
        image: item.article.articleimage[0]?.link ? item.article.articleimage[0].link : bookPlaceHolder
      };
  });
    setImages(items)
  },[data])
    const sign = '>';

    const Reviewhandle = () => {
      authCtx.setReviewData(images);
      navigate(`/review`)
    }

    const Returnhandle = () => {
      authCtx.setReturnData(data);
      authCtx.setReturnSelectedPage('add-return')
      authCtx.seteditReturnData({
        return_items:{},
        received_order: null,
        return_order: null ,
        return_price: '' ,
        reason: '' ,
        quantity: 0 ,
        description: '',
        user_name: '' ,
        user_email: '' ,
        user_phone: '',
        images: [],
        videos: [],} )
      navigate(`/account/orders/order-returns`)
}
const CancleOrderHandler = () => {
  axios.put(`${import.meta.env.VITE_TESTING_API}/order_invoices/${data.id}?status_id=13`)
  .then(() => {
      // console.log("delete request successful:");
        toast.success(language === "eng" ? "Delete request successful." : "Demande de suppression réussie.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
        setShowPopup(false);
        window.location.reload();
  })
  .catch((error) => {
      // console.error("Error in delete request:", error);
      toast.error(language === "eng" ? "Failed to delete item." : "Échec de la suppression de l'élément.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
  });
}
const AddAllToCart = () => {
  data.order_invoice_items?.forEach(element => {
    authCtx.addToCart({props: element.article, carttoggle:()=>{}});
    // console.log(element.article)
  });
}
  return (
  <div className={classes.orderCard}>
        <h3 style={{textAlign:'start'}}>#{data.id}</h3>
        <h3 style={{textAlign:'end'}}><span className={classes.mobileTitle}>{language === 'eng' ? "Date: " : "Date: " }</span>{new Date(data.date).toDateString()}</h3>
        {data.return_status === null ? <h3  style={{textAlign:'start'}}><span className={classes.mobileTitle}>{language === 'eng' ? "Status: " : "Statut: " }</span>{language == 'eng' ? data.look_up.name : data.look_up.name_fr}</h3> : 
                <h3 style={{textAlign:'start'}}><span className={classes.mobileTitle}>{language === 'eng' ? "Status: " : "Statut: " }</span>{language == 'eng' ? data.return_look_up.name : data.return_look_up.name_fr} {language === 'eng' ? "Return" : "Retour" }</h3>}

      <h3 style={{textAlign:'end'}}><span className={classes.mobileTitle}>Total: </span>{data.currency === 'usd' ? ' $' : ' €' }{data.total_price}</h3>
      <button className={classes.btn}>{language === 'eng' ? "View Order" : "Voir la commande" }</button>
       {/* <div className={classes.swiper}>
          <Swiper
            // slidesPerView={3}
            spaceBetween={20}
            effect={"fade"}
            modules={[Pagination]}
            style={{
              padding: "0 1em",
            }}
            pagination={{
              clickable: true
            }}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              651: {
                slidesPerView: 4,
              },
              951: {
                slidesPerView: 5,
              },
            }}
          >
            {images.map((props) => {
              return (
                <SwiperSlide key={props.id} style={{backgroundColor:'transparent'}}>
                  <div className={classes.card_container}>
                    <div className={classes.card_img}>
                      <img src={props.image} alt=""/>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div> */}
        {/* <div className={classes.priceContainerMob}>
          <h4 style={{margin:'0',color:'var(--accent-color)',fontWeight:'500'}}>( {images?.length} items )</h4>
          <h3 style={{margin:'0',fontWeight:'500',color:'var(--secondary-color)'}}>$50</h3>
        </div>
        <div style={{display:'flex',flexDirection:'row',width:'90%',margin:'1em auto 0 auto',justifyContent:'space-between'}}>
          <div className={classes.date}>{new Date(data.date).toDateString()}</div>
          <div className={classes.btnsCont}>
           {(data.status_id === 2 || data.status_id === 3 || data.status_id === 4) && <button className={classes.btn} style={{backgroundColor:'var(--primary-color)'}}>Track Order</button>}
           {(data.status_id === 3 || data.status_id === 4 || data.status_id === 5 ) && data.return_status === null && <button className={classes.btn} onClick={Returnhandle} style={{backgroundColor:'var(--primary-color)'}}>Return</button>}
           {data.status_id === 2  && <button onClick={(event) => setShowPopup(true) & event.stopPropagation()} className={classes.btn} style={{backgroundColor:'var(--accent-color)'}}>Cancel Order</button>}
           {data.status_id === 5 && <button className={classes.btn} style={{backgroundColor:'var(--accent-color)'}} onClick={(event)=>reviewHandler() &event.stopPropagation()&console.log('testtt')}>Review</button>}
            <button onClick={(event)=>AddAllToCart() & event.stopPropagation()} className={classes.btn} style={{backgroundColor:'var(--secondary-color)'}}>Repurchase</button>
          </div>
        </div> */}
        {showPopup && (
        <ConfirmationPopup
          message={"Are you sure you want to delete this Order?"}
          onConfirm={CancleOrderHandler}
          onCancel={() => setShowPopup(false)}
          showPopup={showPopup}
        />
      )}
    </div>
  )
}

export default OrderCard