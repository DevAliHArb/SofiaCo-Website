import React, { useContext, useEffect, useState } from 'react'
import classes from './Factures.module.css'
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EmptyCart from "../../../assets/EmptyOrder.png";

import { Button } from "antd";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CommonCard from '../Common Card/CommonCard';
import AuthContext from '../../Common/authContext';
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";


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

const Factures = () => {
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
      console.log('Response data:', response.data.data);
      const filteredInvoices = sortedData.filter(orderInvoice => orderInvoice.status_id !== 20);
      setorders(filteredInvoices);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(9);

  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1);
    }
  };
  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id);
  };
  const prevpage = () => {
    if (currentpage !== 1) {
      setCurrentPage(currentpage - 1);
      setpagenbroute(pagenbroute - 1);
    }
  };

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/lookups?parent_id=1`);
      console.log('Response data:', response.data.data);
      const allCategories = { id: 0, name: 'All Orders', name_fr:"Toutes les commandes" };
      const filteredData = response.data.data.filter(item => item.id !== 6 && item.id !== 7 && item.id !== 8);
        const categoriesWithAll = [allCategories, ...filteredData];
        
        setordertrackcategories(categoriesWithAll);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchOrders();
  }, []);

  const CancleOrderHandler = () => {
    axios.put(`https://api.leonardo-service.com/api/bookshop/order_invoices/${selectedOrder.id}?status_id=13`)
    .then(() => {
        console.log("delete request successful:");
          toast.success(`Delete request successful`, {
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
        console.error("Error in delete request:", error);
        toast.error("Failed to delete item .", {
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
            {!loading && records?.length === 0 ? 
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
            </div> :  <>
                <div className={classes.headerss}>
                  <h3>Reference Number</h3>
                  <h3>Date</h3>
                  <h3>Total</h3>
                  <h3 >Download</h3> 
                </div>
          {!loading && records?.map((props)=>{
            return(
              <>
              <div onClick={()=>setisSelected(true) & setselectedOrder(props) & setcategoryId(props.status_id ) & window.scrollTo({ top: 0 })}>
              <CommonCard data={props} reviewHandler={()=>{setisReviewMood(true);setselectedOrder(props)}}/>
              </div>
              </>
             )
          })} 
          
        <div className={classes.page_control}>
          <div className={classes.control}>
            <button onClick={prevpage} style={{background:'transparent'}}>
              <FaArrowLeftLong className={classes.icon1} />
            </button>
            {numbers.map((n, i) => {
              if (
                n === 1 ||
                n === pagenb ||
                n === currentpage - 1 ||
                n === currentpage ||
                n === currentpage + 1 ||
                (n === currentpage + 2 && currentpage === 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => {
                      changepage(n);
                      setpagenbroute(n);
                    }}
                    className={`${
                      pagenbroute === n ? classes.selectednb : classes.nb
                    }`}
                  >
                    {n}
                  </button>
                );
              } else if (
                n === currentpage - 2 ||
                n === currentpage + 3
              ) {
                return (
                  <span key={i} className={classes.ellipsis}>...</span>
                );
              }
              return null;
            })}
            <button onClick={nextpage} style={{background:'transparent'}}>
              <FaArrowRightLong className={classes.icon1} />
            </button>
          </div>
        </div>
          </>}
        </div>
      </>}
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

export default Factures