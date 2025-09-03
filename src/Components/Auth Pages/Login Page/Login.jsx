import React, { useContext, useEffect, useState, useRef } from 'react'
import classes from './Login.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AuthContext from '../../Common/authContext'
import './styles.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addInitialcart, addTofavorite, addUser } from '../../Common/redux/productSlice';
import bookPlaceHolder from '../../../assets/bookPlaceholder.png'
import DragPuzzleCaptcha from "drag-puzzle-captcha";
import "drag-puzzle-captcha/DragPuzzleCaptcha.css";

const Login = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm(); 
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const captchaRef = useRef(null);

  
  const handleCaptchaVerify = (verified) => {
    setCaptchaVerified(verified);
  };

  // Function to reset CAPTCHA
  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.reset();
      setCaptchaVerified(false);
    }
  };

  // Function to open CAPTCHA modal
  const openCaptchaModal = () => {
    setShowCaptchaModal(true);
    resetCaptcha();
  };

  // Function to close CAPTCHA modal
  const closeCaptchaModal = () => {
    setShowCaptchaModal(false);
  };

  // Check if both email and password are filled to show CAPTCHA
  const checkFieldsAndShowCaptcha = () => {
    const emailValue = form.getFieldValue('email');
    const passwordValue = form.getFieldValue('password');
    
    if (emailValue && passwordValue && emailValue.trim() !== '' && passwordValue.trim() !== '') {
      setShowCaptcha(true);
    } else {
      setShowCaptcha(false);
      setCaptchaVerified(false);
      setShowCaptchaModal(false);
    }
  };



const [formData, setFormData] = useState({ email: "", password: "", type: 'sofiaco' });

// Failed login attempt tracking states
const [failedAttempts, setFailedAttempts] = useState(0);
const [isLocked, setIsLocked] = useState(false);
const [lockoutTime, setLockoutTime] = useState(null);
const [remainingTime, setRemainingTime] = useState(0);

const handleChange = (e) => {
  const { name, value } = e.target;
  const lowercasedValue = name === 'email' ? value.toLowerCase() : value;
  setFormData({ ...formData, [name]: lowercasedValue });
  // console.log(formData);
    // Check after a short delay to allow form to update
    setTimeout(checkFieldsAndShowCaptcha, 100);
};

// Lockout utility functions
const getLockoutData = () => {
  const stored = localStorage.getItem('loginLockout');
  return stored ? JSON.parse(stored) : { attempts: 0, lockoutTime: null };
};

const saveLockoutData = (attempts, lockoutTime) => {
  localStorage.setItem('loginLockout', JSON.stringify({ attempts, lockoutTime }));
};

const clearLockoutData = () => {
  localStorage.removeItem('loginLockout');
};

const getLockoutDuration = (attempts) => {
  const durations = [30000, 60000, 180000, 3600000, 14400000, 28800000, 86400000]; // 30s, 1min, 3min, 1hr, 4hr, 8hr, 24hr
  return durations[Math.min(attempts - 4, durations.length - 1)];
};

const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

const handleFailedLogin = () => {
  const newAttempts = failedAttempts + 1;
  setFailedAttempts(newAttempts);

  if (newAttempts >= 3) {
    const lockDuration = getLockoutDuration(newAttempts);
    const lockTime = Date.now() + lockDuration;
    
    setIsLocked(true);
    setLockoutTime(lockTime);
    setRemainingTime(Math.floor(lockDuration / 1000));
    
    saveLockoutData(newAttempts, lockTime);
  } else {
    saveLockoutData(newAttempts, null);
  }
};

const handleSuccessfulLogin = () => {
  setFailedAttempts(0);
  setIsLocked(false);
  setLockoutTime(null);
  setRemainingTime(0);
  clearLockoutData();
};

// Check lockout status on component mount and set up timer
useEffect(() => {
  const { attempts, lockoutTime } = getLockoutData();
  setFailedAttempts(attempts);

  if (lockoutTime && Date.now() < lockoutTime) {
    setIsLocked(true);
    setLockoutTime(lockoutTime);
    setRemainingTime(Math.floor((lockoutTime - Date.now()) / 1000));
  }
}, []);

