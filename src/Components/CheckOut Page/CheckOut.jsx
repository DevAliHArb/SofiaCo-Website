import React, { useContext, useEffect } from "react";
import classes from "./CheckOut.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select } from "antd";
import EmptyCart from "../../assets/EmptyCart.png";
// import contactUsImage from "../../assets/contactUsImage.png";
// import contactUsMobImage from "../../assets/contactUsMobImage.png";
import { GoTag } from "react-icons/go";
import { useState } from "react";
import visa from "../../assets/visa_logo.png";
import master from "../../assets/master_logo.png";
import { Link, useNavigate } from "react-router-dom";
import CartSidebar from "../Common/Cart SideBar/CartSidebar";
import CheckOutItem from "./CheckOutItem";
import CircularProgress from '@mui/material/CircularProgress';
// import CoupsDeCoeur from "../Common/CoupsDeCoeur Section/CoupsDeCoeur";
import Data from '../../Data.json'
import PopupAdressesModal from "./Popups/PopupAdressesModal";
import PopupPaymentModal from "./Popups/PopupPaymentModal";
import PopupConfirmedModal from "./Popups/PopupConfirmedModal";
import AuthContext from "../Common/authContext";
import {
  Box,
  Divider,
  FormControl, 
  FormControlLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  
} from "@mui/material";
import axios from "axios";
import {
  editDefaultAdd,
  editDefaultPAY,
  resetCart,
} from "../Common/redux/productSlice";
import AlsoSee from "../Common Components/Also See/AlsoSee";
import { toast } from "react-toastify";

const { TextArea } = Input;

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "1em",
  boxShadow: 24,
  p: 4,
};

