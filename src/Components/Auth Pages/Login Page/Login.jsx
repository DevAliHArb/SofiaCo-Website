import React, { useContext, useEffect, useState } from 'react'
import classes from './Login.module.css'
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
import { addInitialcart, addTofavorite, addUser } from '../../Common/redux/productSlice';
import bookPlaceHolder from '../../../assets/bookPlaceholder.png'

const Login = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [language, setLanguage] = React.useState('eng');
  const [loading, setLoading] = useState(false);



const [formData, setFormData] = useState({ email: "", password: "", type: 'sofiaco' });

const handleChange = (e) => {
  const { name, value } = e.target;
  const lowercasedValue = name === 'email' ? value.toLowerCase() : value;
  setFormData({ ...formData, [name]: lowercasedValue });
  console.log(formData);
};

const onFinish = async () => {
  setLoading(true);
  try {
    const response = await axios.post( "https://api.leonardo-service.com/api/bookshop/login",formData);
    const token = response.data.token;
    localStorage.setItem("token", token);
    const user = response.data;
    const userInfo = user.user;
    const userId = userInfo.id;
    console.log(userInfo);
    // Dispatch action to add user to Redux store
    dispatch(addUser(userInfo));

    const cartResponse = await axios.get(`https://api.leonardo-service.com/api/bookshop/users/${userId}/cart`, {
      headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
      }
  });
  const userCart = cartResponse.data.data; // Assuming cart data is returned in the response
  console.log("User Cart:", userCart);
  userCart?.forEach(cartItem => {
      const article_id = cartItem.article_id;
      const foundBook = authCtx.articles.find(book => book.id === article_id);
      if (cartItem.article) {
        dispatch(addInitialcart({
          cart_id: cartItem.id,
          _id: cartItem.article.id,
          title: cartItem.article.designation,
          author: cartItem.article.dc_auteur,
          image: cartItem.article.articleimage[0]?.link ? cartItem.article.articleimage[0].link : bookPlaceHolder,
          price: cartItem.article.prixpublic,
          quantity: cartItem.quantity,
          description: cartItem.article.descriptif,
          weight: cartItem.article._poids_net,
          price_ttc: cartItem.article._prix_public_ttc,
          article_stock: cartItem.article.article_stock
          }));
      }
  });

  const favoriteResponse = await axios.get(`https://api.leonardo-service.com/api/bookshop/users/${userId}/favorite`, {
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
            favauthor: favtItem.article.dc_auteur,
            favimage: favtItem.article.articleimage[0]?.link ? favtItem.article.articleimage[0].link : bookPlaceHolder,
            favprice: favtItem.article.prixpublic,
            favdescription: favtItem.article.descriptif,
            favquantity: 1,
            weight: favtItem.article._poids_net,
            price_ttc: favtItem.article._prix_public_ttc,
            article_stock: favtItem.article.article_stock
          }));
      }
  });
    toast.success("Login successful!", {
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
    form.resetFields();
    navigate(`/`);
  } catch (error) {
    const errormsg = error.response.data?.error;
    console.error('Error in Login:', error);
    toast.error( `Error in Login: ${errormsg}` , {
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


  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div className={classes.back} onClick={()=>navigate(`/`)}><MdArrowBackIosNew style={{width:'1em', height:'1em', margin:'auto 0.5em auto 0', color:'var(--secondary-color)'}}/><p>Back</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}>
          <div className={classes.auth_bg} />
         <h1>{language === 'eng' ? 'Welcome!' : 'Welcome!'}</h1>
          <Form 
                layout="vertical"
                name="nest-messages"
                className='form'
                onFinish={onFinish}
                form={form}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input
          size="large"  
          name="email"
        placeholder={language === 'eng' ? "User Name" : 'User Name'} 
                 style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,color:'var(--accent-color)'}}
                 onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            type="password"
            name="password"
            size="large" 
            placeholder={language === 'eng' ? "Password" : 'Password'} 
            style={{border:'none',backgroundColor:"rgba(255, 255, 255, 0.1)" ,height:'3em',color:'var(--accent-color)'}}
            onChange={handleChange}
          />
        </Form.Item>
           <Form.Item>
          <Button
           size="large"
           htmlType="submit"
           disabled={loading}
           style={{cursor: loading ? 'wait' : 'pointer'}}
           className={classes.logInButton}>
            {language === 'eng' ? "Let’s Get Started" : "Commençons" }
          </Button>
        </Form.Item> 
      </Form>
      {language === 'eng' ? <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>Register!</span></h4> : <h4>{language === 'eng' ? "Don't have an account?" : "Vous n’avez pas de compte?" } <span style={{fontWeight:700, textDecoration:'underline', cursor:'pointer'}} onClick={()=>navigate(`/register`)}>{language === 'eng' ? "Create one!" : "Créez en un!" }</span></h4>}
      <p>{authCtx.companySettings?.copyrights_en}</p>
        </div>
    </div>
  )
}

export default Login