// Update remaining time every second when locked
useEffect(() => {
  let interval;
  if (isLocked && lockoutTime) {
    interval = setInterval(() => {
      const timeLeft = Math.floor((lockoutTime - Date.now()) / 1000);
      if (timeLeft <= 0) {
        setIsLocked(false);
        setLockoutTime(null);
        setRemainingTime(0);
        clearInterval(interval);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isLocked, lockoutTime]);

const onFinish = async () => {
  // Check if account is locked
  if (isLocked) {
    toast.error(
      `${
        language === "eng"
          ? `Account locked. Try again in ${formatTime(remainingTime)}`
          : `Compte verrouillé. Réessayez dans ${formatTime(remainingTime)}`
      }`,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      }
    );
    return;
  }

     // Check if CAPTCHA is needed and not verified
    if (showCaptcha && !captchaVerified) {
      // Open the CAPTCHA modal instead of showing error
      openCaptchaModal();
      return;
    }
  setLoading(true);
  try {
    const response = await axios.post( `${import.meta.env.VITE_TESTING_API}/login`,formData);
    const token = response.data.token;
    localStorage.setItem("token", token);
    const user = response.data;
    const userInfo = user.user;
    const userId = userInfo.id;
    // console.log(userInfo);
    // Dispatch action to add user to Redux store
    dispatch(addUser(userInfo));

    const cartResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${userId}/cart`, {
      headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
      }
  });
  const userCart = cartResponse.data.data; // Assuming cart data is returned in the response
  // console.log("User Cart:", userCart);
  userCart?.forEach(cartItem => {
      const article_id = cartItem.article_id;
      const foundBook = authCtx.articles.find(book => book.id === article_id);
      if (cartItem.article) {
        dispatch(addInitialcart({
          cart_id: cartItem.id,
          _id: cartItem.article.id,
          title: cartItem.article.designation,
          author: cartItem.article.dc_auteur,
          average_rate: cartItem.average_rate,
          image: cartItem.article.articleimage[0]?.link ? cartItem.article.articleimage[0].link : bookPlaceHolder,
          price: cartItem.article.prixpublic,
          _qte_a_terme_calcule: cartItem.article._qte_a_terme_calcule,
          quantity: cartItem.quantity,
          description: cartItem.article.descriptif,
          weight: cartItem.article._poids_net,
          price_ttc: cartItem.article._prix_public_ttc,
          discount: cartItem.article?.discount,
          removed: cartItem.removed,
          article_stock: cartItem.article.article_stock
          }));
      }
  });

  const favoriteResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${userId}/favorite`, {
      headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
      }
  });
  const favoriteCart = favoriteResponse.data.data; // Assuming cart data is returned in the response
  favoriteCart?.forEach(favtItem => {
      const article_id = favtItem.article_id;
      const foundBook = authCtx.articles.find(book => book.id === article_id);
      if (favtItem.article) {
          dispatch(addTofavorite({
            id: favtItem.id,
            _favid: favtItem.article.id,
            favtitle: favtItem.article.designation,
            favrate: favtItem.average_rate,
            favauthor: favtItem.article.dc_auteur,
            favimage: favtItem.article.articleimage[0]?.link ? favtItem.article.articleimage[0].link : bookPlaceHolder,
            favprice: favtItem.article.prixpublic,
            _qte_a_terme_calcule: favtItem.article._qte_a_terme_calcule,
            favdescription: favtItem.article.descriptif,
            favquantity: 1,
            weight: favtItem.article._poids_net,
            price_ttc: favtItem.article._prix_public_ttc,
            removed: favtItem.removed,
            discount: favtItem.article?.discount,
            article_stock: favtItem.article.article_stock
          }));
      }
  });
    toast.success(language === "eng" ? "Login successful!" : "Connexion réussie !", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "colored",
    });
    
    // Handle successful login
    handleSuccessfulLogin();
    
    setFormData({ email: "", password: "" });
    form.resetFields();
    setCaptchaVerified(false);
    setShowCaptcha(false);
    setShowCaptchaModal(false);
    navigate(`/`); 
  } catch (error) {
    const errormsg = error.response?.data?.error || error.message;
    // console.error('Error in Login:', error);
    
    // Check if it's a 401 error (authentication failed)
    if (error.response?.status === 401) {
      handleFailedLogin();
      
      // Show appropriate error message based on attempts
      if (failedAttempts + 1 <= 3) {
        const remainingAttempts = 3 - (failedAttempts + 1);
        toast.error(
          `${
            language === "eng"
              ? `Invalid credentials. ${remainingAttempts} attempts remaining.`
              : `Identifiants invalides. ${remainingAttempts} tentatives restantes.`
          }`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          }
        );
      } else {
        const lockoutDuration = getLockoutDuration(failedAttempts + 1);
        toast.error(
          `${
            language === "eng"
              ? `Too many failed attempts. Account locked for ${formatTime(lockoutDuration)}.`
              : `Trop de tentatives échouées. Compte verrouillé pour ${formatTime(lockoutDuration)}.`
          }`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          }
        );
      }
    } else {
      // For other errors, show the original error message
      toast.error( language === "eng" ? `Error in Login: ${errormsg}` : `Erreur de connexion : ${errormsg}` , {
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
  } 
  finally {
    setLoading(false)
  }
};


  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div className={classes.back} onClick={()=>navigate(`/`)}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>{language === 'eng' ? "Back" : "Retour"}</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Welcome!' : 'Bienvenue!'}</h1>
          <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
                form={form}
      >
        <Form.Item style={{width:'100%'}}
          name="email"
          rules={[
            { 
              required: true, 
              message: language === 'eng' ? 'Please input your Email!' : 'Veuillez entrer votre adresse e-mail!' 
            },
          ]}
        >
          <Input
          size="large"  
          name="email"
        placeholder={language === 'eng' ? "User Name" : "Nom d'utilisateur"}
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)',height:'2.8em'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item style={{width:'100%'}}
          name="password"
          rules={[
            { 
              required: true, 
              message: language === 'eng' ? 'Please input your Password!' : 'Veuillez entrer votre mot de passe!' 
            },
          ]}
        >
          <Input.Password
            type="password"
            name="password"
            size="large" 
            placeholder={language === 'eng' ? "Password" : "Mot de passe"} 
            style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,height:'3em',color:'var(--accent-color)',height:'2.7em'}}
            onChange={handleChange}
          />
        </Form.Item>
        <div style={{width:'100%', textAlign: 'end',color:'var(--forth-color)',cursor:'pointer'}} onClick={()=>navigate('/forget-password')}>
          <p style={{marginTop:'-1.3em',marginBottom:'2em',fontFamily:'var(--font-family-primary)',fontStyle:'normal',fontSize:'small'}}>
              {language === 'eng' ? "Forgot password ?" : "Mot De Passe Oublié ?"}</p>
        </div>
        
            {/* Show CAPTCHA verification button when both fields are filled */}
            {showCaptcha && !captchaVerified && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '1em'
              }}>
                <Button
                  type="default"
                  onClick={openCaptchaModal}
                  style={{
                    borderColor: 'var(--primary-color)',
                    color: 'var(--primary-color)',
                    fontWeight: '500'
                  }}
                >
                  🛡️ {language === "eng" 
                    ? "Complete Security Verification" 
                    : "Compléter la vérification de sécurité"}
                </Button>
              </div>
            )}

            {/* Show verification success */}
            {captchaVerified && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '1em',
                fontSize: '14px',
                color: '#52c41a',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                ✓ {language === "eng" 
                  ? "Security verification completed" 
                  : "Vérification de sécurité terminée"}
              </div>
            )}

           {/* Lockout Status Display */}
           {isLocked && (
             <div className="lockout-status" style={{ 
               textAlign: 'center', 
               marginBottom: '16px', 
               padding: '12px', 
               backgroundColor: '#fff2f0', 
               border: '1px solid #ffccc7', 
               borderRadius: '6px' 
             }}>
               <p style={{ margin: 0, color: '#cf1322', fontSize: '14px', fontWeight: '500' }}>
                 {language === "eng" 
                   ? `Account temporarily locked. Please wait: ${formatTime(remainingTime)}`
                   : `Compte temporairement verrouillé. Veuillez patienter : ${formatTime(remainingTime)}`
                 }
               </p>
             </div>
           )}

           <Form.Item  style={{width:'100%'}}>
          <Button
           size="large"
           htmlType="submit"
           disabled={loading || isLocked}
           style={{cursor: loading || isLocked ? 'not-allowed' : 'pointer'}}
           className={classes.logInButton}>
            {language === 'eng' ? "Let’s Get Started" : "Commençons" }
          </Button>
        </Form.Item> 
      </Form>
      {language === 'eng' ? <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>{language === 'eng' ? "Register!" : "S'inscrire!"}</span></h4> : <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>{language === 'eng' ? "Create one!" : "Créez en un!" }</span></h4>}
      <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr }</p>
        </div>
        
      {/* CAPTCHA Modal */}
      <DragPuzzleCaptcha
        ref={captchaRef}
        onVerify={handleCaptchaVerify}
        language={language}
        showModal={showCaptchaModal}
        onCloseModal={closeCaptchaModal}
      />
    </div>
  )
}

export default Login