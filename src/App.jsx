import { useContext, useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Common/Navbar Section/Navbar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from "@hooks/useNavigate";

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
import { Helmet } from 'react-helmet-async';
import { removeUser } from './Components/Common/redux/productSlice';
import ErrorPage from './Components/Common/ErrorPage';
import AuthContext from './Components/Common/authContext';
import Publishers from './Components/Collaborators/Publishers Page/Publishers';
import NewPassword from './Components/Auth Pages/New Password/NewPassword';
import ForgotPassword from './Components/Auth Pages/Forgot Password/ForgotPassword';
import PublisherDetails from './Components/Collaborators/Publisher DetailsPage/PublisherDetails';
import ResendVerify from './Components/Auth Pages/Verfiy Email/ResendVerify';
import AddCartPopup from './Components/Common Components/Add To Cart Popup/AddCartPopup';
import CategoriesPage from './pages/CategoriesPage';
import SubCategoriesPage from './pages/SubCategoriesPage';
import SubSubCategoriesPage from './pages/SubSubCategoriesPage';
import BestSellersPage from './Components/Best Sellers Page/BestSellersPage';
import NouveautesPage from './Components/Nouveautes Page/NouveautesPage';
import AffiliateProgram from './Components/Affiliate Program/AffiliateProgram';
import AffiliateProgramDetails from './Components/Affiliate Program/AffiliateProgramDetails';



const SEO_ROUTE_SECTION_MAP = [
  { test: (pathname) => pathname === '/' || pathname === '/main', sectionId: 27 },
  { test: (pathname) => pathname.startsWith('/main/products') || pathname.startsWith('/main/productdetails') || pathname.startsWith('/products'), sectionId: 30 },
  { test: (pathname) => pathname.startsWith('/bestsellers'), sectionId: 49 },
  { test: (pathname) => pathname.startsWith('/nouveautes'), sectionId: 48 },
  { test: (pathname) => pathname.startsWith('/main/events') || pathname.startsWith('/events') || pathname.startsWith('/eventdetails'), sectionId: 29 },
  { test: (pathname) => pathname.startsWith('/main/about') || pathname.startsWith('/about-us'), sectionId: 28 },
  { test: (pathname) => pathname.startsWith('/main/contact') || pathname.startsWith('/contactus'), sectionId: 31 },
  { test: (pathname) => pathname.startsWith('/blogs') || pathname.startsWith('/blogdetails') || pathname.startsWith('/add-blog') || pathname.startsWith('/edit-blog'), sectionId: 8 },
  { test: (pathname) => pathname.startsWith('/main/collections') || pathname.startsWith('/collections') || pathname.startsWith('/collection-details'), sectionId: 26 },
  { test: (pathname) => pathname.startsWith('/main/collaborators') || pathname.startsWith('/main/brands') || pathname.startsWith('/collaborators') || pathname.startsWith('/collaborator') || pathname.startsWith('/brands'), sectionId: 56 },
  { test: (pathname) => pathname.startsWith('/main/cart') || pathname.startsWith('/cart'), sectionId: 11 },
  { test: (pathname) => pathname.startsWith('/main/checkout') || pathname.startsWith('/main/checkout-completed') || pathname.startsWith('/checkout') || pathname.startsWith('/order-success'), sectionId: 12 },
  { test: (pathname) => pathname.startsWith('/main/wishlist') || pathname.startsWith('/wishlist'), sectionId: 55 },
  { test: (pathname) => pathname.startsWith('/compare'), sectionId: 14 },
  { test: (pathname) => pathname.startsWith('/account') || pathname.startsWith('/my-documents') || pathname.startsWith('/affiliate') || pathname.startsWith('/refund_return') || pathname.startsWith('/add_refund_return'), sectionId: 15 },
  { test: (pathname) => pathname.startsWith('/ordertracking') || pathname.startsWith('/followorder') || pathname.startsWith('/review') || pathname.startsWith('/track-order'), sectionId: 16 },
  { test: (pathname) => pathname.startsWith('/main/policies') || pathname.startsWith('/legal-information'), sectionId: 57 },
  { test: (pathname) => pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forget-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/verify-email') || pathname.startsWith('/resend-verify-email'), sectionId: 18 },
];

function App() {
  const authCtx = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false);
  const [cartisOpen, setCartIsOpen] = useState(false);
  const user = useSelector((state) => state.products.userInfo);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const path = location.pathname;
  const [isAuthPages, setIsAuthPages] = useState(false);
  const [withBG, setWithBG] = useState(false);
  const [pageMetaData, setPageMetaData] = useState({});

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

  
 const normalizeMetaValue = (value) => (typeof value === 'string' ? value.trim() : '');

 const getSectionIdForPath = (pathname) => {
  const matchedRoute = SEO_ROUTE_SECTION_MAP.find((route) => route.test(pathname));
  return matchedRoute?.sectionId ?? null;
 };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const cartToggle = () => {
    if (!cartisOpen) {
      authCtx.fetchfavandcartSettings();
    }
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
      path === '/verify-email' ||
      path === '/resend-verify-email'
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
      await axios.get(`${import.meta.env.VITE_TESTING_API}/logout`, { headers });
  
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

  
 useEffect(() => {
  const sectionId = getSectionIdForPath(path);

  if (!sectionId) {
    setPageMetaData({});
    return;
  }

  let isMounted = true;

  const fetchMetaData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/seo-meta?ecom_type=sofiaco&section_id=${sectionId}`);
      if (isMounted) {
        setPageMetaData(response?.data?.data?.[0] || {});
        console.log('Fetched meta data:', response?.data?.data?.[0]);
      }
    } catch (error) {
      if (isMounted) {
        setPageMetaData({});
      }
      console.error('Error fetching meta data:', error);
    }
  };

  fetchMetaData();

  return () => {
    isMounted = false;
  };
 }, [path]);

 const metaTitle = normalizeMetaValue(pageMetaData?.meta_title);
 const metaDescription = normalizeMetaValue(pageMetaData?.meta_description);
 const keyword = normalizeMetaValue(pageMetaData?.keyword);
 const secondaryKeyword = normalizeMetaValue(pageMetaData?.secondary_keyword);
 const longTrainText = normalizeMetaValue(pageMetaData?.long_train_text);

  return (
    <div className={withBG ? 'App1' : 'App'}>
      <Helmet>
        {metaTitle && <title>{metaTitle}</title>}
        {metaDescription && <meta name="description" content={metaDescription} />}
        {keyword && <meta name="keyword" content={keyword} />}
        {secondaryKeyword && <meta name="secondary_keyword" content={secondaryKeyword} />}
        {longTrainText && <meta name="long_train_text" content={longTrainText} />}
      </Helmet>
      {!isAuthPages && <Navbar toggle={toggle} cartToggle={cartToggle} />}
      <CartSidebar isOpen={cartisOpen} toggle={cartToggle} />
      <SideBar isOpen={isOpen} toggle={toggle} />
      <AddCartPopup />
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route
            path="/main"
            element={
              <ScrollToTop>
                <HomePage cartToggle={cartToggle} />
              </ScrollToTop>
            }
          />
          <Route path="/main/about" element={<ScrollToTop><About /></ScrollToTop>} />
          <Route path="/main/events" element={<ScrollToTop><Events /></ScrollToTop>} />
          <Route path="/main/events/:id/event-details" element={<ScrollToTop><EventsDetails /></ScrollToTop>} />
          <Route path="/register" element={<ScrollToTop><Register /></ScrollToTop>} />
          <Route path="/login" element={<ScrollToTop><Login /></ScrollToTop>} />
          <Route path="/verify-email" element={<ScrollToTop><Verify /></ScrollToTop>} />
          <Route path="/resend-verify-email" element={<ScrollToTop><ResendVerify /></ScrollToTop>} />
          <Route path='/forget-password' element={<ScrollToTop><ForgotPassword/></ScrollToTop>} />
          <Route path='/reset-password' element={<ScrollToTop><NewPassword/></ScrollToTop>} />
          <Route path="/main/brands" element={<ScrollToTop><Publishers /></ScrollToTop>} />
          <Route path="/main/brands/:id/details" element={<ScrollToTop><PublisherDetails /></ScrollToTop>} />
          <Route path="/main/collaborators" element={<ScrollToTop><Collaborators /></ScrollToTop>} />
          <Route path="/main/collaborators/:id/details" element={<ScrollToTop><CollaboratorDetails /></ScrollToTop>} />
          <Route path="/main/wishlist" element={<ScrollToTop><Favorite /></ScrollToTop>} />
          <Route path="/main/cart" element={<ScrollToTop><Cart /></ScrollToTop>} />
          <Route path="/main/checkout" element={<ScrollToTop><CheckOut /></ScrollToTop>} />
          <Route path="/checkout" element={<Navigate to="/main/checkout" replace />} />
          <Route path="/main/checkout-completed/:id" element={<ScrollToTop><CompletedOrder /></ScrollToTop>} />
          <Route path="/main/contact" element={<ScrollToTop><ContactUs/></ScrollToTop>} />
          <Route path="/main/products" element={<ScrollToTop><BooksPage /></ScrollToTop>} />
          <Route path="/main/products/subcategory/:id" element={<ScrollToTop><BooksPage /></ScrollToTop>} />
          <Route path="/main/productdetails/:id" element={<ScrollToTop><BookDetailsPage cartToggle={cartToggle} /></ScrollToTop>} />
          <Route path="/main/productdetails/:id/:token" element={<ScrollToTop><BookDetailsPage cartToggle={cartToggle} /></ScrollToTop>} />
          <Route path='/bestsellers' element={<ScrollToTop><BestSellersPage /></ScrollToTop>} />
          <Route path='/nouveautes' element={<ScrollToTop><NouveautesPage /></ScrollToTop>} />
          <Route path="/main/cp/:catname/:catId" element={<ScrollToTop><CategoriesPage /></ScrollToTop>} />
          <Route path="/main/cp/:catname/:subcatname/:id" element={<ScrollToTop><SubCategoriesPage /></ScrollToTop>} />
          <Route path="/main/cp/:catname/:subcatname/:subsubcatname/:id" element={<ScrollToTop><SubSubCategoriesPage /></ScrollToTop>} />
          <Route path="/account/:pageId/*" element={user ? <ScrollToTop><AccountPage /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path='/affiliate/:id' element={user ? <ScrollToTop><AffiliateProgram /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path='/affiliate/:id/details/:programId' element={user ? <ScrollToTop><AffiliateProgramDetails /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path="/my-documents/:pageId" element={user ? <ScrollToTop><MyDocumentsPage /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path="/main/policies" element={<ScrollToTop><Mentions /></ScrollToTop>} />
          <Route path='/order-success' element={<ScrollToTop><SuccessPage/></ScrollToTop>} /> 
          <Route path="*" element={<ErrorPage />} />       
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
