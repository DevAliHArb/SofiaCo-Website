import React, { useEffect, useState } from 'react'
import classes from './OrderTracking.module.css'
import OrderCard from './Order Card/OrderCard';
import visa from '../../../assets/visa_logo.png';
import master from "../../../assets/master_logo.png";
import { useDispatch, useSelector } from 'react-redux';
import AllOrders from '../../../assets/AllOrders.svg';
import Processing from '../../../assets/Processing.svg';
import Shipped from '../../../assets/Shipped.svg';
import Delivered from '../../../assets/Delivered.svg';
// import AllOrders from '../../../assets/Delivered.svg';
// import AllOrders from '../../../assets/Delivered.svg';
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

import { Button } from "antd";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PiNotebook } from "react-icons/pi";
import { PiPackageDuotone } from "react-icons/pi";
import { PiTruck } from "react-icons/pi";
import { PiHandshake } from "react-icons/pi";
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
  const user = useSelector((state)=>state.products.userInfo);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const dispatch = useDispatch();
  const productData = useSelector((state)=>state.products.productData);
  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selectedtitle, setselectedtitle] = useState('');
  const [ordertrackcategories, setordertrackcategories] = useState([])
  const [selectedCategory, setselectedCategory] = useState(0);
  const [selectedOrder, setselectedOrder] = useState({});
  const [isSelected, setisSelected] = useState(false);
  const [isReviewMood, setisReviewMood] = useState(false);
  const [categoryId, setcategoryId] = useState(0);
  const [orders, setorders] = useState([]) 
  const [steps, setsteps] = useState([]) 
  const [data, setData] = useState(orders)
  const [showPopup, setShowPopup] = useState(false);

  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const token = getToken()

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/order_invoice`, {
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
      const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/lookups?parent_id=1`);
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
      label: 'Confirmed',
      description1:'',
      icon: <PiNotebook/>,
  },
  {
      id: 3,
      label: 'Processing',
      description1:'',
      icon: <PiPackageDuotone/>
  },
  {
      id: 4,
      label: 'Shipped',
      description1:'',
      icon: <PiTruck/>
  },
  {
      id: 5,
      label: 'Delivered',
      description1:'',
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
        estimatedDate: index.time,
        description1: '', 
      });
    } else {
      testt.push({
        id: order.id,
        label: order.label, 
        estimatedDate: "",
        description1: '', 
      });
    }
  });
  setsteps(testt)
};
const reviewHandler =()=>setisReviewMood(true);
  const formattedDate = new Date(selectedOrder.date);
  formattedDate.setDate(formattedDate.getDate() + 3);
  const EstimatedDeliveryDate = formattedDate.toDateString();

  const addToCartWithQtyhandler = async (props) => {
    console.log(props)
    const maxQuantity = props._qte_a_terme_calcule;
    const item = productData.find(item => item._id === props.id);
     if (!item) {
     try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/cart?ecom_type=sofiaco`, {
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
        average_rate: props.average_rate,
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
        
        axios.put(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`, {
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
        
        axios.put(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`, {
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
        discount:element.discount,
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
    axios.put(`${import.meta.env.VITE_TESTING_API}/order_invoices/${selectedOrder.id}?status_id=13`)
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
  return (
    <div className={classes.ordertrack_con}>
     {!isSelected && !isReviewMood && <>
        <div style={{margin:'0 0 3em 0'}}>
            {loading && <CircularProgress style={{marginTop:"5em",color:'var(--primary-color)'}}/>}
            {!loading && data?.length === 0 ? 
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
                <button className={classes.btn} onClick={()=>navigate('/main/products')}>
                  {language === 'fr' ? "Commencer vos achats" : 'Start shopping'}

                </button>
              </div>
            </div> :  <>
                <div className={classes.header} >
                <div className={classes.headtitle}><h3 style={{fontWeight:"600",marginTop:'0.2em'}} onClick={()=>console.log(ordertrackcategories)}>Order Tracking</h3></div>
                <div className={classes.btnsContainer}>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(0)  & localStorage.setItem('selectedOrderCategory', 0)} style={{backgroundColor:cat === 0 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={AllOrders} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>All Orders</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(2) & localStorage.setItem('selectedOrderCategory', 2)} style={{backgroundColor:cat === 2 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={AllOrders} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>Confirming</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(3) & localStorage.setItem('selectedOrderCategory', 3)} style={{backgroundColor:cat === 3 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Processing} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>Processing</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(4) & localStorage.setItem('selectedOrderCategory', 4)} style={{backgroundColor:cat === 4 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Shipped} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>Shipped</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(5) & localStorage.setItem('selectedOrderCategory', 5)} style={{backgroundColor:cat === 5 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={Delivered} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>Delivered</p>
                  </div>
                </div>
                <div className={classes.hexagon} onClick={()=>setselectedCategory(13) & localStorage.setItem('selectedOrderCategory', 13)} style={{backgroundColor:cat === 13 && 'var(--primary-color)'}}>
                  <div style={{width:'120%',height:'60%',position:"absolute",top:'20%',left:'-10%',zIndex:'1',rotate:'270deg'}}>
                    <img src={AllOrders} alt=""  style={{width:'50%',}}/>
                    <p style={{marginTop:'0.5em'}}>Canceled</p>
                  </div>
                </div>
                </div>
                <div className={classes.headerss}>
                  <h3>Order Number</h3>
                  <h3>Date</h3>
                  <h3 >Status</h3> 
                  <h3>Total</h3>
                </div>
            </div>
          {!loading && data?.map((props)=>{
            return(
              <>
              <div onClick={()=>setisSelected(true) & setselectedOrder(props) & setcategoryId(props.status_id ) & stepsHandler(props) & window.scrollTo({ top: 0 })}>
              <OrderCard data={props} reviewHandler={()=>{setisReviewMood(true);setselectedOrder(props)}}/>
              </div>
              </>
             )
          })} </>}
        </div>
      </>}
      { isSelected && 
      <div className={classes.detailsCard}>
        <h4 onClick={()=>setisSelected(false) & setselectedOrder({})} style={{color:'var(--secondary-color)',fontSize:'calc(1rem + .3vw)',margin:'-1em 0 0 -10%',cursor:'pointer',fontFamily:'var(--font-family)',width:'100%',textAlign:'start',fontWeight:'500'}}><IoIosArrowBack style={{marginBottom:'-.15em'}}/> Back</h4>
        <div className={classes.header1}>
      <div className={classes.headtitle} style={{margin:"0 0 0 1em",textAlign:'start',fontWeight:'500',lineHeight:'130%'}} onClick={()=>console.log(steps)}>Order # {selectedOrder.id}<br/> Placed on {new Date(selectedOrder.date).getDate()}/{new Date(selectedOrder.date).getMonth()}/{new Date(selectedOrder.date).getFullYear()}</div>
      <div className={classes.headtitle} style={{margin:"auto 1em auto auto",fontWeight:'500'}} onClick={()=>console.log(steps)}>{selectedOrder.currency === 'eur' ? '€' : '$'}{selectedOrder.total_price}</div>
      <div style={{display:'flex',flexDirection:'row'}}>
      {/* {categoryId == 4 && <button className={classes.reviewbtn} onClick={()=>setisReviewMood(true) & setisSelected(false)}>Review</button> }
      {categoryId == 2 ? <button className={classes.btn}  onClick={(event) => setShowPopup(true) & event.stopPropagation()}>Cancel Order</button> : <button onClick={AddAllToCart} className={`${categoryId == 4 ? classes.deliveredBtn : classes.btn}`} >Repurchase</button>} */}
      </div>
      </div>
      <div className={classes.detailsContainer}>
        <div style={{width:'100%',display:'grid',gridTemplateColumns:"25% 25% 25% 25%",margin:'3em 0 1em 12.5%'}}>
        {steps.map((step) => {
            return (
              <div key={step.id} className={classes.orderStep}  style={step.id == 5 ? {borderTop:'.2em solid transparent'} : {borderTop:step.id < categoryId ? '.2em solid var(--primary-color)':'.2em solid rgba(255,255,255,0.5)'}}>
                <div className={classes.stepdot} style={step.id == categoryId ? {backgroundColor:'var(--primary-color)',boxShadow:'0px 0px 0px .6em rgba(233, 119, 4, 50%)'} : step.id < categoryId ? {backgroundColor:'var(--primary-color)'} : {backgroundColor:'rgba(255,255,255,0.5)'}}/>
                <h1 style={{color: step.id > categoryId ? 'rgba(255,255,255,0.5)':'#fff',fontSize:'calc(1rem + 0.3vw)',lineHeight:'100%',fontWeight:'600',marginLeft:'-50%',textAlign:'center',width:'100%'}}>
                 {step.id === 2 ? <PiNotebook style={{fontSize:"2em"}}/> : step.id === 3 ? <PiPackageDuotone style={{fontSize:"2em"}}/> : step.id === 4 ? <PiTruck style={{fontSize:"2em"}}/> : <PiHandshake style={{fontSize:"2em"}}/>} <br/> {step.label} 
                  {/* {(step.id <= categoryId || step.id === 5)&& <span style={{fontSize:'smaller',color:'var(--primary-color)',fontWeight:'500',paddingLeft:'.5em'}}>{(step.id === 5 && step.estimatedDate === "") ?  EstimatedDeliveryDate : (step.id !== 5 ? new Date(step.estimatedDate).toDateString() : new Date(step.estimatedDate).toDateString())} </span>}  */}
                </h1>
                  <p style={{textAlign:'start', color:'#999999'}}>{step.description1}</p>
              </div>
            )})}
            <div>
            <div className={classes.header}>
              <div className={classes.headtitle} style={{color:'var(--accent-color)'}}>Shipping Address</div>
            </div>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--secondary-color)','&.Mui-checked': { color: 'var(--secondary-color)',},margin:'.8em 0 auto 0'}}/>
               <div>
                <p style={{fontSize:'calc(.9rem + .3vw)'}}>{selectedOrder.user_address.name} <button style={{cursor:"auto",border:'none',backgroundColor:'var(--secondary-color)',color:'var(--secondary-color)',borderRadius:'.3em',marginLeft:'3%',padding:'.3em 1em',fontWeight:'500',fontFamily:'var(--font-family)',fontSize:'large'}}>{selectedOrder.user_address.title}</button></p>
                <p>{selectedOrder.user_address.address}, {selectedOrder.user_address.city}, {selectedOrder.user_address.postalcode}</p>
                <p>{selectedOrder.user_address.country}</p>
               </div>
            </div>
            <div className={classes.header} style={{marginTop:'2em'}}>
              <div className={classes.headtitle} style={{color:'var(--accent-color)'}}>Payment Method</div>
            </div>
            <div className={classes.adressCard}>
               <Radio defaultChecked value={true} sx={{ color: 'var(--secondary-color)','&.Mui-checked': { color: 'var(--secondary-color)',},margin:'.5em 0 auto 0'}}/>
               <div>
                <p style={{fontSize:'calc(.9rem + .3vw)'}}>
                  <img alt='visa' src={selectedOrder.user_payment.card_type === 'Master' ? master : visa} style={{width:'auto',height:'1.5em',margin:'0 1em -.5em 1em'}}/>
                  {maskConstant(selectedOrder.user_payment.card_number)} <span style={{color:'var(--primary-color)',paddingLeft:'2em',fontWeight:'400'}}>Expires {selectedOrder.user_payment.month}/{selectedOrder.user_payment.year}</span> </p>
                  
               </div>
            </div>
      </div>
        </div>

        <div className={classes.total_con }>
        <div className={classes.total}>
        <div className={classes.totalrows} style={{margin:'1em 0'}} >
            <p style={{fontWeight:'600',fontSize:'larger'}}>Order # {selectedOrder.id}</p>
            <p style={{ textAlign: "end" }}>( {selectedOrder.order_invoice_items?.length } items )</p>
          </div>
          <div className={classes.cardCont}>
             {selectedOrder.order_invoice_items?.map((props)=>{
            return(
        <div className={classes.card} key={props._id}>
            <div style={{display:"flex",flexDirection:"row",gap:".5em",width:'100%'}}>
            <div className={classes.imageCont}>
              <img src={props.article.articleimage[0]?.link ? props.article.articleimage[0].link : bookPlaceHolder} alt="" style={{height:'100%', width: '100%',objectFit:'cover' }}/>
            </div>
            <div style={{height:'100%',justifyContent:'space-between',display:'flex', flexDirection:'column',width:'80%',fontSize:'calc(.7rem + 0.3vw)',fontFamily:'var(--font-family)'}}>
              <p style={{fontWeight:'600'}}>{props.article.designation}</p>
              <p style={{fontWeight:'400',fontSize:'calc(.6rem + 0.2vw)'}}>{props.article.dc_auteur} {props.article.dc_collection} {FormatDate(props.article.dc_parution)}</p>
              <p style={{fontWeight:'500'}}> QTY : {props.quantity} </p>
            </div>
            </div>
            <div className={classes.quantity}>
              <p style={{color:'var(--secondary-color)',fontSize:'large'}}>{props.price}{selectedOrder.currency === 'usd' ? '$' : '€' } </p>
            </div>
          </div>
             )
          })} 
          </div>
       
          <Divider style={{background:'#fff',margin:'1em 0'}}/>
          <div className={classes.totalrows} >
            <p>SUBTOTAL</p>
            <p style={{ textAlign: "end",fontWeight:"600" }}>{selectedOrder.base_price}{selectedOrder.currency === 'usd' ? '$' : '€' }</p>
          </div><div className={classes.totalrows}>
            <p>TAXES</p>
            <p style={{ textAlign: "end" ,fontWeight:"600"}}>{(selectedOrder.base_price - calculateTotalPrice(selectedOrder.order_invoice_items)).toFixed(2)}{selectedOrder.currency === 'usd' ? '$' : '€' }</p>
          </div>
          <div className={classes.totalrows}>
            <p>DELIVERY</p>
            <p style={{ textAlign: "end" ,fontWeight:"600"}}>{(selectedOrder.total_price - calculateTotalPrice(selectedOrder.order_invoice_items)).toFixed(2)}{selectedOrder.currency === 'usd' ? '$' : '€' }</p>
          </div>
          <Divider style={{background:'#fff',margin:'1em 0'}}/>
          <div className={classes.totalrows} style={{marginBottom:'3em' }}>
            <p>TOTAL</p>
            <p style={{ textAlign: "end",fontWeight:"600"}}>{selectedOrder.total_price}{selectedOrder.currency === 'usd' ? '$' : '€' }</p>
          </div>
        </div>
          
      </div>
        </div>
      </div>}
      { isReviewMood && <div> 
        <div className={classes.header1}>
      <div className={classes.headtitle}>Order # {selectedOrder.id}</div>
      <div style={{display:'flex',flexDirection:'row'}}>
        <h4 onClick={()=>setisSelected(false) & setisReviewMood(false) & setselectedOrder({}) & window.scrollTo({ top: 0 })} style={{color:'var(--accent-color)',fontSize:'calc(1rem + .3vw)',margin:'0.5em 1.5em',cursor:'pointer',fontFamily:'var(--font-family)',fontWeight:'500'}}><IoIosArrowBack style={{marginBottom:'-.15em'}}/> Back</h4>
     <button className={classes.reviewbtn} style={{backgroundColor:'var(--primary-color)',marginRight:"0"}}>Return</button> 
      </div>
      </div>
        <Review props={selectedOrder}/>
      </div>}
      <div className={classes.deliveredMob}><button className={classes.btn} onClick={AddAllToCart}>Repurchase</button></div>
      {showPopup && (
        <ConfirmationPopup
          message={"Are you sure you want to delete this Order?"}
          onConfirm={CancleOrderHandler}
          onCancel={() => setShowPopup(false)}
          showPopup={showPopup}
        />
      )}
    </div>
  )
}

export default OrderTracking