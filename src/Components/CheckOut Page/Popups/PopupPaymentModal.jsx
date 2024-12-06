import React, { useEffect, useState } from "react";
import classes from "./PopupModal.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { Row, Col, Button, Select, Form, Input } from "antd";
import { FiEdit } from "react-icons/fi";
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
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import axios from "axios";



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

const { Option } = Select;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const maskConstant = (constant) => {
  if (typeof constant === "string") {
    // If it's a string, replace characters from the second position to the next 5 with "*"
    return constant.charAt(0) + "*".repeat(5) + constant.slice(6);
  } else if (typeof constant === "number") {
    // If it's a number, replace the first 3 digits with "."
    const constantString = constant.toString();
    return ".".repeat(3) + constantString.slice(3);
  } else {
    // Handle other types as needed
    return constant;
  }
};

const validateLessThanFourNumbers = (_, value) => {
  if (!value || /^\d{0,4}$/.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Please enter less than four numbers."));
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

const PopupPaymentModal = ({ open, handleClose, isselectedPayment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const user = useSelector((state) => state.products.userInfo);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [editMode, seteditMode] = useState(false);
  const [addloading, setaddLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()

  const fetchPayments =  () => {
    
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  
  const handleSubmit = async () => {
    setaddLoading(true)
    try {
      if (editMode) {
        // console.log(formData);
        await axios.put(
          `${import.meta.env.VITE_TESTING_API_IMAGE}/users/${user.id}/payments/${editpaymentId}`,
          formData, {
            headers: {
                Authorization: `Bearer ${token}` // Include token in the headers
            }
        }
        );
      } else {
        await axios.post(`${import.meta.env.VITE_TESTING_API_IMAGE}/users/${user.id}/payments`, {
          ...formData,
          default: "true",
        }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });
      }
      handleClose();
      fetchPayments();
      toast.success(language === "eng" ? "Payment card added successfully." : "Carte de paiement ajoutée avec succès.", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error(error.response.data.error, {
      // Toast configuration
      hideProgressBar: true,
    });
      // console.error("Error submitting address:", error);
    } finally {
      setaddLoading(false)
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeNumber = (e) => {
    const { value } = e.target;

    // Remove all non-digit characters from the input value
    const digits = value.replace(/\D/g, '');

    // Format the digits to add spaces every 4 digits
    const formattedValue = digits.replace(/(.{4})/g, '$1 ').trim();

    // Update the input state and form data
    form.setFieldValue('card_number',formattedValue)
    setFormData({ ...formData, card_number: digits }); // Store the raw digits without spaces
  };
  useEffect(() => {
    form.resetFields();
    setFormData({});
  }, [open]);
  return (
    <div>
    <Modal
     open={open}
     onClose={handleClose}
     aria-labelledby="modal-modal-title"
     aria-describedby="modal-modal-description"
     sx={{ overflow: "hidden",border:'none' }}
   >
     <Box sx={style}>
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
         {language === 'eng' ? "Add a new card" : "Ajouter une nouvelle card"}
       </h4>
     <Form
             layout="vertical"
             name="nest-messages"
             form={form}
             // initialValues={formData}
             onFinish={handleSubmit}
             style={{
             width: '100%',
             margin:'0 auto',
             alignItems: "center",
             textAlign: "center",
             justifyItems: "center",
             maxHeight:'80vh',
             padding:'2em',
             fontFamily: "var(--font-family)",
             }}
   >
     <Form.Item name="card_type" rules={[{ required: true, message: 'Please select an option!' }]} style={{width:'100%',}} >
       <Select 
             name="cardType"
             size="large" 
             disabled={editMode}
             value={formData.card_type}
             placeholder="Select card type" 
             dropdownStyle={{ zIndex: 2000 }} 
             onChange={(e)=>setPaymentMethod(e) & handleChange('card_type', e)}>
             <Option value="American Express">American Express</Option>
             <Option value="Discover">Discover</Option>
             <Option value="Master">Master Card</Option>
             <Option value="Visa">Visa Card</Option>
     </Select>
   </Form.Item>
     {paymentMethod != 'PayPal' && <>
     <div className={classes.inputsContainer}>
     <Form.Item
       name="card_number"
       rules={[{ required: true, message: 'Please input your Card Number!' },
          { 
            pattern: /^[\d\s]+$/, // Allows only digits and spaces
            message: `${language === 'fr' ? "Le numéro de la carte ne doit comporter que des chiffres !" :'The card number must be digits only!'}`
          }]}
       style={{border:'none',width:'100%',borderRadius:'.5em'}}
     >
               <Input
               name="card_number"
               placeholder='Card Number'
               size="large" 
              //  value={formData?.card_number}
               style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
               onChange={handleChangeNumber}
               />
     </Form.Item>
     <Form.Item
     name="year" style={{width:'100%',}}
     rules={[
       { required: true, message: 'Please select the year (YY)' },
     ]}
   >
     <Select placeholder="Select year" dropdownStyle={{ zIndex: 2000 }}
               size="large" 
               name='year'
               onChange={(value) => handleChange('year', value)}>
       {/* Add options for the years, adjust the range as needed */}
       {Array.from({ length: 30 }, (_, index) => {
         const currentYear = new Date().getFullYear();
         const fullYear = currentYear + index;
         const lastTwoDigits = String(fullYear).slice(-2);

         return (
           <Option key={lastTwoDigits} value={lastTwoDigits}>
             {fullYear}
           </Option>
         );
       })}

     </Select>
   </Form.Item>

   <Form.Item
     name="month" style={{width:'100%',}}
     rules={[
       { required: true, message: 'Please select the month' },
     ]}
   >
     <Select placeholder="Select month" dropdownStyle={{ zIndex: 2000 }}
               size="large"
               name='month'
               onChange={(value) => handleChange('month', value)} >
       {/* Add options for the months using monthNames array */}
       {monthNames.map((month, index) => (
         <Option key={index + 1} value={String(index + 1).padStart(2, '0')}>
           {month} ({String(index + 1).padStart(2, '0')})
         </Option>
       ))}
     </Select>
   </Form.Item>
     <Form.Item
       name="cvv"
       rules={[
         {
           validator: validateLessThanFourNumbers,
         },
       ]}
       style={{border:'none',width:'100%',borderRadius:'.5em'}}
     >
               <Input
               name="cvv"
               placeholder='CVV'
               size="large"
               // value={formData?.CVV}
             style={{ height: "3em", backgroundColor: "#fff", fontFamily:'var(--font-family)' }}
                     onChange={(e) => handleChange('cvv', e.target.value)}
               />
     </Form.Item>
     
     </div><div style={{display:'flex',flexWrap:'wrap' ,width:'fit-content',margin:'auto',gap:'1em'}}>
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
                 fontFamily: "var(--font-family)",
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
     </>}
   </Form>
   {/* {paymentMethod == 'PayPal' && <div style={{width:'100%',display:'flex'}}><button 
                                     style={{margin:'0 auto',backgroundColor:'#FAAF00',padding:'1em 6em',borderRadius:'1em'}}
                                     onClick={()=>toast.error(`en cours de construction`, {
                                       position: "top-right",
                                       autoClose: 1500,
                                       hideProgressBar: true,
                                       closeOnClick: true,
                                       pauseOnHover: true,
                                       draggable: true,
                                       progress: 0,
                                       theme: "colored",
                                       })} > </button></div>} */}

     </Box>
   </Modal>
    </div>
  );
};



export default PopupPaymentModal;
