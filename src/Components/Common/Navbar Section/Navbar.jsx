import React, { useContext, useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import logo from "../../../assets/navbar/logo.svg";
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
import { useNavigate } from "react-router-dom";
import AuthContext from "../authContext";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { changeCurrency, changeLanguage } from "../redux/productSlice";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";


const Navbar = ({ toggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
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

  return (
    <>
      <div className={classes.headnav} style={{}}>
        <div className={classes.header}>
          <div className={classes.logocontainer}>
            <img
              src={logo}
              alt="logodark"
              style={{ width: "70%", margin: "auto 0", height: "auto" }}
            />
          </div>
          <div className={classes.headercontent}>
            <div className={classes.header_top}>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> <MdOutlineMail style={{width:'1.5em', height:'1.5em', margin:'auto 0.5em auto auto'}}/>{authCtx.companySettings?.email}</p>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto auto'}}/>{authCtx.companySettings?.phone}</p>
              </div>
              <div className={classes.header_top_content}>
                <p style={{display:'Flex', flexDirection:'row'}}> Jusqu'à 50 % de réduction sur les articles <FaArrowRightLong style={{width:'1.3em', height:'1.3em', margin:'auto auto auto 0.5em'}}/></p>
              </div>
              <div className={classes.header_top_content1}>
                <p style={{display:'Flex', flexDirection:'row'}}> <FiTruck style={{width:'1em', height:'1em', margin:'auto 0.5em auto auto'}}/> Suivre votre commande</p>

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
              <p onClick={() => toast.info("En Cours De Construction!")}>
                Livres
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                Jouets
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                parfum
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                vetements
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                tapis de priere
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                Nos éditeurs
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                AGENDA
              </p>
              <p onClick={() => toast.info("En Cours De Construction!")}>
                nos services
              </p>
              <div className={classes.icons}>
                <div style={{position:'relative'}}>
                <MdFavoriteBorder className={classes.icon} />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'50%', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <IoCartOutline className={classes.icon} />
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'50%', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <LuUser className={classes.icon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.mobile}>
      <div className={classes.logocontainer1}>
            <img
              src={logo}
              alt="logodark"
              style={{ width: "70%", margin: "auto 0", height: "auto" }}
            />
          </div>
          <div className={classes.icons}>
                <div style={{position:'relative'}}>
                <MdFavoriteBorder className={classes.icon} />
                {favoriteData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'50%', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{favoriteData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <IoCartOutline className={classes.icon} />
                {productData?.length !== 0  && <span style={{width:'1.3em', height:'1.25em', position:'absolute',borderRadius:'50%', background:'var(--primary-color)',left:'1.2em', top:'-0.5em',color:'#fff',paddingTop:'0.05em'}}>{productData?.length}</span>}
                </div>
                <div style={{position:'relative'}}>
                <LuUser className={classes.icon} />
                </div>
            <MenuIcon style={{ fontSize: "3em", width:'0.8em', height:'0.8em', marginTop:'-0.1em' }} onClick={toggle}/>
              </div>
      </div>
    </>
  );
};

export default Navbar;
