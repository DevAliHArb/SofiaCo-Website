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
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';



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
  const [paymentslist, setPaymentsList] = useState([]);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const token = getToken()

  
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
    } catch (error) {
      // console.error("Error fetching addresses:", error);
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
    </div>
  );
};



export default PopupPaymentModal;
