import React, { useContext, useEffect, useState } from 'react'
import classes from './OrderTracking.module.css'
import OrderCard from './Order Card/OrderCard';
import visa from '../../../assets/visa_logo.png';
import master from "../../../assets/master_logo.png";
import { useDispatch, useSelector } from 'react-redux';
import AllOrders from '../../../assets/AllOrders.svg';
import Processing from '../../../assets/Processing.svg';
import Shipped from '../../../assets/Shipped.svg';
import Delivered from '../../../assets/Delivered.svg';
import Confirming from '../../../assets/Confirming.svg';
import Canceled from '../../../assets/Canceled.svg';
import Select from '@mui/material/Select';
import { IoIosArrowBack } from "react-icons/io";
import { Divider} from "@mui/material";
import Radio from '@mui/material/Radio';
import Review from './Review page/Review';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import bookPlaceHolder from '../../../assets/bookPlaceholder.png';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EmptyCart from "../../../assets/EmptyOrder.png";
import Rating from "@mui/material/Rating";

import { Button } from "antd";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiNotebook } from "react-icons/pi";
import { PiPackageDuotone } from "react-icons/pi";
import { PiTruck } from "react-icons/pi";
import { PiHandshake } from "react-icons/pi";
import { PiChecks } from "react-icons/pi";
import { PiMapPinLine } from "react-icons/pi";
import { PiCheckCircle } from "react-icons/pi";
import { PiNotepad } from "react-icons/pi";
import AuthContext from '../../Common/authContext';
import { addTocart } from '../../Common/redux/productSlice';



const ConfirmationPopup = ({ message, onConfirm, onCancel, showPopup }) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #ACACAC",
    borderRadius: "1em",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className="confirmation-popup">
      <Modal
        open={showPopup}
        onClose={onCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "hidden" }}
      >
        <Box sx={style}>
        <p>{message}</p>
        <div style={{width:'fit-content',margin:'auto',display:'flex',flexWrap:'wrap'}}>
        <Button 
           onClick={onConfirm}
          style={{backgroundColor:'var(--primary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'0.5em',margin:'1em '}}>
            {language === 'eng' ? "Yes" : "Oui"}
          </Button>
        <Button 
           onClick={onCancel}
          style={{backgroundColor:'var(--secondary-color)',color: 'white', height:'3em',width:'10em',borderRadius:'.5em',margin:'1em '}}>
            {language === 'eng' ? "No" : "Non"}
          </Button></div>
        </Box>
      </Modal>
    </div>
    
  );
};


