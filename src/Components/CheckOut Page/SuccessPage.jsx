import React, { useEffect, useState } from 'react';
import classes from './Success.module.css'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart, resetOrderData } from '../Common/redux/productSlice';

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const orderData = useSelector((state) => state.products.orderData[0]);

  
  useEffect(() => {
    const handleSuccess = async () => {
    //   const query = new URLSearchParams(location.search);
    //   const sessionId = query.get('session_id');
    //   const orderId = query.get('order_id'); // If you pass order_id in the URL
    //   const requestData = localStorage.getItem('orderData')
    //   if (sessionId) {
        try {
          // Fetch session details if needed
          // const sessionResponse = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
          //   headers: { 'Authorization': `Bearer ${YOUR_STRIPE_SECRET_KEY}` }
          // });

          // Call your API to create the order invoice
        //   const requestData = { sessionId, orderId }; // Add more data if necessary
          await axios.post('https://api.leonardo-service.com/api/bookshop/order_invoices', orderData);

          // Optionally clear cart or other actions
          dispatch(resetCart());
          dispatch(resetOrderData())

          toast.success("Order placed successfully!");
        } catch (err) {
          console.error("Error creating order invoice:", err);
          setError("Failed to create order. Please try again.");
        } finally {
          setLoading(false);
        }
    //   }
    };

    handleSuccess();
  }, [location.search]);

  return (
    <div className={classes.success}>
      {loading ? <p>Loading...</p> : <p>{error ? error : "Payment Successful! Your order has been placed."}</p>}
      {!loading &&  <>
        {error ? <button onClick={()=>navigate(`/checkout`)}>{language === "eng" ? "Back to checkout" : "Retour à la caisse"}</button> : <button onClick={()=>navigate(`/`)}>{language === "eng" ? "Back to home page" : "Retour à la page d'accueil"}</button>}
      </>}
    </div>
  );
};

export default SuccessPage;
