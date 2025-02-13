import React, { useContext, useEffect, useState } from 'react'
import classes from './AllCard.module.css'
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

const AllCard = ({data ,reviewHandler, isProforma}) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [filtereddata, setFiltereddata] = useState([])
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [showPopup, setShowPopup] = useState(false);


  const handleDownload = async (documentId) => {
    if (!documentId) {
      toast.error(language === "eng" ? "Document ID is missing." : "L'ID du document est manquant.");
      return;
    }
  
    try {
      // First, get the document using GET request to fetch the PDF URL
      const response = await axios.get(`${import.meta.env.VITE_PDF_API}/${documentId}`);
      
      const pdfLink = response.data;  // Assuming the response contains the pdfUrl field
  
      if (pdfLink) {
        // Create an anchor element programmatically
        const link = document.createElement('a');
        link.href = pdfLink;
        link.setAttribute('download', 'file.pdf'); // Set the download attribute with a default file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
  
        // Now, send DELETE request to remove the document
        // await axios.delete(`${import.meta.env.VITE_PDF_API}/${documentId}`);
        toast.success(language === "eng" ? "File downloaded and deleted successfully." : "Fichier téléchargé et supprimé avec succès.");
      } else {
        toast.error(language === "eng" ? "PDF link is not available." : "Le lien PDF n'est pas disponible.");
      }
    } catch (error) {
      console.error('Error handling the document download:', error);
      toast.error(language === "eng" ? "An error occurred while handling the document." : "Une erreur est survenue lors de la gestion du document.");
    }
  };
  

  return (
  <div className={classes.orderCard}>
        <h3>{data.numero}</h3>
        <h3>{new Date(data.datecreation).toDateString()}</h3>
        <h3>{data.montantttc}
          €

        </h3>
        <h3>{data?.mydocumenttype?.nom}</h3>
      <div className={classes.download} onClick={() => handleDownload(data.b_usr_documenttype_id === 72 || data.b_usr_documenttype_id === 9 || data.b_usr_documenttype_id === 19 ? data.cde_doc_id : data.id)}>
        <p>PDF</p>
        <FiDownload className={classes.download_icon}/>
      </div>
    </div>
  )
}

export default AllCard