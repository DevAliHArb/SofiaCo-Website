import React, { useContext, useEffect, useState } from "react";
import classes from "./EventsDetails.module.css";
// import collab_image from "../../../assets/collab-head.png";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Form, Input } from "antd";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt } from "react-icons/fa";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { MdLocationOn } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { addSelectedEvent } from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import Services from "../../Home Page/Services Section/Services";
import EventImg from "../../../assets/EventImg.png";
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

const calculateDuration = (startDate, endDate) => {
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  // Calculate the difference in milliseconds between the two dates
  const durationInMilliseconds = endDateTime - startDateTime;
  // Convert milliseconds to hours and minutes
  const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
};

const EventsDetails = () => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [latestEvents, setlatestEvents] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchAbout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/events?ecom_type=sofiaco`);
      // console.log('Response data:', response.data);
      setlatestEvents(response.data.data || {})
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    }
  };
useEffect(() => {
  fetchAbout();
}, []);
  const eventitem = useSelector((state) => state.products.selectedEvent);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const authCtx = useContext(AuthContext);
  const user = useSelector((state) => state.products.userInfo);
  const [eventData, seteventData] = useState({});
  const [eventReview, seteventReview] = useState([]);
  const [form] = Form.useForm();
  const [showMoreReviews, setShowMoreReviews] = useState(2);

  const [formData, setFormData] = useState({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [eventEnded, setEventEnded] = useState(false);
// console.log(eventEnded)
  useEffect(() => {
    const currentDate = new Date();
    const eventDate = eventitem[0].date;

    // console.log(currentDate)
    // console.log(eventDate)
    // Check if the event date is in the past
    const hasEventEnded = currentDate > eventDate;
    if (hasEventEnded) {
    setEventEnded(true);
    }
  }, [eventitem.date]);
  const withFirstLetters = latestEvents?.map((person) => {
    const firstLetter = person.name_eng[0];
    return { ...person, firstLetter };
  });
  
  const filteredEvents = withFirstLetters?.filter((event) => {
    if (language === 'eng') {
      return (
        searchQuery === "" ||
        event.name_eng.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (language === 'fr') {
      return (
        searchQuery === "" ||
        event.name_fr.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  const handleSubmit = async () => {
    if (user) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_TESTING_API}/events/${eventData.id}/replies`,
          { ...formData, user_id: user.id }
        );
        // console.log("Event replied successfully:", response.data);
        toast.success(language === "eng" ? "Event replied successfully." : "Réponse à l'événement réussie.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });

        // Update eventData.event_replies with the new reply
        seteventData(prevEventData => ({
          ...prevEventData,
          event_replies: [...prevEventData.event_replies, {reply:response.data.data.reply ,created_at:response.data.data.reply,user:{first_name:user.first_name,last_name:user.last_name} }],
        }));

        form.resetFields();
        setFormData({ reply: "" });
      } catch (error) {
        // console.error("Error replying event:", error);
        toast.error(language === "eng" ? "Error replying to event." : "Erreur lors de la réponse à l'événement.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
      }
    } else {
      toast.error(language === "eng" ? "Please login to leave a reply." : "Veuillez vous connecter pour laisser une réponse.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    eventitem.forEach((element) => {
      seteventData(element);
      seteventReview(element.eventreview);
    });
  }, [eventitem]);

  const handleShowMore = () => {
    setShowMoreReviews(showMoreReviews + 2); // Increase the number of displayed reviews
  };
  const mainEventImg = eventData.event_images?.filter( (event) => event?.is_main_image === 'true') || [];
  const eventImg = eventData.event_images?.filter( (event) => event?.is_main_image !== 'true');
  return (
    <div className={classes.events_detail}>
      <div className={classes.events_detail_image_con} style={{flexDirection:"column-reverse"}}>
        <div className={classes.contentContainer} onClick={()=>console.log(eventData)}>
          <h1>{language == 'eng' ? eventData.name_eng : eventData.name_fr}</h1>
          <h3>{eventData.event_host?.map((data ,index)=>{
                    return(
                           <>{data.name} {(index + 1) === eventData.event_host?.length ? '' : "/"}</>
                    )
                  })}</h3>
        <div className={classes.details_box}>
          <div className={classes.detail_item}>
            <p><CiClock2 className={classes.iconss}/>{formatTime(eventData.start_time)} - {formatTime(eventData.end_time)}</p>
          </div>
          <div className={classes.detail_item}>
            <p><MdLocationOn className={classes.iconss}/>{eventData.location}</p>
          </div>
          <div className={classes.detail_item}>
            <p><FaCalendarAlt className={classes.iconss}/>{formatDate(eventData.date)}</p>
          </div>
        </div>
          <div className={classes.priceBtn}>
            <p>{currency === "eur" ? `€ ${Number(eventData?.price).toFixed(0)} ` : `$ ${(eventData?.price * authCtx.currencyRate).toFixed(0)} `}</p>
          </div>
        </div>
        <img
          src={`${(mainEventImg?.length !== 0 && mainEventImg[0].image) || EventImg }`}
          alt="registerImage"
          style={{ height: "100%" }}
          className={classes.events_detail_image}
        />
      </div>
      <div className={classes.events_detail_image_con} style={{flexDirection:"column"}}>
        <div className={classes.imagesCont}>
        <img
          src={eventImg?.length >0 && `${eventImg[0]?.image}` || EventImg}
          alt="registerImage"
          style={{ height: "100%" }}
          className={classes.card_imgimg}
        />
        <img
          src={eventImg?.length >0 && `${eventImg[1]?.image}` || EventImg}
          alt="registerImage"
          style={{ height: "100%" }}
          className={classes.card_imgimg}
        />
        <img
          src={eventImg?.length >0 && `${eventImg[2]?.image}` || EventImg}
          alt="registerImage"
          style={{ height: "100%" }}
          className={classes.card_imgimg}
        />
        </div>
        <div className={classes.contentss}>
          <h2>{language == 'eng' ? eventData.name_eng : eventData.name_fr}</h2>
          <p>{language == 'eng' ? eventData.description_eng : eventData.description_fr}</p>
          <div className={classes.contactBtn} onClick={()=>navigate(`/contact`)}>
          {language === 'eng' ? "CONTACT US" : "CONTACTEZ-NOUS" }
          </div>
        </div>
      </div>
          <div className={classes.map_con}>
            <iframe
              title="Google Map"
              src={eventData.location_url}
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                borderRadius: "1em",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <Services/>


      {/* <div className={classes.content}>
        <div className={classes.details_section}>
          <div className={classes.title_con}>
            <h1>{language == 'eng' ? eventData.name_eng : eventData.name_fr}</h1>
            {eventEnded && <div className={classes.ended}>
              <p>ENDED</p>
            </div>}
          </div>
          <div className={classes.img_con}>
            <img src={eventData.event_images && `https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${eventData.event_images[0].image}`} style={{height:'100%', width:'100%'}} alt="Event Image" />
          </div>
          <div className={classes.points}>
            <h3>This event includes</h3>
            <div className={classes.points_list}>
          {eventData.event_feature?.map((data)=>{
                    return(
                      <p>
                        <img style={{width:"1.2em",height:'1.2em'}} src={data.icon ? `https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${data.icon}` : 'screen' } alt="" /> {language == 'eng' ? data.title_eng : data.title_fr}
                      </p>
                    )
                  })}
              {/* <p>
                <img src={like} alt="" /> Direct interaction with the instructor
              </p>
              <p>
                <img src={screen} alt="" />
                Access on mobile and web
              </p>
              <p>
                <img src={camera} alt="" />
                Session recording after the workshop
              </p>
              <p>
                <img src={timer} alt="" />1 hour live session
              </p>
            </div>
          </div>
          <div className={classes.about}>
            <h3>About the workshop</h3>
            <p></p>
          
          </div>
          <div className={classes.socials}>
            <h3>Follow Us</h3>
            {eventData.facebook && <FaFacebookF className={classes.social_icon} onClick={()=>window.open(eventData.facebook,'_blank')}/>}
            {eventData.twitter && <FaXTwitter className={classes.social_icon} onClick={()=>window.open(eventData.twitter,'_blank')}/>}
            {eventData.pdf && <FaLinkedinIn className={classes.social_icon} onClick={()=>window.open(eventData.pdf,'_blank')}/>}
            {eventData.instagram && <FaInstagram className={classes.social_icon} onClick={()=>window.open(eventData.instagram,'_blank')}/>}
          </div>
          {user && <div className={classes.form}>
            <h3>Leave a Reply</h3>
            <Form
              layout="vertical"
              name="nest-messages"
              form={form}
              onFinish={handleSubmit}
              className={classes.form_input}
            >
                 <Form.Item
          name="reply"
          rules={[{ required: true, message: "S'il vous plaît entrez votre Votre Message!" }]}
        >
          <Input.TextArea
          name="reply"
            type="textarea"
            rows={8}
            placeholder="Hello I am Intrested in.."
            style={{border:'none',backgroundColor:"#DED8CC" ,width:'100%',color:'var(--accent-color)',borderRadius:'1em', padding:'1.5em'}}
             onChange={handleChange}
          />
        </Form.Item>
        <Button
           size="large"
           htmlType="submit"  
           className="login-form-button"
          style={{backgroundColor:'var(--forth-color)',color: 'var(--secondary-color)',padding:'0 3em'}}>
            Submit 
          </Button>
            </Form>
          </div>}
          <div className={classes.reviews}>
        {eventData.event_replies?.slice(0, showMoreReviews).map((props) => {
          return (
            <div className={classes.review_card} key={props.id}>
              <h3>{props.user?.first_name} {props.user?.last_name}</h3>
              <p>"{props?.reply}"</p>
              <p>Posted on {formatDate(props.created_at)}</p>
            </div>
          );
        })}
        {showMoreReviews < eventData.event_replies?.length && (// Check if there are more reviews to display
          <Button onClick={handleShowMore} className={classes.btn} >
            Show More
          </Button>
        )}
      </div>
        </div>
        <div className={classes.events_list}>
          <div className={classes.custom_select_mob}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              className={classes.input}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width:'100%',
                borderRadius: ".1em",
                padding: "0em 0em 0 1.5em",
                background: "var(--secondary-color)",
                margin: "auto 0",
                color:'var(--forth-color-)'
              }}
            />
            <button
              className={classes.btn1}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <SearchIcon style={{color:'var(--forth-color)', width:'2em', height:'1em'}}/>
            </button>
          </div>
          <div className={classes.listt}>
            <h3>Latest Events</h3>
            {filteredEvents?.slice(0,3).map((props, index)=>{
                return(
                    <div key={index} className={classes.small_event_card} onClick={() => {
                      dispatch(addSelectedEvent(props));
                      navigate(`/events/${props.id}/event-details`);
                    }}>
                      <img src={eventData.event_images && `https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${eventData.event_images[0].image}`} style={{height:'100%',width:'90%',objectFit:'cover',margin:'auto',borderRadius:'.5em'}} alt="" />
                      <div style={{width:'100%',display:'flex',flexDirection:'column'}}>
                        <h3>{language == 'eng' ? props.name_eng : props.name_fr}</h3>
                        <h5>{language == 'eng' ? props.description_eng.slice(0,25) : props.description_fr.slice(0,25)}...</h5>
                        <div style={{display:'flex',flex:"row",justifyContent:"space-between",width:'95%',margin:'auto'}}>
                        <p style={{textAlign:'start',fontWeight:'500'}}>{formatDate(props.date)}</p>
                        <p style={{textAlign:'end',fontWeight:'600'}}>{props.price}$</p>
                        </div>
                      </div>
                    </div>
                )
            })}
          </div>
          {eventData.event_host?.map((data)=>{
                    return(
                      <div className={classes.owner_card}>
                          <div className={classes.owner_info}>
                              <img alt="" src={data.image ? `https://sofiadis.recette-lisa.leonardo-service.com/modules/sofiadis/files/${data.image}` : '' }/>
                              <div className={classes.name}>
                                  <h3>{data.name}</h3>
                                  <p>{data.email}</p>
                              </div>
                          </div>
                              <div className={classes.owner_details}>
                                  <p>{language == 'eng' ? data.description_eng : data.description_fr}</p>
                              </div>
                    </div>
                    )
                  })}
        </div>
      </div> */}
    </div>
  );
};

export default EventsDetails;
