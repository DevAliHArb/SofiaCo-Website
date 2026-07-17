import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Common/Navbar Section/Navbar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from "@hooks/useNavigate";

import { ToastContainer } from 'react-toastify';
import Footer from './Components/Common/Footer Section/Footer';
import { useDispatch, useSelector } from 'react-redux';
import ScrollToTop from './Components/Common/ScrollToTop';
import SideBar from './Components/Common/SideBarSection/SideBar';
import CartSidebar from './Components/Common/Cart SideBar/CartSidebar';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { removeUser } from './Components/Common/redux/productSlice';
import ErrorPage from './Components/Common/ErrorPage';
import AuthContext from './Components/Common/authContext';
import AddCartPopup from './Components/Common Components/Add To Cart Popup/AddCartPopup';

// ---------------------------------------------------------------------------
// Route-level code splitting — each page's JS loads only when first visited.
// Keeps the initial bundle small so prerendered/mobile pages don't have to
// parse the whole app before showing anything.
// ---------------------------------------------------------------------------
const HomePage              = lazy(() => import('./Components/Home Page/HomePage'));
const About                 = lazy(() => import('./Components/About Page/About'));
const Events                = lazy(() => import('./Components/Events/Events Page/Events'));
const EventsDetails         = lazy(() => import('./Components/Events/Events Details Page/EventsDetails'));
const Register              = lazy(() => import('./Components/Auth Pages/Register Page/Register'));
const Login                 = lazy(() => import('./Components/Auth Pages/Login Page/Login'));
const Verify                = lazy(() => import('./Components/Auth Pages/Verfiy Email/Verify'));
const Collaborators         = lazy(() => import('./Components/Collaborators/Collaborators Page/Collaborators'));
const CollaboratorDetails   = lazy(() => import('./Components/Collaborators/Collaborator Details Page/CollaboratorDetails'));
const Cart                  = lazy(() => import('./Components/Cart Page/Cart'));
const CheckOut              = lazy(() => import('./Components/CheckOut Page/CheckOut'));
const CompletedOrder        = lazy(() => import('./Components/CheckOut Page/CheckOut Summary/CompletedOrder'));
const BooksPage             = lazy(() => import('./Components/Books page/BooksPage'));
const BookDetailsPage       = lazy(() => import('./Components/Book Details Page/BookDetailsPage'));
const Favorite               = lazy(() => import('./Components/Favorite Page/Favorite'));
const AccountPage           = lazy(() => import('./Components/Account Page/AccountPage'));
const Mentions               = lazy(() => import('./Components/Mentions Légales/Mentions'));
const MyDocumentsPage       = lazy(() => import('./Components/My Documents/MyDocumentsPage'));
const ContactUs              = lazy(() => import('./Components/ContactUs/ContactUs'));
const SuccessPage            = lazy(() => import('./Components/CheckOut Page/SuccessPage'));
const Publishers             = lazy(() => import('./Components/Collaborators/Publishers Page/Publishers'));
const NewPassword            = lazy(() => import('./Components/Auth Pages/New Password/NewPassword'));
const ForgotPassword         = lazy(() => import('./Components/Auth Pages/Forgot Password/ForgotPassword'));
const PublisherDetails       = lazy(() => import('./Components/Collaborators/Publisher DetailsPage/PublisherDetails'));
const ResendVerify           = lazy(() => import('./Components/Auth Pages/Verfiy Email/ResendVerify'));
const CategoriesPage         = lazy(() => import('./pages/CategoriesPage'));
const SubCategoriesPage      = lazy(() => import('./pages/SubCategoriesPage'));
const SubSubCategoriesPage   = lazy(() => import('./pages/SubSubCategoriesPage'));
const BestSellersPage        = lazy(() => import('./Components/Best Sellers Page/BestSellersPage'));
const NouveautesPage         = lazy(() => import('./Components/Nouveautes Page/NouveautesPage'));
const AffiliateProgram       = lazy(() => import('./Components/Affiliate Program/AffiliateProgram'));
const AffiliateProgramDetails = lazy(() => import('./Components/Affiliate Program/AffiliateProgramDetails'));
const BlogPage                = lazy(() => import('./Components/Blogs Page/Blogs Page/BlogPage'));
const BlogDetails             = lazy(() => import('./Components/Blogs Page/Blog Details/BlogDetails'));
const AddBlog                 = lazy(() => import('./Components/Blogs Page/Add Blog/AddBlog'));
const EditBlog                 = lazy(() => import('./Components/Blogs Page/Edit Blog/EditBlog'));

