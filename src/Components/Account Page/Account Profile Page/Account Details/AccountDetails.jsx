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

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import axios from "axios";

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
  fontFamily: "montserrat",
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

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // console.log(response.data.data)
      dispatch(editUser(response.data.data));
      console.log(userInfo);
      // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching user:", error);
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
        `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
        { ...formData, image: changedimage, _method: "put" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type
          },
        }
      );
      fetchUser();
      console.log(userInfo);
      console.log("Image uploaded successfully:", response.data);
      toast.success("Image uploaded successfully", {
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
      console.error("Error uploading image:", error);
      toast.error("error.response.data", {
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
        console.log(passData);
        // Make API call to change password
        const response = await axios.put(
          `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
          passData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
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
        console.error("Error changing password:", error);
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
      toast.error("confirm password doesn't match", {
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
    console.log(formData);
    setLoading(true);
    if (changedimage !== null) {
      handleImageChange();
    }
    try {
      const response = await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${userInfo.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); // Handle response as needed
      dispatch(editUser(values));
      toast.success("Data saved successfully", {
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
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={classes.AccountDetailsContainer}>
        <div className={classes.header}>
          <div className={classes.headtitle}>
            <h3 style={{ fontWeight: "600", marginTop: "0.2em" }}>
              MON Profile
            </h3>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={ChangeImageHandler}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className={classes.image_con} onClick={handleImageClick}>
          <div className={classes.hover}>
            <FcEditImage
              fontSize="large"
              color="primary"
              style={{
                position: "relative",
                margin: "25% 25%",
                width: "50%",
                height: "50%",
                color: "#fff",
                textAlign: "center",
              }}
            />
          </div>
          {userInfo.image !== 'user.png' ? (
            <>
              {changedimage !== null ? (
                <img
                  src={URL.createObjectURL(changedimage)}
                  alt={userInfo.first_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <img
                  src={`https://api.leonardo-service.com/img/${userInfo.image}`}
                  alt={userInfo.first_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              )}
            </>
          ) : (
            <img
              src={Userimage}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
        </div>
        <Form
          layout="vertical"
          name="nest-messages"
          form={form}
          initialValues={userInfo}
          onFinish={handleEditUser}
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
              name="first_name"
              label={
                <p
                  style={{
                    color: "var(--accent-color)",
                    margin: "0",
                    fontWeight: "500",
                    fontFamily: "montserrat",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  PréNom
                </p>
              }
              rules={[
                { required: true, message: 'Please input your first name!' },
                { max: 16, message: 'First name must be less than 17 characters!' }
              ]}
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="first_name"
                placeholder="Nom"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="last_name"
              label={
                <p
                  style={{
                    color: "var(--accent-color)",
                    margin: "0",
                    fontWeight: "500",
                    fontFamily: "montserrat",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  Nom
                </p>
              }
              rules={[{ required: true, message: 'Please input your last_name!' },
                { max: 16, message: 'First name must be less than 17 characters!' }]}
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input
                name="last_name"
                size="large"
                placeholder="Prénom"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label={
                <p
                  style={{
                    color: "var(--accent-color)",
                    margin: "0",
                    fontWeight: "500",
                    fontFamily: "montserrat",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  Numéro de Téléphone
                </p>
              }
              rules={[
                {
                    pattern: /^\d+$/,
                    message: 'Phone number must contain only numbers!',
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
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input
                name="phone"
                size="large"
                placeholder="Téléphone"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={
                <p
                  style={{
                    color: "var(--accent-color)",
                    margin: "0",
                    fontWeight: "500",
                    fontFamily: "montserrat",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  Courriel
                </p>
              }
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'The input is not a valid email!' }
              ]}
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="email"
                disabled
                placeholder="Nom d’utilisateur"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handleChange}
              />
            </Form.Item>
            {/* <Form.Item
              name="password"
              label={
                <p
                  style={{
                    color: "var(--accent-color)",
                    margin: "0",
                    fontWeight: "500",
                    fontFamily: "montserrat",
                    fontSize: "calc(.8rem + .2vw)",
                  }}
                >
                  Password
                </p>
              }
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input.Password
                name="password"
                type="password"
                placeholder="************"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handlepassChange}
              />
            </Form.Item> */}
          </div>
          {/* <p
            onClick={handlemodelOpen}
            style={{
              color: "var(--forth-color)",
              margin: "-.9em auto 1em 0",
              width: "fit-content",
              cursor: "pointer",
              fontWeight: "500",
              fontFamily: "montserrat",
              fontSize: "calc(.8rem + .3vw)",
            }}
          >
            Change Password
          </p> */}
          <div className={classes.btnsContainer}>
            <Form.Item>
              <Button
                size="large"
            onClick={handlemodelOpen}
                className={classes.passBtn}
              >
              Change Password
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                htmlType="submit"
                className={classes.saveBtn}
                disabled={loading ? true : false}
                style={{ cursor: loading ? "wait" : "pointer" }}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <Modal
        open={modelOpen}
        onClose={handlemodelClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "hidden", border: "none" }}
      >
        <Box sx={style}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0",
              fontFamily: "montserrat",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "0.2em 0 0 0",
                borderBottom: "1px solid var(--primary-color)",
                borderRadius: "1em",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  margin: "1em auto",
                  fontSize: "calc(1rem + .3vw)",
                  color: "var(--accent-color)",
                  width: "fit-content",
                }}
              >
                Change Password
              </p>
              <div style={{ marginRight: "5%" }}>
                <button
                  style={{
                    position: "relative",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "var(--forth-color)",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                  onClick={handlemodelClose}
                >
                  <CloseSharpIcon
                    style={{ fontSize: "2em", marginTop: "0.6em" }}
                  />
                </button>
              </div>
            </div>
          </div>
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
              maxHeight: "80vh",
              padding: "2em",
            }}
          >
            <Form.Item
              name="currentPassword"
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input.Password
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handlepassChange}
              />
            </Form.Item>

            <Form.Item
              name="newpassword"
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input.Password
                name="newpassword"
                type="password"
                placeholder="New Password"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handlepassChange}
              />
            </Form.Item>

            <Form.Item
              name="confirmpassword"
              style={{ border: "none", borderRadius: ".5em" }}
            >
              <Input.Password
                name="confirmpassword"
                type="password"
                placeholder="Confirm New Password"
                style={{ height: "3em", backgroundColor: "#DED8CC" }}
                onChange={handlepassChange}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "fit-content",
                margin: "auto",
                gap: "1em",
              }}
            >
              <Button
                size="large"
                onClick={handlemodelClose}
                style={{
                  backgroundColor: "#DED8CC",
                  color: "var(--forth-color)",
                  padding: ".5em 2em",
                  fontSize: "calc(.7rem + 0.3vw)",
                }}
              >
                Cancel
              </Button>
              <Form.Item className={classes.formItem}>
                <Button
                  size="large"
                  htmlType="submit"
                  className={classes.saveBtn}
                  disabled={loading ? true : false}
                  style={{
                    cursor: loading ? "wait" : "pointer",
                    padding: ".5em 2em",
                  }}
                >
                  Ajouter
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Box>
      </Modal>
    </>
  );
};

export default AccountDetails;
