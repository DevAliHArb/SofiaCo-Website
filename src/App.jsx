import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './Components/Common/Navbar Section/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import HomePage from './Components/Home Page/HomePage';
import { useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop'
// import SideBar from './Components/Common/SideBar Section/SideBar'
import About from './Components/About Page/About';
import Events from './Components/Events/Events Page/Events';
import EventsDetails from './Components/Events/Events Details Page/EventsDetails';
import Register from './Components/Auth Pages/Register Page/Register';
import Login from './Components/Auth Pages/Login Page/Login';
import Verify from './Components/Auth Pages/Verfiy Email/Verify';
import CollectionsPage from './Components/Collection Pages/Collections Page/Collections';
import CollectionDetailsPage from './Components/Collection Pages/CollectionDetails Page/CollectionDetails';
import Collaborators from './Components/Collaborators/Collaborators Page/Collaborators';
import CollaboratorDetails from './Components/Collaborators/Collaborator Details Page/CollaboratorDetails';


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
    {!isAuthPages && <Navbar toggle={toggle} carttoggle={carttoggle}/>}
       {/* <SideBar isOpen={isOpen} toggle={toggle} /> */}
       <div >
         <Routes>
          <Route path='/' element={<ScrollToTop><HomePage carttoggle={carttoggle}/></ScrollToTop>} />
          <Route path='/about' element={<ScrollToTop><About/></ScrollToTop>} />
          <Route path='/events' element={<ScrollToTop><Events/></ScrollToTop>} />
          <Route path='/events/:id/event-details' element={<ScrollToTop><EventsDetails/></ScrollToTop>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path='/register' element={<ScrollToTop><Register /></ScrollToTop>} />
          <Route path='/login' element={<ScrollToTop><Login /></ScrollToTop>} />
          <Route path='/verify-email' element={<ScrollToTop><Verify /></ScrollToTop>} />
          <Route path='/collections' element={<ScrollToTop><CollectionsPage /></ScrollToTop>} />
          <Route path='/collections/:id/details' element={<ScrollToTop><CollectionDetailsPage /></ScrollToTop>} />
          <Route path='/collaborators' element={<ScrollToTop><Collaborators /></ScrollToTop>} />
          <Route path='/collaborators/:id/details' element={<ScrollToTop><CollaboratorDetails /></ScrollToTop>} />
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

