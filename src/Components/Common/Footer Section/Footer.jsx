import React, { useContext } from 'react'
import classes from './Footer.module.css'
import logo from '../../../assets/Footerlogo.svg'
import bg from '../../../assets/FooterBG.svg'
import bgmob from '../../../assets/FooterBGmob.svg'
import payments from '../../../assets/payments.png'
import { FaFacebookF, FaInstagram  } from "react-icons/fa";
import { FaXTwitter, FaYoutube  } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import AuthContext from '../authContext';
import { useSelector } from 'react-redux';
import data from '../../../Data.json'
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";



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
                <div className={classes.imgabsmob}>
                    <img src={bgmob} alt='Logo' />
                </div>
                <div className={classes.desktop}>
                <div className={classes.info}>
                <h3>{data.Footer.ContactInfo.title[language]}</h3>
                    <p style={{display:'Flex', flexDirection:'row'}}> <MdOutlineMail style={{width:'1.5em', height:'1.5em', margin:'auto 0.5em auto 0', color:'var(--primary-color)'}}/>{authCtx.companySettings.email}</p>
                    <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto 0', color:'var(--primary-color)'}}/>Tel: {authCtx.companySettings?.phone}</p>
                    <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto 0', color:'var(--primary-color)'}}/>Tel: {authCtx.companySettings?.phone}</p>
                    <p style={{display:'Flex', flexDirection:'row'}}> <FiPhoneCall style={{width:'1.3em', height:'1.3em', margin:'auto 0.5em auto 0', color:'var(--primary-color)'}}/>Tel: {authCtx.companySettings?.phone}</p>
                    </div>
                <div className={classes.info}>
                <h3>{data.Footer.Menu.title[language]}</h3>
                    <p onClick={()=>navigate(`/books`)}>{data.Footer.Menu.point1[language]}</p>
                    <p onClick={()=>navigate(`/events`)}>{data.Footer.Menu.point2[language]}</p>
                    <p onClick={()=>navigate(`/collaborators`)}>{data.Footer.Menu.point3[language]}</p>
                    <p onClick={()=>navigate(`/collections`)}>{data.Footer.Menu.point4[language]}</p>
                </div>
                <div className={classes.info}>
                <h3>{data.Footer.CUSTOMERSERVICE.title[language]}</h3>
                    <p onClick={()=>navigate(`/books`)}>{data.Footer.CUSTOMERSERVICE.point1[language]}</p>
                    <p onClick={()=>navigate(`/events`)}>{data.Footer.CUSTOMERSERVICE.point2[language]}</p>
                    <p onClick={()=>navigate(`/collaborators`)}>{data.Footer.CUSTOMERSERVICE.point3[language]}</p>
                </div>
                <div className={classes.info}>
                <h3>{data.Footer.GENERAL.title[language]}</h3>
                    <p onClick={()=>navigate(`/books`)}>{data.Footer.GENERAL.point1[language]}</p>
                    <p onClick={()=>navigate(`/events`)}>{data.Footer.GENERAL.point2[language]}</p>
                    <p onClick={()=>navigate(`/collaborators`)}>{data.Footer.GENERAL.point3[language]}</p>
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