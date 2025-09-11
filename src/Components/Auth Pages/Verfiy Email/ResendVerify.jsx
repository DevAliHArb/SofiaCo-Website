import React, { useContext, useEffect, useState } from 'react'
import classes from './Verify.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AuthContext from '../../Common/authContext'
import { toast } from 'react-toastify';

const ResendVerify = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [loading, setLoading] = useState(false);
const handleResend = async () => {
    const email = localStorage.getItem('unverifiedEmail');
    
    try {
      setLoading(true); // Start loading state

      const updatedFormData = { email: email, type: `sofiaco` };
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/email/verification-notification`, updatedFormData);
      // Check if the response indicates success (assuming based on HTTP status code, adjust if needed)
      toast.info(`${language === 'eng' ? "E-mail resent" : "E-mail renvoyé"}`,{hideProgressBar:true})
    } catch (error) {
      // console.error('Error resending verification email:', error);
      toast.error(error.response.data.error, { hideProgressBar: true });
    } finally {
      setLoading(false); // Always stop loading state, regardless of success or failure
    }
  };

  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div className={classes.back} onClick={()=>navigate(`/login`)}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>{language === 'eng' ? "Back" : "Retour"}</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Verify your Email Address!' : 'Vérifiez votre adresse e-mail!'}</h1>
       <h4>{language === 'eng' ? "Please click on “Send email,” then check your inbox and click on the link to activate your account." : "Veuillez cliquer sur « Envoyer l'e-mail », puis vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte."}</h4> 
      <div className={classes.btn_ok}><button onClick={handleResend} className={classes.logInButton}>{language === "eng" ? "Send Email" : "Envoyer l'e-mail"}</button></div>

      <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr }</p>
        </div>
    </div>
  )
}

export default ResendVerify