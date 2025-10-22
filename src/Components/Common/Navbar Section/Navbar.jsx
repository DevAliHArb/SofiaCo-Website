import React, { useContext, useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FaRegHeart } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  IconButton,
  MenuItem,
  Tooltip,
  FormControl,
  Select,
} from "@mui/material";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from "./Search box/SearchBox";
import LanCurrSelect from "./Language and Currency/LanCurrSelect";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AuthContext from "../authContext";
import ColoredLogo from "../../../assets/navbar/logo.svg";
import moblogo from "../../../assets/navbar/moblogo.svg";
import { changeCurrency, changeLanguage, removeUser } from "../redux/productSlice";
import * as Scroll from "react-scroll";

import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "background.paper",
  border: "2px solid #ACACAC",
  borderRadius: "1em",
  boxShadow: 24,
  display:'flex',
  flexDirection:'column',
  p: 4,
};
const Navbar = ({ toggle, cartToggle }) => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const isMobile = useMediaQuery('(max-width:1023px)');
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const productData = useSelector((state) => state.products.productData);
  const favoriteData = useSelector((state) => state.products.favorites);
  const compareData = useSelector((state) => state.products.compare);
  const userInfo = useSelector((state) => state.products.userInfo);
  
  const [isSearchBar, setIsSearchBar] = useState(false);
  const settings = ["Profile", "Logout"];
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [popover, setPopover] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const location = path.split("/")[1];
  const scroller = Scroll.scroller;

  const NavigateAndScroll = async (props) => {
    if (path === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      await navigate("/");
      setTimeout(() => {
        scroller.scrollTo(props, {
          duration: 500,
          delay: 0,
          smooth: true,
          offset: 50,
        });
      }, 400);
    }
  };

  
  const handleChangeCurrency = async (event) => {
    const cur = event.target.value;
    
    // Check for currency and currencyRate
    if (currency === 'eur' && !authCtx.currencyRate) {
        return setOpenmodal(true)
    }
  
    dispatch(changeCurrency({ currency: cur }));
  
    try {
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
        { currency: cur },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // console.error("Error updating currency:", error);
    }
  };

  const handleChangeLanguage = async (event) => {
    const lan = event.target.value;
    dispatch(changeLanguage({ Language: lan }));
    try {
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
        { language: lan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // console.error("Error updating language:", error);
    }
  };

  const logout = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");

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
      await axios.get(`${import.meta.env.VITE_TESTING_API}/logout`, {
        headers,
      });

      // Remove the token from local storage after successful logout
      localStorage.removeItem("token");

      dispatch(removeUser());
      navigate(`/login`);
      // Add any additional logic you may need, such as redirecting the user to the login page or updating the application state
    } catch (error) {
      // console.error("Error logging out:", error);
      // Handle any errors that occur during logout
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Perform any additional actions after successful logout
    } catch (error) {
      // console.error("Error logging out:", error);
      // Handle logout error
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY > 80;
      if (isTop !== isScrolled) {
        setIsScrolled(isTop);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
    {isScrolled && <div style={{position: 'relative', height: '5em', width: '100%'}}></div>}
      <div className={`${isScrolled ? classes.fixednav_con : classes.headnav}`}>
            
            <div className={classes.header_top}>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> <MdOutlineMail style={{width:'1.5em', height:'1.5em', margin:'auto 0.5em auto auto', color:'#fff'}}/>{authCtx.companySettings?.email}</p>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto auto', color:'#fff'}}/>{authCtx.companySettings?.phone}</p>
              </div>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> {language === 'eng' ? authCtx.companySettings?.announcement_bar_text_en : authCtx.companySettings?.announcement_bar_text_fr }{authCtx.companySettings?.announcement_bar_url && <FaArrowRightLong style={{width:'1.3em', height:'1.3em', margin:'auto auto auto 0.5em', color:'#fff',cursor:'pointer'}} onClick={()=>window.open(authCtx.companySettings?.announcement_bar_url , '_blank')}/>}</p>
              </div>
              <div className={classes.header_top_content1}>
                <p onClick={()=>navigate('/account/order-tracking')} style={{display:'Flex',cursor:'pointer', flexDirection:'row'}}> <FiTruck style={{width:'1em', height:'1em', margin:'auto 0.5em auto auto', color:'#fff'}}/> {language === 'eng' ? "Track your order" : "Suivre votre commande"}</p>

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
                        color: "#fff",
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
                        color: "#fff",
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
        <div className={classes.header}>
          <div className={classes.logocontainer}>
            {/* <Link to="/"> */}
              <img src={isMobile ? moblogo : ColoredLogo} style={{cursor:"pointer"}} alt="logodark"  onClick={NavigateAndScroll}/>
            {/* </Link> */}
          </div>
          {!isSearchBar && <div className={classes.headercontent}>
            <div className={classes.bottomdiv}>
              {<LanCurrSelect />}
              <div className={classes.options}>
              <div
                  className={classes.icon}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                >
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => {
                        setIsSearchBar(true);
                      }}
                    >
                    <FiSearch 
                        style={{
                          width: "30px",
                          height: "30px",
                          color: "var(--secondary-color)",
                          margin: "6px",
                        }} />
                        </IconButton>
                </div>
                <div
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  className={classes.icon}
                >
                  <Tooltip title={language === "eng" ? "Wishlist" : "Liste De Souhaits"}>
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => {
                        if (userInfo) {
                          navigate(`/wishlist`);
                        } else {
                          navigate(`/login`);
                        }
                      }}
                    >
                      <FaRegHeart
                        alt=""
                        style={{
                          width: "30px",
                          height: "30px",
                          color: "var(--secondary-color)",
                          margin: "6px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  {favoriteData?.length !== 0 && (
                    <span
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                        position: "absolute",
                        marginLeft: "-15px",
                        marginTop: "-52px",
                        borderRadius: "50%",
                        background: "var(--primary-color)",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      {favoriteData?.length}
                    </span>
                  )}
                </div>
                <div
                  className={classes.icon}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                >
                  <Tooltip title={language === "eng" ? "Cart" : "Panier"}>
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => {
                        if (userInfo) {
                          cartToggle();
                        } else {
                          navigate(`/login`);
                        }
                      }}
                    >
                      <ShoppingCartOutlinedIcon
                        style={{
                          width: "30px",
                          height: "30px",
                          color: "var(--secondary-color)",
                          margin: "6px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  {productData?.length !== 0 && (
                    <span
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                        position: "absolute",
                        marginLeft: "-15px",
                        marginTop: "-52px",
                        borderRadius: "50%",
                        background: "var(--primary-color)",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      {productData?.length}
                    </span>
                  )}
                </div>
                <div
                  className={classes.icon}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                >
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={toggle}
                    >
                    <MenuIcon 
                        style={{
                          width: "36px",
                          height: "36px",
                          color: "var(--secondary-color)",
                          margin: "3px 6px",
                        }} />
                        </IconButton>
                </div>
                {/* <div
                  style={{ width: "30px", height: "30px", marginTop: "-12px" }}
                >
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip
                      title={language === "eng" ? "Profile" : "Mon Compte"}
                    >
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {userInfo?.id ? (
                          <Avatar
                            alt={userInfo.first_name}
                            src={`${import.meta.env.VITE_TESTING_API_IMAGE}/img/${userInfo.image}`}
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                            }}
                            className={classes.icon}
                          />
                        ) : (
                          <PersonIcon
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                            }}
                            className={classes.icon}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </div> */}
              </div>
            </div>
          </div>}
           {isSearchBar && <div className={classes.search_con}><SearchBox setIsSearchBar={setIsSearchBar} isSearchBar={isSearchBar}/></div>}
        </div>
        {/*  */}
        {/* <div className={`${isScrolled ? classes.rightsidenav : classes.none}`}>
          <div className={classes.siderowright}>
            <div
              style={{
                width: "30px",
                height: "30px",
                margin: "8px",
                borderRadius: "50%",
              }}
            >
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {userInfo?.id ? (
                      <Avatar
                        alt={userInfo.first_name}
                        src={`${import.meta.env.VITE_TESTING_API_IMAGE}/img/${userInfo.image}`}
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                        }}
                        className={classes.icon}
                      />
                    ) : (
                      <PersonIcon
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          color: "#fff",
                        }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userInfo?.id ? (
                    <div>
                      <MenuItem
                        key={1}
                        onClick={() => {
                          navigate(`/accountprofile`);
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">
                          {language === "eng" ? "Profile" : "Mon Compte"}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        key={2}
                        onClick={() => {
                          navigate(`/ordertracking`);
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">
                          {language === "eng"
                            ? "Orders Tracking"
                            : "Suivi des Commandes"}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        key={3}
                        onClick={() => {
                          navigate(`/refund_return`);
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">
                          {language === "eng"
                            ? "Orders Returns"
                            : "Retours de Commandes"}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        key={4}
                        onClick={() => (handleCloseUserMenu(), handleLogout())}
                      >
                        <Typography textAlign="center">
                          {language === "eng" ? "Logout" : "Déconnexion"}{" "}
                        </Typography>
                      </MenuItem>
                    </div>
                  ) : (
                    <div>
                      <MenuItem
                        key={1}
                        onClick={() =>
                          handleCloseUserMenu() & navigate(`/login`)
                        }
                      >
                        <Typography textAlign="center">
                          {language === "eng" ? "Login" : "Se Connecter"}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        key={2}
                        onClick={() =>
                          handleCloseUserMenu() & navigate(`/register`)
                        }
                      >
                        <Typography textAlign="center">
                          {language === "eng" ? "Register" : "Créer un compte"}
                        </Typography>
                      </MenuItem>
                    </div>
                  )}
                </Menu>
              </Box>
            </div>
          </div>
          <div className={classes.siderowright}>
            <Tooltip title="Cart">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  if (userInfo) {
                    carttoggle();
                  } else {
                    navigate(`/login`);
                  }
                }}
              >
                <IoBagOutline
                  style={{
                    width: "30px",
                    height: "30px",
                    color: "#fff",
                    margin: "55% auto",
                  }}
                />
              </IconButton>
            </Tooltip>
            {productData?.length !== 0 && (
              <span
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  position: "absolute",
                  marginLeft: "-12px",
                  marginTop: "5px",
                  borderRadius: "50%",
                  background: "var(--accent-color)",
                  textAlign: "center",
                  color: "var(--secondary-color)",
                }}
              >
                {productData?.length}
              </span>
            )}
          </div>
          <div className={classes.siderowright}>
            <Tooltip title="Wishlist">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  if (userInfo) {
                    navigate(`/wishlist`);
                  } else {
                    navigate(`/login`);
                  }
                }}
              >
                <FaRegHeart
                  style={{
                    width: "30px",
                    height: "30px",
                    color: "#fff",
                    margin: "55% auto",
                  }}
                />
              </IconButton>
            </Tooltip>
            {favoriteData?.length !== 0 && (
              <span
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  position: "absolute",
                  marginLeft: "-12px",
                  marginTop: "5px",
                  borderRadius: "50%",
                  background: "var(--accent-color)",
                  textAlign: "center",
                  color: "var(--secondary-color)",
                }}
              >
                {favoriteData?.length}
              </span>
            )}
          </div>
          <div className={classes.siderowright}>
            <Tooltip title="Compare">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  if (userInfo) {
                    navigate(`/compare`);
                  } else {
                    navigate(`/login`);
                  }
                }}
              >
                <IoGitCompareOutline
                  style={{
                    width: "30px",
                    height: "30px",
                    color: "#fff",
                    margin: "55% auto",
                  }}
                />
              </IconButton>
            </Tooltip>
            {compareData?.length !== 0 && (
              <span
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  position: "absolute",
                  marginLeft: "-12px",
                  marginTop: "5px",
                  borderRadius: "50%",
                  background: "var(--accent-color)",
                  textAlign: "center",
                  color: "var(--secondary-color)",
                }}
              >
                {compareData?.length}
              </span>
            )}
          </div>
        </div>
        <div className={`${isScrolled ? classes.leftsidenav : classes.none}`}>
          <div className={classes.siderow}>
            <a href={authCtx.companySettings.facebook} target="_blank">
              <FaFacebookF
                style={{
                  color: "#fff",
                  width: "30px",
                  height: "30px",
                  margin: "22% auto",
                }}
              />
            </a>
          </div>
          <div className={classes.siderow}>
            <a href={authCtx.companySettings.twitter} target="_blank">
              {" "}
              <FaXTwitter
                style={{
                  color: "#fff",
                  width: "30px",
                  height: "30px",
                  margin: "22% auto",
                }}
              />
            </a>
          </div>
          <div className={classes.siderow}>
            <a href={authCtx.companySettings.linkedin} target="_blank">
              <FaLinkedinIn
                style={{
                  color: "#fff",
                  width: "30px",
                  height: "30px",
                  margin: "22% auto",
                }}
              />
            </a>
          </div>
          <div className={classes.siderow}>
            <a href={authCtx.companySettings.insta} target="_blank">
              {" "}
              <FaInstagram
                style={{
                  color: "#fff",
                  width: "30px",
                  height: "30px",
                  margin: "22% auto",
                }}
              />
            </a>
          </div>
        </div> */}
      </div>
      <div className={classes.mobilenav}>
        {!isSearchBar && <div
          style={{
            margin: "auto 0",
            width: "96%",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "0 2%",
          }}
        >
        <div className={classes.logomobile} onClick={NavigateAndScroll}>
          <img
            style={{ objectFit: "contain", margin: "0em auto" }}
            src={isMobile ? moblogo : ColoredLogo}
            alt="logodark"
          />
        </div>
          <div className={classes.rightsidenavMobile}>
            <div className={classes.siderowrightmobile}>
                  <Tooltip title="Search">
                    <IconButton 
                      onClick={() => {
                        setIsSearchBar(true);
                      }} sx={{ p: 0 }}>
                      
                        <FiSearch
                          style={{
                            width: "25px",
                            height: "25px",
                            color: "var(--secondary-color)",
                          }}
                        />
                    </IconButton>
                  </Tooltip>
            </div>
            <div className={classes.siderowrightmobile}>
              <Tooltip title="Cart">
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    if (userInfo) {
                      navigate(`/cart`);
                    } else {
                      navigate(`/login`);
                    }
                  }}
                >
                  <ShoppingCartOutlinedIcon
                    style={{
                      width: "25px",
                      height: "25px",
                      color: "var(--secondary-color)",
                      margin: "0",
                    }}
                  />
                </IconButton>
              </Tooltip>
              {productData?.length !== 0 && (
                <span
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    position: "absolute",
                    marginLeft: "-12px",
                    marginTop: "5px",
                    borderRadius: "50%",
                    background: "var(--primary-color)",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  {productData?.length}
                </span>
              )}
            </div>
            <div className={classes.siderowrightmobile}>
              <Tooltip title="Wishlist">
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    if (userInfo) {
                      navigate(`/wishlist`);
                    } else {
                      navigate(`/login`);
                    }
                  }}
                >
                  <FaRegHeart
                    style={{
                      width: "25px",
                      height: "25px",
                      color: "var(--secondary-color)",
                      margin: "0",
                    }}
                  />
                </IconButton>
              </Tooltip>
              {favoriteData?.length !== 0 && (
                <span
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    position: "absolute",
                    marginLeft: "-12px",
                    marginTop: "5px",
                    borderRadius: "50%",
                    background: "var(--primary-color)",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  {favoriteData?.length}
                </span>
              )}
            </div>
            
            <div className={classes.siderowrightmobile}>
              <Tooltip title="menu">
                <IconButton
                  sx={{ p: 0 }}
                >
                  
            <MenuIcon 
                    style={{
                      width: "25px",
                      height: "25px",
                      color: "var(--secondary-color)",
                      margin: "0",
                    }} onClick={toggle}/>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>}
        {isSearchBar && <div className={classes.search_con_mobile}><SearchBox setIsSearchBar={setIsSearchBar} isSearchBar={isSearchBar}/></div>}
      </div>
      <div className={classes.navheight}></div>
    </>
  );
};

export default Navbar;
