import React, { useContext, useState } from "react";
import classes from "./NewPassword.module.css"
import logo from '../../../assets/navbar/logo.svg'
import { FormControl, MenuItem, Select } from "@mui/material";
import { Button, Checkbox, Form, Input } from 'antd';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleLogin from '@leecheuk/react-google-login';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import { addUser } from "../redux/productSlice";
import { ToastContainer, toast } from "react-toastify" ;
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from "react-icons/io";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { changeLanguage } from "../../Common/redux/productSlice";
import { MdArrowBackIosNew } from "react-icons/md";
import AuthContext from "../../Common/authContext";


const NewPassword = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const usertoken = getToken();

  
  const handleChangeLanguage = async (event) => {
    const lan = event.target.value;
      dispatch(changeLanguage({ Language: lan }));
    try {
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
        { 'language':lan },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log(JSON.stringify({
      ...values,
      token: token,
      email: email,
    }))
    const body = JSON.stringify({
      ...values,
      token: token,
      email: email,
      type: 'sofiaco',
    });
    try {
      // Send a request to your backend API to reset the password
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/password/reset`,  body,{ 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.data;
      console.log(data)
      // Check if the request was successful
    if (response.status === 200 && response.status < 300) {
        navigate('/login');
        // Reset the form and show success message
        toast.success(data.message , {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
        // Optionally, redirect the user to a login page or home page
      } else {
        // Show error message if the request failed
        toast.error(data.message, {
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
    } catch (error) {
      console.error('Error:', error);
      toast.error(`${language === 'eng' ? 'An error occurred. Please try again.' : "Une erreur s'est produite. Veuillez réessayer."}`);
    } finally {
      setLoading(false);
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
          <h1>{language === "eng" ? "New Password" : "Nouveau mot de passe"}</h1>
          <p style={{width:'90%',margin:'1em auto'}}>{language === "eng" 
  ? "Set the new password for your account so you can login and access all features" 
  : "Définissez le nouveau mot de passe pour votre compte afin de pouvoir vous connecter et accéder à toutes les fonctionnalités"}</p>
     <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
      >
      <Form.Item style={{width:'100%'}}
          name="password"
          label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family-primary)',margin:'0 '}}>{language === "eng" ? "Enter New Password" : "Entrez un nouveau mot de passe"}</p>}
          rules={[
            {
              required: true,
              message: language === "eng" ? 'Please input your password!' : 'Veuillez saisir votre mot de passe!',
            },
            {
              validator: (_, value) => {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
                  return Promise.reject('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                }
                return Promise.resolve();
              }
            }
          ]}          
        >
          <Input.Password
            type="password"
            placeholder={language === "eng" ? "at least 8 characters" : "au moins 8 caractères"} 
            style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)',height:'2.7em'}}
          />
        </Form.Item>
        <Form.Item style={{width:'100%'}}
          name="password_confirmation"
          label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family-primary)',margin:'0 '}}>{language === "eng" ? "Confirm Password" : "Confirmer le mot de passe"}</p>}
          rules={[
            {
              required: true,
              message: language === "eng" ? 'Please confirm your password!' : 'Veuillez confirmer votre mot de passe!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(language === "eng" 
                    ? 'The new password that you entered do not match!' 
                    : 'Le nouveau mot de passe que vous avez saisi ne correspond pas!')
                );
              },
            }),
          ]}          
        >
          <Input.Password
            type="password"
            placeholder={language === "eng" ? "at least 8 characters" : "au moins 8 caractères"} 
            style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)',height:'2.7em'}}
          />
        </Form.Item>
           <Form.Item  style={{width:'100%'}}>
          <Button 
           size="large"
           htmlType="submit"
           disabled={loading ? true : false}
           style={{cursor: loading ? 'wait' : 'pointer'}}
           className={classes.logInButton}>
            {language === "eng" ? "Update Password" : "Mettre à jour le mot de passe"}
          </Button>
        </Form.Item> 
      </Form> 
  {language === 'eng' ? <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>{language === 'eng' ? "Register!" : "S'inscrire!"}</span></h4> : <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>{language === 'eng' ? "Create one!" : "Créez en un!" }</span></h4>}
  <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr }</p>
    </div>
    </div>
  );
};

export default NewPassword;