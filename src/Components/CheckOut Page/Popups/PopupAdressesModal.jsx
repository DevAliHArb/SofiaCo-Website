import React, { useEffect, useState } from "react";
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
import { AddressCountries } from "../../Common/Constants/Data";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: '#fff',
  boxShadow: 24,
  fontSize:'calc(0.7rem + 0.2vw)',
  fontFamily:'var(--font-family)',
  overflow:'hidden',
  borderRadius:'1em'
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
  const user = useSelector((state) => state.products.userInfo);
  const [formData, setFormData] = useState(formDataa);
  const [addloading, setaddLoading] = useState(false);
  const [form] = Form.useForm();
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
    console.log(formData);
  };

  console.log(editModee);

  useEffect(() => {
    form.resetFields();
    setFormData({});
  }, [open]);

  const handleSubmit = async () => {
    setaddLoading(true)
    try {
      if (editModee) {
        console.log(formData)
        await axios.put(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/addresses/${editaddressId}`, formData, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });
      } else {
        await axios.post(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/addresses`, {
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
      console.error('Error submitting address:', error);
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
        <Box sx={style}  >
       <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                initialValues={formDataa}
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
          <h4 style={{color:'var(--forth-color)',fontWeight:'600',fontFamily:'var(--font-family)',width:'100%',textAlign:'start',fontSize:'calc(.8rem + .3vw)'}}>Ajouter une nouvelle addresse</h4>
        <div className={classes.inputsContainer}>
        <Form.Item
          name="title"
          label= {(<p style={{color:'var(--accent-color)',margin:'0',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'calc(.8rem + .2vw)'}}>
          Nickname</p>)}
          rules={[{ required: true, message: 'Veuillez saisir le titre de votre adresse!' }]}
          style={{border:'none',borderRadius:'.5em'}}
        >
                <Input
                size="large" 
                name="title"
                value={formData.Nickname}
                      style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
                      onChange={(e) => handleChange("title", e.target.value)}
                />
        </Form.Item>
        <Form.Item
          name="name"
          label=  {(<p style={{color:'var(--accent-color)',margin:'0',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'calc(.8rem + .2vw)'}}>
          Nom / Prénom</p>)}
          rules={[{ required: true, message: 'Veuillez saisir votre pays!' }]}
          style={{border:'none',borderRadius:'.5em'}}
        >
                  <Input
                  name="name"
                  size="large"
                  value={formData.name}
                        style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
                        onChange={(e) => handleChange("name", e.target.value)}
                  />
        </Form.Item>
        <Form.Item
          name="company"
          label={(<p style={{color:'var(--accent-color)',margin:'0',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'calc(.8rem + .2vw)'}}>
          Companie (optional)</p>)}
          style={{border:'none',borderRadius:'.5em'}}
        >
                <Input
                size="large" 
                name="company"
                value={formData.Company}
                      style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
                      onChange={(e) => handleChange("company", e.target.value)}
                />
        </Form.Item>
              <Form.Item
                name="country"
                label={
                  <p
                    style={{
                      color: "var(--accent-color)",
                      margin: "0",
                      fontWeight: "500",
                      fontFamily: "var(--font-family)",
                      fontSize: "calc(.8rem + .2vw)",
                    }}
                  >
                    Pays
                  </p>
                }
                rules={[
                  { required: true, message: "Veuillez saisir votre pays!" },
                ]}
                initialValue={formData?.country}
                style={{ border: "none", borderRadius: ".5em" }}
              >
                  <Select
                    name="country"
                    // placeholder={
                    //   data.AccountProfilePage.Adresses.countryInput[
                    //     language
                    //   ]
                    // }
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
                    {AddressCountries.map((country, index) => (
                      <Option key={index} value={country.name}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
              </Form.Item>

      </div>
        <Form.Item
          name="address"
          label= {(<p style={{color:'var(--accent-color)',margin:'0',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'calc(.8rem + .2vw)'}}>
          Addresse</p>)}
          rules={[{ required: true, message: 'Veuillez saisir votre adresse!' }]}
          style={{border:'none',borderRadius:'.5em',width:'100%'}}
        >
          <Input
          name="address"
          size="large" 
          placeholder='Street name, apartment, etc.'
          value={formData.address}
          style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
          onChange={(e) => handleChange("address", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="city"
          rules={[{ required: true, message: 'Veuillez saisir votre ville!' }]}
          style={{border:'none',borderRadius:'.5em'}}
        >
                <Input
                size="large" 
                name="city"
                placeholder='Ville'
                value={formData.city}
                      style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
                      onChange={(e) => handleChange("city", e.target.value)}
                />
        </Form.Item>
        <Form.Item
          name="postalcode"
          rules={[{ required: true, message: 'Veuillez saisir votre Code postal!' }]}
          style={{border:'none',borderRadius:'.5em',backgroundColor:'#DED8CC'}}
        >
                  <Input
                  name="postalcode"
                  placeholder='Code postal'
                  size="large" 
                  value={formData.postalcode}
                        style={{border:'none', height:'3em',backgroundColor:'#DED8CC'}}
                        onChange={(e) => handleChange("postalcode", e.target.value)}
                  />
        </Form.Item>
        {/* <Form.Item style={{marginTop:'-2em',marginBottom:'1em'}}>
          <div style={{width:'100%', textAlign: 'start',color:'var(--forth-color)',cursor:'pointer',marginTop:'.5em'}}>
            <Checkbox style={{fontFamily:'var(--font-family)',fontStyle:'normal',fontSize:'small'}}>
            <p style={{fontFamily:'var(--font-family)',fontStyle:'normal',fontSize:'small',color:'var(--accent-color)'}}>Use as my Default Address</p>
            </Checkbox>
          </div>
        </Form.Item> */}
        <div style={{display:'flex',flexWrap:'wrap' ,width:'fit-content',margin:"auto",gap:'1em'}}>
        <Button 
           size="large"
           className={classes.Btn } onClick={handleClose}
          style={{backgroundColor:'#DED8CC',color: 'var(--forth-color)'}}>
            Supprimer
          </Button>
          <Form.Item className={classes.formItem}>
        <Button 
           size="large"
           htmlType="submit" 
           disabled = {addloading}         
           style={{cursor: addloading ? 'wait' : 'pointer'}}
           className={classes.Btn }>
            Ajouter
          </Button>
        </Form.Item>
        </div>
        {/* </div>  */}
      </Form>
       </Box>
      </Modal>
    </div>
  );
};
export default PopupAdressesModal;
