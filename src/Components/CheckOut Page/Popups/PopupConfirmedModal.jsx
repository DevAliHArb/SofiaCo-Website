import React, { useEffect, useState } from "react";
import classes from "./PopupModal.module.css";
import Img from "../../../assets/ConfirmIcon.png";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 500,
  bgcolor: '#fff',
  boxShadow: 24,
  fontSize:'calc(0.7rem + 0.2vw)',
  fontFamily:'montserrat',
  overflow:'hidden',
  borderRadius:'1em'
};

const PopupConfirmedModal = ({ open, handleClose, orderId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "hidden",border:'none' }}
      >
        <Box sx={style}>
        <div style={{ width: '100%',display: 'flex', flexDirection:'column',alignItems: 'center', margin:'0',textAlign:"center", fontFamily:'montserrat' }}>
        <div style={{width:'9em',margin:'2em auto'}}><img alt="" src={Img} style={{width:"100%"}}/></div>
        <h4 style={{color:"var(--accent-color)",fontWeight:'700',fontSize:'calc(.9rem + .3vw)',margin:'0 auto',padding:'0 10%'}}>Your order is confirmed</h4>
        <h6 style={{color:"var(--accent-color)",fontWeight:'600',fontSize:'calc(.8rem + .2vw)',margin:'1em auto',padding:'0 10%'}}>Thanks for shopping! your order hasn’t shipped yet, but we wll send you an email when it’s done.</h6>
        </div>
        <div style={{width:'85%',gap:'1em',margin:'1em auto 2em auto',display:"flex",flexDirection:"column"}}>
        <Button 
           size="large"
           onClick={()=>navigate(`/checkout-summary/${orderId}`)}
          style={{backgroundColor:'var(--forth-color)',color: '#DED8CC', fontWeight:'600', height:'3em',width:'100%',borderRadius:'.7em'}}>
            View Order
          </Button>
          <Button 
           size="large"
           onClick={()=>navigate('/')}
          style={{backgroundColor:'var(--primary-color)',color: '#DED8CC', fontWeight:'600', height:'3em',width:'100%',borderRadius:'.7em'}}>
            Back to Home
          </Button>
        </div>
        </Box>
      </Modal>
    </div>
  );
};



export default PopupConfirmedModal;
