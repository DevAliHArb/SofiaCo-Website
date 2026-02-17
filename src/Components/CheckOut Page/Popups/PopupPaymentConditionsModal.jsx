import React from "react";
import classes from "./PopupModal.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
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
  fontFamily:'var(--font-family)',
  overflow:'hidden',
  borderRadius:'1em'
};

const PopupPaymentConditionsModal = ({ open, handleClose, onPayNow, onPayLater }) => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "hidden", border:'none' }}
      >
        <Box sx={style}>
          <div style={{ 
            width: '100%',
            display: 'flex', 
            flexDirection:'column',
            alignItems: 'center', 
            margin:'0',
            textAlign:"center", 
            fontFamily:'var(--font-family)' 
          }}>
            <h4 style={{
              color:"var(--secondary-color)",
              fontWeight:'700',
              fontSize:'calc(.9rem + .3vw)',
              margin:'2em auto 0 auto',
              padding:'0 10%'
            }}>
              {language === 'eng' 
                ? 'Payment Options Available' 
                : 'Options de paiement disponibles'}
            </h4>
            <h6 style={{
              color:"var(--secondary-color)",
              fontWeight:'600',
              fontSize:'calc(.8rem + .2vw)',
              margin:'1em auto',
              padding:'0 10%'
            }}>
              {language === 'eng' 
                ? 'You have payment conditions available. Would you like to pay now or use your payment conditions?' 
                : 'Vous disposez de conditions de paiement. Souhaitez-vous payer maintenant ou utiliser vos conditions de paiement ?'}
            </h6>
          </div>
          <div style={{
            width:'85%',
            gap:'1em',
            margin:'1em auto 2em auto',
            display:"flex",
            flexDirection:"column"
          }}>
            <Button 
              size="large"
              onClick={onPayNow}
              style={{
                backgroundColor:'var(--primary-color)',
                color: '#fff', 
                fontWeight:'600', 
                height:'3em',
                width:'100%',
                borderRadius:'.7em'
              }}
            >
              {language === 'eng' ? 'Pay Now' : 'Payer maintenant'}
            </Button>
            <Button 
              size="large"
              onClick={onPayLater}
              style={{
                backgroundColor:'var(--forth-color)',
                color: 'var(--secondary-color)', 
                fontWeight:'600', 
                height:'3em',
                width:'100%',
                borderRadius:'.7em'
              }}
            >
              {language === 'eng' ? 'Pay Later (Use Payment Conditions)' : 'Payer plus tard (Utiliser les conditions de paiement)'}
            </Button>
            <Button 
              size="large"
              onClick={handleClose}
              style={{
                backgroundColor:'#ccc',
                color: '#333', 
                fontWeight:'600', 
                height:'3em',
                width:'100%',
                borderRadius:'.7em'
              }}
            >
              {language === 'eng' ? 'Cancel' : 'Annuler'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PopupPaymentConditionsModal;
