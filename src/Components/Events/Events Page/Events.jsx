import React, { useContext, useEffect, useState } from "react";
import classes from "./Events.module.css";
import EventImg from "../../../assets/EventImg.png";
import { FaCalendarAlt } from "react-icons/fa";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedEvent } from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import nodata from '../../../assets/noevents.png'
import axios from "axios";
import data from "../../../Data.json";
import AuthContext from "../../Common/authContext";

const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedTime = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  return `${formattedTime}`;
};

const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toDateString();
  return `${formattedDate}`;
};

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);


  const [eventData, seteventData] = useState([]);
  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/events?ecom_type=sofiaco`);
      // console.log('Response data:', response.data);
      seteventData(response.data.data || [])
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    }
  };
// useEffect(() => {
//   fetchAbout();
// }, []);

  return (
    <div className={classes.events}>
      <div className={classes.header}>
        <h1 className={classes.headerh1}>{data.Event.title[language]}</h1>
        {/* <h2 className={classes.headerh2}>{data.Event.Subtitle[language]}</h2> */}
      </div>
      
                {eventData.length === 0 ?  
                <div className={classes.nodata}>
                  <div className={classes.nodata_img}>
                    <img src={nodata} alt="" />
                  </div>
                  {language === 'eng' ? (
        <h1>No Events <br /> were found!</h1>
      ) : (
        <h1>Aucun Evénements <br /> n'a été trouvé !</h1>
      )}
                </div> :
      <div className={classes.content}>
       {eventData?.map((props) => {
        const eventImg = props.event_images?.filter( (event) => event?.is_main_image === 'true')
          return (
            <div key={props.id}  onClick={(event) => {
              event.stopPropagation();
              dispatch(addSelectedEvent(props));
              navigate(`/main/events/${props.id}/event-details`);
            }}
           className={classes.card_container}>
              <div className={classes.card_img}>
                <div className={classes.card_imgimg}>
                  <img alt='' src={`${(eventImg?.length === 0 ? props.event_images[0]?.image : eventImg[0]?.image)||EventImg }`}/>
                <div className={classes.icon_con}>
                  <p className={classes.icon} onClick={()=>console.log(eventImg)}>{currency === "eur" ? `€ ${Number(props.price).toFixed(0)} ` : `$ ${(props.price * authCtx.currencyRate).toFixed(0)} `}</p>
                </div>
                </div>
                <div className={classes.card_text}>
                    <div className={classes.hovered_title}>
                      <h2>{language == 'eng' ? props.name_eng : props?.name_fr}</h2>
                    {/* <p className={classes.user}><CiUser /> {props.event_host?.map((props, index)=>{return(<>{index != 0 && ' / '}{props.name}</>)})}</p> */}
                    </div>
                      <p className={classes.p}>{props.description_eng?.substring(0, 60)}{props.description_eng?.length > 60 && "..."}</p>
                  <div className={classes.card_text_head}>
                  <p><FaCalendarAlt className={classes.iconss}/> {formatDate(props.date)}</p>
                  <p><FaRegClock className={classes.iconss}/> {formatTime(props.start_time)} - {formatTime(props.end_time)}</p>
                  <p style={{height:'2.5em'}}><MdLocationOn className={classes.iconss}/> {props.location}</p>
                  </div>
                      <button className={classes.btn}>{language === 'eng' ? "Read more" : "Lire Plus" }</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
}
    </div>
  );
};

export default Events;