const CheckOut = () => {
  const [form] = Form.useForm();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector( (state) => state.products.selectedCurrency[0].currency);
  const authCtx = useContext(AuthContext);
  const productData = useSelector((state) => state.products.productData);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.products.userInfo);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [totalAmt, setTotalAmt] = useState(0);
  const [subtotalAmt, setsubTotalAmt] = useState(0);
  const [totalWeight, settotalWeight] = useState(0);
  const [deliveryFees, setdeliveryFees] = useState(0);
  const [deliveryId, setdeliveryId] = useState(null);
  const [TVA, setTVA] = useState(0);
  const [displayedPayment, setdisplayedPayment] = useState(1);
  const [displayedAddress, setdisplayedAddress] = useState(1);
  const [selectedPayment, setselectedPayment] = useState(1);
  const [selectedAddress, setselectedAddress] = useState(1);
  const [coupon, setcoupon] = useState({});
  const [userCoupon, setuserCoupon] = useState([]);
  const [reviewMsg, setreviewMsg] = useState("");
  const [addressmodalopen, setAdressModalOpen] = React.useState(false);
  const handleAdressOpen = () => setAdressModalOpen(true);
  const [paymentmodalopen, setPaymentModalOpen] = React.useState(false);
  const handlePaymentOpen = () => setPaymentModalOpen(true);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isContainerVisible, setContainerVisible] = useState(true);
  const [addresseslist, setAddressesList] = useState([]);
  const [paymentslist, setPaymentsList] = useState([]);
  const [order_invoice_items, setorder_invoice_items] = useState([]);
  const [shippingCosts, setshippingCosts] = useState([]); // State to store the coupon code input
  const [couponList, setCouponList] = useState([]); // State to store the list of coupons
  const [selectedCoupon, setSelectedCoupon] = useState(""); // State to store the selected coupon
  
  const [editMode, seteditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [editaddressId, setEditaddressid] = useState();

  function getShippingCost(orderCartCost, orderWeight, shippingCostss) {
    console.log("heloooo", {orderCartCost, orderWeight, shippingCostss})
    // Filter out items with null cart_cost and sort the remaining items by cart_cost in ascending order
    const sortedByCartCost = shippingCostss
      .filter((item) => item.cart_cost !== null)
      .sort((a, b) => parseFloat(a.cart_cost) - parseFloat(b.cart_cost));

    // Iterate over the sorted items by cart_cost
    for (let i = 0; i < sortedByCartCost.length; i++) {
      const costItem = sortedByCartCost[i];
      const cartCost = parseFloat(costItem.cart_cost);

      // Check if the order's cart cost falls below the current cost range
      if (orderCartCost < cartCost) {
        setdeliveryId(costItem.id)
        return parseFloat(costItem.cost);
      }
    }

    // If no cart cost found above the order cart cost, filter out items with null weight and sort the remaining items by weight in descending order
    const sortedByWeight = shippingCostss
      .filter((item) => item.weight !== null)
      .sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));

    // Iterate over the sorted items by weight
    for (let i = 0; i < sortedByWeight.length; i++) {
      const costItem = sortedByWeight[i];
      const weight = parseFloat(costItem.weight);

      // Check if the order's weight falls below the current weight range
      if (orderWeight < weight) {
        setdeliveryId(costItem.id)
        return parseFloat(costItem.cost);
      }
    }

    // If no applicable cost found, return 0 or some default value
    setdeliveryId(null)
    return 0;
  }

  const handleCouponChange = (e) => {
    console.log(e)
    setSelectedCoupon(e); // Update selected coupon value
  };

  // Fetch list of coupons from backend API
  const fetchCoupons = async () => {
    try {
      // Fetch user's coupons
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const userCoupons = response.data.data;

      // Fetch coupon data for each coupon_id
      const couponsPromises = userCoupons.map(async (coupon) => {
        const couponId = coupon.coupon_id;
        const couponResponse = await axios.get(
          `https://api.leonardo-service.com/api/bookshop/coupons/${couponId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        return couponResponse.data.data;
      });
      // Resolve all promises
      const resolvedCoupons = await Promise.all(couponsPromises);

      // Save coupon data in state
      setCouponList(resolvedCoupons);
    } catch (error) {
      console.error("Error fetching user coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons(); // Fetch coupons when component mounts
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  function generatedate() {
    const currentDate = new Date();
    // Get the individual components of the date and time
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed, so January is 0
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  const token = getToken();

  const handleApplyCoupon = async () => {
    try {
      // Step 1: Check if the coupon code exists in the coupons table
      const couponResponse = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/coupons`,
        {
          params: {
            code: selectedCoupon,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // If the coupon exists
      if (couponResponse.data && couponResponse.data.data) {
        const couponId = couponResponse.data.data.id;

        // Step 2: Check if the coupon is associated with the user in the user_coupons table
        const userCouponResponse = await axios.get(
          `https://api.leonardo-service.com/api/bookshop/users/${user.id}/coupons`,
          {
            params: {
              coupon_id: couponId,
            },
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );

        setSelectedCoupon("");
        setcoupon(couponResponse.data.data);
        setuserCoupon(userCouponResponse.data.data);
        // Notify the user about successful coupon application
        toast.success(`Coupon applied successfully.`, {
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
        toast.error(`Invalid coupon code.`, {
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
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon.", {
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
  };

  const FetchShippinCost = async () => {
    if (addresseslist?.length === 0) {
      setshippingCosts([]);
    } else {
      const activeAddress = addresseslist?.find(
        (address) => address.default === "true"
      );
      console.log(activeAddress.country);
      try {
        const orderCartCost = subtotalAmt;
        const orderWeight = totalWeight;
        setLoading(true);
        const response = await axios.get(
          `https://api.leonardo-service.com/api/bookshop/shipping-costs?country_name=${activeAddress.country}`
        );
        console.log("Response data del:", response.data);
        setshippingCosts(response.data.data);
        const shippingCost = getShippingCost(
          orderCartCost ,
          orderWeight,
          response.data.data
        );
        setdeliveryFees(shippingCost);
        console.log("Shipping cost:", response.data.data);
      } catch (error) {
        window.location.reload();
        setLoading(false);
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
      FetchShippinCost();
  }, [addresseslist, subtotalAmt,totalWeight]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const addresses = response.data.data;

      // Sort addresses to have the default address first
      const sortedAddresses = addresses.sort((a, b) => {
        if (a.default === "true") return -1;
        if (b.default === "true") return 1;
        return a.id - b.id;
      });

      setAddressesList(sortedAddresses);
      setdisplayedAddress(1);

      sortedAddresses.forEach((element) => {
        if (element.default === "true") {
          dispatch(editDefaultAdd(element.id));
        }
      });
      // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Set loading to false in case of error
    } finally{
      FetchShippinCost();
    }
  };

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
      const sortedPayments = response.data.data.sort((a, b) => {
        if (a.default === "true") return -1;
        if (b.default === "true") return 1;
        return a.id - b.id;
      });
      setPaymentsList(sortedPayments);
      setdisplayedPayment(1);
      response?.data.data.forEach((element) => {
        if (element.default === "true") {
          dispatch(editDefaultPAY(element.id));
        }
      });
      // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Set loading to false in case of error
    }
  };

  const handleAdressClose = () => {
    setAdressModalOpen(false);
    setTimeout(() => {
      fetchAddresses();
      console.log(addresseslist);
    }, 500);
  };

  const handlePaymentClose = () => {
    setPaymentModalOpen(false);
    fetchPayments();
  };
  useEffect(() => {
    fetchPayments();
    fetchAddresses();
  }, []);

  // useEffect(() => {
  //   if(productData?.length === 0){
  //     navigate('/cart')
  //   }
  // }, [productData]);

  useEffect(() => {
    let updatedOrderInvoiceItems = [];
    let totalPrice = 0;
    let totalWeight = 0;
    let totalTVA = 0;
    productData.forEach((item) => {
      updatedOrderInvoiceItems.push({
        article_id: item._id,
        quantity: item.quantity,
        cost:
          (item.discount > 0
            ? (item.price - item.price * (item.discount / 100)).toFixed(2)
            : Number(item.price).toFixed(2)) * 1,
        review: item.note || "-",
        price:
          (item.discount > 0
            ? (item.price - item.price * (item.discount / 100)).toFixed(2)
            : Number(item.price).toFixed(2)) * 1,
      });
      totalPrice +=
        item.quantity *
        (item.discount > 0
          ? (item.price - item.price * (item.discount / 100)).toFixed(2)
          : Number(item.price).toFixed(2));
      totalWeight += item.quantity * item.weight;
      totalTVA += (item.price_ttc - item.price) * item.quantity;
    });
    setorder_invoice_items(updatedOrderInvoiceItems);
    settotalWeight(totalWeight);
    if (currency === "usd") {
      setsubTotalAmt((totalPrice * authCtx.currencyRate + totalTVA).toFixed(2));
      setTVA((totalTVA * authCtx.currencyRate).toFixed(2));
    } else {
      setsubTotalAmt((totalPrice + totalTVA).toFixed(2));
      setTVA(totalTVA.toFixed(2));
    }
  }, [productData, currency]);
  useEffect(() => {
    if (totalAmt < 0) {
      setTotalAmt(0);
    }
  }, [totalAmt]);

  const CheckOutHandler = async () => {
    if (!user.defaultAdd) {
      toast.error("Please add a default Address.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } else if (!user.defaultPay) {
      toast.error("Please add a default Payment.", {
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
      try {
        const requestData = {
          user_id: user.id,
          user_address_id: user.defaultAdd,
          user_payment_id: user.defaultPay,
          delivery_id: deliveryId,
          base_price: subtotalAmt,
          date: generatedate(),
          total_price: totalAmt,
          review: reviewMsg,
          order_invoice_items: order_invoice_items,
          currency: currency,
        };

        if (userCoupon.length > 0) {
          requestData.user_coupon_id = userCoupon[0].id;
        }
        setLoading(true);
        const response = await axios.post(
          "https://api.leonardo-service.com/api/bookshop/order_invoices",
          requestData
        );

        dispatch(resetCart());
        setorderId(response.data.order_invoice.id)
        console.log(response.data.order_invoice.id)
        navigate(`/checkout-completed/${response.data.order_invoice.id}`);
        setLoading(false);
        toast.success(`Order success`, {
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
        console.error("Error in ordering:", error);
        setLoading(false);
        toast.error("Failed to order items.", {
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
    }
  };

  const calculateReduction = (subtotalAmt, percentage) => {
    const reduction = parseFloat(subtotalAmt) * (parseFloat(percentage) / 100); // 20% reduction
    const result = parseFloat(subtotalAmt) - parseFloat(reduction);
    return result;
  };
  const calculateReductionAmt = (total, percentage) => {
    const reduction = total * (percentage / 100); // 20% reduction
    return reduction;
  };

  useEffect(() => {
    if (coupon.reduction) {
      if (coupon.type === "Amount") {
        const subTotal =
          parseFloat(subtotalAmt) -
          (currency === "usd"
            ? coupon.reduction * authCtx.currencyRate
            : parseFloat(coupon.reduction));
        const total = parseFloat(deliveryFees) + parseFloat(subTotal);
        setTotalAmt(total.toFixed(2));
      }
      if (coupon.type === "Percentage") {
        const subTotal = calculateReduction(subtotalAmt, coupon.reduction);
        const total = parseFloat(deliveryFees) + parseFloat(subTotal);
        setTotalAmt(total.toFixed(2));
      }
    } else {
      const total = parseFloat(deliveryFees) + parseFloat(subtotalAmt);
      setTotalAmt(total.toFixed(2));
    }
  }, [deliveryFees, coupon, subtotalAmt]);

  // Function to check if a coupon has expired
  const isCouponExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    return expiryDateObj < currentDate;
  };

  const userInfo = useSelector((state) => state.products.userInfo);
  const [value, setValue] = React.useState("option1");
  const [isFixed, setIsFixed] = React.useState(true);
  const [orderId, setorderId] = React.useState(0);
  const [confirmedmodalopen, setconfirmedmodalopen] = React.useState(false);
  const handleConfirmedOpen = () => setconfirmedmodalopen(true);

  const handleConfirmedClose = () => {
    setconfirmedmodalopen(false);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChange1 = async (id) => {
    try {
      // Update the database to set the selected address as default
      await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/payments/${id}`,
        {
          default: "true",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      fetchPayments();
      toast.success("Default Payment card is set successfully", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error setting default payment:", error);
    }
  };

  const handleChange2 = async (id) => {
    try {
      // Update the database to set the selected address as default
      await axios.put(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/addresses/${id}`,
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
      toast.success("Default address is set!", {
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
      console.error("Error setting default address:", error);
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
      toast.success("Payment card deleted successfully", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  
  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/addresses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setAddressesList((prevAddresses) =>
        prevAddresses.filter((address) => address.id !== id)
      );  
      toast.success('Address Deleted', {
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
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className={classes.cart_container}>
      {loading && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(224, 195, 137, 0.2)', zIndex: 9999 }}><CircularProgress style={{margin:"45vh",color:'var(--primary-color)'}}/></div>} 
      
      <div className={classes.headTitles}>
        <h1>Checkout</h1>
        <div style={{width:'fit-content',margin:"2em auto",display:'flex',flexDirection:"row",gap:"2em"}}>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:"pointer"}} onClick={()=>navigate('/cart')}><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>1</span> {Data.Cart.title1[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'default',borderBottom:".2em solid var(--primary-color)"}}><span style={{padding:'.3em .5em',backgroundColor:'var(--primary-color)',color:'#fff',borderRadius:'50%'}}>2</span> {Data.Cart.title2[language]}</h4>
          <h4 style={{padding:'1em',margin:'0 .5em',cursor:'not-allowed'}}><span style={{padding:'.3em .5em',backgroundColor:'#EEBA7F',color:'#fff',borderRadius:'50%'}}>3</span> {Data.Cart.title3[language]}</h4>
        </div>
      </div>
      <div className={classes.shopping_con}>
        <div className={classes.shopping}>
          {productData.length == 0 ? (
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
                  color: "var(--accent-color)",
                  fontFamily: "var(--font-family)",
                  fontSize: "calc(.7rem + .3vw)",
                }}
              >
                <div style={{ width: "fit-content", margin: "auto" }}>
                  <img
                    alt="EmptyCart"
                    src={EmptyCart}
                    style={{ width: "10em", height: "auto" }}
                  />
                </div>
                <h1 style={{ textAlign: "center",fontFamily: "var(--font-family)" }}>Your Cart is empty!</h1>
                <p style={{ textAlign: "center" ,fontFamily: "var(--font-family)"}}>
                  {" "}
                  You have no items in your shopping cart
                </p>
                <button
                  className={classes.browseBtn}
                  onClick={() => navigate("/")}
                >
                  Browse
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.container}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <h2
                    style={{
                      color: "var(--secondary-color)",
                      fontFamily: "var(--font-family)",
                      fontSize: "calc(1.2rem + .3vw)",
                      marginTop: "0",
                      fontWeight: "500",
                    }}
                  >
                    Address
                  </h2>
                  <button
                    className={classes.btn}
                    onClick={() => {
                      setdisplayedAddress(addresseslist?.length);
                    }}
                  >
                    My Addresses
                  </button>
                </div>
                {addresseslist?.slice(0, displayedAddress).map((address) => {
                  return (
                    <div className={classes.adressCard}>
                      <RadioGroup
                        value={
                          addresseslist.find((item) => item.default === "true")
                            ?.id
                        }
                        onChange={() =>
                          handleChange2(address.id) &
                          console.log(address.default)
                        }
                      >
                        <FormControlLabel
                          value={address.id}
                          control={
                            <Radio
                              defaultChecked
                              value={address.id}
                              sx={{
                                color: "var(--primary-color)",
                                "&.Mui-checked": {
                                  color: "var(--primary-color)",
                                },
                                margin: ".5em 0 auto 0",
                              }}
                            />
                          }
                        />
                      </RadioGroup>{" "}
                      <div>
                        <p style={{ fontSize: "calc(.9rem + .3vw)" }}>
                          {address.name}{" "}
                          <button
                            style={{
                              cursor: "auto",
                              border: "none",
                              backgroundColor: "var(--authbg-color)",
                              color: "#fff",
                              borderRadius: ".3em",
                              marginLeft: "7%",
                              padding: ".3em 1em",
                              fontWeight: "500",
                              fontFamily: "var(--font-family)",
                              fontSize: "medium",
                            }}
                          >
                            {address.title}
                          </button>
                        </p>
                        <p>
                          {address.address}, {address.city},{" "}
                          {address.postalcode}{" "}
                        </p>
                        <p>{address.country}</p>
                      </div>
                      <div className={classes.removeCont} style={{zIndex:'9'}}>
                        <p
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            color: "var(--secondary-color)",
                            fontWeight: "600",
                          }}
                          onClick={() => {
                            setFormData(address);
                            seteditMode(true);
                            handleAdressOpen();
                            setEditaddressid(address.id)
                          }}                        >
                          Edit
                        </p>
                        <p
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            fontWeight: "600",
                            zIndex:'9'
                          }}
                          onClick={()=>handleDeleteAddress(address.id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  );
                })}
                <p
                  onClick={() => {
                    handleAdressOpen();
                    seteditMode(false);
                    setFormData({});
                  }}
                  style={{
                    color: "var(--authbg-color)",
                    paddingLeft: "7%",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .3vw)",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "2em",
                  }}
                >
                  <p
                    style={{
                      fontSize: "calc(1.5rem + .4vw)",
                      margin: "-.3em .3em 0 0",
                    }}
                  >
                    +
                  </p>{" "}
                  Add New Address
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    margin: "4em 0 2em 0",
                  }}
                >
                  <h2
                    style={{
                      color: "var(--secondary-color)",
                      fontFamily: "var(--font-family)",
                      fontSize: "calc(1.2rem + .3vw)",
                      marginTop: "0",
                      fontWeight: "500",
                    }}
                  >
                    Payment Method
                  </h2>
                  <button
                    className={classes.btn}
                    onClick={() => {
                      setdisplayedPayment(paymentslist?.length);
                    }}
                  >
                    My Payment Methods
                  </button>
                </div>
                {paymentslist?.slice(0, displayedPayment).map((payment) => {
                  return (
                    <div className={classes.adressCard}>
                      <RadioGroup
                        value={
                          paymentslist.find((item) => item.default === "true")
                            ?.id
                        }
                        onChange={() =>
                          handleChange1(payment.id) &
                          console.log(payment.default)
                        }
                      >
                        <FormControlLabel
                          value={payment.id}
                          control={
                            <Radio
                              defaultChecked
                              value={payment.id}
                              sx={{
                                color: "var(--primary-color)",
                                "&.Mui-checked": {
                                  color: "var(--primary-color)",
                                },
                                margin: ".5em 0 auto 0",
                              }}
                            />
                          }
                        />
                      </RadioGroup>
                      {/* <Radio defaultChecked value={payment.id} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.5em 0 auto 0'}}/> */}
                      <div>
                        <p style={{ fontSize: "calc(.8rem + .3vw)" }}>
                          <img
                            alt="visa"
                            src={payment.card_type === 'Master' ? master : visa}
                            style={{
                              width: "auto",
                              height: "1.5em",
                              margin: "0 1em -.5em 0em",
                            }}
                          />
                          {maskConstant(payment.card_number)}{" "}
                          <span
                            style={{
                              color: "var(--authbg-color)",
                              paddingLeft: "2em",
                              fontWeight: "400",
                            }}
                          > <br className={classes.break}/> <br className={classes.break}/> 
                            Expires {payment.month}/{payment.year}
                          </span>{" "}
                        </p>
                      </div>
                      <div className={classes.removeCont}>
                        <p
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            marginLeft: "auto",
                            fontWeight: "600",
                          }}
                          onClick={()=>handleDeletePayment(payment.id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  );
                })}
                <p
                  onClick={() => {
                    handlePaymentOpen();
                  }}
                  style={{
                    color: "var(--authbg-color)",
                    paddingLeft: "7%",
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(.8rem + .3vw)",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "2em",
                  }}
                >
                  <p
                    style={{
                      fontSize: "calc(1.5rem + .4vw)",
                      margin: "-.3em .3em 0 0",
                    }}
                  >
                    +
                  </p>{" "}
                  Add New Payment Method
                </p>
          <div className={classes.noteContainer}>
            <h2
              style={{
                color: "var(--secondary-color)",
                fontFamily: "var(--font-family)",
                fontSize: "calc(1rem + .3vw)",
                margin: "2em 0 0.5em 0 ",
                fontWeight: "600",
                textAlign:'start',paddingLeft:".3em"
              }}
            >
              Add a note to your order
            </h2>
            <TextArea
              name="note"
              rows={5}
              value={reviewMsg}
              onChange={(e) => setreviewMsg(e.target.value)}
              placeholder="Notes concernant votre commande, par exemple des notes spéciales pour la livraison…"
              style={{
                border: "none",
                padding: "1em 2em",
                width: "100%",
                backgroundColor: "#F3F5FA",
                borderRadius: ".7em",
                fontSize: "calc(.7rem + 0.3vw)",
              }}
            />
          </div>
              </div>
              <CheckOutItem />
            </>
          )}
          {isContainerVisible && (
            <div className={classes.MobSticky}>
              <div
                className={classes.totalrows}
                style={{
                  color: "#fff",
                  width: "80%",
                  margin: "1em auto 0 auto",
                  padding: ".4em 0",
                  marginTop: "1em",
                  borderRadius: ".7em",
                }}
              >
                <p style={{ fontWeight: "600", paddingLeft: "1em" }}>TOTAL </p>
                <p
                  style={{
                    fontWeight: "600",
                    textAlign: "end",
                    paddingRight: "1em",
                  }}
                >
                  $ {totalAmt}
                </p>
              </div>
              <button
                className={classes.checkout_btn}
                id="footer111"
                onClick={CheckOutHandler}
                style={{
                  height: "3em",
                  margin: "1em auto ",
                  fontSize: "calc(.7rem + 0.3vw)",
                  width: "80%",
                }}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      <div className={classes.bigContainer} >
        <div className={classes.auth_bg}></div>
        <div className={classes.total_con} id="fixed-component11">
            <div className={classes.total}>
              <div className={classes.totalrows}>
                <h2>Mon Panier</h2>
                <p style={{ textAlign: "end" }}>
                  ( {productData?.length} ITEMS )
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>Total TTC</p>
                <p style={{ textAlign: "end" }}>
                  {(subtotalAmt * 1).toFixed(2)} {currency == "eur" ? `€` : `$`}
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>Total HT</p>
                <p style={{ textAlign: "end" }}>
                  {(subtotalAmt - TVA).toFixed(2)}{" "}
                  {currency == "eur" ? `€` : `$`}
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>Total TVA</p>
                <p style={{ textAlign: "end" }}>
                  {TVA} {currency == "eur" ? `€` : `$`}
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>Frais de port</p>
                <p style={{ textAlign: "end" }}>
                  {deliveryFees === 0 ? "Free" : deliveryFees}{" "}
                  {deliveryFees != 0 && (currency === "eur" ? `€` : `$`)}
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>
                  Remise{" "}
                  {coupon.reduction &&
                    coupon.type === "Percentage" &&
                    `(${coupon.reduction} % OFF)`}
                </p>
                <p style={{ textAlign: "end" }}>
                  {coupon.reduction
                    ? coupon.type === "Percentage"
                      ? `- ${calculateReductionAmt(
                          subtotalAmt,
                          coupon.reduction
                        ).toFixed(2)} ${currency === "usd" ? "$" : "€"}`
                      : `- ${
                          currency === "usd"
                            ? `${(
                                coupon.reduction * authCtx.currencyRate
                              ).toFixed(2)} $`
                            : `${coupon.reduction} €`
                        }`
                    : "0.00"}
                </p>
              </div>
              <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                onFinish={handleApplyCoupon}
                className={classes.totalrows}
                style={{ marginTop: "2em",gridTemplateColumns:'65% 35%' }}
              >
                <Form.Item name="name" initialValue=""
                style={{
                      height: "2.5em",
                      borderRadius: ".7em",
                      fontSize: "calc(.7rem + 0.3vw)",
                      width: "100%",
                    }}>
                  <Select
                    value={selectedCoupon}
                    onChange={handleCouponChange}
                    displayEmpty
                    style={{
                      border: "none",
                      height: "2.5em",
                      borderRadius: ".7em",
                      fontSize: "calc(.7rem + 0.3vw)",
                      width: "100%",
                    }}
                  >
                    {/* <MenuItem value="" disabled>
                  {language === 'eng' ? 'Select a coupon' : 'Sélectionner un coupon'}
                </MenuItem> */}
                    <MenuItem
                      style={{ border: "none", height: "2.5em" }}
                      value=""
                    >
                      {language === "eng" ? "No Coupon" : "Non Coupon"}
                    </MenuItem>
                    {couponList
                      .filter(
                        (coupon) =>
                          coupon.active === "true" &&
                          !isCouponExpired(coupon.expiry)
                      )
                      .map((coupon) => (
                        <MenuItem
                          style={{ border: "none", height: "2.5em" }}
                          key={coupon.id}
                          value={coupon.code}
                        >
                          {coupon.code}
                        </MenuItem>
                      ))}
                  </Select>
                  {/* <Input
              suffix={<GoTag style={{ color: 'var(--accent-color)' }} />}
              name="name"
                    placeholder="Ajouter un code promo" 
                    style={{border:'none',backgroundColor:"#DED8CC",height:'2.5em',borderRadius:'.7em',fontSize:'calc(.7rem + 0.3vw)' }}
                    // onChange={handleChange}
              /> */}
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className={classes.checkout_btn}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
              <Divider className={classes.divider} />
              {/* <div className={classes.totalrows} >
            <p>SUBTOTAL </p>
            <p style={{ textAlign: "end" }}>$ {totalAmt}</p>
          </div>
          
          <RadioGroup
            aria-label="radio-buttons"
            name="radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <div className={classes.totalrows} style={{display:"flex",flexWrap:'wrap',justifyContent:'space-between',gap:'0'}}>
                  <p ><Radio value="option1" sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',}}}/>Free Regular Shipment</p>
                  <p >01 Feb, 2024</p>
                </div>
                <div className={classes.totalrows}  style={{display:"flex",flexWrap:'wrap',justifyContent:'space-between'}}>
                  <p ><Radio value="option2" sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',}}}/>$8.00 Priority Shipping</p>
                  <p >01 Feb, 2024</p>
                </div>
          </RadioGroup>
          <Divider
            className={classes.divider}
          /> */}
              <div className={classes.totalrows}>
                <p>TOTAL </p>
                <p style={{ textAlign: "end" }}>
                  {totalAmt}
                  {currency === "usd" ? "$" : "€"}
                </p>
              </div>
            </div>
            <button
              className={classes.checkout_btn}
              onClick={CheckOutHandler}
              style={{ margin: "2em 0" ,cursor:'pointer'}}
            >
              Checkout
            </button>
        </div>
      </div>
      </div>
      <AlsoSee />
      <CartSidebar />
      <PopupAdressesModal
        open={addressmodalopen}
        handleClose={handleAdressClose}
        isselectedAddress={(data) => setselectedAddress(data)}
        formDataa={formData}
        editModee={editMode}
        editaddressId={editaddressId}
      />
      <PopupPaymentModal
        open={paymentmodalopen}
        handleClose={handlePaymentClose}
        isselectedPayment={(data) => setselectedPayment(data)}
        isselectedAddress={(data) => setselectedAddress(data)}
      />
      <PopupConfirmedModal
        open={confirmedmodalopen}
        orderId={orderId}
        handleClose={handleConfirmedClose}
      />
    </div>
  );
};

export default CheckOut;
