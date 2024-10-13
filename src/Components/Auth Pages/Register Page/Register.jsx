import React, { useContext, useEffect, useState } from 'react'
import classes from './Register.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AuthContext from '../../Common/authContext'
import './styles.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {const navigate = useNavigate();
  const authCtx = useContext(AuthContext)
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [language, setLanguage] = React.useState('eng');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    image: "",
  });
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
    
    useEffect(() => { // This will log the updated state after each render
    }, [userData]);


    const onFinish = async (values) => {
        setLoading(true)
        try {
          const updatedFormData = { ...formData, google: "false", type:'sofiaco' };
  
          await axios.post("https://api.leonardo-service.com/api/bookshop/register", updatedFormData);
          toast.success(language === "eng" ? "Registration successful!" : "Inscription réussie !", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });

          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
          });
          form.resetFields();
          navigate(`/verify-email`);
        } catch (error) {
          // console.error("Error registering:", error);
          toast.error(
            error.response.data.error,
            {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            }
          );
        } finally {
          setLoading(false)
        }
    };

    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div onClick={()=>navigate(`/login`)} className={classes.back}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>Back</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Remplissez le formulaire ci-dessus pour avoir vos identifiants!' : 'Remplissez le formulaire ci-dessus pour avoir vos identifiants!'}</h1>
          <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
                form={form}
      >
      <Form.Item
        name="company_name"
        rules={[{ required: true, message: 'Please input your Company Name!' },
          { max: 30, message: 'Company name must be less than 31 characters!' }]}
      >
        <Input
        size="large"  
        name="company_name" 
               placeholder={language === 'eng' ? "Company name" : 'Nom de société'} 
               style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
               onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        name="first_name"
        rules={[{ required: true, message: 'Please input your First Name!' },
          { max: 16, message: 'First name must be less than 17 characters!' }]}
      >
        <Input
        size="large"  
        name="first_name" 
        placeholder={language === 'eng' ? "Owner first name" : ''}
               style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
               onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[{ required: true, message: 'Please input your Last Name!' },
          { max: 16, message: 'First name must be less than 17 characters!' }]}
      >
        <Input
        size="large"  
        name="last_name"
        placeholder={language === 'eng' ? "Owner last name" : ''}
               style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
               onChange={handleChange}
        />
      </Form.Item>
        <Form.Item
          name="company_address"
          rules={[{ required: true, message: 'Please input your company address!' },
            {
              max: 64,
              min: 12,
              message: "Le titre doit comporter entre 12 et 64 caractères.",
            },]}
        >
          <Input
          size="large"  
          name="company_address"
        placeholder={language === 'eng' ? "Comany address" : 'Adresse société'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="company_city"
          rules={[{ required: true, message: 'Please input your company city!' },
            {
              max: 16,
              message: "Le titre ne doit pas dépasser 16 caractères.",
            },]}
        >
          <Input
          size="large"  
          name="company_city"
        placeholder={language === 'eng' ? "Comany city" : 'Ville société'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Please input your phone!' },
            { pattern: /^[0-9]+$/, message: 'Phone number must contain only numbers!' },
            {
              max: 16,
              message: "Le titre ne doit pas dépasser 16 caractères.",
            },]}
        >
          <Input
          size="large"  
          name="phone"
        placeholder={language === 'eng' ? "Phone number" : 'Numéro de téléphone'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { 
              required: true, 
              message: 'Please input your Email!' 
            },
            { 
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
              message: 'The input is not valid E-mail!' 
            },
            {
              max: 40,
              message: "Le titre ne doit pas dépasser 40 caractères.",
            },
          ]}
        >
          <Input
          size="large"  
          name="email"
        placeholder={language === 'eng' ? "Email" : 'Email'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="tva"
          rules={[{ required: true, message: 'Please input your TVA!' },
            {
              max: 16,
              message: "Le titre ne doit pas dépasser 16 caractères.",
            },]}
        >
          <Input
          size="large"  
          name="tva"
        placeholder={language === 'eng' ? "N TVA" : 'N TVA'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="siret"
          rules={[{ required: true, message: 'Please input your siret!' },
            {
              max: 16,
              message: "Le titre ne doit pas dépasser 16 caractères.",
            },]}
        >
          <Input
          size="large"  
          name="siret"
        placeholder={language === 'eng' ? "SIRET" : 'SIRET'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
           <Form.Item>
          <Button
           size="large"
           disabled={loading}
           style={{cursor: loading ? 'wait' : 'pointer'}}
           htmlType="submit"
           className={classes.logInButton}>
            Let’s Get Started
          </Button>
        </Form.Item> 
      </Form>
      {language === 'eng' ? <h4>Vous avez un compte? <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/login`)}>Log in!</span></h4> : <h4>Vous avez un compte? <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/login`)}>Log in!</span></h4>}
      <p>{authCtx.companySettings?.copyrights_en}</p>
        </div>
    </div>
  )
}

export default Register