const FormatDate = (props) => {
  const date = new Date(props);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-indexed month
  const day = ('0' + date.getDate()).slice(-2);

  return (`${year}-${month}-${day}`);
}
  function calculateTotalPrice(orderInvoiceItems) {
    let totalPrice = 0;

    orderInvoiceItems.forEach(item => {
        totalPrice += item.quantity * parseFloat(item.price);
    });

    return totalPrice.toFixed(2);
}
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
const OrderTracking = () => {
  const getcat = () => {
    const storedValue = localStorage.getItem('selectedOrderCategory');
    if (storedValue) {
      return parseInt(storedValue, 10); // Convert the stored value to an integer
    }
    return 0;
  };

  const cat = getcat();
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.replace(/\/$/, '').split('/');
  const orderId = pathParts.pop();
  const reviewParam = pathParts.pop();
  const user = useSelector((state)=>state.products.userInfo);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(AuthContext)
  const [selectedtitle, setselectedtitle] = useState('');
  const [ordertrackcategories, setordertrackcategories] = useState([])
  const [selectedCategory, setselectedCategory] = useState(localStorage.getItem('selectedOrderCategory') || 0);
  const [selectedOrder, setselectedOrder] = useState({});
  const [isSelected, setisSelected] = useState(false);
  const [isReviewMood, setisReviewMood] = useState(false);
  const [categoryId, setcategoryId] = useState(0);
  const [orders, setorders] = useState([]) 
  const [steps, setsteps] = useState([]) 
  const [data, setData] = useState(orders)
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const productData = useSelector((state)=>state.products.productData);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken()

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/order_invoice`, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
    const sortedData = response.data.data?.sort((a, b) => new Date(b.date) - new Date(a.date));
      // console.log('Response data:', response.data.data);
      const filteredInvoices = sortedData.filter(orderInvoice => orderInvoice.status_id !== 20);
      setorders(filteredInvoices);
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/lookups?parent_id=1`);
      // console.log('Response data:', response.data.data);
      const allCategories = { id: 0, name: 'All Orders', name_fr:"Toutes les commandes" };
      const filteredData = response.data.data.filter(item => item.id !== 6 && item.id !== 7 && item.id !== 8);
        const categoriesWithAll = [allCategories, ...filteredData];
        
        setordertrackcategories(categoriesWithAll);
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchOrders();
  }, []);
  // useEffect(()=>{
  //   if (selectedCategory === 0){
  //     const nonHistoryOrders = orders?.filter((item) => item.status_id !== 6 && item.status_id !== 7 && item.status_id !== 8);
  //     setData(nonHistoryOrders);
  //   }else {
  //   const unpaidOrders = orders?.filter((item) => item.status_id === selectedCategory);
  //   setData(unpaidOrders);
  //   }
  // },[selectedCategory, orders])

  const handleChange = (e) => {
    if (e.target.value === 0) {
      const nonHistoryOrders = orders?.filter((item) => item.status_id !== 6 && item.status_id !== 7 && item.status_id !== 8);
      setData(nonHistoryOrders);
    } else {
      const unpaidOrders = orders?.filter((item) => item.status_id === e.target.value);
      setData(unpaidOrders);
  }
    setselectedCategory(e.target.value) 
    // console.log(data)
  }
