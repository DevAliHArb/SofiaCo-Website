import React, { useContext, useEffect, useState } from "react";
import classes from "./ContactUs.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from "../../Data.json";
import { Button, Radio, Select , Form, Input } from 'antd';
import { IoMailOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookF, FaInstagram  } from "react-icons/fa";
import { FaXTwitter, FaYoutube  } from "react-icons/fa6";
import { IoIosAttach } from "react-icons/io";
import AuthContext from '../Common/authContext';
import TextField from "./Text Field/TextField";
import Services from "../Home Page/Services Section/Services";
import { toast } from "react-toastify";


const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [form] = Form.useForm();
  const authCtx = useContext(AuthContext);

  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
      console.log("heloooo",formData)
      
      
      try {
        const response = await axios.post(
          "https://api.leonardo-service.com/api/bookshop/contact-us",
          { ...formData, ecom_type: 'sofiaco' }
        );
        setFormData({});
        form.resetFields();
        console.log("Email sent:", response.data);
        // You can display a success message if needed
        toast.success('Email sent successfully', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0 ,
          theme: "colored",
          })
      } catch (error) {
        console.error("Error in sending email:", error.response.data.error.email[0]);
        // You can display an error message if needed
        toast.error(`Error in sending email:` && error.response.data.error.email[0], {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0 ,
          theme: "colored",
          });
      }
  };

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
  };
  function openNewWindow(url) {
    window.open(url, '_blank');
  }

  return (
    <div className={classes.contactUs}>
      <div className={classes.header}>
        <h1 className={classes.headerh1}>{data.ContactUsPage.title[language]}</h1>
        <h2 className={classes.headerh2}>{data.ContactUsPage.Subtitle[language]}</h2>
      </div>
        <div className={classes.cardsContainer}>
        <div className={classes.card} >
            <h2>{language === 'eng' ? "Drop us a message" : "Envoyez-nous un message" }</h2>
            <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                onFinish={handleSubmit}
                className={classes.form}
      >
        <div className={classes.inputCont}>
        <Form.Item
          name="first_name"
          rules={[{ required: true, message: `${language === 'eng' ? "Please enter your name!" : "S'il vous plaît entrez votre Prénom!"}` }]}
        >
        <TextField
          id="first_name"
          label="Name*"
          maxLength={50}
          placeholder={language === 'eng' ? "Your Name" : "Votre nom"}
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
        />
        </Form.Item>
        <Form.Item
          name="email"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Company</p>}
          rules={[
            {
              type: 'email',
              message: `${language === 'eng' ? "Please enter valid email!" : "L'entrée n'est pas valide Email !"}`,
            },
            {
              required: true,
              message: `${language === 'eng' ? "Please enter your email!" : "S'il vous plaît entrez votre Email!"}`,
            },
          ]}
        >
        <TextField
          id="email"
          label="Email Address*"
          maxLength={100}
          placeholder={language === 'eng' ? "Your Email Address" : "Votre adresse électronique" }
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        </Form.Item>
        </div>
        <div className={classes.inputCont}>
        <Form.Item
          name="telephone"
          rules={[
            {
              pattern: /^[0-9]{6,16}$/,
              message: `${language === 'eng' ? 'Please enter valid phone!' : "The input is not valid Téléphone!"}`,
            },
            {
              required: true,
              message: `${language === 'eng' ? "Please enter your phone!" : "S'il vous plaît entrez votre Téléphone!"}`,
            },
          ]}
        >
        <TextField
          id="telephone"
          label="Phone Number*"
          maxLength={20}
          placeholder={language === 'eng' ? "Your Phone Number" : "Votre numéro de téléphone" }
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} 
        />
        </Form.Item>
        <Form.Item
          name="company"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Téléphone</p>}
          rules={[
            {
              required: true,
              message: `${language === 'eng' ? "Please enter your company!" : "S'il vous plaît entrez votre Company!"}`,
            },
          ]}
        >
        <TextField
          id="company"
          label="Company*"
          placeholder={language === 'eng' ? "Your Company" : "Votre entreprise" }
          maxLength={50}
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
        </Form.Item>
        </div>
        <Form.Item
          name="message"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0'}}>Message</p>}
          rules={[{ required: true, message: `${language === 'eng' ? "Please enter your message!" : "S'il vous plaît entrez votre Votre Message!"}` }]}
        >
        <TextField
              id="message"
              label="Message"
              placeholder={language === 'eng' ? "Your Message" : "Votre message" }
              variant="standard"
              fullWidth
              multiline
              maxLength={250}
              rows={3}
              inputProps={{ style: { color: "var(--secondary-color)" } }} 
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              
            />
        </Form.Item>
          <div className={classes.buttonContainer}>
            <Form.Item  style={{width:'fit-content'}}>
            <Button 
           size="large"
           htmlType="submit"  
           className="login-form-button"
          style={{backgroundColor:'var(--primary-color)',color: 'white',padding:'0 5em',zIndex:"9"}}>
            Submit 
          </Button>
        </Form.Item> 
          </div>
      </Form>
        </div>
          <div className={classes.sotialsCard}>
            <h2>{language === 'eng' ? "Contact Details" : "Coordonnées De Contact" }</h2>
            <div style={{zIndex:'1',width:'100%',margin:'0 auto',display:'flex',flexDirection:"row",gap:'.5em'}}>
                <div style={{position:'relative',padding:'0.4em',color:'#fff',borderRadius:'50%',backgroundColor:'var(--primary-color)',width:'1em',height:'1em',fontSize:'1em',margin:'auto 0'}}><FaLocationDot style={{height:'1em',margin:'0'}}/></div>
                <div><p style={{fontFamily:'var(--font-family)',fontWeight:'400',color:'#fff',maxWidth:"15em",textAlign:'start'}}>{authCtx.companySettings.location}</p></div>
            </div>
          <div style={{zIndex:'1',width:'100%',margin:'0 auto',display:'flex',flexDirection:"row",gap:'.5em'}}>
                <div style={{position:'relative',padding:'0.4em',color:'#fff',borderRadius:'50%',backgroundColor:'var(--primary-color)',width:'1em',height:'1em',fontSize:'1em',margin:'auto 0'}}><IoMailOutline style={{height:'1em',margin:'0'}}/></div>
                <div><p style={{fontFamily:'var(--font-family)',fontWeight:'400',color:'#fff',maxWidth:"15em",textAlign:'start'}}>{authCtx.companySettings.email}</p></div>
            </div>
            <div style={{zIndex:'1',width:'100%',margin:'0 auto',display:'flex',flexDirection:"row",gap:'.5em'}}>
                <div style={{position:'relative',padding:'0.4em',color:'#fff',borderRadius:'50%',backgroundColor:'var(--primary-color)',width:'1em',height:'1em',fontSize:'1em',margin:'auto 0'}}><HiOutlinePhone style={{height:'1em',margin:'0'}}/></div>
                <div><p style={{fontFamily:'var(--font-family)',fontWeight:'400',color:'#fff',maxWidth:"15em",textAlign:'start'}}>{authCtx.companySettings.phone}</p></div>
            </div>
            <div className={classes.socials}>
                        <div className={classes.social_icon} onClick={()=>openNewWindow(authCtx.companySettings.twitter)} ><FaXTwitter className={classes.icon}/></div>
                        <div className={classes.social_icon} onClick={()=>openNewWindow(authCtx.companySettings.facebook)}><FaFacebookF className={classes.icon}/></div>
                        <div className={classes.social_icon} onClick={()=>openNewWindow(authCtx.companySettings.insta)}   ><FaInstagram className={classes.icon}/></div>
                        <div className={classes.social_icon} onClick={()=>openNewWindow(authCtx.companySettings.youtube)} ><FaYoutube className={classes.icon}/></div>
                    </div>
          </div>
                    <div className={classes.auth_bg1}></div>
      </div>
      <Services/>
    </div>
  );
};

export default ContactUs;

