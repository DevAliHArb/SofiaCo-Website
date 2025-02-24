import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthContext, { AuthContextProvider } from './Components/Common/authContext.jsx'
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
import { decryptAES128CTR } from './Components/Common/Decrypt.jsx'


const PayPalAndStripeComponent = () => {
  const authCtx = useContext(AuthContext);  // Access auth context
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [stripePublishableKey, setStripePublishableKey] = useState(null);

  useEffect(() => {
    const fetchDecryptedValues = async () => {
      // Get the encrypted values from the authCtx
      const encryptedPaypalClientId = authCtx.societeConfig?.find(item => item.config_module_nomtech === "paypal_client_id")?.valeur;
      const encryptedStripePublishableKey = authCtx.societeConfig?.find(item => item.config_module_nomtech === "stripe_pay_api_key")?.valeur; // Ensure this is the publishable key

      // Decrypt the values
      if (encryptedPaypalClientId && encryptedStripePublishableKey) {
        const decryptedPaypalClientId = await decryptAES128CTR(encryptedPaypalClientId);
        const decryptedStripePublishableKey = await decryptAES128CTR(encryptedStripePublishableKey);

        // Set the decrypted values to state
        setPaypalClientId(decryptedPaypalClientId);
        setStripePublishableKey(decryptedStripePublishableKey);
      }
    };

    fetchDecryptedValues();
  }, [authCtx]); // Run this effect when authCtx changes

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
  <Provider store={store}>
    <AuthContextProvider>
      <BrowserRouter>
        <PersistGate loading={'loading'} persistor={persistor}>
          <PayPalAndStripeComponent /> {/* PayPal & Stripe rendered here */}
        </PersistGate>
      </BrowserRouter>
    </AuthContextProvider>
  </Provider>
)
