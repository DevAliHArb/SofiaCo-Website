
import React, { useContext, useEffect, useState } from 'react'
import classes from './HistoryCard.module.css'
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Navigation } from 'swiper/modules';
import EmptyContainer from '../../../Common/Empty Container/EmptyContainer';
import AuthContext from '../../../Common/authContext';

const HistoryCard = ({data}) => {
  const [filtereddata, setFiltereddata] = useState([])
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  
  const styles = {
    style1: {
      position: "absolute",
      right: "-2%",
      width: "fit-content",
      color: "black",
      zIndex: 11,
    },
    style2: {
      position: "absolute",
      left: "-2%",
      width: "fit-content",
      color: "black",
      zIndex: 11,
    },
  };

  useEffect(()=>{
    setFiltereddata(data)
    setImages(data.items)
    if(data.status === 'unpaid'){
      setTitle('Non payées')
    }else if(data.status === 'pending'){
      setTitle('En cours')
    }else if(data.status === 'shipped'){
      setTitle('Expédiée')
    }else if(data.status === 'arrived'){
      setTitle('Livrées')
    }
  },[data])
    const sign = '>';
    // console.log(filtereddata)

    const Reviewhandle = () => {
      authCtx.setReviewData(images);
      navigate(`/review`)
    }

    const Returnhandle = () => {
      authCtx.setReturnData(images);
      authCtx.seteditReturnData({
        orderData:{},
        received: null,
        returnOrder: null ,
        price: '' ,
        reason: '' ,
        quantity: 0 ,
        description: '',
        name: '' ,
        email: '' ,
        phone: '',
        images: [],
        videos: [],} )
      navigate(`/add_refund_return`)
    }

  return (
    <div className={classes.orderCard}>
        <div className={classes.header}>
            <div className={classes.leftHeader}>
                <p style={{fontWeight:700, fontSize:'calc(0.7rem + 0.4vw)'}}>{title}</p>
                <p style={{fontWeight:700, fontSize:'calc(1rem + 0.2vw)'}}>Reçu : Le 20 Nov. 2023  </p>
            </div>
            <div className={classes.btn_con}>
                <button>CONSULTER LES DÉTAILS DE LA COMMANDE {sign}</button>
            </div>
        </div>
        <div className={classes.content}>
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
            slidesPerView: 4,
          },
        }}
          >
          {images.map((props) => (
                 <SwiperSlide >
                   <img src={props.image} alt={`Item ${props.id}`}/>
                 </SwiperSlide>
               ))}
          </Swiper>
          <div className="swiper-button-prev" style={styles.style2}></div>
          <div className="swiper-button-next" style={styles.style1}></div>
    </div>
            <div className={classes.optionbtns_con}>
            {data.status === 'arrived' && <button>Confirmez la réception</button>}
            {data.status === 'unpaid' && <button>Réglez la commande</button>}
            {data.status === 'unpaid' && <button>Annulez la commande</button>}
            {(data.status === 'arrived') && <button onClick={Reviewhandle}>Donner un avis</button>}
            {data.status === 'arrived'  && <button onClick={Returnhandle}>Retourner/Rembourser</button>}
            {(data.status === 'history') && <button>Recommander à un ami</button>}
            {(data.status === 'pending' || data.status === 'shipped') && <button>Suivre</button>}
            {(data.status === 'pending' || data.status === 'shipped' || data.status === 'arrived' || data.status === 'history') && <button>Acheter à nouveau</button>}
            </div>
        </div>
        <div className={classes.discriptions}>
            <p>{images.length} Articles : <span style={{fontWeight:600}}>250,16€</span><br className={classes.breakLine}/> ate de la commande :<span style={{fontWeight:600}}> 8 Nov. 2023</span><br className={classes.breakLine}/> uméro de commande : <span style={{fontWeight:600}}>CA- xxx-0xxxxxxxx xxxxxxxx</span></p>
        </div>
    </div>
  )
}

export default HistoryCard
