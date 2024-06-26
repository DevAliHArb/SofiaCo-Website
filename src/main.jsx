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

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <AuthContextProvider>
  <BrowserRouter>
  <PersistGate loading={'loading'} persistor={persistor}>
    <App />
  </PersistGate>
  </BrowserRouter>
  </AuthContextProvider>
  </Provider>
)
