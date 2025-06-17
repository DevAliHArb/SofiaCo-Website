import React, { useEffect, useState } from 'react';
import classes from './Success.module.css'
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // <-- import useParams
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart, resetOrderData } from '../Common/redux/productSlice';

const SuccessPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const user = useSelector((state) => state.products.userInfo);
  const [orderId, setorderId] = useState(null);

const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/order_invoices?user_id=${user.id}`);
      const orderId = response?.data?.data[0]?.id;
      setorderId(orderId);
    } catch (error) {
      console.error("Error fetching order success:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchOrder();
  }, []);
  return (
    <div className={classes.success}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          {error
            ? error
            : language === 'eng'
              ? <>Payment Successful! Your order has been placed.<br />Your order ID is: <b>{orderId}</b></>
              : <>Paiement réussi ! Votre commande a été passée.<br />Votre numéro de commande est : <b>{orderId}</b></>
          }
        </p>
      )}
      {!loading && (
        <>
          {error ? (
            <button onClick={() => navigate(`/checkout`)}>
              {language === "eng" ? "Back to checkout" : "Retour à la caisse"}
            </button>
          ) : (
            <button onClick={() => navigate(`/`)}>
              {language === "eng" ? "Back to home page" : "Retour à la page d'accueil"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SuccessPage;
