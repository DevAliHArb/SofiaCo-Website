import React, { useContext, useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import logo from "../../../assets/navbar/logo.svg";
import moblogo from "../../../assets/navbar/moblogo.svg";
import ProAccess from "../../../assets/ProAccess.png";
import ProAccessLogo from "../../../assets/ProAccessLogo.png";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCartOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../authContext";
import { Avatar, Box, FormControl, IconButton, Menu, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { changeCurrency, changeLanguage, removeUser } from "../redux/productSlice";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";


const Navbar = (props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;
  const [withBG, setwithBG] = useState(false);
  const productData = useSelector((state) => state.products.productData);
  const favoriteData = useSelector((state) => state.products.favorites);
  const compareData = useSelector((state) => state.products.compare);
  const userInfo = useSelector((state) => state.products.userInfo);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const handleChangeCurrency = async (event) => {
    const cur = event.target.value;
    dispatch(changeCurrency({ currency: cur }));
    try {
      await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
        { currency: cur },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  };

  const handleChangeLanguage = async (event) => {
    const lan = event.target.value;
    dispatch(changeLanguage({ Language: lan }));
    try {
      await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
        { language: lan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };
  const logout = async () => {
    console.log('ok')
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
      await axios.get('https://api.leonardo-service.com/api/bookshop/logout', { headers });
  
      // Remove the token from local storage after successful logout
      localStorage.removeItem('token');
  
      dispatch(removeUser()) ;
      navigate(`/login`);
      // Add any additional logic you may need, such as redirecting the user to the login page or updating the application state
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any errors that occur during logout
    }
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY > 120;
      if (isTop !== isScrolled) {
        setIsScrolled(isTop);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  useEffect(() => {
    const collaboratorDetailsRegex = /^\/collaborators\/[^/]+\/details$/;
    const collectionDetailsRegex = /^\/collections\/[^/]+\/details$/;
    const bookDetailsRegex = /^\/bookdetails\/[^/]+$/;
  
    if (path === "/collaborators" || path === "/books" || path ==="/policies" || collaboratorDetailsRegex.test(path) || collectionDetailsRegex.test(path) || bookDetailsRegex.test(path)) {
      setwithBG(true)
    } else { setwithBG(false) }
  }, [path])

  return (
    <>
      <div className={classes.headnav} >
        <div className={classes.header} style={{backgroundColor: withBG ? '#fff': 'transparent'}}>
          <div className={classes.logocontainer}
              onClick={()=>navigate(`/`)}>
            <img
              src={logo}
              alt="logodark"
              style={{ width: "70%", margin: "auto 0", height: "96%", }}
            />
          </div>
          <div className={classes.headercontent}>
            <div className={classes.header_top}>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> <MdOutlineMail style={{width:'1.5em', height:'1.5em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/>{authCtx.companySettings?.email}</p>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/>{authCtx.companySettings?.phone}</p>
              </div>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> {language === 'eng' ? "Jusqu'à 50 % de réduction sur les articles_en" : "Jusqu'à 50 % de réduction sur les articles"} <FaArrowRightLong style={{width:'1.3em', height:'1.3em', margin:'auto auto auto 0.5em', color:'var(--secondary-color)'}}/></p>
              </div>
              <div className={classes.header_top_content1}>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiTruck style={{width:'1em', height:'1em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/> {language === 'eng' ? "Suivre votre commande_en" : "Suivre votre commande"}</p>

                <p className={classes.long_line}></p>
                <div className={classes.select}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 50, width: 65, border: "none" }}
                    size="small"
                  >
                    <Select
                      style={{
                        fontSize: "calc(.7rem + 0.4vw)",
                      }}
                      disableUnderline
                      displayEmpty
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={language}
                      onChange={handleChangeLanguage}
                      sx={{
                        //   fontSize:'calc(0.6rem + 0.3vw)',
                        color: "var(--accent-color) !imortant",
                        fontFamily: "var(--font-family)",
                        fontStyle: "normal",
                        margin: "0",
                        textAlign: "center",
                        //   color:'#fff',
                        "&:focus-within": {
                          backgroundColor: "transparent", // Remove background color when an option is selected
                        },
                        "&:focus": {
                          backgroundColor: "transparent", // Add transparent background on focus
                        },
                        "& svg": {
                          margin: "auto",
                          marginTop: "-0.1em",
                          // color: '',
                          color: "var(--accent-color) !important", // Change the color of the arrow
                        },
                      }}
                    >
                      <MenuItem value="eng">ENG</MenuItem>
                      <MenuItem value="fr">FR</MenuItem>
                      {/* <MenuItem value='ar'>Ar</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                <p className={classes.long_line}></p>
                <div className={classes.select}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 0, width: 47 }}
                    size="small"
                  >
                    <Select
                      style={{
                        fontSize: "calc(.7rem + 0.4vw)",
                      }}
                      disableUnderline
                      displayEmpty
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={currency}
                      onChange={handleChangeCurrency}
                      sx={{
                        //   fontSize:'calc(0.6rem + 0.3vw)',
                        color: "var(--accent-color) !imortant",
                        fontFamily: "var(--font-family)",
                        fontStyle: "normal",
                        margin: "auto",
                        textAlign: "center",
                        //   color:'#fff',
                        "&:focus-within": {
                          backgroundColor: "transparent", // Remove background color when an option is selected
                        },
                        "&:focus": {
                          backgroundColor: "transparent", // Add transparent background on focus
                        },
                        "& svg": {
                          margin: "auto",
                          marginTop: "-0.1em",
                          // color: '',
                          color: "var(--accent-color) !important", // Change the color of the arrow
                        },
                      }}
                    >
                      <MenuItem value="eur">EUR</MenuItem>
                      <MenuItem value="usd">USD</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className={classes.navlinks}>
              <p onClick={() => navigate(`/books`)}>
                {language === 'eng' ? 'Books' : 'Livres'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'Jouets_en' : 'Jouets'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'parfum_en' : 'parfum'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'vetements_en' : 'vetements'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'tapis de priere_en' : 'tapis de priere'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'Nos éditeurs_en' : 'Nos éditeurs'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'AGENDA_en' : 'AGENDA'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'nos services_en' : 'nos services'}
              </p>
              <div className={classes.icons}>
                <div style={{position:'relative',cursor:'pointer'}} onClick={()=>navigate(`/favorites`)}>
                <MdFavoriteBorder className={classes.icon} />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative',cursor:'pointer'}} onClick={()=>props.cartToggle()}>
                <IoCartOutline className={classes.icon}/>
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={language === 'eng' ? "Profile" : "Profil"}>
                    <div onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {userInfo?.id ? 
                      <Avatar alt={userInfo.first_name} src={`https://api.leonardo-service.com/img/${userInfo.image}`} style={{borderRadius:'50%',width:'1.6em', height:'1.6em', marginTop:'-0.15em'}} className={classes.icon}/>
                      : 
                      <LuUser className={classes.icon} />
                    }
                    </div>
                  </Tooltip>
                  
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                   { userInfo?.id  ? 
                   <>
                   <MenuItem key={1} onClick={()=>{ navigate(`/account/profile`); handleCloseUserMenu()}} >
                     <Typography textAlign="center">{language === 'eng' ? "Profile" : "Profil"}</Typography>
                   </MenuItem>
                   <MenuItem key={2} onClick={()=>{ navigate(`/ordertracking`); handleCloseUserMenu()}} >
                     <Typography textAlign="center">{language === 'eng' ? "Orders Tracking" : "Suivi des Commandes"}</Typography>
                   </MenuItem>
                   <MenuItem key={3} onClick={()=>{ navigate(`/my-documents/proforma`); handleCloseUserMenu()}} >
                     <Typography textAlign="center">{language === 'eng' ? "My Documents" : "My Documents_fr"}</Typography>
                   </MenuItem>
                   <MenuItem key={4} onClick={()=>{handleCloseUserMenu() ; logout()}} >
                        <Typography textAlign="center">{language === 'eng' ? "Logout" : "Se Déconnecter"} </Typography>
                      </MenuItem>
                   </>
                      :
                      <>
                      <MenuItem key={1} onClick={()=>handleCloseUserMenu() & navigate(`/login`)} >
                        <Typography textAlign="center">{language === 'eng' ? "Login" : "Se Connecter"}</Typography>
                      </MenuItem>
                      <MenuItem key={2} onClick={()=>handleCloseUserMenu() & navigate(`/register`)} >
                        <Typography textAlign="center">{language === 'eng' ? "Register" : "Registre"}</Typography>
                      </MenuItem>
                      </>
                      }
                  </Menu>
                </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.headnavfixed} style={{display: isScrolled ? 'flex' : 'none'}}>
        <div className={classes.header}>
          <div className={classes.logocontainer}
              onClick={()=>navigate(`/`)}>
            <img
              src={logo}
              alt="logodark"
              style={{ width: "70%", margin: "auto 0", height: "auto" }}
            />
          </div>
          <div className={classes.headercontent}>
            <div className={classes.header_top}>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> <MdOutlineMail style={{width:'1.5em', height:'1.5em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/>{authCtx.companySettings?.email}</p>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/>{authCtx.companySettings?.phone}</p>
              </div>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> {language === 'eng' ? "Jusqu'à 50 % de réduction sur les articles_en" : "Jusqu'à 50 % de réduction sur les articles"} <FaArrowRightLong style={{width:'1.3em', height:'1.3em', margin:'auto auto auto 0.5em', color:'var(--secondary-color)'}}/></p>
              </div>
              <div className={classes.header_top_content1}>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiTruck style={{width:'1em', height:'1em', margin:'auto 0.5em auto auto', color:'var(--secondary-color)'}}/> {language === 'eng' ? "Suivre votre commande_en" : "Suivre votre commande"}</p>

                <p className={classes.long_line}></p>
                <div className={classes.select}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 50, width: 65, border: "none" }}
                    size="small"
                  >
                    <Select
                      style={{
                        fontSize: "calc(.7rem + 0.4vw)",
                      }}
                      disableUnderline
                      displayEmpty
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={language}
                      onChange={handleChangeLanguage}
                      sx={{
                        //   fontSize:'calc(0.6rem + 0.3vw)',
                        color: "var(--accent-color) !imortant",
                        fontFamily: "var(--font-family)",
                        fontStyle: "normal",
                        margin: "0",
                        textAlign: "center",
                        //   color:'#fff',
                        "&:focus-within": {
                          backgroundColor: "transparent", // Remove background color when an option is selected
                        },
                        "&:focus": {
                          backgroundColor: "transparent", // Add transparent background on focus
                        },
                        "& svg": {
                          margin: "auto",
                          marginTop: "-0.1em",
                          // color: '',
                          color: "var(--accent-color) !important", // Change the color of the arrow
                        },
                      }}
                    >
                      <MenuItem value="eng">ENG</MenuItem>
                      <MenuItem value="fr">FR</MenuItem>
                      {/* <MenuItem value='ar'>Ar</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                <p className={classes.long_line}></p>
                <div className={classes.select}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 0, width: 47 }}
                    size="small"
                  >
                    <Select
                      style={{
                        fontSize: "calc(.7rem + 0.4vw)",
                      }}
                      disableUnderline
                      displayEmpty
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={currency}
                      onChange={handleChangeCurrency}
                      sx={{
                        //   fontSize:'calc(0.6rem + 0.3vw)',
                        color: "var(--accent-color) !imortant",
                        fontFamily: "var(--font-family)",
                        fontStyle: "normal",
                        margin: "auto",
                        textAlign: "center",
                        //   color:'#fff',
                        "&:focus-within": {
                          backgroundColor: "transparent", // Remove background color when an option is selected
                        },
                        "&:focus": {
                          backgroundColor: "transparent", // Add transparent background on focus
                        },
                        "& svg": {
                          margin: "auto",
                          marginTop: "-0.1em",
                          // color: '',
                          color: "var(--accent-color) !important", // Change the color of the arrow
                        },
                      }}
                    >
                      <MenuItem value="eur">EUR</MenuItem>
                      <MenuItem value="usd">USD</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className={classes.navlinks}>
              <p onClick={() => navigate(`/books`)}>
                {language === 'eng' ? 'Books' : 'Livres'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'Jouets_en' : 'Jouets'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'parfum_en' : 'parfum'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'vetements_en' : 'vetements'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'tapis de priere_en' : 'tapis de priere'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'Nos éditeurs_en' : 'Nos éditeurs'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'AGENDA_en' : 'AGENDA'}
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                {language === 'eng' ? 'nos services_en' : 'nos services'}
              </p>
              <div className={classes.icons}>
                <div style={{position:'relative', cursor:'pointer'}} onClick={()=>navigate(`/favorites`)}>
                <MdFavoriteBorder className={classes.icon} />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative', cursor:'pointer'}} onClick={()=>props.cartToggle()}>
                <IoCartOutline className={classes.icon}/>
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={language === 'eng' ? "Profile" : "Profil"}>
                    <div onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {userInfo?.id ? 
                      <Avatar alt={userInfo.first_name} src={`https://api.leonardo-service.com/img/${userInfo.image}`} style={{borderRadius:'50%',width:'1.6em', height:'1.6em', marginTop:'-0.15em'}} className={classes.icon}/>
                      : 
                      <LuUser className={classes.icon} />
                    }
                    </div>
                  </Tooltip>
                </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.mobile} style={{backgroundColor: withBG ? '#fff': 'transparent'}}>
      <div className={classes.logocontainer1}
              onClick={()=>navigate(`/`)}>
            <img
              src={moblogo}
              alt="logodark"
              style={{ width: "100%", margin: "auto 0", height: "auto" }}
            />
          </div>
          <div className={classes.icons}>
                <div style={{position:'relative', cursor:'pointer'}}>
                <MdFavoriteBorder className={classes.icon} />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.2em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative', cursor:'pointer'}} onClick={()=>props.cartToggle()}>
                <IoCartOutline className={classes.icon}/>
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.2em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={language === 'eng' ? "Profile" : "Profil"}>
                    <div onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {userInfo?.id ? 
                      <Avatar alt={userInfo.first_name} src={`https://api.leonardo-service.com/img/${userInfo.image}`} style={{borderRadius:'50%',width:'1.6em', height:'1.6em', marginTop:'-0.15em'}} className={classes.icon}/>
                      : 
                      <LuUser className={classes.icon} />
                    }
                    </div>
                  </Tooltip>
                </Box>
                </div>
                <div style={{position:'relative'}}>
                <MenuIcon style={{ fontSize: "3em", width:'0.8em', height:'0.8em', marginTop:'-0.1em' }} onClick={()=>props.toggle()}/>
                </div>
              </div>
      </div>
      <div className={classes.mobilefixed} style={{display: isScrolled ? 'flex' : 'none'}}>
      <div className={classes.mobfixedcontent}>
      <div className={classes.logocontainer1}
              onClick={()=>navigate(`/`)}>
            <img
              src={moblogo}
              alt="logodark"
              style={{ width: "100%", margin: "auto 0", height: "auto" }}
            />
          </div>
          <div className={classes.icons}>
                <div style={{position:'relative', cursor:'pointer'}} onClick={()=>navigate(`/favorites`)}>
                <MdFavoriteBorder className={classes.icon}  />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.2em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative', cursor:'pointer'}} onClick={()=>props.cartToggle()}>
                <IoCartOutline className={classes.icon}/>
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.2em', position:'absolute',borderRadius:'5px', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.1em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={language === 'eng' ? "Profile" : "Profil"}>
                    <div onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {userInfo?.id ? 
                      <Avatar alt={userInfo.first_name} src={`https://api.leonardo-service.com/img/${userInfo.image}`} style={{borderRadius:'50%',width:'1.6em', height:'1.6em', marginTop:'-0.15em'}} className={classes.icon}/>
                      : 
                      <LuUser className={classes.icon} />
                    }
                    </div>
                  </Tooltip>
                </Box>
                </div>
            <MenuIcon style={{ fontSize: "3em", width:'0.8em', height:'0.8em', marginTop:'-0.1em' }} onClick={()=>props.toggle()}/>
              </div>
      </div>
      </div>
    </>
  );
};

export default Navbar;
