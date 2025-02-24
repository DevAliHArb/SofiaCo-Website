import React, { useContext, useState } from "react";
import classes from "./ForgotPassword.module.css";
import logo from '../../../assets/navbar/logo.svg'
import { FormControl, MenuItem, Select } from "@mui/material";
import { Button, Checkbox, Form, Input } from 'antd';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleLogin from '@leecheuk/react-google-login';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import { addUser } from "../redux/productSlice"; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { addUser, changeLanguage } from "../../Common/redux/productSlice";
import { MdArrowBackIosNew } from "react-icons/md";
import AuthContext from "../../Common/authContext";


const ForgotPassword = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const getToken = () => {
    return localStorage.getItem("token");
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
  
  const clientId =   import.meta.env.VITE_GOOGLE_CLIENT_ID;

  
const responseGoogle = async (response) => {
  const userData1 = {
      first_name: response.profileObj.givenName,
      last_name: response.profileObj.familyName,
      email: response.profileObj.email,
  };

  // Fetch image data
  const imageUrl = response.profileObj.imageUrl;
  const imageBlob = await fetch(imageUrl).then((res) => res.blob());
  const reader = new FileReader();
  
  reader.onload = async () => {
      const imageDataUrl = reader.result;
      userData1.image = imageDataUrl;

      // Make API call to login
      setLoading(true);
      try {
          const loginResponse = await axios.post(`${import.meta.env.VITE_TESTING_API}/login`, {
              email: userData1.email,
              type: 'sofiaco'
          });
          const token = loginResponse.data.token;
          localStorage.setItem("token", token);
          const user = loginResponse.data;
          const userInfo = user.user;
          const userId = userInfo.id;
          console.log(userInfo);

          // Dispatch action to add user to Redux store
          dispatch(addUser(userInfo));

          // const cartResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${userId}/cart`, {
          //     headers: {
          //         Authorization: `Bearer ${token}` // Include token in the headers
          //     }
          // });
          // const userCart = cartResponse.data.data; // Assuming cart data is returned in the response
          // console.log("User Cart:", userCart);
          // userCart.forEach(cartItem => {
          //     const article_id = cartItem.article_id;
          //     const foundBook = authCtx.articles.find(book => book.id === article_id);
          //     if (foundBook) {
          //         dispatch(addInitialcart({
          //             cart_id: cartItem.id,
          //             _id: foundBook.id,
          //             title: foundBook.designation,
          //             author: foundBook.dc_auteur,
          //             image: foundBook.articleimage[0].link,
          //             price: foundBook.prixpublic,
          //             quantity: cartItem.quantity,
          //             description: foundBook.descriptif,
          //         }));
          //     }
          // });

          // const favoriteResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${userId}/favorite`, {
          //     headers: {
          //         Authorization: `Bearer ${token}` // Include token in the headers
          //     }
          // });
          // const favoriteCart = favoriteResponse.data.data; // Assuming cart data is returned in the response
          // favoriteCart.forEach(favtItem => {
          //     const article_id = favtItem.article_id;
          //     const foundBook = authCtx.articles.find(book => book.id === article_id);
          //     if (foundBook) {
          //         dispatch(addTofavorite({
          //             id: favtItem.id,
          //             _favid: foundBook.id,
          //             favtitle: foundBook.designation,
          //             favauthor: foundBook.dc_auteur,
          //             favimage: foundBook.articleimage[0].link,
          //             favprice: foundBook.prixpublic,
          //             favdescription: foundBook.descriptif,
          //         }));
          //     }
          // });

          toast.success(`${language === 'eng' ? "Login successful!" : "Connexion réussie !"}`, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
          });
          setFormData({ email: "", password: "" });
          navigate(`/`);
      } catch (error) {
          const errormsg = error.response.data.error;
          console.error('Error in Login:', `${errormsg}`);
          toast.error( `${language === 'eng' ? "Google account not found"  : "Compte Google introuvable"}`, {
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
      finally {
          setLoading(false)
      }
  };
  reader.readAsDataURL(imageBlob);
};

    
  const onFinish = async (values) => {
    setLoading(true);
    values.type = 'albouraq';
    const body = JSON.stringify(values);
    try {
      // Send a request to your backend API to reset the password
      const response = await axios.post(
        `${import.meta.env.VITE_TESTING_API}/forgot-password`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response?.data;
      console.log(data);
      // Check if the request was successful
    if (response.status >= 200 && response.status < 300) {
        navigate("/login");    
        toast.info(language === "eng" ? 'Please check your email' : 'Veuillez vérifier votre email', { hideProgressBar: true });
        // Reset the form and show success message
        // toast.success(data[1] , {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: 0,
        //   theme: "colored",
        // });
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
      toast.error(error.response?.data.error.email[0] , {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
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
          <h1>{language === "eng" ? "Forgot Password?" : "Mot de passe oublié ?"}</h1>
          <p style={{width:'90%',margin:'1em auto'}}>{language === "eng"
  ? "Enter the email associated with your account and we’ll send an email with instructions to reset your password."
  : "Entrez l'email associé à votre compte et nous vous enverrons un email avec les instructions pour réinitialiser votre mot de passe."
}</p>
            <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
      >
        <Form.Item style={{width:'100%'}}
          name="email"
          label={<p style={{color:'var(--accent-color)',fontWeight:'500',fontFamily:'var(--font-family-primary)',margin:'0 '}}>Enter Your Email</p>}
          rules={[
            { 
              required: true, 
              message: language === "eng" ? "Please input your Email!" : "Veuillez saisir votre email !" 
            }
          ]}
                  >
          <Input
          size="large"  
          placeholder={language === "eng" ? "Example@email.com" : "Exemple@email.com"}
          style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)',height:'2.7em'}}
          />
        </Form.Item>
           <Form.Item  style={{width:'100%'}}>
          <Button 
           size="large"
           htmlType="submit"
           disabled={loading}
           style={{cursor: loading ? 'wait' : 'pointer'}}
           className={classes.logInButton}>
           {language === "eng" ? "Submit" : "Soumettre"}
          </Button>
        </Form.Item> 
      </Form>
      <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr }</p>
        </div>
    </div>
  );
};

export default ForgotPassword;