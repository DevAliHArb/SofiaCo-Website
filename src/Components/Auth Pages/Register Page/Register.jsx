import React from 'react'
import classes from './Register.module.css'
import logo from '../../../assets/navbar/logo.svg'
import { MdArrowBackIosNew } from "react-icons/md";

const Register = () => {
  return (
    <div className={classes.auth_con}>
        <div className={classes.header}>
            <div className={classes.back}><MdArrowBackIosNew style={{width:'1.2em', height:'1.2em', marginRight:'0.5em'}}/><p>Back</p></div>
            <div className={classes.logo_con}>
                <img src={logo} alt='logo' />
            </div>
        </div>
        <div className={classes.auth_card}></div>
    </div>
  )
}

export default Register