let stepss = [
  {
      id: 2,
      label: 'Confirming',
      label_fr: 'Confirmation',
      description:'Your order has been confirmed.',
      description_fr:'Votre commande a été confirmée.',
      icon: <PiNotebook/>,
  },
  {
      id: 3,
      label: 'Processing',
      label_fr: 'En Cours',
      description:'Your order is  in progress.',
      description_fr:'Votre commande est en cours.',
      icon: <PiPackageDuotone/>
  },
  {
      id: 4,
      label: 'Shipping',
      label_fr: 'Expédiée',
      description:'Your order has been Shipped.',
      description_fr:'Votre commande a été expédiée.',
      icon: <PiTruck/>
  },
  {
      id: 5,
      label: 'Confirming Recieved',
      label_fr: 'Confirmation Reçu',
      description:'Your order has been delivered. Thank you for shopping at Sofiaco!',
      description_fr:"Votre commande a été livrée. Merci d'avoir fait vos achats chez Sofiaco !",
      icon: <PiHandshake/>
  }
  
];
const stepsHandler =(props)=>{
  let testt = []
  stepss.forEach(order => {
    let index = props.order_status_history?.find(step => step.status_id === order.id);
    // console.log("helllooo",index)
    if (index) {
      testt.push({
        id: order.id,
        label: order.label, 
        label_fr: order.label_fr, 
        description: order.description,
        description_fr: order.description_fr,
        estimatedDate: index.time, 
      });
    } else {
      testt.push({
        id: order.id,
        label: order.label, 
        label_fr: order.label_fr, 
        estimatedDate: "",
        description: order.description, 
        description_fr: order.description_fr,
      });
    }
  });
  setsteps(testt)
};
const reviewHandler =()=>setisReviewMood(true);
  const formattedDate = new Date(selectedOrder?.date);
  formattedDate.setDate(formattedDate.getDate() + 3);
  const EstimatedDeliveryDate = formattedDate.toDateString();

  const addToCartWithQtyhandler = async (props) => {
    console.log(props)
    const maxQuantity = props._qte_a_terme_calcule;
    const item = productData.find(item => item._id === props.id);
     if (!item) {
     try {
      setIsLoading(true);
      const response = await axios.post("https://api.leonardo-service.com/api/bookshop/cart?ecom_type=bookshop", {
        user_id: user.id,
        article_id: props.id,
        quantity: props.quantity,
      });
      dispatch(addTocart({
        _id: props.id,
        title: props.designation,
        author: props.dc_auteur,
        image: props.image,
        price: props.prixpublic,
        _qte_a_terme_calcule: props._qte_a_terme_calcule,
        discount: props.discount,
        quantity: props.quantity,
        description: props.descriptif,
        weight: props._poids_net,
        cart_id: response.data.data.id,
        price_ttc: props._prix_public_ttc,
        article_stock: props.article_stock
      }));
    } catch (error) {
      // console.error("Error adding to cart:", error);
      console.log(error)
    } finally{
      setIsLoading(false);
    };
     } else {
      const newQuantity = Number(item.quantity * 1) + Number(props.quantity * 1);
      const newQuantityMax = Number(maxQuantity) - Number(item.quantity * 1);
      setIsLoading(true);
      if (Number(newQuantity) > Number(maxQuantity)) {
        
        axios.put(`https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`, {
          quantity: Number(maxQuantity).toFixed(0),
          })
          .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(addTocart({
                  _id: props.id,
                  quantity: Number(newQuantityMax).toFixed(0),
                }))
                setIsLoading(false);
          })
          .catch((error) => {
              // console.error("Error in PUT request:", error);
              setIsLoading(false);
          });
      } else {
        
        axios.put(`https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`, {
          quantity: newQuantity,
          })
          .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(addTocart({
                  _id: props.id,
                  quantity: props.quantity,
                }))
          })
          .catch((error) => {
              // console.error("Error in PUT request:", error);
              setIsLoading(false);
          });
      }
      
    }
  }
  const AddAllToCart = () => {
    selectedOrder?.order_invoice_items?.forEach(element => {
      console.log(element.article._qte_a_terme_calcule);
      if (element.article._qte_a_terme_calcule > 0) {
        const quantityToAdd =
    element.quantity > element.article._qte_a_terme_calcule
      ? element.article._qte_a_terme_calcule
      : element.quantity;
      addToCartWithQtyhandler(
        ({ 
            id: element.article.id,
            designation: element.article.designation,
            dc_auteur: element.article.dc_auteur,
            image: element.article.articleimage[0]?.link ? element.article.articleimage[0].link : bookPlaceHolder,
            prixpublic: element.article.prixpublic,
            _qte_a_terme_calcule: element.article._qte_a_terme_calcule,
            _code_barre: element.article._code_barre,
            quantity: Number(quantityToAdd).toFixed(0),
            discount:element.article.discount,
            descriptif: element.article.descriptif,
            _poids_net: element.article._poids_net,
            _prix_public_ttc: element.article._prix_public_ttc,
          })
        );
          
        }
    });
    
    toast.success(`${language === 'eng' ? "Successful repurchase order" : "Succès de l'ordre de rachat"}`, {
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
  const CancleOrderHandler = () => {
    axios.put(`https://api.leonardo-service.com/api/bookshop/order_invoices/${selectedOrder?.id}?status_id=13`)
    .then(() => {
        // console.log("delete request successful:");
          toast.success(language === "eng" ? "Delete request successful." : "Demande de suppression réussie.", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
          setShowPopup(false);
          window.location.reload();
    })
    .catch((error) => {
        // console.error("Error in delete request:", error);
        toast.error(language === "eng" ? "Failed to delete item." : "Échec de la suppression de l'élément.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
    });
  }

  useEffect(()=>{
    if (cat === 0){
      const nonHistoryOrders = orders?.filter((item) => item.status_id !== 6 && item.status_id !== 7 && item.status_id !== 8);
      setData(nonHistoryOrders);
    }else {
    const unpaidOrders = orders?.filter((item) => item.status_id === cat);
    setData(unpaidOrders);
    }
    
  },[selectedCategory, orders, cat])
    
  useEffect(() => {
    if (!isNaN(parseInt(orderId, 10))) {
      // Use '===' for proper comparison
      const selected = data?.filter((item) => item.id === parseInt(orderId, 10)); 
      
      if (selected && selected.length > 0) {
        setisSelected(true);
        setselectedOrder(selected[0]);
        setcategoryId(selected[0]?.status_id);
        stepsHandler(selected[0]);
      } else {
        setisSelected(false);
      }
    } else {
      setisSelected(false);
    }
  }, [orderId, data]);
  useEffect(() => {
    if (reviewParam === 'review') {
      const selected = data?.filter((item) => item.id = parseInt(orderId, 10))
      console.log('testttt', selected)
      setselectedOrder(selected[0]) ;
      setTimeout(() => {
        setisReviewMood(true) ;
        setisSelected(false) ;
      }, 1000)
    } else{setisReviewMood(false)}
  }, [reviewParam, data]);
  return (
    <div className={classes.ordertrack_con}>
     {!isSelected && !isReviewMood && <>
        <div style={{margin:'0 0 3em 0'}}>
            {loading && <CircularProgress style={{marginTop:"5em",color:'var(--primary-color)'}}/>}
            {!loading && orders?.length === 0 ? 
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                  margin: "auto",
                  color: "#fff",
                  fontFamily: "var(--font-family)",
                  fontSize: "calc(.7rem + .3vw)",
                }}
              >
                <div style={{ width: "fit-content", margin: "auto" }}>
                  <img
                    alt="EmptyCart"
                    src={EmptyCart}
                    style={{ width: "13em", height: "auto" }}
                  />
                </div>
                <h1 style={{ textAlign: "center",color:"#fff",fontWeight:'600' }}>{language === 'fr' ? "Vous n'avez pas encore passé de commande !" : 'You haven’t made any orders yet!'}</h1>
                <button className={classes.btn} onClick={()=>navigate('/books')}>
                  {language === 'fr' ? "Commencer vos achats" : 'Start shopping'}

                </button>
              </div>
            </div> : 
             <>
                <div className={classes.header} >
                <div className={classes.headtitle}><h3 style={{fontWeight:"600",marginTop:'0.2em'}} onClick={()=>console.log(ordertrackcategories)}>My Orders</h3></div>
                <div className={classes.btnsContainer}>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(0)  & localStorage.setItem('selectedOrderCategory', 0)} style={{backgroundColor:cat === 0 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'9',rotate:'270deg'}}>
                    <img src={AllOrders} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "All Orders" : "Toutes les commandes" }</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(2) & localStorage.setItem('selectedOrderCategory', 2)} style={{backgroundColor:cat === 2 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Confirming} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "Confirming" : "Confirmation" }</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(3) & localStorage.setItem('selectedOrderCategory', 3)} style={{backgroundColor:cat === 3 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Processing} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "Processing" : "Traitement" }</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(4) & localStorage.setItem('selectedOrderCategory', 4)} style={{backgroundColor:cat === 4 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Shipped} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "Shipped" : "Expédié" }</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(5) & localStorage.setItem('selectedOrderCategory', 5)} style={{backgroundColor:cat === 5 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Delivered} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "Delivered" : "Livrée" }</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(13) & localStorage.setItem('selectedOrderCategory', 13)} style={{backgroundColor:cat === 13 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Canceled} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>{language === 'eng' ? "Canceled" : "Annulé" }</p>
                  </div>
                </div>
                </div>
                {data.length !== 0 && <div className={classes.headerss}>
                  <h3>{language === 'eng' ? "Order Number" : "Numéro de commande" }</h3>
                  <h3>Date{language === 'eng' ? "" : "" }</h3>
                  <h3 >{language === 'eng' ? "Status" : "Statut" }</h3> 
                  <h3>Total</h3>
                </div>}
            </div>
          {!loading &&data?.length === 0 ? <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                  margin: "auto",
                  color: "#fff",
                  fontFamily: "var(--font-family)",
                  fontSize: "calc(.7rem + .3vw)",
                }}
              >
                <div style={{ width: "fit-content", margin: "auto" }}>
                  <img
                    alt="EmptyCart"
                    src={EmptyCart}
                    style={{ width: "13em", height: "auto" }}
                  />
                </div>
                <h1 style={{ textAlign: "center",color:"#fff",fontWeight:'600' }}>{language === 'fr' ? `Vous n’avez encore aucune commande ${ordertrackcategories?.find(step => step.id === selectedCategory)?.name_fr} !` : `You haven’t any orders ${ordertrackcategories?.find(step => step.id === selectedCategory)?.name} yet!`}</h1>
                <button className={classes.btn} onClick={()=>navigate('/books')}>
                  {language === 'fr' ? "Commencer vos achats" : 'Start shopping'}

                </button>
              </div>
            </div> : data?.map((props)=>{
            return(
              <>
              <div onClick={()=>navigate(`/account/order-tracking/${props.id}`) & setisSelected(true) & setselectedOrder(props) & setcategoryId(props.status_id ) & stepsHandler(props) & window.scrollTo({ top: 0 })}>
              <OrderCard data={props} reviewHandler={()=>{setisReviewMood(true);setselectedOrder(props)}}/>
              </div>
              </>
             )
          })} </>}
        </div>
      </>}
      { isSelected && 
      <div className={classes.detailsCard}>
        <h4 onClick={()=>setisSelected(false) & setselectedOrder({}) & navigate('/account/order-tracking')} className={classes.back}><IoIosArrowBack style={{marginBottom:'-.15em'}}/> Back</h4>
        <div className={classes.header1}>
      <div className={classes.headtitle} style={{margin:"0 0 0 1em",textAlign:'start',fontWeight:'500',lineHeight:'130%'}} onClick={()=>console.log(steps)}>Order # {selectedOrder?.id}<br/> Placed on {new Date(selectedOrder?.date).getDate()}/{new Date(selectedOrder?.date).getMonth()}/{new Date(selectedOrder?.date).getFullYear()}</div>
      <div className={classes.headtitle} style={{margin:"auto 1em auto auto",fontWeight:'500'}} onClick={()=>console.log(steps)}>{selectedOrder?.currency === 'eur' ? '€' : '$'}{selectedOrder?.total_price}</div>
      <div style={{display:'flex',flexDirection:'row'}}></div>
      </div>
      <div className={classes.detailsContainer}>
        <div style={{width:'100%',display:'grid',gridTemplateColumns:"25% 25% 25% 25%",margin:'3em 0 1em 12.5%'}} className={classes.displayNoneMob}>
        {steps?.sort((a, b) => a.id - b.id).map((step) => {
            return (
              <div key={step.id} className={classes.orderStep}  style={step.id == 5 ? {borderTop:'.2em solid transparent'} : {borderTop:step.id < categoryId ? '.2em solid var(--primary-color)':'.2em solid rgba(255,255,255,0.5)'}}>
                <div className={classes.stepdot} style={step.id == categoryId ? {backgroundColor:'var(--primary-color)',boxShadow:'0px 0px 0px .6em rgba(233, 119, 4, 50%)'} : step.id < categoryId ? {backgroundColor:'var(--primary-color)'} : {backgroundColor:'rgba(255,255,255,0.5)'}}/>
                <h1 style={{color: step.id > categoryId ? 'rgba(255,255,255,0.5)':'#fff',fontSize:'calc(1rem + 0.3vw)',lineHeight:'100%',fontWeight:'600',marginLeft:'-50%',textAlign:'center',width:'100%'}}>
                 {step.id === 2 ? <PiNotebook style={{fontSize:"2em"}}/> : step.id === 3 ? <PiPackageDuotone style={{fontSize:"2em"}}/> : step.id === 4 ? <PiTruck style={{fontSize:"2em"}}/> : <PiHandshake style={{fontSize:"2em"}}/>} <br/> {language === 'eng' ? step.label : step.label_fr} 
                  {/* {(step.id <= categoryId || step.id === 5)&& <span style={{fontSize:'smaller',color:'var(--primary-color)',fontWeight:'500',paddingLeft:'.5em'}}>{(step.id === 5 && step.estimatedDate === "") ?  EstimatedDeliveryDate : (step.id !== 5 ? new Date(step.estimatedDate).toDateString() : new Date(step.estimatedDate).toDateString())} </span>}  */}
                </h1>
                  <p style={{textAlign:'start', color:'#999999'}}>{step.description1}</p>
              </div>
            )})}
        </div>
        <div className={classes.MobLineTime}>
        {steps?.sort((a, b) => a.id - b.id).map((step) => {
            return (
              <div key={step.id} className={classes.orderStep}  style={step.id == 5 ? {borderLeft:'.2em solid transparent'} : {borderLeft:step.id < categoryId ? '.2em solid var(--primary-color)':'.2em solid rgba(255,255,255,0.5)'}}>
                <div className={classes.stepdot} style={step.id == categoryId ? {backgroundColor:'var(--primary-color)',boxShadow:'0px 0px 0px .6em rgba(233, 119, 4, 50%)'} : step.id < categoryId ? {backgroundColor:'var(--primary-color)'} : {backgroundColor:'rgba(255,255,255,0.5)'}}/>
                <h1 style={{color: step.id > categoryId ? 'rgba(255,255,255,0.5)':'#fff',fontSize:'calc(1rem + 0.3vw)',lineHeight:'100%',fontWeight:'600',textAlign:'start',margin:'-1em 0 3em 1em',width:'100%'}}>
                 {step.id === 2 ? <PiNotebook style={{fontSize:"2em",marginBottom:'-.3em'}}/> : step.id === 3 ? <PiPackageDuotone style={{fontSize:"2em",marginBottom:'-.3em'}}/> : step.id === 4 ? <PiTruck style={{fontSize:"2em",marginBottom:'-.3em'}}/> : <PiHandshake style={{fontSize:"2em",marginBottom:'-.3em'}}/>}  {language === 'eng' ? step.label : step.label_fr} 
                  {/* {(step.id <= categoryId || step.id === 5)&& <span style={{fontSize:'smaller',color:'var(--primary-color)',fontWeight:'500',paddingLeft:'.5em'}}>{(step.id === 5 && step.estimatedDate === "") ?  EstimatedDeliveryDate : (step.id !== 5 ? new Date(step.estimatedDate).toDateString() : new Date(step.estimatedDate).toDateString())} </span>}  */}
                </h1>
              </div>
            )})}
        </div>
         <div className={classes.orderActivityCont}>
          <h2>{language === 'eng' ? "Order Activity" : "Activité de commande" }</h2>
          {steps?.sort((a, b) => b.id - a.id).map((step) => {
            if (step.estimatedDate) {
              return (
                <div style={{display:"flex",flexDirection:"row", width:'100%',margin:'1em 0'}}>
                  <div style={{color:'#fff',width:'3em', height:'3em',borderRadius:'.3em',backgroundColor:"var(--primary-color)",display:'flex',marginRight:'.5em'}}>
                    {step.id === 2 ? <PiNotepad style={{fontSize:"1.7em",margin:'auto'}}/> : step.id === 3 ? <PiCheckCircle style={{fontSize:"1.7em",margin:'auto'}}/> : step.id === 4 ? <PiMapPinLine style={{fontSize:"1.7em",margin:'auto'}}/> : <PiChecks style={{fontSize:"1.7em",margin:'auto'}}/>}
                  </div>
                  <div>
                    <p style={{marginTop:'0'}}>{language === 'eng' ? step.description : step.description_fr} </p>
                    <p style={{marginBottom:'0',fontWeight:'500',color:'var(--secondary-color)'}}>{ new Date(step.estimatedDate).toDateString()} at: { new Date(step.estimatedDate).toLocaleTimeString()}</p>
                  </div>
                </div>
              )
            }
              })}
              <div style={{display:"flex",flexDirection:"row", width:'100%',margin:'1em 0'}}>
                <div style={{color:'#fff',width:'3em', height:'3em',borderRadius:'.3em',backgroundColor:"var(--primary-color)",display:'flex',marginRight:'.5em'}}>
                  <PiNotebook style={{fontSize:"1.7em",margin:'auto'}}/>
                </div>
                <div>
                  <p style={{marginTop:'0'}}>{language === 'eng' ? "Your order is placed." : "Votre commande est passée." } </p>
                  <p style={{marginBottom:'0',fontWeight:'500',color:'var(--secondary-color)'}}>{ new Date(selectedOrder?.date).toDateString()} at: { new Date(selectedOrder?.date).toLocaleTimeString()}</p>
                </div>
              </div>
        </div>
        <div className={classes.total_con }>
        <div className={classes.total}>
        <div className={classes.totalrows}>
            <p style={{textAlign:"start",paddingLeft:'10%'}}>{language === 'eng' ? "Products" : "Produits" }</p>
            <p className={classes.displayNoneMob}>{language === 'eng' ? "Price" : "Prix" }</p>
            <p className={classes.displayNoneMob}>{language === 'eng' ? "Quantity" : "Quantité" }</p>
            <p className={classes.displayNoneMob}>Sub-Total</p>
          </div>
          <div className={classes.cardCont}>
             {selectedOrder?.order_invoice_items?.map((props)=>{
            return(
        <div className={classes.card} key={props._id} onClick={()=>console.log(props)}>
            <div style={{display:"flex",flexDirection:"row",gap:".5em",width:'100%'}}>
            <div className={classes.imageCont}>
              <img src={props.article.articleimage[0]?.link ? props.article.articleimage[0].link : bookPlaceHolder} alt="" style={{height:'100%', width: '100%',objectFit:'cover' }}/>
            </div>
            <div style={{height:'100%',textAlign:'start',margin:'auto 0 auto auto',justifyContent:'space-between',display:'flex', flexDirection:'column',width:'70%',fontSize:'calc(.7rem + 0.3vw)',fontFamily:'var(--font-family)'}}>
              <p style={{fontWeight:'600',marginBottom:"1em",marginTop:'0'}}>{props.article.designation}</p>
              {props.article.dc_auteur && <p style={{fontWeight:'600',fontSize:'calc(.6rem + 0.2vw)'}}>{props.article.dc_auteur}</p>}
              {props.article.descriptif && <p className={classes.dicription} dangerouslySetInnerHTML={{ __html: props.article.descriptif }}/>}
            <div className={classes.quantityMob}>
              <p> {selectedOrder?.currency === 'usd' ? '$' : '€' }{props.price} </p>
              <p style={{textAlign:'end'}}>{selectedOrder?.currency === 'usd' ? '$' : '€' }{(props.price * props.quantity).toFixed(2)} </p>
            </div>
              </div>
            </div>
            <p className={classes.quantity}> {selectedOrder?.currency === 'usd' ? '$' : '€' }{props.price} </p>
            <p className={classes.quantity}> x{props.quantity} </p>
            <p className={classes.quantity}>{selectedOrder?.currency === 'usd' ? '$' : '€' }{(props.price * props.quantity).toFixed(2)} </p>
          </div>
             )
          })} 
          </div>
        </div>
          
      </div>
        <div className={classes.addrCont}>
          <div className={classes.adressCard}>
            <h2>{language === 'eng' ? "Billing Address" : "Adresse de Facturation" }</h2>
              <p style={{marginBottom:'1em'}}>{selectedOrder?.user_address.name}</p>
              <p style={{margin:'0',padding:'0'}}>{selectedOrder?.user_address.address}, {selectedOrder?.user_address.city}, {selectedOrder?.user_address.postalcode}</p>
              <p>{selectedOrder?.user_address.country}</p>
              <p style={{margin:'1em 0'}}>{language === 'eng' ? "Phone Number:" : "Numéro de téléphone :" }{user.phone}</p>
              <p> E-mail: {user.email}</p>
          </div>
          <div style={{height:'80%',width:'2px',backgroundColor:'#E4E7E9',margin:"auto"}}></div>
          <div className={classes.adressCard}>
            <h2>{language === 'eng' ? "Order Notes" : "Notes de commande" }</h2>
            <div>
              <p>{selectedOrder?.review ? selectedOrder?.review : 'No notes'}</p>
            </div>
          </div>
      </div>
        </div>
        <div style={{margin:'2em auto 4em auto',width:'fit-content',gap:"2em",display:'flex',flexWrap:"wrap"}}>
      {categoryId == 2 ? <button className={classes.btn}  onClick={(event) => setShowPopup(true) & event.stopPropagation()}>{language === 'eng' ? "Cancel Order" : "Annuler la commande" }</button> : <button onClick={AddAllToCart} className={`${categoryId == 4 ? classes.deliveredBtn : classes.btn}`} >Repurchase</button>}
      {categoryId == 5 && <button className={classes.reviewbtn} onClick={()=>navigate(`/account/order-tracking/review/${selectedOrder.id}`) & setisReviewMood(true) & setisSelected(false)}>{language === 'eng' ? "Review" : "Révision " }</button> }
      </div>
      </div>}
      { isReviewMood && <div className={classes.detailsCard}> 
        <h4 onClick={()=>setisSelected(false) & setisReviewMood(false) & setselectedOrder({}) & window.scrollTo({ top: 0 })} className={classes.back}><IoIosArrowBack style={{marginBottom:'-.15em'}}/> {language === 'eng' ? "Back" : "Dos" }</h4>
        <div className={classes.header1}>
      <div className={classes.headtitle} style={{margin:"0 0 0 1em",textAlign:'start',fontWeight:'500',lineHeight:'130%'}} onClick={()=>console.log(steps)}>Order # {selectedOrder?.id}<br/> {language === 'eng' ? "Placed on" : "Placé sur" } {new Date(selectedOrder?.date).getDate()}/{new Date(selectedOrder?.date).getMonth()}/{new Date(selectedOrder?.date).getFullYear()}</div>
      <div className={classes.headtitle} style={{margin:"auto 1em auto auto",fontWeight:'500'}} onClick={()=>console.log(steps)}>{selectedOrder?.currency === 'eur' ? '€' : '$'}{selectedOrder?.total_price}</div>
      <div style={{display:'flex',flexDirection:'row'}}></div>
      </div> 
      {/* <button className={classes.reviewbtn} style={{backgroundColor:'var(--primary-color)',marginRight:"0"}}>Return</button>  */}
        <Review props={selectedOrder}/>
      </div>}
      {/* <div className={classes.deliveredMob}><button className={classes.btn} onClick={AddAllToCart}>Repurchase</button></div> */}
      {showPopup && (
        <ConfirmationPopup
          message={language === 'eng' ? "Are you sure you want to delete this Order?" : "Êtes-vous sûr de vouloir supprimer cet ordre ?"}
          onConfirm={CancleOrderHandler}
          onCancel={() => setShowPopup(false)}
          showPopup={showPopup}
        />
      )}
    </div>
  )
}

export default OrderTracking