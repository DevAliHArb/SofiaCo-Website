import React, { useContext, useEffect, useState } from "react";
import classes from "./PopupModal.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { Row, Col, Button, Checkbox, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  addPayment,
  deletePayment,
  editPayment,
  editDefaultAdd,
  editDefaultPAY,
  addAddress,
  editAddress,
} from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import data from '../../../Data.json'
import AuthContext from "../../Common/authContext";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  bgcolor: "var(--authbg-color)",
  boxShadow: 24,
  fontSize: "calc(0.7rem + 0.2vw)",
  fontFamily: "var(--font-family)",
  overflow: "hidden",
  borderRadius: "1em",
  padding:'1em 2em'
};

function generateNewId(arrayOfObjects) {
  if (arrayOfObjects.length === 0) {
    // If the array is empty, start with ID 1
    return 1;
  }

  // Find the maximum ID in the array
  const maxId = Math.max(...arrayOfObjects.map((obj) => obj.id));

  // Generate a new ID by adding 1 to the maximum ID
  const newId = maxId + 1;

  return newId;
}

const PopupAdressesModal = ({ open, handleClose, isselectedAddress, editModee, formDataa, editaddressId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = useSelector((state) => state.products.userInfo);
  const [formData, setFormData] = useState(formDataa);
  const [addloading, setaddLoading] = useState(false);
  const [form] = Form.useForm();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const fetchAddresses = async () => {
    
  };
  
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFormData({});
    if (editModee) {
      form.setFieldsValue(formDataa)
    }
  }, [open]);

  const handleSubmit = async () => {
    setaddLoading(true)
    try {
      if (editModee) {
        // console.log(formData)
        await axios.put(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses/${editaddressId}`, formData, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });
      } else {
        await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses`, {
          ...formData,
          default: true
        }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });
      }
      handleClose();
      fetchAddresses();
      form.resetFields()
    } catch (error) {
      // console.error('Error submitting address:', error);
    } finally {
      setaddLoading(false)
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={()=>handleClose() & form.resetFields()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "hidden",border:'none' }}
      >
        
        <Box sx={style}>
          {editModee ?<h4
            style={{
              color: "#fff",
              fontWeight: "600",
              fontFamily: "var(--font-family)",
              width: "100%",
              padding: "0 2em",
              textAlign: "start",
              fontSize: "calc(.9rem + .3vw)",
            }}
          >
          {language === "eng" ? "Edit address" : "Modifier l'adresse"}
          </h4> : <h4
            style={{
              color: "#fff",
              fontWeight: "600",
              fontFamily: "var(--font-family)",
              width: "100%",
              padding: "0 2em",
              textAlign: "start",
              fontSize: "calc(.9rem + .3vw)",
            }}
          >
          {language === "eng" ? "Add a new address" : "Ajouter une nouvelle addresse"}
          </h4>}
          <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                // initialValues={formDataa}
                onFinish={handleSubmit}
                style={{
                width: '100%',
                margin:'0 auto',
                alignItems: "center",
                textAlign: "center",
                justifyItems: "center",
                maxHeight:'80vh',
                padding:'2em',
                overflowX:"hidden",
                overflowY:'scroll'
                }}
      >
            <div className={classes.inputsContainer}>
              <Form.Item
                name="title"
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
                    {
                      data.AccountProfilePage.Adresses.AdresseInputTitle[
                        language
                      ]
                    }
                  </p>
                }
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le titre de votre title!",
                  },
                  {
                    max: 24,
                    message: "Le titre ne doit pas dépasser 24 caractères.",
                  },
                ]}
                style={{ border: "none",width:'100%', borderRadius: ".5em" }}
              >
                <Input
                  size="large"
                  name="title"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                    placeholder={
                      data.AccountProfilePage.Adresses.AdresseInputTitle[
                        language
                      ]
                    }
                  value={ formData?.title}
                  className={classes.inputt}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="name"
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
                    {
                      data.AccountProfilePage.Adresses.NomInput[
                        language
                      ]
                    }
                  </p>
                }
                rules={[
                  { required: true, message: "Veuillez saisir votre nom!" },
                  {
                    max: 24,
                    message: "Le titre ne doit pas dépasser 24 caractères.",
                  },
                ]}
                style={{ border: "none",width:'100%', borderRadius: ".5em" }}
              >
                <Input
                  name="name"
                  size="large"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                    placeholder={
                      data.AccountProfilePage.Adresses.NomInput[
                        language
                      ]
                    }
                  className={classes.inputt}
                  // value={formData?.name || ''}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="company"
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
                    {
                      data.AccountProfilePage.Adresses.CompanyInput[
                        language
                      ]
                    }
                  </p>
                }
                style={{ border: "none",width:'100%', borderRadius: ".5em" }}
                rules={[
                  { required: true, message: "Veuillez saisir votre companie!" },
                  {
                    max: 30,
                    message: "Le titre ne doit pas dépasser 30 caractères.",
                  },
                ]}
              >
                <Input
                  size="large"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                    placeholder={
                      data.AccountProfilePage.Adresses.CompanyInput[
                        language
                      ]
                    }
                  name="company"
                  value={formData?.company || ''}
                  className={classes.inputt}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="country"
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
                    {
                      data.AccountProfilePage.Adresses.countryInput[
                        language
                      ]
                    }
                  </p>
                }
                rules={[
                  { required: true, message: "Veuillez saisir votre pays!" },
                ]}
                initialValue={formData?.country}
                style={{ border: "none",width:'100%', borderRadius: ".5em" }}
              >
                  <Select
                    name="country"
                    placeholder={
                      data.AccountProfilePage.Adresses.countryInput[
                        language
                      ]
                    }
                    size="large"
                    value={formData?.country || ''}
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                    }}
                    dropdownStyle={{ zIndex: 2000 }}
                    showSearch // Enables searching
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(e) => handleChange("country", e)}
                  >
                    {/* Add options for all countries */}
                    {authCtx.countries?.map((country, index) => (
                      <Option key={index} value={country.name}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
              </Form.Item>
            </div>
            <Form.Item
              name="address"
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
                  {
                      data.AccountProfilePage.Adresses.AdresseInput[
                        language
                      ]
                    }
                </p>
              }
              rules={[
                { required: true, message: "Veuillez saisir votre adresse!" },
                {
                  max: 64,
                  message: "Le titre doit comporter entre 12 et 64 caractères.",
                },
              ]}
              style={{ border: "none", borderRadius: ".5em", width: "100%" }}
            >
              <Input
                name="address"
                size="large"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                placeholder={language === 'eng' ? "1. Street name, apartment, ..." : "1. Nom de la rue, appartement, ..."}
                className={classes.inputt}
                value={formData?.address || ''}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="address2"
              rules={[
                {
                  max: 64,
                  message: "Le titre doit comporter entre 12 et 64 caractères.",
                },
              ]}
              style={{ border: "none", borderRadius: ".5em", width: "100%" }}
            >
              <Input
                name="address2"
                size="large"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                placeholder={language === 'eng' ? "2. Street name, apartment, ..." : "2. Nom de la rue, appartement, ..."}
                className={classes.inputt}
                value={formData?.address || ''}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="city"
              rules={[
                { required: true, message: "Veuillez saisir votre ville!" },
                {
                  max: 16,
                  message: "Le titre ne doit pas dépasser 16 caractères.",
                },
              ]}
              style={{ border: "none",width:'100%', borderRadius: ".5em" }}
            >
              <Input
                size="large"
                name="city"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                placeholder={language === 'eng' ? "City" : "Ville"}
                className={classes.inputt}
                value={formData?.city || ''}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="postalcode"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre Code postal!",
                },
                {
                  max: 8,
                  message: "Le titre ne doit pas dépasser 8 caractères.",
                },
              ]}
              style={{
                border: "none",width:'100%',
                borderRadius: ".5em",
                backgroundColor: "#DED8CC",
              }}
            >
              <Input
                name="postalcode"
                placeholder={language === 'eng' ? "Postal code" : "Code postal"}
                size="large"
                    style={{
                      width: "100%",
                      height: "3em",
                      textAlign: "start",
                      backgroundColor: "#fff",
                    }}
                className={classes.inputt}
                value={formData?.postalcode || ''}
                onChange={(e) => handleChange("postalcode", e.target.value)}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "fit-content",
                margin: "3em 0 auto auto",
                gap: "1em",
              }}
            >
              <Button
                size="large"
                className={classes.cancel}
                onClick={handleClose}
              >
                {language === 'eng' ? "Cancel" : "Supprimer"}
              </Button>
              {/* <Form.Item className={classes.formItem}> */}
                <Button
                  size="large"
                  htmlType="submit"
                  disabled={addloading ? true : false}
                style={{
                    cursor: addloading ? "wait" : "pointer",
                }}
                  className={classes.addAddBtn}
                >
                  {language === 'eng' ? "Add" : "Ajouter"}
                </Button>
              {/* </Form.Item> */}
              <Button
                size="large"
                className={classes.cancelmob}
                onClick={handleClose}
              >
                {language === 'eng' ? "Cancel" : "Supprimer"}
              </Button>
            </div>
            {/* </div>  */}
          </Form>
        </Box>
      </Modal>
    </div>
  );
};
export default PopupAdressesModal;
