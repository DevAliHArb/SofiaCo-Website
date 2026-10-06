import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './Components/Common/authContext.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './Components/Common/redux/store.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import logo from './assets/loading-gif.gif'
import axios from 'axios'
import { HelmetProvider } from 'react-helmet-async'


// Key now comes from GET /payment-public-keys (public, no auth needed),
// which returns { stripe_publishable_key, paypal_client_id } already
// decrypted — replaces the old pattern of pulling an encrypted value out of
// /societe-config and decrypting it client-side.
const PayPalAndStripeComponent = () => {
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [stripePublishableKey, setStripePublishableKey] = useState(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/payment-public-keys`);
        if (response.data?.paypal_client_id) {
          setPaypalClientId(response.data.paypal_client_id);
        }
        if (response.data?.stripe_publishable_key) {
          setStripePublishableKey(response.data.stripe_publishable_key);
        }
      } catch (error) {
        console.error('Error fetching payment public keys:', error);
      }
    };

    fetchKeys();
  }, []);

  if (!paypalClientId || !stripePublishableKey) {
    // Show loading indicator or nothing while values are being decrypted
    return <div style={{
      position:'absolute',
      top:0,
      left: 0,
      bottom: 0,
      right: 0,
      width:'fit-content', 
      height:'fit-content',
      margin:'auto',
      justifyContent:'center',
      alignItems:'center',
    }}><img src={logo} alt='' /></div>;
  }

  const initialOptions = {
    clientId: paypalClientId,  // Use decrypted PayPal clientId
    currency: "USD",
    intent: "capture",
  };

  const stripePromise = loadStripe(stripePublishableKey);  // Use decrypted Stripe publishable key

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </PayPalScriptProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <Provider store={store}>
      <AuthContextProvider>
        <BrowserRouter>
          <PersistGate loading={'loading'} persistor={persistor}>
            <PayPalAndStripeComponent /> {/* PayPal & Stripe rendered here */}
          </PersistGate>
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  </HelmetProvider>
)