// Shown while a lazy route chunk is downloading
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    Chargement…
  </div>
);

const NOINDEX_PATHS = [
  '/main/cart', '/main/checkout', '/main/checkout-completed', '/account',
  '/my-documents', '/affiliate', '/login', '/register', '/forget-password',
  '/reset-password', '/verification', '/verify-email', '/resend-verify-email',
  '/main/wishlist', '/order-success', '/main/add-blog', '/main/edit-blog',
];

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sofiaco',
  url: 'https://sofiaco.fr',
  logo: { '@type': 'ImageObject', url: 'https://sofiaco.fr/favicon.svg' },
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sofiaco',
  url: 'https://sofiaco.fr',
};

const SEO_ROUTE_SECTION_MAP = [
  { test: (pathname) => pathname === '/' || pathname === '/main', sectionId: 27 },
  { test: (pathname) => pathname.startsWith('/main/products') || pathname.startsWith('/cp/') || pathname.startsWith('/products'), sectionId: 30 },
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

 const canonicalPath = path.replace(/\/+$/, '') || '/';
 const isNoIndex = NOINDEX_PATHS.some((p) => path.startsWith(p));
 const isHome = path === '/' || path === '/main';

  return (
    <div className={withBG ? 'App1' : 'App'}>
      <Helmet>
        <html lang="fr" />
        {metaTitle && <title>{metaTitle}</title>}
        {metaDescription && <meta name="description" content={metaDescription} />}
        {keyword && <meta name="keyword" content={keyword} />}
        {secondaryKeyword && <meta name="secondary_keyword" content={secondaryKeyword} />}
        {longTrainText && <meta name="long_train_text" content={longTrainText} />}
        <link rel="canonical" href={`https://sofiaco.fr${canonicalPath}`} />
        <meta property="og:site_name" content="Sofiaco" />
        <meta property="og:locale" content="fr_FR" />
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {metaDescription && <meta property="og:description" content={metaDescription} />}
        <meta property="og:url" content={`https://sofiaco.fr${canonicalPath}`} />
        {isNoIndex && <meta name="robots" content="noindex,nofollow" />}
        {isHome && (
          <script type="application/ld+json">
            {JSON.stringify([ORG_JSON_LD, WEBSITE_JSON_LD])}
          </script>
        )}
      </Helmet>
      {!isAuthPages && <Navbar toggle={toggle} cartToggle={cartToggle} />}
      <CartSidebar isOpen={cartisOpen} toggle={cartToggle} />
      <SideBar isOpen={isOpen} toggle={toggle} />
      <AddCartPopup />
      <div>
        <Suspense fallback={<PageLoader />}>
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
          <Route path="/cp/:catname/:subcatname/:subsubcatname/:productname/:id" element={<ScrollToTop><BookDetailsPage cartToggle={cartToggle} /></ScrollToTop>} />
          <Route path="/cp/:catname/:subcatname/:subsubcatname/:productname/:id/:token" element={<ScrollToTop><BookDetailsPage cartToggle={cartToggle} /></ScrollToTop>} />
          <Route path='/bestsellers' element={<ScrollToTop><BestSellersPage /></ScrollToTop>} />
          <Route path='/nouveautes' element={<ScrollToTop><NouveautesPage /></ScrollToTop>} />
          <Route path='/main/blogs' element={<ScrollToTop><BlogPage /></ScrollToTop>} />
          <Route path='/main/blogdetails/:blogId' element={<ScrollToTop><BlogDetails /></ScrollToTop>} />
          <Route path='/main/add-blog' element={user ? <ScrollToTop><AddBlog /></ScrollToTop> : <Navigate to="/login" replace />} />
          <Route path='/main/edit-blog/:blogId' element={user ? <ScrollToTop><EditBlog /></ScrollToTop> : <Navigate to="/login" replace />} />
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
        </Suspense>
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
