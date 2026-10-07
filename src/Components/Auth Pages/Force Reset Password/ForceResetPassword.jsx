import React, { useContext, useState } from "react";
import classes from "../New Password/NewPassword.module.css"
import logo from '../../../assets/navbar/logo.svg'
import { Button, Form, Input } from 'antd';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { addUser } from "../../Common/redux/productSlice";
import AuthContext from "../../Common/authContext";

// Authenticated-user forced password reset. Reached only when the
// backend flags the logged-in user's account with must_reset_password.
// There is intentionally no back/cancel action here — the app-wide
// guard in App.jsx keeps the user on this page until they comply.
const ForceResetPassword = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const user = useSelector((state) => state.products.userInfo);
  const token = sessionStorage.getItem("token");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${user?.id}/force-reset-password`,
        {
          password: values.password,
          password_confirmation: values.password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data?.message || (language === "eng" ? "Password updated successfully!" : "Mot de passe mis à jour avec succès !"), {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });

      dispatch(addUser({ ...user, must_reset_password: false }));
      navigate('/');
    } catch (error) {
      const errormsg = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error(language === "eng" ? `Error: ${errormsg}` : `Erreur : ${errormsg}`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.auth_con}>
      <div className={classes.header}>
        <div className={classes.logo_con}>
          <img src={logo} alt='logo' />
        </div>
      </div>
      <div className={classes.auth_card}>
        <div className={classes.auth_bg} />
        <h1>{language === "eng" ? "Password Reset Required" : "Réinitialisation du mot de passe requise"}</h1>
        <p style={{ width: '90%', margin: '1em auto' }}>{language === "eng"
          ? "For your account's security, you must set a new password before continuing."
          : "Pour la sécurité de votre compte, vous devez définir un nouveau mot de passe avant de continuer."}</p>
        <Form
          layout="vertical"
          name="nest-messages"
          className='form'
          onFinish={onFinish}
        >
          <Form.Item style={{ width: '100%' }}
            name="password"
            label={<p style={{ color: 'var(--accent-color)', fontWeight: '500', fontFamily: 'var(--font-family-primary)', margin: '0 ' }}>{language === "eng" ? "Enter New Password" : "Entrez un nouveau mot de passe"}</p>}
            rules={[
              {
                required: true,
                message: language === "eng" ? 'Please input your password!' : 'Veuillez saisir votre mot de passe!',
              },
              {
                validator: (_, value) => {
                  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
                    return Promise.reject('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.Password
              type="password"
              placeholder={language === "eng" ? "at least 8 characters" : "au moins 8 caractères"}
              style={{ border: 'none', backgroundColor: "rgba(255, 255, 255, 0.1)", color: 'var(--accent-color)', height: '2.7em' }}
            />
          </Form.Item>
          <Form.Item style={{ width: '100%' }}
            name="password_confirmation"
            label={<p style={{ color: 'var(--accent-color)', fontWeight: '500', fontFamily: 'var(--font-family-primary)', margin: '0 ' }}>{language === "eng" ? "Confirm Password" : "Confirmer le mot de passe"}</p>}
            rules={[
              {
                required: true,
                message: language === "eng" ? 'Please confirm your password!' : 'Veuillez confirmer votre mot de passe!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(language === "eng"
                      ? 'The new password that you entered do not match!'
                      : 'Le nouveau mot de passe que vous avez saisi ne correspond pas!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder={language === "eng" ? "at least 8 characters" : "au moins 8 caractères"}
              style={{ border: 'none', backgroundColor: "rgba(255, 255, 255, 0.1)", color: 'var(--accent-color)', height: '2.7em' }}
            />
          </Form.Item>
          <Form.Item style={{ width: '100%' }}>
            <Button
              size="large"
              htmlType="submit"
              disabled={loading ? true : false}
              style={{ cursor: loading ? 'wait' : 'pointer' }}
              className={classes.logInButton}>
              {language === "eng" ? "Update Password" : "Mettre à jour le mot de passe"}
            </Button>
          </Form.Item>
        </Form>
        <p>{language == 'eng' ? authCtx.companySettings.copyrights_en : authCtx.companySettings.copyrights_fr}</p>
      </div>
    </div>
  );
};

export default ForceResetPassword;
