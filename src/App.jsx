import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './Components/Common/Navbar Section/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import HomePage from './Components/Home Page/HomePage';
import { useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop'
import About from './Components/About Page/About';
import SideBar from './Components/Common/SideBar Section/SideBar'
import Register from './Components/Auth Pages/Register Page/Register';
import Login from './Components/Auth Pages/Login Page/Login';
import Verify from './Components/Auth Pages/Verfiy Email/Verify';


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartisOpen, setcartIsOpen] = useState(false);
  const user = useSelector((state) => state.products.userInfo);
  const location = useLocation();
  const path = location.pathname;
  const [isAuthPages, setisAuthPages] = useState(false);

 const toggle = () => {
   setIsOpen(!isOpen);
 };
 
 const carttoggle = () => {
  if (user) {
    setcartIsOpen(!cartisOpen);
  }
};

useEffect(() => {
  if (path == "/login" || path == "/register" || path == "/forget-password" || path == "/reset-password" || path == "/verification" || path === '/verify-email') {
    setisAuthPages(true)
  } else { setisAuthPages(false) }
}, [path])

  return (
    <div className="App1">
      <div className="App" >
    {!isAuthPages && <Navbar toggle={toggle}/>}
       <SideBar isOpen={isOpen} toggle={toggle} />
       <div >
         <Routes>
          <Route path='/' element={<ScrollToTop><HomePage carttoggle={carttoggle}/></ScrollToTop>} />
          <Route path='/about' element={<ScrollToTop><About/></ScrollToTop>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path='/register' element={<ScrollToTop><Register /></ScrollToTop>} />
          <Route path='/login' element={<ScrollToTop><Login /></ScrollToTop>} />
          <Route path='/verify-email' element={<ScrollToTop><Verify /></ScrollToTop>} />
        </Routes>
      </div>
      {!isAuthPages && <Footer/>}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{color:'red'}}
        />
    </div>
    </div>
  )
}

export default App

