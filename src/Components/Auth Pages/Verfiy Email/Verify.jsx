import React, { useContext, useEffect, useState } from 'react'
import classes from './Verify.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AuthContext from '../../Common/authContext'

const Verify = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [language, setLanguage] = React.useState('eng');
  const [loading, setLoading] = useState(false);


  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div className={classes.back} onClick={()=>navigate(`/login`)}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>Back</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Verify your Email Address!' : 'Vérifiez votre adresse e-mail!'}</h1>
      {language === 'eng' ? <h4>Kindly check your email to get verified!</h4> : <h4>Veuillez vérifier votre email pour être vérifié !</h4>}
      <div className={classes.btn_ok}><button onClick={()=>navigate(`/login`)} className={classes.logInButton}>Ok</button></div>
      
      <p>{authCtx.companySettings?.copyrights_en}</p>
        </div>
    </div>
  )
}

export default Verify