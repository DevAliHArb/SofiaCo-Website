import React, { useEffect, useState } from 'react'
import classes from './Payment.module.css'
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { FiEdit } from "react-icons/fi";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Row, Col, Button,  Select, Form, Input } from 'antd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment, deletePayment, editPayment, editDefaultPAY, editUser } from '../../../Common/redux/productSlice';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { GiCheckMark } from "react-icons/gi";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import Visa from '../../../../assets/VisaIcon.png'
import MasterCard from '../../../../assets/MasterCard.png'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from '../../../../Data.json'
import nodata from '../../../../assets/nopayments.svg'
import directPay from '../../../../assets/directPay.png'
import PayPal from '../../../../assets/PayPal.png'


const { Option } = Select;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


const maskConstant = (constant) => {
  if (typeof constant === "string") {
    const visibleChars = constant.slice(-4); // Extract last four characters
    const hiddenChars = "*".repeat(Math.max(0, constant.length - 4)); // Replace rest with asterisks
    return hiddenChars + visibleChars;
  } else {
    // Handle other types as needed
    return constant;
  }
};

  const validateLessThanFourNumbers = (_, value) => {
    if (!value || /^\d{0,4}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter less than four numbers.'));
  };
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
const Payment = () => {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.products.userInfo);
    const [selectedPayment, setselectedPayment] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [editMode, seteditMode] = useState(false);
    const [editdata, seteditdata] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [addloading, setaddLoading] = useState(false);
  const [paymentslist, setPaymentsList] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); form.resetFields(); setFormData({})}
  
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  // Inside the Payment component
useEffect(() => {
  if (!open) {
    // console.log('hello')
    // console.log(formData)
  }
}, [open]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const sortedPayments = response.data.data.sort((a, b) => a.id - b.id);
      setPaymentsList(sortedPayments);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      // console.error("Error fetching addresses:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  
  const handleChange1 = async (id) => {
    try {
      // Update the database to set the selected address as default
      await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments/${id}`,
        {
          default: "true",
          default_pay: 'card'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      dispatch(editUser({...user, default_pay: 'card'}));
      fetchPayments();
      toast.success(`${language === 'eng' ? "Default Payment card is set successfully" : "La carte de paiement par défaut a été définie avec succès"}`, {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      // console.error("Error setting default payment:", error);
    }
  };
  const handleChange2 = async (props) => {
    if (user.default_pay !== props) {
    try {
      // console.log(passData)
        // Make API call to change password
        const response = await axios.put(`https://api.leonardo-service.com/api/bookshop/users/${user.id}`, {default_pay: props}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Default Payment card is set successfully");
      dispatch(editUser({...user, default_pay: props}));
        toast.success(`${language === 'eng' ? "Default Payment card is set successfully" : "La carte de paiement par défaut a été définie avec succès"}`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0 ,
          theme: "colored",
          })
    } catch (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0 ,
          theme: "colored",
          })
    }
      
    }
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
          `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments/${editpaymentId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        toast.success(language === "eng" ? "Payment card edited successfully" : "Carte de paiement modifiée avec succès", {
          // Toast configuration
          hideProgressBar: true,
        });
      } else {
        await axios.post(
          `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments`,
          {
            ...formData,
            default: "true",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        toast.success(language === "eng" ? "Payment card added successfully" : "Carte de paiement ajoutée avec succès", {
          // Toast configuration
          hideProgressBar: true,
        });
      }
      handleClose();
      fetchPayments();
    } catch (error) { 
      toast.error(error.response.data.error, {
      // Toast configuration
      hideProgressBar: true,
    });
      // console.error("Error submitting payment:", error);
    } finally {
      setaddLoading(false)
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setPaymentsList((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== id)
      );
      toast.success(language === "eng" ? "Payment card deleted successfully" : "Carte de paiement supprimée avec succès", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      // console.error("Error deleting payment:", error);
    }
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  return (
    <>
    <div className={classes.paymentContainer}>
            <div className={classes.header}>
              <div className={classes.headtitle}><h3 style={{fontWeight:"600",marginTop:'0.2em'}}>
              {data.AccountProfilePage.Payment.subtitle[language]}
              </h3></div>
            </div>
          <div className={classes.cardContainer}> 
            {paymentslist?.map((item, index) => (
            <div key={item.id} onClick={()=>{ handleChange1(item.id)}} className={`${(item.default === 'true' && user.default_pay === 'card') ? classes.paymentCardSelected : classes.paymentCard}`} >
              <div className={classes.contantContainer}>
                      <div className={classes.contant}>
                        <div style={{display:'flex',flexDirection:"row"}} >
                        <img alt='' src={getImageSrc(item.card_type)} style={{height:'4em',width:'auto',margin:'0 0 0 -.55em',padding:'0'}}/>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <p style={{margin:'.2em'}}>{item.card_type}</p>
                          <p style={{margin:'.2em'}}>{maskConstant(item.card_number)}</p>
                        </div>
                        </div>
                        <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          color: '#fff',
                          marginTop: ".5em",
                        }}
                      >
                        <p
                          style={{
                            width: ".7em",
                            height: ".7em",
                            border: (item.default === 'true' && user.default_pay === 'card') ? ".2em solid var(--secondary-color)" : ".2em solid var(--primary-color)",
                            borderRadius: "50%",
                            margin: ".3em 0",
                            backgroundColor: "#fff",
                            marginRight: ".3em",
                          }}
                        >
                          <span style={{position:'absolute', width:'.5em', height:'0.5em', background: (item.default === 'true' && user.default_pay === 'card') ? 'var(--secondary-color)' : '#fff', margin:'0.1em', borderRadius:'50%'}}></span>
                        </p>
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}>Default</p>
                      </div>
                        </div>
                    <div className={classes.addtocart}>
                        {/* <button className={classes.editBtn} onClick={()=>{setFormData(item);
                                                                    seteditdata(item)
                                                                     seteditMode(true);
                                                                     setEditaddressid(item.id);
                                                                     handleOpen();}} style={{color:selectedPayment === item.id ? 'var(--secondary-color)': 'var(--forth-color)'}}> 
                                                Edit</button> */}
                        <button className={classes.deleteBtn}
                        style={{background: (item.default === 'true' && user.default_pay === 'card') ? 'var(--secondary-color)' : 'var(--primary-color)'}}
                          onClick={()=>{dispatch(deletePayment(item.id)),handleDeletePayment(item.id)}}
                        >
                          <img src={DeleteIcon}
                        style={{ width: "1.5em", marginTop: ".05em 0.1em" }}/>
                        </button>
                      </div>
                    </div>
                </div>
                ))}
                <div onClick={()=>{ handleChange2('direct')}} className={`${user.default_pay === 'direct' ? classes.paymentCardSelected : classes.paymentCard}`} >
                  <div className={classes.contantContainer}>
                          <div className={classes.contant}>
                            <div style={{display:'flex',flexDirection:"row"}} >
                            <img alt='' src={directPay} style={{height:'3em',width:'auto',margin:'0 0 1em 0',padding:'0'}}/>
                            <div style={{display:'flex',flexDirection:'column'}}>
                              <p style={{margin:'auto .2em',fontWeight:"500"}}> Direct Payment</p>
                              {/* <p style={{margin:'.2em'}}>vtvf</p> */}
                            </div>
                            </div>
                        <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          color: '#fff',
                          marginTop: ".5em",
                        }}
                      >
                        <p
                          style={{
                            width: ".7em",
                            height: ".7em",
                            border: user.default_pay === 'direct' ? ".2em solid var(--secondary-color)" : ".2em solid var(--primary-color)",
                            borderRadius: "50%",
                            margin: ".3em 0",
                            backgroundColor: "#fff",
                            marginRight: ".3em",
                          }}
                        >
                          <span style={{position:'absolute', width:'.5em', height:'0.5em', background: user.default_pay === 'direct' ? 'var(--secondary-color)' : '#fff', margin:'0.1em', borderRadius:'50%'}}></span>
                        </p>
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}>Default</p>
                      </div>
                            </div>
                        <div className={classes.addtocart}>
                          </div>
                        </div>
                    </div>
                <div onClick={()=>{ handleChange2('paypal')}} className={`${user.default_pay === 'paypal' ? classes.paymentCardSelected : classes.paymentCard}`} >
                  <div className={classes.contantContainer}>
                          <div className={classes.contant}>
                            <div style={{display:'flex',flexDirection:"row"}} >
                            <img alt='' src={PayPal} style={{height:'3em',width:'auto',margin:'0 0 1em 0',padding:'0'}}/>
                            <div style={{display:'flex',flexDirection:'column',margin:"auto 0"}}>
                              <p style={{margin:'auto .2em',fontWeight:"500"}}> PayPal</p>
                              {/* <p style={{margin:'.2em'}}>vtvf</p> */}
                            </div>
                            </div>
                        <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          color: '#fff',
                          marginTop: ".5em",
                        }}
                      >
                        <p
                          style={{
                            width: ".7em",
                            height: ".7em",
                            border: user.default_pay === 'paypal' ? ".2em solid var(--secondary-color)" : ".2em solid var(--primary-color)",
                            borderRadius: "50%",
                            margin: ".3em 0",
                            backgroundColor: "#fff",
                            marginRight: ".3em",
                          }}
                        >
                          <span style={{position:'absolute', width:'.5em', height:'0.5em', background: user.default_pay === 'paypal' ? 'var(--secondary-color)' : '#fff', margin:'0.1em', borderRadius:'50%'}}></span>
                        </p>
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}>Default</p>
                      </div>
                            </div>
                        <div className={classes.addtocart}>
                          </div>
                        </div>
                    </div>
                
            </div>
            <button className={classes.addBtn} onClick={()=>{handleOpen();
                                                               seteditMode(false)
                                                               setFormData({})}}>
            {language === 'eng' ? "+ Add a new card" : "+ Ajouter une nouvelle card"}</button>
       </div>  
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
        <Form.Item name="card_type" rules={[{ required: true, message: 'Please select an option!' }]} >
          <Select 
                name="cardType"
                size="large" 
                disabled={editMode}
                value={formData.card_type}
                placeholder="Select card type" 
                dropdownStyle={{ zIndex: 2000 }} 
                onChange={(e)=>setPaymentMethod(e) & handleChange('card_type', e)}>
          <Option value="Visa">Visa Card</Option>
          <Option value="Master">Master Card</Option>
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
          style={{border:'none',borderRadius:'.5em'}}
        >
                  <Input
                  name="card_number"
                  placeholder='Card Number'
                  size="large" 
        // value={inputValue}
        style={{ height: "3em", backgroundColor: "#fff", fontFamily: 'var(--font-family)' }}
        onChange={handleChangeNumber}
      />
    </Form.Item>
        <Form.Item
        name="year"
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
        name="month"
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
          style={{border:'none',borderRadius:'.5em'}}
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
     </>
  )
}

const getImageSrc = (type) => {
  switch (type) {
    case 'Visa':
      return Visa;
      case 'Master':
      return MasterCard;
    default:
      return '';
  }
  };

export default Payment