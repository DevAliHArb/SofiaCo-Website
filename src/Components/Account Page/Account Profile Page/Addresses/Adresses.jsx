import React, { useContext, useEffect, useState } from "react";
import classes from "./Adresses.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { FiEdit } from "react-icons/fi";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Row, Col, Button, Checkbox, Form, Input, Select } from "antd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  resetAddresses,
  deleteAddress,
  editAddress,
  editDefaultAdd,
} from "../../../Common/redux/productSlice";
import { Class } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import data from '../../../../Data.json'
import nodata from '../../../../assets/noaddresses.svg'
import AuthContext from "../../../Common/authContext";

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
const Adresses = () => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const user = useSelector((state) => state.products.userInfo);
  const [selectedAdress, setselectedAdress] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [addloading, setaddLoading] = useState(false);
  const [addresseslist, setAddressesList] = useState([]);
  const [editaddressId, setEditaddressid] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (addressData) => {
    setFormData(addressData || {}); // Update formData with the complete address object
    setOpen(true);
  };
  
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const handleClose = () => {
    setOpen(false);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // console.log("Response data:", response.data);
      const sortedAddresses = response.data.data.sort((a, b) => a.id - b.id);
        setAddressesList(sortedAddresses);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      // console.error("Error fetching addresses:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange1 = async (id) => {
    try {
      // Update the database to set the selected address as default
      await axios.put(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses/${id}`,
        {
          default: "true",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      fetchAddresses();
      toast.success(language === "eng" ? "Default address is set!" : "L'adresse par défaut est définie !", {
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
      // console.error("Error setting default address:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };

  const handleSubmit = async () => {
    setaddLoading(true);
    try {
      if (editMode) {
        // console.log(formData);
        await axios.put(
          `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses/${editaddressId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        toast.success(language === "eng" ? "Address Edited!" : "Adresse modifiée !", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
      } else {
        await axios.post(
          `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses`,
          {
            ...formData,
            default: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        toast.success(language === "eng" ? "Address added!" : "Adresse ajoutée !", {
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
      handleClose();
      fetchAddresses();
    } catch (error) {
      // console.error("Error submitting address:", error);
    } finally {
      setaddLoading(false);
      window.location.reload();
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setAddressesList((prevAddresses) =>
        prevAddresses.filter((address) => address.id !== id)
      );
      fetchAddresses();
      toast.success(language === "eng" ? "Address Deleted" : "Adresse supprimée", {
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
      // console.error("Error deleting address:", error);
    }
  };
  
  useEffect(() => {
    form.resetFields();
    setFormData({});
    if (editMode) {
      form.setFieldsValue(formData)
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormData({}); // Reset formData to empty object
      form.resetFields(); // Reset form fields
    }
  }, [open]);

// console.log(formData)
  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }
  return (
    <>
      <div className={classes.adressesContainer}>
        <div className={classes.header}>
          <div className={classes.headtitle}>
            <h3 style={{ fontWeight: "600", marginTop: "0.2em" }}>
            {data.AccountProfilePage.Adresses.subtitle[language]}
            </h3>
          </div>
        </div>
          {addresseslist?.length === 0 ? 
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            <h1>{language === 'eng' ? "No addresses found!" : "Aucune adresse trouvée !"}</h1>
          </div>
            :
            <div className={classes.adressCardContainer}>
          {addresseslist?.map((item, index) => (
            <div key={index} style={{ flex: "1", width: "100%" }}>
              <div
                key={item.id}
                onClick={() => {
                  handleChange1(item.id);
                }}
                className={`${
                  item.default === "true"
                    ? classes.adressCardSelected
                    : classes.adressCard
                }`}
              >
                <div className={classes.contantContainer}>
                  <div className={classes.contant}>
                    <p style={{ margin: ".1em 0" }}>{item.name}</p>
                    <p style={{ margin: ".1em 0" }}>{item.company}</p>
                    <p style={{ margin: ".1em 0" }}>
                      {item.country}, {item.city}, {item.address.length > 45 ? item.address.substring(0, 45) : item.address}
                    </p>
                    <p style={{ margin: ".1em 0" }}>{item.postalcode} </p>
                    {/* {item.default === 'true' && ( */}
                        <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          color: '#fff',
                          marginTop: ".5em",
                          margin:'auto 0 0 0'
                        }}
                      >
                        <p
                          style={{
                            width: "1em",
                            height: "1em",
                            border: item.default === 'true' ? ".2em solid var(--secondary-color)" : ".2em solid var(--primary-color)",
                            borderRadius: "50%",
                            margin: ".3em 0",
                            backgroundColor: "#fff",
                            marginRight: ".3em",
                          }}
                        >
                          <span style={{position:'absolute', width:'.7em', height:'0.7em', background: item.default === 'true' ? 'var(--secondary-color)' : '#fff', margin:'0.17em 0.13em', borderRadius:'50%'}}></span>
                        </p>
                        <p style={{ margin: ".2em 0", alignSelf:'center' }}>Default</p>
                      </div>
                    {/* )} */}
                  </div>
                  <div className={classes.addtocart}>
                    <button
                      className={classes.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(item);
                        setEditMode(true);
                        handleOpen(item);
                        setEditaddressid(item.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={classes.deleteBtn}
                      onClick={(e) => {
                        dispatch(deleteAddress(item.id));
                        handleDeleteAddress(item.id);
                      }}
                      style={{
                        background: item.default === 'true' ? 'var(--secondary-color)': ''
                      }}
                    >
                      <img
                        src={DeleteIcon}
                        style={{ width: "1.5em", marginTop: ".05em 0.1em" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
        </div>
          }
        <button
            className={classes.addBtn}
            onClick={() => {
              setEditMode(false);
              setFormData({})
              handleOpen();
            }}
          >
            {language === 'eng' ? "+ Add a new Address" : "+ Ajouter une nouvelle Addresse"}
          </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "hidden", border: "none" }}
      >
        <Box sx={style}>
        {editMode ?
          <h4
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
          </h4> : 
          <h4
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
            // initialValues={Object.keys(formData)?.length !== 0 ? formData : {}}
            // initialValues={formData}
            onFinish={handleSubmit}
            style={{
              width: "100%",
              margin: "0 auto",
              alignItems: "center",
              textAlign: "center",
              justifyItems: "center",
              maxHeight: "80vh",
              padding: "2em",
              overflowX: "hidden",
              overflowY: "scroll",
              gap: "0",
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
                style={{ border: "none",width:'100%',borderRadius: ".5em" }}
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
                  min: 12,
                  message: "Le titre doit comporter entre 12 et 64 caractères.",
                },
              ]}
              style={{ border: "none", borderRadius: ".5em", width: "100%" }}
            >
              <Input
                name="address"
                size="large"
                placeholder={language === 'eng' ? "Street name, apartment, etc." : "Nom de la rue, appartement, etc."}
                className={classes.inputt}
                value={formData?.address || ''}
                onChange={(e) => handleChange("address", e.target.value)}
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
                  {!editMode ? language === 'eng' ? "Add" : "Ajouter":
                  language === "eng" ? "Save" : "Économiser"}
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
    </>
  );
};

export default Adresses;
