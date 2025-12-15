import React, { useContext, useEffect, useState } from 'react'
import classes from './Register.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AuthContext from '../../Common/authContext'
import './styles.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {const navigate = useNavigate();
  const authCtx = useContext(AuthContext)
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
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
          const updatedFormData = { ...formData,business_area: formData?.company_country, active: 'false', google: "false", type:'sofiaco', database_sous_domaine: import.meta.env.VITE_DATABASE_NAME, user_type:'b2b' };
  
          await axios.post(`${import.meta.env.VITE_TESTING_API}/register`, updatedFormData);
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
          console.error("Error registering:", error);
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
  const handleChangecountry = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  console.log(formData);
  
  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div onClick={()=>navigate(`/login`)} className={classes.back}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>{language === 'eng' ? "Back" : "Retour"}            </p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Fill out the form above to get your credentials!' : 'Remplissez le formulaire ci-dessus pour avoir vos identifiants!'}</h1>
          <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
                form={form}
      >
      <Form.Item
        name="company_name"
        rules={[
          { required: true, message: language === 'eng' ? 'Please input your Company Name!' : 'Veuillez entrer le nom de votre entreprise!' },
          { max: 30, message: language === 'eng' ? 'Company name must be less than 31 characters!' : 'Le nom de l\'entreprise doit comporter moins de 31 caractères!' }
        ]}
        style={{width:'100%'}}
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
        rules={[
          { required: true, message: language === 'eng' ? 'Please input your First Name!' : 'Veuillez entrer votre prénom!' },
          { max: 16, message: language === 'eng' ? 'First name must be less than 17 characters!' : 'Le prénom doit comporter moins de 17 caractères!' }
        ]}
        style={{width:'100%'}}
      >
        <Input
        size="large"  
        name="first_name" 
        placeholder={language === 'eng' ? "Owner First Name" : "Prénom du Propriétaire"}
               style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
               onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          { required: true, message: language === 'eng' ? 'Please input your Last Name!' : 'Veuillez entrer votre nom de famille!' },
          { max: 16, message: language === 'eng' ? 'Last name must be less than 17 characters!' : 'Le nom de famille doit comporter moins de 17 caractères!' }
        ]}
        style={{width:'100%'}}
      >
        <Input
        size="large"  
        name="last_name"
        placeholder={language === 'eng' ? "Owner last name" : 'Nom du Propriétaire'}
               style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
               onChange={handleChange}
        />
      </Form.Item>
        <Form.Item
          name="company_address"
          rules={[
            { required: true, message: language === 'eng' ? 'Please input your company address!' : 'Veuillez entrer l\'adresse de votre entreprise!' },
            { 
              max: 64, 
              message: language === 'eng' ? 'The address must not exceed 64 characters.' : 'L\'adresse ne doit pas dépasser 64 caractères.' 
            },
          ]}
          style={{width:'100%'}}
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
          rules={[
            { required: true, message: language === 'eng' ? 'Please input your company city!' : 'Veuillez entrer la ville de votre entreprise!' },
            { 
              max: 16, 
              message: language === 'eng' ? 'The city must not exceed 16 characters.' : 'La ville ne doit pas dépasser 16 caractères.' 
            },
          ]}
          style={{width:'100%'}}
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
                name="country"
                rules={[
                  { required: true, message: "Veuillez saisir votre pays!" },
                ]}
                style={{width:'100%', border: "none", borderRadius: ".5em" }}
              >
                  <Select
                    name="country"
                    placeholder={language === 'eng' ? "Company country" : 'Pays de la société'}
                    size="large"
                    style={{
                      width: "100%",
                      height: "2.5em",
                      textAlign: "start",
                    }}
                    dropdownStyle={{ zIndex: 2000 }}
                    showSearch // Enables searching
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => handleChangecountry("company_country", e)}
                  >
                    {/* Add options for all countries */}
                    {authCtx.countries?.map((country, index) => (
                      <Option key={index} value={country.name}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
              </Form.Item>
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: language === 'eng' ? 'Please input your phone!' : 'Veuillez entrer votre numéro de téléphone!' },
            { pattern: /^[0-9]+$/, message: language === 'eng' ? 'Phone number must contain only numbers!' : 'Le numéro de téléphone ne doit contenir que des chiffres!' },
            { 
              max: 16, 
              message: language === 'eng' ? 'The phone number must not exceed 16 characters.' : 'Le numéro de téléphone ne doit pas dépasser 16 caractères.' 
            },
          ]}
          style={{width:'100%'}}
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
              message: language === 'eng' ? 'Please input your Email!' : 'Veuillez entrer votre adresse e-mail!' 
            },
            { 
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
              message: language === 'eng' ? 'The input is not a valid E-mail!' : 'L\'entrée n\'est pas une adresse e-mail valide!' 
            },
            { 
              max: 40, 
              message: language === 'eng' ? 'The input must not exceed 40 characters.' : 'L\'entrée ne doit pas dépasser 40 caractères.' 
            },
          ]}
          style={{width:'100%'}}
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
          rules={[
            { 
              required: true, 
              message: language === 'eng' ? 'Please input your TVA!' : 'Veuillez entrer votre TVA!' 
            },
            { 
              max: 20, 
              message: language === 'eng' ? 'The input must not exceed 20 characters.' : 'L\'entrée ne doit pas dépasser 20 caractères.' 
            },
          ]}
          style={{width:'100%'}}
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
          rules={[
            { 
              required: true, 
              message: language === 'eng' ? 'Please input your SIRET!' : 'Veuillez entrer votre SIRET!' 
            },
            { 
              max: 16, 
              message: language === 'eng' ? 'The input must not exceed 16 characters.' : 'L\'entrée ne doit pas dépasser 16 caractères.' 
            },
          ]}
          style={{width:'100%'}}
        >
          <Input
          size="large"  
          name="siret"
        placeholder={language === 'eng' ? "SIRET" : 'SIRET'}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
           <Form.Item
        style={{width:'100%'}}>
          <Button
           size="large"
           disabled={loading}
           style={{cursor: loading ? 'wait' : 'pointer'}}
           htmlType="submit"
           className={classes.logInButton}>
           {language === 'eng' ? "Let’s Get Started" : 'Connexion'} 
          </Button>
        </Form.Item> 
      </Form>
      {language === 'eng' ? <h4>{language === 'eng' ? "Do you have an account?" : "Vous avez un compte?"} <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/login`)}>{language === 'eng' ? "Log in!" : "Se connecter!"}</span></h4> : <h4>{language === 'eng' ? "Do you have an account?" : "Vous avez un compte?"} <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/login`)}>{language === 'eng' ? "Log in!" : "Se connecter!"}</span></h4>}
      <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr }</p>
        </div>
    </div>
  )
}

export default Register