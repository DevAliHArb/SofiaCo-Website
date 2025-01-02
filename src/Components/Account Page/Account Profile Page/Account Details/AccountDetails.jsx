import React, { useEffect, useRef, useState } from "react";
import classes from "./AccountDetails.module.css";

import { Button, Checkbox, Form, Input } from "antd";
// import Google from '../../../assets/Google.png'
import Userimage from '../../../../assets/user.png'
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../Common/redux/productSlice";
import { FcEditImage } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from '../../../../Data.json'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 500,
  bgcolor: "#fff",
  boxShadow: 24,
  fontSize: "calc(0.7rem + 0.2vw)",
  fontFamily: "var(--font-family)",
  overflow: "hidden",
  borderRadius: "1em",
};

const AccountDetails = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.products.userInfo);
  const [modelOpen, setmodelOpen] = React.useState(false);
  const handlemodelOpen = () => setmodelOpen(true);
  const handlemodelClose = () => {
    setmodelOpen(false);
    passform.resetFields();
  };
  const [changePass, setchangePassword] = useState(false);
  const [changedimage, setchangedImage] = useState(null);
  const [form] = Form.useForm();
  const [passform] = Form.useForm();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // console.log(response.data.data)
      dispatch(editUser(response.data.data));
      // console.log(userInfo);
      // Set loading to false after fetching data
    } catch (error) {
      // console.error("Error fetching user:", error);
      // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const ChangeImageHandler = (e) => {
    const file = e.target.files[0];

    setchangedImage(file);
  };

  const handleImageChange = async () => {
    // const formData = new FormData();
    // formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
        { ...formData, image: changedimage, _method: "put" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type
          },
        }
      );
      fetchUser();
      // console.log(userInfo);
      // console.log("Image uploaded successfully:", response.data);
      toast.success(language === "eng" ? "Image uploaded successfully" : "Image téléchargée avec succès", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      // Update local state or dispatch an action to update user data
    } catch (error) {
      // console.error("Error uploading image:", error);
      toast.error(language === "eng" ? "Error uploading image:" : "Erreur lors du téléchargement de l'image :", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      // Handle upload errors gracefully, e.g., display an error message
    } finally {
      setchangedImage(null);
    }
  };

  const handleImageClick = () => {
    // Trigger the file input when the image is clicked
    fileInputRef.current.click();
  };
  const validatePassword = (_, value) => {
    const regex = /^(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

    if (!regex.test(value)) {
      return Promise.reject("Password must be at least 8 characters");
    }

    return Promise.resolve();
  };
  const [formData, setFormData] = useState({});
  const [passData, setpassData] = useState({});

  const handleChangePass = async () => {
    setLoading(true);
    if (passData.newpassword === passData.confirmpassword) {
      try {
        // console.log(passData);
        // Make API call to change password
        const response = await axios.put(
          `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
          passData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        }); // Handle response as needed
        // You may want to display a success message or update the user state
        setchangePassword(false);

        passform.resetFields();
        handlemodelClose();
        setLoading(false);
      } catch (error) {
        // console.error("Error changing password:", error);
        toast.error(error.response.data.error, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
        setLoading(false);
        // Handle error (display error message, etc.)
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(
        language === "eng" ? "Confirm password doesn't match" : "Le mot de passe de confirmation ne correspond pas", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    }
  };

  const handleOpenChangePassForm = (e) => {
    setchangePassword(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlepassChange = (e) => {
    const { name, value } = e.target;
    setpassData({ ...passData, [name]: value });
  };

  const handleEditUser = async (values) => {
    // console.log(formData);
    setLoading(true);
    if (changedimage !== null) {
      handleImageChange();
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${userInfo.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data); // Handle response as needed
      dispatch(editUser(values));
      toast.success(language === "eng" ? "Data saved successfully" : "Données enregistrées avec succès", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } catch (error) {
      // console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={classes.AccountDetailsContainer}>
        <div className={classes.header}>
          <div className={classes.headtitle}>
            <h3>
             {data.AccountProfilePage.AccountDetails.subtitle[language]}
            </h3>
          </div>
        </div>
        <Form
          layout="vertical"
          name="nest-messages"
          form={form}
          initialValues={userInfo}
          onFinish={handleEditUser}
          disabled={modelOpen}
          style={{
            width: "100%",
            margin: "0 auto",
            alignItems: "center",
            textAlign: "center",
            justifyItems: "center",
            marginBottom: "1em",
            opacity: modelOpen ? '0.5' : '1'
          }}
        >
          <div className={classes.inputsContainer}>
            <Form.Item
              name="company_name"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "Company" : "Entreprise"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your company name!' },
                {
                  max: 30,
                  message: "Le titre ne doit pas dépasser 30 caractères.",
                },
              ]}
              style={{ border: "none", width:'100%',borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="company_name"
                placeholder= {language === "eng" ? "Company name" : "Companie nom"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="first_name"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "First Name" : "Prenom"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your first name!' },
                { max: 16, message: 'First name must be less than 17 characters!' }
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="first_name"
                placeholder= {language === "eng" ? "First name" : "Prenom"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="last_name"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "Last Name" : "Nom"}
                </p>
              }
              rules={[{ required: true, message: 'Please input your last_name!' },
                { max: 16, message: 'First name must be less than 17 characters!' }]}
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input
                name="last_name"
                size="large"
                placeholder= {language === "eng" ? "Last name" : "Nom"}
                style={{ height: "3em", width:'100%',backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="company_address"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "Address" : "Adresse"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your company address!' },
                {
                  max: 64,
                  min: 12,
                  message: "Le titre doit comporter entre 12 et 64 caractères.",
                },
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="company_address"
                placeholder= {language === "eng" ? "Company address" : "Adresse de l'entreprise"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="company_city"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "City" : "Ville"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your company city!' },
                {
                  max: 16,
                  message: "Le titre ne doit pas dépasser 16 caractères.",
                },
              ]}
              style={{ border: "none",width:'100%',borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="company_city"
                placeholder= {language === "eng" ? "Company city" : "Ville de l'entreprise"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "Phone" : "Téléphone"}
                </p>
              }
              rules={[
                {
                    pattern: /^\d+$/,
                    message: 'Phone number must contain only numbers!',
                },
                {
                  max: 16,
                  message: "Le titre ne doit pas dépasser 16 caractères.",
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (value && value.length > 6) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Phone number must have more than 6 digits!'));
                    },
                }),
            ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                name="phone"
                size="large"
                placeholder= {language === "eng" ? "Telephone" : "Téléphone"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "E-mail" : "E-mail"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'The input is not a valid email!' }
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="email"
                disabled
                placeholder= {language === "eng" ? "Email" : "Email"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="tva"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "TVA" : "TVA"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your TVA!' },
                {
                  max: 16,
                  message: "Le titre ne doit pas dépasser 16 caractères.",
                },
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="tva"
                placeholder= {language === "eng" ? "TVA" : "TVA"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="siret"
              label={
                <p
                  style={{
                    color: "#fff",
                    margin: "0",
                    fontWeight: "300",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  {language === "eng" ? "Siret" : "Siret"}
                </p>
              }
              rules={[
                { required: true, message: 'Please input your siret!' },
                {
                  max: 16,
                  message: "Le titre ne doit pas dépasser 16 caractères.",
                },
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="siret"
                placeholder= {language === "eng" ? "Company name" : "Siret"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div className={classes.btnsContainer}>
              <Button
                size="large"
            onClick={handlemodelOpen}
                className={classes.passBtn}
              >
              {language === "eng" ? "Change Password" : "Modifier le mot de passe"}
              </Button>
            <Form.Item>
              <Button
                size="large"
                htmlType="submit"
                className={classes.saveBtn}
                disabled={loading }
                style={{ cursor: loading ? "wait" : "pointer" }}
              >
               {language === "eng" ? "Save" : "Enregistrer"}
              </Button>
            </Form.Item>
              <Button
                size="large"
            onClick={handlemodelOpen}
                className={classes.passBtnmob}
              >
              {language === "eng" ? "Change Password" : "Modifier le mot de passe"}
              </Button>
          </div>
        </Form>
          { modelOpen &&
            <Form
            layout="vertical"
            name="nest-messages"
            form={passform}
            onFinish={handleChangePass}
            style={{
              width: "100%",
              margin: "0 auto",
              alignItems: "center",
              textAlign: "center",
              justifyItems: "center",
              marginBottom: "1em",
            }}
          >
            <div className={classes.inputsContainer}>
            <Form.Item
              name="currentPassword"
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input.Password
                name="currentPassword"
                type="password"
                placeholder= {language === "eng" ? "Current Password" : "Mot de passe actuel"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handlepassChange}
              />
            </Form.Item>

            <Form.Item
              name="newpassword"
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.'
                }
              ]}
            >
              <Input.Password
                name="newpassword"
                type="password"
                placeholder= {language === "eng" ? "New Password" : "Nouveau mot de passe"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handlepassChange}
              />
            </Form.Item>

            <Form.Item
              name="confirmpassword"
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.'
                }
              ]}
            >
              <Input.Password
                name="confirmpassword"
                type="password"
                placeholder= {language === "eng" ? "Confirm New Password" : "Confirmer le nouveau mot de passe"}
                style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                onChange={handlepassChange}
              />
            </Form.Item>
            </div>
          <div className={classes.btnsContainer}>
              <Button
                size="large"
                onClick={handlemodelClose}
                className={classes.cancel}
              >
                {language === "eng" ? "Cancel" : "Supprimer"}
              </Button>
                <Button
                  size="large"
                  htmlType="submit"
                  className={classes.saveBtn}
                  disabled={loading }
                  style={{
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                {language === "eng" ? "Save" : "Enregistrer"}
                </Button>
              <Button
                size="large"
                onClick={handlemodelClose}
                className={classes.cancelmob}
              >
                {language === "eng" ? "Cancel" : "Supprimer"}
              </Button>
            </div>
          </Form>
          }
      </div>
    </>
  );
};

export default AccountDetails;