import React, { useContext, useEffect, useState } from 'react'
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
import { loadStripe } from '@stripe/stripe-js';
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import AuthContext from '../../../Common/authContext';


const { Option } = Select;

const monthNamesEng = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthNamesFr = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];


const maskConstant = (constant) => {
  if (typeof constant === "string") {
    const visibleChars = constant.slice(-4); // Extract last four characters
    const hiddenChars = "*".repeat(Math.max(0, 16 - 4)); // Replace rest with asterisks
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
  const authCtx = useContext(AuthContext)
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
    return sessionStorage.getItem("token");
  };

  const token = getToken();
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments`,
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
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments/${id}`,
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
        const response = await axios.put(`${import.meta.env.VITE_TESTING_API}/users/${user.id}`, {default_pay: props}, {
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


  const [cardBrand, setCardBrand] = useState(null);
  // Function to handle changes in the CardNumberElement
  const handleCardChange = (event) => {
    console.log(event)
    if (event.brand) {
      setCardBrand(event.brand); // Update state with detected card brand
    }
  };

    // Mapping of card brands to their image URLs (Use your own images)
    const cardBrandImages = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
      mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
      discover: "https://upload.wikimedia.org/wikipedia/commons/5/59/Discover_Card_logo.png",
      diners: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Diners_Club_Logo3.svg",
      jcb: "https://upload.wikimedia.org/wikipedia/commons/0/0c/JCB_logo.svg",
      unionpay: "https://upload.wikimedia.org/wikipedia/commons/5/5a/UnionPay_logo.svg",
    };


  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }
  
    setaddLoading(true); // Start loading state
  
  
    const cardNumberElement = elements.getElement(CardNumberElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });
  
    if (error) {
      console.error("Error creating Stripe token:", error);
      alert(error.message);
      setaddLoading(false);
      return;
    }
  // Check if the card already exists (match by card brand and last 4 digits)
  const cardExists = paymentslist.some(
    (item) =>
      item.card_type === paymentMethod?.card?.brand &&
      item.card_number === paymentMethod?.card?.last4 // Compare last 4 digits
  );

  if (cardExists) {
    setaddLoading(false);
    return toast.info(
      language === "eng"
        ? "Payment card already exists. Delete it and try again"
        : "La carte de paiement existe déjà. Supprimez-la et réessayez",
      { hideProgressBar: true }
    );
  }
    // console.log("PaymentMethod created:", paymentMethod?.card);
  
    const data = {
      holder_name: formData?.holder_name,
      payment_method: paymentMethod.id,
      card_type: paymentMethod?.card?.brand,
      card_number: paymentMethod?.card?.last4, // Store last 4 digits
      month: paymentMethod?.card?.exp_month,
      year: paymentMethod?.card?.exp_year,
      default: formData?.default ? formData?.default : 'false',
    };
  
    try {
      await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success(
        language === "eng"
          ? "Payment card added successfully"
          : "Carte de paiement ajoutée avec succès",
        { hideProgressBar: true }
      );
  
      // Fetch updated payment methods (if needed)
      fetchPayments();
      handleClose();
    } catch (error) {
      console.error(
        language === "eng"
          ? "Error submitting card:"
          : "Erreur de soumission de la carte :",
        error.response?.data?.error || error.message
      );
  
      toast.error(
        error.response?.data?.error ||
          (language === "eng"
            ? "Failed to add payment card"
            : "Échec de l'ajout de la carte"),
        { hideProgressBar: true }
      );
    } finally {
      setaddLoading(false); // Ensure loading is stopped
    }
  };  

  const handleDeletePayment = async (item) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setPaymentsList((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== item.id)
      );
      if (item.default === 'true' && user?.default_pay === 'card') {
        handleChange2('direct')
      }
      toast.success("Payment card deleted successfully", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
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
            {authCtx.companySettings?.is_payment_cards && paymentslist?.map((item, index) => (
            <div key={item.id} onClick={()=>{ handleChange1(item.id)}} className={`${(item.default === 'true' && user.default_pay === 'card') ? classes.paymentCardSelected : classes.paymentCard}`} >
              <div className={classes.contantContainer}>
                      <div className={classes.contant}>
                        <div style={{display:'flex',flexDirection:"row"}} >
                        <img alt='' src={getImageSrc(item.card_type)} style={{height:'3em',width:'auto',margin:'0 .5em 1em 0',padding:'0'}}/>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <p style={{margin:'.2em', textTransform:'capitalize'}}>{item.card_type}</p>
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
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}> {language === 'eng' ? "Default" : "Défaut" } </p>
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
                          onClick={()=>{dispatch(deletePayment(item.id)),handleDeletePayment(item)}}
                        >
                          <img src={DeleteIcon}
                        style={{ width: "1.5em", marginTop: ".05em 0.1em" }}/>
                        </button>
                      </div>
                    </div>
                </div>
                ))}
                {authCtx.companySettings?.is_direct_pay && <div onClick={()=>{ handleChange2('direct')}} className={`${user.default_pay === 'direct' ? classes.paymentCardSelected : classes.paymentCard}`} >
                  <div className={classes.contantContainer}>
                          <div className={classes.contant}>
                            <div style={{display:'flex',flexDirection:"row"}} >
                            <img alt='' src={directPay} style={{height:'3em',width:'auto',margin:'0 .5em 1em 0',padding:'0'}}/>
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
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}>{language === 'eng' ? "Default" : "Défaut" }</p>
                      </div>
                            </div>
                        <div className={classes.addtocart}>
                          </div>
                        </div>
                    </div>}
               {authCtx.companySettings?.is_paypal && <div onClick={()=>{ handleChange2('paypal')}} className={`${user.default_pay === 'paypal' ? classes.paymentCardSelected : classes.paymentCard}`} >
                  <div className={classes.contantContainer}>
                          <div className={classes.contant}>
                            <div style={{display:'flex',flexDirection:"row"}} >
                            <img alt='' src={PayPal} style={{height:'3em',width:'auto',margin:'0 .5em 1em 0',padding:'0'}}/>
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
                        <p style={{ margin: ".2em 0",alignSelf:'center' }}>{language === 'eng' ? "Default" : "Défaut" }</p>
                      </div>
                            </div>
                        <div className={classes.addtocart}>
                          </div>
                        </div>
                    </div>}
                
            </div>
            {authCtx.companySettings?.is_payment_cards && <button className={classes.addBtn} onClick={()=>{handleOpen();
                                                               seteditMode(false)
                                                               setFormData({})}}>
            {language === 'eng' ? "+ Add a new card" : "+ Ajouter une nouvelle card"}</button>}
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
        <div className={classes.inputsContainer}>
        <Form.Item
          name="holder_name"
          label={
            <p
              style={{
                color: "var(--accent-color)",
                margin: "0",
                fontWeight: "500",
                fontFamily: "var(--font-family-primary)",
                fontSize: "calc(.8rem + .2vw)",width:'100%'
              }}
            >
              {language === 'eng' ? "Card holder" : "Titulaire de la carte"}
            </p>
          }
          rules={[
            {
              required: true, message: 'veuillez saisir le nom du titulaire de la carte',
            },
          ]}
          style={{border:'none',borderRadius:'.5em',width:'100%'}}
        >
                  <Input
                  name="holder_name"
                  placeholder={language === "eng" ? "Holder name" : " Nom du titulaire de la carte"}
                  size="large" 
                  // value={formData?.card_number}
        style={{ height: "2.6em", backgroundColor: "#fff", fontFamily: 'var(--font-family)', fontSize:'16px' }}
                        onChange={(e) => handleChange('holder_name', e.target.value)}
                        />
        </Form.Item>
        <Form.Item
          name="card_number"
          label={
            <p
              style={{
                color: "var(--accent-color)",
                margin: "0",
                fontWeight: "500",
                fontFamily: "var(--font-family-primary)",
                fontSize: "calc(.8rem + .2vw)",width:'100%'
              }}
            >
                    {language === 'eng' ? "Card Number" : "Numéro de carte"}
            </p>
          }
          style={{border:'none',borderRadius:'.5em',width:'100%'}}
        >
          <div className="card-input-wrapper">
        {/* Show Card Brand Image if available */}
        {cardBrand && cardBrandImages[cardBrand] && (
          <img src={cardBrandImages[cardBrand]} alt={cardBrand} className="card-logo" />
        )}
        
        {/* Card Number Input */}
        <CardNumberElement
          className="card-input"
          options={{
            style: {
              base: {
                fontSize: "16px",
                paddingLeft: cardBrand ? "3rem" : "1rem",
                fontFamily: 'var(--font-family)',
                '::placeholder': {
                  color: 'rgba(33, 42, 83, 0.8)', // Placeholder text color
                  fontFamily: 'var(--font-family)', // Placeholder font family
                },
              },
              placeholder: { 
                color: 'red' 
              } 
            },
          }}
          onChange={handleCardChange} // Detect card type dynamically
        />
      </div>
        </Form.Item>
        <Form.Item
          name="date"
          label={
            <p
              style={{
                color: "var(--accent-color)",
                margin: "0",
                fontWeight: "500",
                fontFamily: "var(--font-family-primary)",
                fontSize: "calc(.8rem + .2vw)",width:'100%'
              }}
            >
              {language === 'eng' ? "Expiry date" : "Date d’expiration"}
            </p>
          }
          style={{ width: '100%' }}
        >
        <CardExpiryElement 
          className='cardInput' 
          options={{ 
            style: { 
              base: { 
                fontSize: "16px",
                color: 'var(--secondary-color)',
                fontFamily: 'var(--font-family)', 
                backgroundColor: '#fff',
                '::placeholder': {
                  color: 'rgba(33, 42, 83, 0.8)', // Placeholder text color
                  fontFamily: 'var(--font-family)', // Placeholder font family
                },
              } 
            } 
          }} 
        />
        </Form.Item>
        <Form.Item
          name="cvv"
          label={
            <p
              style={{
                color: "var(--accent-color)",
                margin: "0",
                fontWeight: "500",
                fontFamily: "var(--font-family-primary)",
                fontSize: "calc(.8rem + .2vw)",width:'100%'
              }}
            >
              {language === 'eng' ? "Safety code (CVC/CVV)" : "Code de sécurité (CVC/CVV)"}
            </p>
          }
          style={{width:'100%',border:'none',borderRadius:'.5em'}}
        >
                  
        <CardCvcElement
          className='cardInput' 
          options={{ 
            style: { 
              base: { 
                fontSize: "16px",
                color: 'var(--secondary-color)',
                fontFamily: 'var(--font-family)', 
                backgroundColor: '#fff',
                '::placeholder': {
                  color: 'rgba(33, 42, 83, 0.8)', // Placeholder text color
                  fontFamily: 'var(--font-family)', // Placeholder font family
                },
              } 
            } 
          }} 
        />
        </Form.Item>
        </div>
        <div style={{display:'flex',flexWrap:'wrap' ,width:'fit-content',margin:'auto',gap:'1em'}}>
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
      </Form>
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