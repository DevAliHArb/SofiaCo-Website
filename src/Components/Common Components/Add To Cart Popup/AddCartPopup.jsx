import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './AddCartPopup.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiShare2 } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Details from './Details';
import AuthContext from '../../Common/authContext';
import { useSelector } from 'react-redux';
import img from '../../../assets/bookPlaceholder.png'
import { Add } from '@mui/icons-material';
import axios from 'axios';

const AddCartPopup = () => {

  const authCtx = useContext(AuthContext)
  const [selectedBook, setSelectedBook] = useState({});
    
  const id = authCtx.addtocartPopupId;
  const isOpen = authCtx.addtocartPopupOpen;
  const onClose = () => {
    authCtx.setaddtocartPopupOpen(false);
  }
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

    const fetchBook = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_TESTING_API}/articles?id=${id}&ecom_type=${process.env.REACT_APP_ECOM_TYPE}`);
        const book = response.data;
        setSelectedBook(book);
      } catch (error) {
        // console.error('Error fetching the book:', error);
      }
    };
    useEffect(()=>{
      if (isOpen) fetchBook()
    },[isOpen])
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeId, setactiveId] = useState(1);
      
  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.activeIndex);
  };

  const constantValue = activeSlideIndex + 1;
  useEffect(() => {
    selectedBook.articleimage?.forEach((item) => {
      if (item.id === constantValue) {
        setactiveId(item.id); 
      }
    });
  }, [constantValue]);
// console.log(constantValue)

  const [swiper, setSwiper] = useState(null);

  const slideTo = (index) => {
if(swiper) 
swiper.slideTo(index)};
      
  const handleMouseMove = (e) => {
    const image = e.target;
    const boundingRect = image.getBoundingClientRect();
    
    const x = (e.clientX - boundingRect.left) / boundingRect.width;
    const y = (e.clientY - boundingRect.top) / boundingRect.height;

    image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    overflow: 'auto',
    p: 0,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="add-to-cart-modal"
      aria-describedby="product-details-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
            zIndex: 1,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className={classes.bookDetails}>
        <div className={classes.bigContainer}>
          <div className={classes.booksContainer}>
        <div className={classes.swiper}>
          <div className={classes.imageContainer}>
            {selectedBook._qte_a_terme_calcule < 1 && (
              <div className={classes.out_of_stock}>
                <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
              </div>
            )}
            <img 
              src={selectedBook.articleimage?.[0]?.link || img} 
              alt="Book Cover" 
              onMouseMove={handleMouseMove}
            />
          </div>
        </div> 
          </div>
        <Details/>
        </div>
    </div>
      </Box>
    </Modal>
  )
}

export default AddCartPopup
