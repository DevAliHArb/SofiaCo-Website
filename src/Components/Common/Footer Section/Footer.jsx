import React, { useContext } from 'react'
import classes from './Footer.module.css'
import logo from '../../../assets/Footerlogo.svg'
import bg from '../../../assets/FooterBG.svg'
import payments from '../../../assets/payments.png'
import { FaFacebookF, FaInstagram  } from "react-icons/fa";
import { FaXTwitter, FaYoutube  } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import AuthContext from '../authContext';
import { useSelector } from 'react-redux';



const Footer = () => { 
    const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
    
function openNewWindow(url) {
    window.open(url, '_blank');
  }
  return (
    <div className={classes.footer}>
        <div className={classes.content}>
            <div className={classes.main}>
                <div className={classes.footer_logo}>
                    <img src={logo} alt='Logo' />
                </div>
                <div className={classes.imgabs}>
                    <img src={bg} alt='Logo' />
                </div>
                <div className={classes.desktop}>
                <div className={classes.info}>
                    <h3>Company</h3>
                    <p onClick={()=>navigate(`/about`)}>About</p>
                    <p onClick={()=>navigate(`/books`)}>Shop</p>
                    <p onClick={()=>navigate(`/collaborators`)}>Collaborators</p>
                    <p onClick={()=>navigate(``)}>Career</p>
                </div>
                <div className={classes.info}>
                    <h3>Help</h3>
                    <p>Customer Support</p>
                    <p>Delivery Details</p>
                    <p>Terms & Conditions</p>
                    <p onClick={()=>navigate(`/mentions-legales`)}>Privacy Policy</p>
                </div>
                <div className={classes.info}>
                    <h3>FAQ</h3>
                    <p>Account</p>
                    <p>Manage Deliveries</p>
                    <p>Orders</p>
                    <p>Payments</p>
                </div>
                <div className={classes.info}>
                    <h3>Resources</h3>
                    <p onClick={()=>navigate(``)}>Free eBooks</p>
                    <p onClick={()=>navigate(`/services`)}>Services</p>
                    <p onClick={()=>navigate(`/events`)}>Events</p>
                    <p onClick={()=>openNewWindow('https://www.youtube.com/@albouraqeditionstv145')}>Youtube Videos</p>
                </div>
                </div>
            </div>
            <div className={classes.bottom}>
                <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr } </p>
                <img src={payments} alt='' />
            </div>
        </div>
    </div>
  )
}

export default Footer