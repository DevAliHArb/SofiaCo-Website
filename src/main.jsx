import React from 'react'
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

const initialOptions = {
  clientId: "Ab3mMG5piyeol2OLh83BS0LOmvLSB6ABNnAabiw0gkEJ_lggsfhQB06WaFMSaD0_ZbBASIow1aDntXZo",
  currency: "USD",
  intent: "capture",
};
const stripePromise = loadStripe("pk_test_51MhxfuGOcxX8WUaI6XSZQ5v4IjwFuOXqnmFSzlRO9nzw13ZdnXBVAOZqkkOFmrXwJxjQZqpMshj8uFYyGEyOLjzK00M2o6LIOg")

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <AuthContextProvider>
  <BrowserRouter>
  <PersistGate loading={'loading'} persistor={persistor}>
  <PayPalScriptProvider options={initialOptions}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
  </PayPalScriptProvider>
  </PersistGate>
  </BrowserRouter>
  </AuthContextProvider>
  </Provider>
)
