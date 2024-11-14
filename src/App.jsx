import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Common/Navbar Section/Navbar';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import HomePage from './Components/Home Page/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop';
import SideBar from './Components/Common/SideBarSection/SideBar';
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
import CartSidebar from './Components/Common/Cart SideBar/CartSidebar';
import Cart from './Components/Cart Page/Cart';
import CheckOut from './Components/CheckOut Page/CheckOut';
import CompletedOrder from './Components/CheckOut Page/CheckOut Summary/CompletedOrder';
import BooksPage from './Components/Books page/BooksPage';
import BookDetailsPage from './Components/Book Details Page/BookDetailsPage';
import Favorite from './Components/Favorite Page/Favorite';
import AccountPage from './Components/Account Page/AccountPage';
import Mentions from './Components/Mentions Légales/Mentions';
import MyDocumentsPage from './Components/My Documents/MyDocumentsPage';
import ContactUs from './Components/ContactUs/ContactUs';
import SuccessPage from './Components/CheckOut Page/SuccessPage';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { removeUser } from './Components/Common/redux/productSlice';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartisOpen, setCartIsOpen] = useState(false);
  const user = useSelector((state) => state.products.userInfo);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const path = location.pathname;
  const [isAuthPages, setIsAuthPages] = useState(false);
  const [withBG, setWithBG] = useState(false);

  useEffect(() => {
    // console.log('Current path:', path);
  
    const accountDetailsRegex = /^\/account\/\w+/;
    // console.log('Regex test result:', accountDetailsRegex.test(path));
  
    if (accountDetailsRegex.test(path)) {
      setWithBG(true);
    } else {
      setWithBG(false);
    }
  }, [path]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const cartToggle = () => {
    if (user) {
      setCartIsOpen(!cartisOpen);
    }
  };

  useEffect(() => {
    // Check if path is an authentication page
    if (
      path === '/login' ||
      path === '/register' ||
      path === '/forget-password' ||
      path.startsWith('/reset-password') ||
      path === '/verification' ||
      path === '/verify-email'
    ) {
      setIsAuthPages(true);
    } else {
      setIsAuthPages(false);
    }
  }, [path]);

  const logout = async () => {
    // console.log('ok')
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
  
      // If token is not available, there's no need to logout
      if (!token) {
        return;
      }
  
      // Set up headers with the token
      const headers = {
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      };
  
      // Send a POST request to the logout endpoint
      await axios.get(`${import.meta.env.VITE_TESTING_API}/api/bookshop/logout`, { headers });
  
      // Remove the token from local storage after successful logout
      localStorage.removeItem('token');
  
      dispatch(removeUser()) ;
      navigate(`/login`);
      // Add any additional logic you may need, such as redirecting the user to the login page or updating the application state
    } catch (error) {
      // console.error('Error logging out:', error);
      // Handle any errors that occur during logout
    }
  };
  // useEffect(()=>{
  //   if (user && !user?.accepted) {
  //     logout()
  //   }
  // },[user])

  return (
    <div className={withBG ? 'App1' : 'App'}>
      {!isAuthPages && <Navbar toggle={toggle} cartToggle={cartToggle} />}
      <CartSidebar isOpen={cartisOpen} toggle={cartToggle} />
      <SideBar isOpen={isOpen} toggle={toggle} />
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ScrollToTop>
                <HomePage cartToggle={cartToggle} />
              </ScrollToTop>
            }
          />
          <Route path="/about" element={<ScrollToTop><About /></ScrollToTop>} />
          <Route path="/events" element={<ScrollToTop><Events /></ScrollToTop>} />
          <Route path="/events/:id/event-details" element={<ScrollToTop><EventsDetails /></ScrollToTop>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<ScrollToTop><Register /></ScrollToTop>} />
          <Route path="/login" element={<ScrollToTop><Login /></ScrollToTop>} />
          <Route path="/verify-email" element={<ScrollToTop><Verify /></ScrollToTop>} />
          <Route path="/collections" element={<ScrollToTop><CollectionsPage /></ScrollToTop>} />
          <Route path="/collections/:id/details" element={<ScrollToTop><CollectionDetailsPage /></ScrollToTop>} />
          <Route path="/collaborators" element={<ScrollToTop><Collaborators /></ScrollToTop>} />
          <Route path="/collaborators/:id/details" element={<ScrollToTop><CollaboratorDetails /></ScrollToTop>} />
          <Route path="/wishlist" element={<ScrollToTop><Favorite /></ScrollToTop>} />
          <Route path="/cart" element={<ScrollToTop><Cart /></ScrollToTop>} />
          <Route path="/checkout" element={<ScrollToTop><CheckOut /></ScrollToTop>} />
          <Route path="/checkout-completed/:id" element={<ScrollToTop><CompletedOrder /></ScrollToTop>} />
          <Route path="/contact" element={<ScrollToTop><ContactUs/></ScrollToTop>} />
          <Route path="/books" element={<ScrollToTop><BooksPage /></ScrollToTop>} />
          <Route path="/bookdetails/:id" element={<ScrollToTop><BookDetailsPage cartToggle={cartToggle} /></ScrollToTop>} />
          <Route path="/account/:pageId/*" element={user ? <ScrollToTop><AccountPage /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path="/my-documents/:pageId" element={user ? <ScrollToTop><MyDocumentsPage /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path="/policies" element={<ScrollToTop><Mentions /></ScrollToTop>} />
          <Route path='/order-success' element={<ScrollToTop><SuccessPage/></ScrollToTop>} />        
          </Routes>
      </div>
      {!isAuthPages && <Footer />}
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
        style={{ color: 'red' }}
      />
    </div>
  );
}

export default App;
