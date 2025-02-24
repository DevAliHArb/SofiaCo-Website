import React, { useContext, useEffect, useState } from "react";
import classes from "./NewsLetterSection.module.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { IoMailOutline } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import AuthContext from "../../Common/authContext";
import NewsletterBg from "../../../assets/NewsletterBg.png";
import NewsletterBgMob from "../../../assets/NewsletterBgMob.png";
import { toast } from "react-toastify";



const NewsLetterSection = () => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
const authCtx = useContext(AuthContext);
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [form] = Form.useForm(); 
  
function openNewWindow(url) {
  window.open(url, '_blank');
}
const addToNewsletter = async (email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_TESTING_API}/newsletter`,
      { email, ecom_type: 'sofiaco' }
    );
    setEmail('')
    console.log("Email added to newsletter:", response.data);
    // You can display a success message if needed
    toast.success(`${language === 'eng' ? "Successful subscriber" : 'Abonné avec succès'}`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0 ,
      theme: "colored",
      })
      form.resetFields()
  } catch (error) {
    console.error("Error adding email to newsletter:", error.response.data.error.email[0]);
    // You can display an error message if needed
    toast.error(error.response.data.error.email[0] && `${language === 'eng' ? "The email has already been subscribed." : "L'email a déjà été souscrit."}`, {
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
  setEmail(e.target.value);
};

const handleSubmit = () => {
  // Validate email here if needed
  if (!validateEmail(email)) {
    toast.error(`${language === 'eng' ? "Please enter a valid email address." : "Veuillez entrer une adresse email valide."}`);
    return;
  }

  addToNewsletter(email);
};

const validateEmail = (email) => {
  // Email validation regex pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
  return (
      <div className={classes.content}>
        <img src={NewsletterBg} style={{position:'absolute',top:"0",left:'0',width:"100%",height:'100%'}} alt="" className={classes.newsletterBg}/>
        <img src={NewsletterBgMob} style={{position:'absolute',top:"0",left:'0',width:"100%",height:'100%'}} alt="" className={classes.newsletterBgMob}/>
        <div className={classes.data}>
                  <h2>{language === 'eng' ? "Subscribe to our Newsletter!" : "Abonnez-vous à notre Newsletter !"}</h2>
                  <p>{language === 'eng' ? "Get the latest updates, special offers, and insider tips delivered straight to your inbox. Subscribe now and stay connected with all the good stuff!" : "Recevez les dernières mises à jour, les offres spéciales et les conseils d'initiés directement dans votre boîte de réception. Abonnez-vous dès maintenant et restez au courant de tout ce qui se passe !"}</p>
                <Form
                form={form}
                style={{width:'95%',display:"flex",flexDirection:'column',maxWidth:"30em",margin:'0'}}
                >
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "Veuillez entrer un email valide!",
                          required: true,
                        },
                        {
                          required: true,
                          message: "L'email est requis!",
                        },
                      ]}
                      style={{ width: '100%' }}
                    >
                      <Input
                        className={classes.input}
                        placeholder={language === 'eng' ? "Enter your email address" : "Saisissez votre adresse électronique"}
                        value={email}
                        onChange={handleChange}
                      />
                    </Form.Item>
                    <button
                    htmlType="submit"
                    className={classes.button_btn}
                    onClick={handleSubmit}
                    >
                    {language === 'eng' ? "Register" : "Je M’inscris" }
                    </button>
                </Form>
        </div>
      </div>
  );
};

export default NewsLetterSection;
