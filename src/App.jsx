import { useState } from 'react'
import './App.css'
import Navbar from './Components/Common/Navbar Section/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom';
import SideBar from './Components/Common/Sidebar Section/SideBar';

import { ToastContainer, toast } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import HomePage from './Components/Home Page/HomePage';
import { useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop'


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartisOpen, setcartIsOpen] = useState(false);
  const user = useSelector((state) => state.products.userInfo);

 const toggle = () => {
   setIsOpen(!isOpen);
 };
 
 const carttoggle = () => {
  if (user) {
    setcartIsOpen(!cartisOpen);
  }
};

  return (
    <div className="App" >
    <Navbar toggle={toggle}/>
       <SideBar isOpen={isOpen} toggle={toggle} />
       <div >
         <Routes>
       <Route path='/' element={<ScrollToTop><HomePage carttoggle={carttoggle}/></ScrollToTop>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer/>
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
  )
}

export default App

