import React, { useEffect, useRef, useState } from 'react'
import classes from './FollowOrder.module.css'
import laposte from '../../../assets/laposte_logo.png'
import imagee from '../../../assets/lapostebarimage.png'
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepContent, Typography } from '@mui/material';
import { orders } from '../../constants/data';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Navigation } from 'swiper/modules';

const steps = [
    {
        label:'Commande envoyée ',
        description1:'Commande expédiée',
        description2:'11 novembre 2023, 11:36',
    },
    {
        label:'Order processed by shipper',
        description1:'11 novembre 2023, 10:47',
        description2:'',
    },
    {
        label:'Colis emballé',
        description1:'11 novembre 2023, 10:47',
        description2:'',
    },
    {
        label:'Commande affectée',
        description1:'11 novembre 2023, 06:14',
        description2:'',
    },
    {
        label:'Commande payée avec succès',
        description1:'10 novembre 2023, 00:42',
        description2:'',
    },
    {
        label:'Commande enregistrée',
        description1:'10 novembre 2023, 00:42',
        description2:'',
    },
    
  ];

  const styles = {
    style1: {
      position: "absolute",
      right: "-5%",
      width: "fit-content",
      color: "black",
      zIndex: 11,
    },
    style2: {
      position: "absolute",
      left: "-5%",
      width: "fit-content",
      color: "black",
      zIndex: 11,
    },
  };
const FollowOrder = () => {
    const { orderId } = useParams();
    const h1Ref = useRef(null);
    const copyTextToClipboard = () => {
        // Access the text content of the h1 element using the ref
        const textToCopy = h1Ref.current.innerText;
    
        // Create a temporary textarea element to hold the text
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
    
        // Append the textarea to the document
        document.body.appendChild(tempTextArea);
    
        // Select the text in the textarea
        tempTextArea.select();
    
        // Execute the copy command
        document.execCommand('copy');
    
        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);
    
        // Optionally, provide feedback to the user
        toast.success(`id copied to clipboard!`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0 ,
            theme: "colored",
            })
      };
    let sign = '>';

    const [order, setOrder] = useState({})
    useEffect(() => {

      orders.forEach((item) => {
          if (item.id == orderId) {
              setOrder(item);
          }
        })

    }, [orderId]);

  return (
    <div className={classes.followorder}>
    <div className={classes.header}>
  <div className={classes.headtitle}>SUIVI DE COMMANDES</div>
  <div className={classes.border} />
  </div>
  <div className={classes.content}>
    <div className={classes.followorderbarCard}>
      <div className={classes.laPosteMob}>
        <img src={laposte} alt='laposte' style={{width:'70%',margin:'auto'}}/>
        <p style={{textDecoration:'underline', marginTop:'2em', cursor:'pointer'}}>Voir les détails sur La Poste<ArrowForwardIosIcon style={{fontSize:'medium'}}/></p>
      </div>
     <div className={classes.followorderbar}>
        <img src={laposte} alt='laposte' className={classes.laPoste}/>
        <div className={classes.followorderbar_info}>
            <h1 style={{fontSize:'calc(1rem + 0.6vw)',fontWeight:700}}>Numéro de suivi :</h1>
            <h3 style={{fontSize:'calc(1rem + 0.6vw)'}}><h1 ref={h1Ref} style={{fontSize:'calc(1rem + 0.6vw)',fontWeight:500}}>XAXXXXXXXXXXXXXXXX</h1> <span style={{display:'flex', flexDirection:'row',cursor:'pointer'}} onClick={copyTextToClipboard}><h1 style={{fontWeight:700,marginLeft:'0.5em'}}>Copier</h1> <FaCopy style={{margin:'auto 0.2em',fontSize:'larger'}}/></span></h3>
            <p className={classes.detailss}>Voir les détails sur La Poste<ArrowForwardIosIcon style={{fontSize:'medium'}}/></p>
        </div>
        <img src={imagee} alt='laposte' style={{margin:'auto'}}/>
    </div> 
    </div>
    
    <div className={classes.progress_con}>
    <div className={classes.progressheader}>
            <div style={{display:'flex', flexDirection:'row', columnGap:'1em', margin:'auto 0', paddingLeft:'2em'}}>
                <p style={{ fontSize:'calc(0.8rem + 0.4vw)',fontWeight:'500'}}><span style={{fontWeight:900}}>COMMANDE N° :</span> <br className={classes.breakpoint}/>#PO-069-XXX XXXXXXXXXXXXXX</p>
            </div>
            <div className={classes.btn_con}>
                <button>CONSULTER LES DÉTAILS DE LA COMMANDE{sign}</button>
            </div>
        </div>
        <div className={classes.estimation}>
        <div className={classes.swiper}>
          <Swiper
            spaceBetween={20}
            effect={"fade"}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
        modules={[ Navigation]}
            style={{
              padding: '3% 0 0% 0',
            }}
          breakpoints={{
            0: {
              slidesPerView: 3,
              },
            651: {
              slidesPerView: 3,
            },
          951: {
            slidesPerView: 3,
          },
        }}
          >
          {order.items?.map((props) => (
                 <SwiperSlide >
                   <img src={props.image} alt={`Item ${props.id}`}/>
                 </SwiperSlide>
               ))}
          </Swiper>
          <div className="swiper-button-prev" style={styles.style2}></div>
          <div className="swiper-button-next" style={styles.style1}></div>
    </div>
        <div className={classes.custom_div}>
      <div className={classes.cutout}>Livraison</div>
      <div className={classes.titleee}>
        <h1 style={{fontSize:'calc(1rem + 0.2vw)',color:'#3B84B0', textAlign:'start',fontStyle:'italic',fontWeight:'700'}}> <span style={{fontSize:'xx-large'}}>17</span> nov.2023 -<span style={{fontSize:'xx-large'}}> 27</span> nov.2023</h1>
        <p style={{fontSize:'calc(0.7rem + 0.4vw)',color:'#999999', margin:'1em auto 1em auto'}}>Estmation de la date de livraison</p>
        </div>
              {/* Add other content or components inside the div as needed */}
        </div>
        </div>
        <div className={classes.tracking}>
            <h3 style={{fontSize:'calc(0.7rem + 0.4vw)',textAlign:'start', padding:'2em 1em 2em 0'}}>Les heures sont affichées dans le fuseau horaire local.</h3>
            <div>
            {steps.map((step, index) => {
            return (
              <div key={index} className={classes.orderStep}  style={index == steps?.length-1 ? {borderLeft:'1px solid transparent'} : {borderLeft:'1px solid #C9C9C9'}}>
                <div className={classes.stepdot} style={index == 0 ? {backgroundColor:'#3B84B0'} : {backgroundColor:'#E5E5E5'}}/>
                <h1 style={index == 0 ? {color:'#3B84B0',fontSize:'calc(1rem + 0.3vw)',lineHeight:'100%',fontWeight:'700'} : {color:'#999999',fontSize:'calc(1rem + 0.2vw)',lineHeight:'100%'}}>{step.label}</h1>
                  <p style={{textAlign:'start', color:'#999999'}}>{step.description1}</p>
                  {step.description2 !== '' && <p style={{textAlign:'start', color:'#999999'}}>{step.description2}</p>}
              </div>
            )})}
            </div>
        </div>
    </div>
  </div> 
    </div>
  )
}

export default FollowOrder