import React, { useContext, useEffect, useState } from 'react'
import classes from './CommonCard.module.css'
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FiDownload } from "react-icons/fi";

import { Row, Col, Button, Select, Form, Input } from "antd";
import './styles.css'
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../Common/authContext';


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

const CommonCard = ({data ,reviewHandler}) => {
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
        // image: item.article.articleimage[0]?.link ? item.article.articleimage[0].link : bookPlaceHolder
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
  axios.put(`https://api.leonardo-service.com/api/bookshop/order_invoices/${data.id}?status_id=13`)
  .then(() => {
      console.log("delete request successful:");
        toast.success(`Delete request successful`, {
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
      console.error("Error in delete request:", error);
      toast.error("Failed to delete item .", {
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
    console.log(element.article)
  });
}
  return (
  <div className={classes.orderCard}>
        <h3>{data.id}</h3>
        <h3>{new Date(data.date).toDateString()}</h3>
        <h3>{data.total_price}{data.currency === 'usd' ? '$' : '€' }</h3>
      <div className={classes.download}>
        <p>PDF</p>
        <FiDownload className={classes.download_icon}/>
      </div>
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

export default CommonCard