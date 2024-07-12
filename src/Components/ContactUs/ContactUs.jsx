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


const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [form] = Form.useForm();
  const authCtx = useContext(AuthContext);

  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
      console.log("heloooo",formData)
      
      // emailjs.send("service_f604aoj", "template_9c5qcbt", formData , "5Igpq1cdiXnfbX80E")
      //   .then(
      //     (result) => {
      //       console.log(result.text);
      //       setFormData({ fname: '', lname: '', email: '', phone: '', message: ''});
      //       form.resetFields();
      //     },)
      //     .catch((error) => {
      //       console.log(error.text);
      //     }
      //   );
      form.resetFields();
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
            <h2>Drop us a message</h2>
            <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                onFinish={handleSubmit}
                className={classes.form}
      >
        <div className={classes.inputCont}>
        <Form.Item
          name="name"
          // label={<p style={{color:'var(--secondary-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Nom</p>}
          rules={[{ required: true, message: "S'il vous plaît entrez votre Prénom!" }]}
        >
        <TextField
          id="name"
          label="Name*"
          placeholder="Your Name"
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
        />
        </Form.Item>
        <Form.Item
          name="company"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Company</p>}
          rules={[
            {
              type: 'email',
              message: "L'entrée n'est pas valide Email !",
            },
            {
              required: true,
              message: "S'il vous plaît entrez votre Company!",
            },
          ]}
        >
        <TextField
          id="email"
          label="Email Address*"
          placeholder="Your Email Address"
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        </Form.Item>
        </div>
        <div className={classes.inputCont}>
        <Form.Item
          name="email"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Email</p>}
          rules={[
            {
              pattern: /^[0-9]{6,16}$/,
              message: 'The input is not valid Téléphone!',
            },
            {
              required: true,
              message: "S'il vous plaît entrez votre E-mail!",
            },
          ]}
        >
        <TextField
          id="phone"
          label="Phone Number*"
          placeholder="Your Phone Number"
          variant="standard"
          rows={1}
          inputProps={{ style: { color: "var(--secondary-color)" } }}  
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
        />
        </Form.Item>
        <Form.Item
          name="phone"
          // label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family)',margin:'0 '}}>Téléphone</p>}
          rules={[
            {
              required: true,
              message: "S'il vous plaît entrez votre Téléphone!",
            },
          ]}
        >
        <TextField
          id="company"
          label="Company*"
          placeholder="Your Company"
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
          rules={[{ required: true, message: "S'il vous plaît entrez votre Votre Message!" }]}
        >
        <TextField
              id="message"
              label="Message"
              placeholder="Your Message"
              variant="standard"
              fullWidth
              multiline
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
            <h2>Contact Details</h2>
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

