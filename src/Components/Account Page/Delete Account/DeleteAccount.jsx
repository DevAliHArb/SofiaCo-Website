import React, { useEffect, useRef, useState } from 'react'
import classes from './DeleteAccount.module.css'

import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import data from '../../../Data.json';
import { useNavigate } from 'react-router-dom';
import { removeUser } from '../../Common/redux/productSlice';


const DeleteAccount = () => {

  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state.products.userInfo);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()

    
const logout = async () => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // If token is not available, there's no need to logout
    if (!token) {
      return;
    }

    // Set up headers with the token
    const headers = {
      Accept: `application/json`,
      Authorization: `Bearer ${token}`,
    };

    // Send a POST request to the logout endpoint
    await axios.get(`${import.meta.env.VITE_TESTING_API}/api/bookshop/logout`, { headers });

    // Remove the token from local storage after successful logout
    localStorage.removeItem('token');

    dispatch(removeUser()) ;
    navigate(`/login`);
    // Add any additional logic you may need, such as redirecting the user to the login page or updating the application state
  } catch (error) {
    // console.error('Error logging out:', error);
    // Handle any errors that occur during logout
  }
};
  const handleDeleteAccount = () => {
    axios.delete(`${import.meta.env.VITE_TESTING_API}/api/bookshop/users/${userInfo?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      // Update Redux state or perform any other necessary actions
      logout() // Example: dispatch an action to update Redux state after deletion

      // Show success message
      toast.success(language === "eng" ? "Email sent. Please verify your email." : "Email envoyé. Veuillez vérifier votre email.", {hideProgressBar: true});
    })
    .catch(error => {
      // Handle error
      // console.log(error);
      toast.error(language === "eng" ? "An error occurred. Please try again later!" : "Une erreur s'est produite. Veuillez réessayer plus tard !", {hideProgressBar:true});
    });
  };


  return (
    <div className={classes.AccountDetailsContainer}>
    <div className={classes.header}>
      <div className={classes.headtitle}>
        <h3 style={{ fontWeight: "600", marginTop: "0.2em" }}>
        {data.AccountProfilePage.DeleteAccount.title[language]}
        </h3>
      </div>
    </div>

            <div className={classes.content}>
              <div className={classes.content_data}>
                <p>{data.AccountProfilePage.DeleteAccount.data1[language]}</p>
                <button onClick={handleDeleteAccount}>{data.AccountProfilePage.DeleteAccount.button1[language]}</button>
              </div>
              <div className={classes.content_data} style={{marginTop:'5em'}}>
                <p>{data.AccountProfilePage.DeleteAccount.data2[language]}</p>
                <button onClick={logout}>{data.AccountProfilePage.DeleteAccount.button2[language]}</button>
              </div>
            </div>
       </div>  
  )
}

export default DeleteAccount