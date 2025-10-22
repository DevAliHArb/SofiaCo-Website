import React, { useContext, useState } from 'react';
// import ReactCountryFlag from "react-country-flag";
import { FormControl, InputLabel, MenuItem, Popover, Select } from '@mui/material';
import AuthContext from '../../authContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addSelectedCategory, changeCurrency, changeLanguage } from '../../redux/productSlice';
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "antd";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

import { TbCategory } from "react-icons/tb";
import { IoBookOutline } from 'react-icons/io5';


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

export default function LanCurrSelect() {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  
  const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
  const user = useSelector((state) => state.products.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const authCtx = useContext(AuthContext);
  const dispatch= useDispatch();
  const navigate = useNavigate()
  const [openmodal, setOpenmodal] = useState(false)

  const [openCat, setOpenCat] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  // Track selected category: null means 'All', otherwise item.id
  // Persist selectedCategory in localStorage, handle type (string/number)
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryId ||null);
  React.useEffect(() => {
          setSelectedCategory(Number(selectedCategoryId) || null);
  }, [selectedCategoryId]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const handleCloseModal = () => {
    setOpenmodal(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
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
      console.error("Error updating currency:", error);
    }
  };
  


  const handleChangeLanguage = async (event) => {
    const lan = event.target.value;
      dispatch(changeLanguage({ Language: lan }));
    try {
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
        { 'language':lan },
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

  const defaultStyle = {
    padding:'.5em 1em',
    color:'#111',
    textAlign:'center',
    border:'1px solid #F6F6F6',
    width: 'fit-content',
    height:'fit-content',
    borderRadius:'30px',
    whiteSpace:'nowrap',
    fontSize:'calc(0.7rem + 0.3vw)',
    backgroundColor:'#F6F6F6',
    cursor:'pointer',
    margin:'auto 0',
    transition: "background-color 0.3s, color 0.3s",
    position:'relative',
  };

  const defaultStyle1 = {
    padding:'0',
    color:'#111',
    textAlign:'center',
    border:'2px solid var(--secondary-color)',
    width: 'fit-content',
    height:'fit-content',
    borderRadius:'1em',
    whiteSpace:'nowrap',
    fontSize:'calc(0.7rem + 0.3vw)',
    backgroundColor:'#fff',
    cursor:'pointer',
    margin:'auto 0',
    transition: "background-color 0.3s, color 0.3s",
    position:'relative',
  };

  const hoverStyle = {
    backgroundColor: "#fff",
    color: "var(--primary-color)",
    border:'1px solid var(--primary-color)',
  };

  // Toggle the hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  
  // Select category (null for 'All', otherwise item.id)
  const handleCategoryClick = (route, id) => {
    // setSelectedCategory(id);
    localStorage.setItem('route', route || 'all');
    dispatch(addSelectedCategory(id === null ? null : String(id)))
    setOpenCat(false);
  };

  // console.log(authCtx.selectedcurrency)
  // console.log(currency)
  return (
    <>
    <div style={{display:'flex',flexDirection:"row",gap:"1em"}}>
        <div style={defaultStyle1}>
          <Select
            open={openCat}
            style={{ border: "none", boxShadow: 'none', background: 'transparent', minWidth: '12em', outline: 'none',height:'2.3em',borderRadius:'30px',padding:'0' }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              outline: 'none',
            }}
            onClose={() => setOpenCat(false)}
            onOpen={() => setOpenCat(true)}
            value={selectedCategory === null ? 'all' : selectedCategory}
            onChange={e => {
              const val = e.target.value;
              if (val === 'all') {
                handleCategoryClick('/', 'null');
              } else {
                const item = authCtx.articleFamilleParents?.find(i => i.id === val);
                handleCategoryClick(item?.route, item?.id);
              }
              setOpenCat(false);
            }}
            renderValue={selected => {
              if (selected === 'all' || selected === null) {
                return (
                  <span style={{display:'flex',alignItems:'center',gap:'0.7em'}}>
                <TbCategory style={{fontSize:'1.5em', color:'var(--primary-color)'}}/>
                    <span style={{color:'#111'}}>{language === 'eng' ? 'All Categories' : 'Tous les catégories'}</span>
                  </span>
                );
              }
              const item = authCtx.articleFamilleParents?.find(i => i.id === selected);
              return (
                <span style={{display:'flex',alignItems:'center',gap:'0.7em'}}>
                <IoBookOutline style={{fontSize:'1.5em', color:'var(--primary-color)'}}/>
                  <span style={{color:'#111'}}>{item?.nom}</span>
                </span>
              );
            }}
          >
            <MenuItem value="all" style={{padding:".5em 1em",margin:'0',height:"fit-content"}}>
              <span style={{display:'flex',alignItems:'center',gap:'0.7em'}}>
                <TbCategory style={{fontSize:'1.5em', color:'var(--primary-color)'}}/>
                <span style={{ color:'#111' }}>{language === 'eng' ? 'All Categories' : 'Tous les catégories'}</span>
              </span>
            </MenuItem>
            {authCtx.articleFamilleParents?.map((item) => (
              <MenuItem key={item.id} value={item.id} style={{padding:".5em 1em",margin:'0',height:"fit-content"}}>
                <span style={{display:'flex',alignItems:'center',gap:'0.7em'}}>
                <IoBookOutline style={{fontSize:'1.5em', color:'var(--primary-color)'}}/>
                  <span style={{ color:'#111' }}>{item?.nom}</span>
                </span>
              </MenuItem>
            ))}
          </Select>
        </div>
        {/* End category button */}
    {/* <button style={defaultStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    onClick={handleClick}
    variant="contained">
    <img src={CurrencyLangIcon} alt="" style={{width:'1.4em',margin:"0 .5em -.45em 0"}}/>
     <span onClick={() => setOpenLanguage(true)} style={{position:'relative'}}>{language === 'eng' ? (<ReactCountryFlag countryCode="GB" svg style={{ marginRight: '0' }} />) : (<ReactCountryFlag countryCode="FR" svg style={{ marginRight: '0' }} />)}</span> 
      <FormControl
        style={{ display: openLanguage ? 'inline-block' : 'none',position:'absolute', top:'-1em', left:'0',opacity:0 }} // Hidden FormControl to control dropdown
      >
        <Select
          open={openLanguage}
          onClose={() => setOpenLanguage(false)}
          onOpen={() => setOpenLanguage(true)}
          value={language}
          onChange={handleChangeLanguage}
        >
          <MenuItem value="eng">
            <ReactCountryFlag countryCode="GB" svg style={{ marginRight: '0.5em' }} />
            English
          </MenuItem>
          <MenuItem value="fr">
            <ReactCountryFlag countryCode="FR" svg style={{ marginRight: '0.5em' }} />
            Français
          </MenuItem>
        </Select>
      </FormControl> <span style={{color:"var(--secondary-color)",padding:'0 .3em'}}> | </span> <span onClick={() => setOpenCurrency(true)} style={{fontWeight:"700"}}>{currency === 'eur' ? '€' : '$'}</span>
      <FormControl
        style={{ display: openCurrency ? 'inline-block' : 'none',position:'absolute', top:'-1em', right:'0',opacity:0 }} // Hidden FormControl to control dropdown
        >
        <Select
          open={openCurrency}
          onClose={() => setOpenCurrency(false)}
          onOpen={() => setOpenCurrency(true)}
          value={currency}
          onChange={handleChangeCurrency}
        >
          <MenuItem value="eur">Euro (€)</MenuItem>
          <MenuItem value="usd">Dollar ($)</MenuItem>
        </Select>
      </FormControl>
    </button> */}

    </div>
    <Modal
        open={openmodal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <InfoIcon style={{color:"red",margin:"0 auto .5em auto",fontSize:"3em"}}/>
        <h3 style={{color:"red"}}>{language === "eng" ? "You cannot change the currency. Please contact the administration." : "Vous ne pouvez pas changer la devise. Veuillez contacter l\'administration."}</h3>
        <div style={{width:'fit-content',margin:'auto',display:'flex',flexWrap:'wrap'}}>
        <Button 
           onClick={()=>{handleCloseModal(); navigate(`/contactus`)}}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'3em 0',margin:'2em auto 0 auto'}}>
            {language === "eng" ? "Contact us" : "Nous contacter"}
          </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
