import classes from "./SideBar.module.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import fixedlogo from "../../../assets/navbar/favicon.svg";
import { FaRegUser, FaUser  } from "react-icons/fa6";
import { PiShoppingCartSimpleLight  } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrency, changeLanguage } from "../redux/productSlice";


export default function SideBar({ toggle, isOpen, carttoggle }) {
  
  const [shopopen, setshopisopen] = React.useState(false);
  const [collopen, setcollisopen] = React.useState(false);
  const [accopen, setaccisopen] = React.useState(false);
  const [lanopen, setlanisopen] = React.useState(false);
  const [curopen, setcurisopen] = React.useState(false);
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.products.userInfo);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const handleChangeCurrency = async (cur) => {
    dispatch(changeCurrency({ currency: cur }));
    try {
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
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

  const handleChangeLanguage = async (lan) => {
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
  const list = (anchor) => ( 
    <>
     <Box
      sx={{ height: "100% !important" }}
      role="presentation"
      // onClick={toggle}
      // onKeyDown={toggle}
      className={classes.container}
    >
     
    <div className={classes.mobile_nav_fixed}>
       <IoClose className={classes.close_icon} onClick={toggle} style={{color:'#fff'}}/>
       <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <img src={fixedlogo} style={{width:'100%', height:'100%'}} alt="logo" />
        </Link>
      </div>
      <List>
    

        <Link  to='/books' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding style={{marginTop:'0.5em'}}>
          <ListItemButton>
            <ListItemText className={classes.text}>
            {language === 'eng' ? 'Books' : 'Livres'} 
                {/* {shopopen ? <IoIosArrowDown style={{transform:'rotate(180deg)'}} /> : <IoIosArrowDown /> } */}
            </ListItemText>
          </ListItemButton>
        </ListItem>
        </Link>

        <Link  to='/about' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton >
            <ListItemText className={classes.text}>
            {language === 'eng' ? "ABOUT US" : "À PROPOS" }
            {/* {collopen ? <IoIosArrowDown style={{transform:'rotate(180deg)'}} /> : <IoIosArrowDown /> } */}
            </ListItemText>
          </ListItemButton>
        </ListItem>
        </Link>


        <Link  to='/events' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            {language === 'eng' ? "EVENTS" : "ÉVÉNEMENTS" }
            </ListItemText>
          </ListItemButton>
        </ListItem>
        </Link>

        <Link  to='/collaborators' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            {language === 'eng' ? "COLLABORATORS" : "COLLABORATEURS" }
            </ListItemText>
          </ListItemButton>
        </ListItem>
        </Link>

<Link  to='/publishers' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
<ListItem disablePadding>
  <ListItemButton>
    <ListItemText className={classes.text}>
    {language === 'eng' ? 'publishers' : 'Éditeurs'}
    </ListItemText>
  </ListItemButton>
</ListItem>
</Link>

<Link  to='/contact' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
<ListItem disablePadding>
  <ListItemButton>
    <ListItemText className={classes.text}>
    {language === 'eng' ? "CONTACT US" : "CONTACTEZ-NOUS" }
    </ListItemText>
  </ListItemButton>
</ListItem>
</Link>

        <Divider
          color="white"
          width="90%"
          style={{margin:'0.5em auto'}}
        />
  

        
        {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
        <ListItem disablePadding>
          <ListItemButton onClick={()=>setcurisopen(!curopen)}>
            <ListItemText   className={classes.text}>
                {currency} {curopen ? <IoIosArrowDown style={{transform:'rotate(180deg)'}} /> : <IoIosArrowDown /> }
            </ListItemText>
          </ListItemButton>
        </ListItem>
        {/* </Link> */}

        {curopen && <div style={{paddingLeft:'1em'}}>
          
          {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
          <ListItem disablePadding>
            {/* <ListItemButton */}
              <ListItemText onClick={()=>handleChangeCurrency('eur') & setcurisopen(false)} className={classes.text1}>
             EUR
              </ListItemText>
            {/* </ListItemButton> */}
          </ListItem>
          {/* </Link> */}
  
          
          {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
          <ListItem disablePadding>
            {/* <ListItemButton> */}
              <ListItemText onClick={()=>handleChangeCurrency('usd') & setcurisopen(false)} className={classes.text1}>
              USD
              </ListItemText>
            {/* </ListItemButton> */}
          </ListItem>
          {/* </Link> */}
  
          </div>}
  

        
        {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
        <ListItem disablePadding>
          <ListItemButton onClick={()=>setlanisopen(!lanopen)}>
            <ListItemText className={classes.text}>
                {language} {lanopen ? <IoIosArrowDown style={{transform:'rotate(180deg)'}} /> : <IoIosArrowDown /> }
            </ListItemText>
          </ListItemButton>
        </ListItem>
        {/* </Link> */}

        {lanopen && <div style={{paddingLeft:'1em'}}>
          
          {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
          <ListItem disablePadding>
            {/* <ListItemButton> */}
              <ListItemText onClick={()=>handleChangeLanguage('eng') & setlanisopen(false)} className={classes.text1}>
              ENG
              </ListItemText>
            {/* </ListItemButton> */}
          </ListItem>
          {/* </Link> */}
  
          
          {/* <Link  to='/' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}
          <ListItem disablePadding>
            {/* <ListItemButton> */}
              <ListItemText onClick={()=>handleChangeLanguage('fr')  & setlanisopen(false)} className={classes.text1}>
              FR
              </ListItemText>
            {/* </ListItemButton> */}
          </ListItem>
          {/* </Link> */}
  
          </div>}


      </List>
    </Box>
    </>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor} >
          <Drawer 
          anchor={anchor} 
          open={isOpen} 
          onClose={toggle}  
          PaperProps={{
        style: {
          height: '100% !important',
          width: '100% !important',
          background:'transparent',
          alignSelf:'start' // You can adjust the width as needed
        },
      }}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
