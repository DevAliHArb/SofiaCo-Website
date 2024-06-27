import { useState } from 'react'
import './App.css'
import Navbar from './Components/Common/Navbar Section/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import HomePage from './Components/Home Page/HomePage';
import { useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop'
import About from './Components/About Page/About';
import SideBar from './Components/Common/Sidebar Section/SideBar'
import Events from './Components/Events/Events Page/Events';
import EventsDetails from './Components/Events/Events Details Page/EventsDetails';


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
    <div className="App1">
      <div className="App" >
    <Navbar toggle={toggle}/>
       <SideBar isOpen={isOpen} toggle={toggle} />
       <div >
         <Routes>
          <Route path='/' element={<ScrollToTop><HomePage carttoggle={carttoggle}/></ScrollToTop>} />
          <Route path='/about' element={<ScrollToTop><About/></ScrollToTop>} />
          <Route path='/events' element={<ScrollToTop><Events/></ScrollToTop>} />
          <Route path='/events/:id/event-details' element={<ScrollToTop><EventsDetails/></ScrollToTop>} />
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
    </div>
  )
}

export default App

