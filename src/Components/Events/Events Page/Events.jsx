import React, { useEffect, useState } from "react";
import classes from "./Events.module.css";
// import collab_image from "../../../assets/collab-head.png";
import { FaCalendarAlt } from "react-icons/fa";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { MdLocationOn } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedEvent } from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from "../../../Data.json";

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
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);


  const [eventData, seteventData] = useState([]);
  const fetchAbout = async () => {
    try {
      const response = await axios.get('https://api.leonardo-service.com/api/bookshop/events?ecom_type=albouraq');
      console.log('Response data:', response.data);
      seteventData(response.data.data || {})
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
useEffect(() => {
  fetchAbout();
}, []);

  return (
    <div className={classes.events}>
      <div className={classes.header}>
        <h1 className={classes.headerh1}>{data.Event.title[language]}</h1>
        <h2 className={classes.headerh2}>{data.Event.Subtitle[language]}</h2>
      </div>
      <div className={classes.content}>
        {eventData?.map((props) => {
          return (
            <div key={props.id}  onClick={(event) => {
              event.stopPropagation();
              dispatch(addSelectedEvent(props));
              navigate(`/events/${props.id}/event-details`);
            }}
           className={classes.card_container}>
              <div className={classes.card_img}>
                <div className={classes.icon_con}>
                  <p className={classes.icon}>${props.price}</p>
                </div>
                {props.event_images?.map((props) => (
                    <>
                      {props.is_main_image === 'true' && <img alt='' className={classes.card_imgimg} src={`https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${props.image}`} style={{height:'100%', width:'100%'}}/>}
                    </>
                  ))}
                <div className={classes.card_text}>
                  <div className={classes.card_text_head}>
                  <p><FaCalendarAlt className={classes.iconss}/> {formatDate(props.date)}</p>
                  <p><CiClock2 className={classes.iconss}/> {formatTime(props.start_time)} - {formatTime(props.end_time)}</p>
                  <p><MdLocationOn className={classes.iconss}/> {props.location}</p>
                  </div>
                  <div className={classes.hover}>
                    <div className={classes.hovered_title}>
                      <h2>{language == 'eng' ? props.name_eng : props.name_fr}</h2>
                    <p className={classes.user}><CiUser /> {props.event_host?.map((props, index)=>{return(<>{index != 0 && ' / '}{props.name}</>)})}</p>
                    </div>
                      <p className={classes.p}>{props.description_eng?.substring(0, 60)}{props.description_eng?.length > 60 && "..."}</p>
                      <button className={classes.btn}>Lire Plus</button>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;

