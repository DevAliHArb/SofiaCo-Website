import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './BookDetails.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiShare2 } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Details from './Details';
import AuthContext from '../../Common/authContext';
import { useSelector } from 'react-redux';
import img from '../../../assets/bookPlaceholder.png'
import { Helmet } from 'react-helmet-async';

const BookDetails = () => {

  const authCtx = useContext(AuthContext)
  const [bookData, setbookData] = useState({});
    const selectedBook = useSelector((state) => state.products.selectedBook[0])
    const selectedVariants = useSelector((state) => state.products.selectedVariants);
    const selectedVariantProduct = useSelector((state) => state.products.selectedVariantProduct);
    
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  // useEffect(() => {
  //   selectedBooks.forEach(element => {
  //     setbookData(element)
  //   });
      
  // }, [selectedBooks]);

  const [array, setArray] = useState([
        { id: 2, image: '',},
        { id: 3, image: '',},
    ]);

    useEffect(() => {
      
    if (bookData && bookData.image) {
        setArray((prevArray) => [
          { id: 1, image: bookData.image },
          ...prevArray.filter(item => item.id !== 1),
        ]);
      }
    }, [bookData]);

    const styles = {
        style1: {
          position: "absolute",
          top: "50%",
           right: "10%",
          width: "fit-contant",
          height:'fitcontant',
          zIndex: 10,
          rotate:'180deg',
        },
        style2: {
          position: "absolute",
          top: "50%",
           left: "10%",
           width: "fit-contant",
           height:'fitcontant',
          zIndex: 10,
        },
      };
      const [activeSlideIndex, setActiveSlideIndex] = useState(0);
      const [activeId, setactiveId] = useState(1);
      const [filteredImages, setFilteredImages] = useState([]);
      const [swiper, setSwiper] = useState(null);
      
  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.activeIndex);
  };

  const constantValue = activeSlideIndex + 1;
  useEffect(() => {
        filteredImages?.forEach((item, index) => {
          if (index + 1 === constantValue) {
            setactiveId(index + 1); 
          }
        });
      }, [constantValue, filteredImages]);

      useEffect(() => {
        if (!selectedBook?.articleimage) {
          setFilteredImages([]);
          return;
        }

        if (selectedVariantProduct?.articleimage?.length > 0) {
          setFilteredImages(selectedVariantProduct.articleimage);
          return;
        }

        if (selectedVariantProduct?.image) {
          setFilteredImages([
            {
              id: selectedVariantProduct.id || 'selected-variant-product-image',
              link: selectedVariantProduct.image,
              type: selectedVariantProduct.designation,
            },
          ]);
          return;
        }

        const selectedVariantItemIds = Object.values(selectedVariants || {})
          .map((variant) => variant?.id)
          .filter((variantId) => variantId);

        if (selectedVariantItemIds.length === 0) {
          setFilteredImages(selectedBook.articleimage);
          return;
        }

        const variantSpecificImages = selectedBook.articleimage.filter((image) =>
          selectedVariantItemIds.includes(image.b_usr_article_variant_items_id)
        );

        if (variantSpecificImages.length > 0) {
          setFilteredImages(variantSpecificImages);
        } else {
          setFilteredImages(selectedBook.articleimage);
        }
      }, [selectedBook?.articleimage, selectedVariants, selectedVariantProduct]);

      useEffect(() => {
        setActiveSlideIndex(0);
        setactiveId(1);
        if (swiper) {
          swiper.slideTo(0);
        }
      }, [filteredImages, swiper]);

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

  
  const normalizeMetaValue = (value) => (typeof value === 'string' ? value.trim() : '');

  const metaTitle = normalizeMetaValue(
    selectedBook?.meta_title ||
    selectedBook?.designation
  );

  const metaDescription = normalizeMetaValue(
    selectedBook?.meta_description ||
    (language === 'eng' ? selectedBook?.description_en : selectedBook?.description_fr)
  );

  const keyword = normalizeMetaValue(
    selectedBook?.keywords ||
    selectedBook?.designation
  );

  const secondaryKeyword = normalizeMetaValue(
    selectedBook?.secondary_keywords ||
    selectedBook?.isbn
  );

  const longTailText = normalizeMetaValue(selectedBook?.long_tail_text);

  return (
    <div className={classes.bookDetails}>
        <Helmet>
          {metaTitle && <title>{metaTitle}</title>}
          {metaDescription && <meta name="description" content={metaDescription} />}
          {keyword && <meta name="keywords" content={keyword} />}
          {secondaryKeyword && <meta name="secondary_keywords" content={secondaryKeyword} />}
          {longTailText && <meta name="long_tail_text" content={longTailText} />}
        </Helmet>
        <div className={classes.bigContainer}>
          <div className={classes.booksContainer}>
        <div className={classes.swiper}>
          <Swiper
          onSlideChange={handleSlideChange}
          onSwiper={setSwiper}
            slidesPerView={1}
            // navigation={{
            //   nextEl: ".button-next-slide",
            //   prevEl: ".button-prev-slide",
            // }}
            // modules={[Navigation]}
          >
            {filteredImages?.length != 0 ? 
           <>
            {filteredImages?.map((props) => {
              return (
                <SwiperSlide style={{padding:'0 0%'}}>
                    <div className={classes.imageContainer}>
                     {props._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
                        <img src={props.link} alt={props?.type} onMouseMove={handleMouseMove}/>
                    </div>
                </SwiperSlide>
              );
            })}
           </>
            :
                <SwiperSlide style={{padding:'0 0%'}}>
                    <div className={classes.imageContainer}>
                     {selectedBook?._qte_a_terme_calcule < 1 && <div className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
                        <img src={img} alt="Book Cover" onMouseMove={handleMouseMove}/>
                    </div>
                </SwiperSlide>
                    }
          </Swiper>
            {/* <div className="button-prev-slide" style={styles.style2}>
              <ChevronLeftIcon style={{color: 'black',backgroundColor:'#FAFAFA',borderRadius:'50%',padding:'5%'}}/>
            </div>
            <div className="button-next-slide" style={styles.style1}>
              <ChevronLeftIcon style={{color: 'black',backgroundColor:'#FAFAFA',borderRadius:'50%',padding:'5%'}}/>
            </div> */} 
        </div>
        
        <div className={classes.bookCoversContainer}>
          {filteredImages?.map((props, index) => {
                        return (
                          <div className={classes.bookCovers} onClick={() => slideTo(index) & console.log(activeId)}>
                            <div style={{width:'100%', margin:'auto',position:'relative'}}>
                            <img src={props.link} className={`${constantValue === index + 1  ? classes.bookCoverSelectedimg : classes.bookCoverimg }`} alt={props?.type}/>
                          </div></div>
                        )})} 
                        
                  
                      </div>
        {/* <div className={classes.auth_con}>
          <p>{language === 'eng' ? '100%  guarantee of authentication' : ''}</p>
          <p>{language === 'eng' ? '100%  guarantee of identification' : ''}</p>
          </div>               */}
        <div className={classes.socialsCont}> 
            <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + .3vw)',fontWeight:"600",paddingLeft:'1em', margin:'auto 0'}}><FiShare2 style={{margin:'0 .3em -.3em 0'}}/>{language === 'eng' ? 'Share:' : 'Recommander ce produit:'}</p>
            <div style={{display:'flex',flexDirection:'row'}}>
              <div className={classes.iconCont}><FaFacebook style={{fontSize:'1.6em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaXTwitter style={{fontSize:'1.6em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaInstagram style={{fontSize:'1.6em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaYoutube style={{fontSize:'1.6em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
            </div>
          </div> 
          </div>
        <div className={classes.socialsContMob}> 
            <p style={{color:'var(--secondary-color)',fontSize:'calc(.9rem + .3vw)',fontWeight:"600"}}><FiShare2 style={{margin:'0 .3em -.1em 0'}}/>{language === 'eng' ? 'Share:' : 'Recommander ce produit:'}</p>
            <div style={{display:'flex',flexDirection:'row'}}>
              <div className={classes.iconCont}><FaFacebook style={{fontSize:'1.4em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaXTwitter style={{fontSize:'1.4em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaInstagram style={{fontSize:'1.4em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
              <div className={classes.iconCont}><FaYoutube style={{fontSize:'1.4em',marginTop:'.45em', color:'var(--primary-color)', cursor:'pointer'}}/></div>
            </div>
          </div>
        <Details/>
        </div>
    </div>
  )
}

export default BookDetails
