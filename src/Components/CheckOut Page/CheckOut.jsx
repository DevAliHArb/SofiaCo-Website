import React, { useContext, useEffect, useRef } from "react";
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
  addOrderData,
  editDefaultAdd,
  editDefaultPAY,
  resetCart,
} from "../Common/redux/productSlice";
import AlsoSee from "../Common Components/Also See/AlsoSee";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "1em",
  boxShadow: 24,
  p: 4,
};

const CheckOut = () => {
  const [form] = Form.useForm();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
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
  const [ispaypal, setIspaypal] = useState(false);
  const [directPay, setdirectPay] = useState(false);
  const [openPay, setopenPay] = useState(false);
  const [delivery, setDelivery] = useState("standard");
  const [paymentId, setPaymentId] = useState("direct");
  const [EURTVA, setEURTVA] = useState(0);

  const [openpaypal, setOpenpaypal] = React.useState(false);
  const handleOpenpaypal = () => setOpenpaypal(true);
  const handleClosepaypal = () => setOpenpaypal(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleErrorOpen = (message) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const [colissimoPopupOpen, setColissimoPopupOpen] = useState(false);
  const [colissimoPointData, setColissimoPointData] = useState(null);
  const widgetRef = useRef(null);
  
  useEffect(() => {
    const outOfStockItems = productData.filter(item => item._qte_a_terme_calcule < 1);
    const removedItems = productData.filter(item => item?.removed);
    if (outOfStockItems.length > 0 ) {
      navigate('/cart');
    }
  }, [productData]);

  useEffect(() => {
    if (colissimoPointData === null) {
      setDelivery("standard");
    }
  }, [colissimoPointData]);

  useEffect(() => {
    // Function to load external scripts
    const loadScript = (src, onLoad) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };
  
    // Function to fetch authentication token
    const fetchAuthToken = async () => {
      const data = {
        login: import.meta.env.VITE_COLISSIMO_LOGIN,
        password: import.meta.env.VITE_COLISSIMO_PASSWORD,
      };
  
      try {
        const response = await axios.post(
          "https://ws.colissimo.fr/widget-colissimo/rest/authenticate.rest",
          data
        );
        return response.data.token;
      } catch (error) {
        return null;
      }
    };
  
    // Initialize the Colissimo widget
    const initializeColissimoWidget = async () => {
      const url_serveur = "https://ws.colissimo.fr";
      const token = await fetchAuthToken();
      if (!token) return;
  
      const user_address = addresseslist.find((add) => add.default === "true");
  
      // Load jQuery first
      loadScript(
        "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
        () => {
          if (window.$) {
            loadScript(
              "https://ws.colissimo.fr/widget-colissimo/js/jquery.plugin.colissimo.min.js",
              () => {
                if (window.$ && typeof window.$.fn.frameColissimoOpen === "function") {
                  // Ensure widgetRef is set and the element exists
                  if (widgetRef.current) {
                    window.$(widgetRef.current).frameColissimoOpen({
                      URLColissimo: url_serveur,
                      callBackFrame: "maMethodeDeCallBack",
                      ceCountry: "FR",
                      ceAddress: user_address.address,
                      ceZipCode: user_address.postalcode,
                      ceTown: user_address.city,
                      token: token,
                    });
  
                    // Override colissimo_widget_internalClose to close the widget and set state
                    const originalCloseFunction = window.colissimo_widget_internalClose;
                    window.colissimo_widget_internalClose = () => {
                      setColissimoPopupOpen(false);
                      if (originalCloseFunction) {
                        originalCloseFunction(); // Call the original function after setting the state
                      }
                    };
                  }
                }
              }
            );
          }
        }
      );
    };
  
    // Load and initialize widget
    if (colissimoPopupOpen) {
      initializeColissimoWidget();
    }
  
    // Cleanup function
    return () => {
      if (window.$ && widgetRef.current) {
        window.$(widgetRef.current).frameColissimoClose();
        setColissimoPopupOpen(false);
      }
    };
  }, [colissimoPopupOpen]);
  
  // Callback method
  useEffect(() => {
    window.maMethodeDeCallBack = (point) => {
      setColissimoPointData(point);
  
      // Ensure to close widget and update state
      if (window.$ && widgetRef.current) {
        window.$(widgetRef.current).frameColissimoClose();
      }
      setColissimoPopupOpen(false);
    };
  
    // Cleanup callback when component unmounts
    return () => {
      setColissimoPopupOpen(false);
      delete window.maMethodeDeCallBack;
    };
  }, []);

  function getShippingCost(orderCartCost, orderWeight, shippingCostss) {
    // console.log("heloooo", { orderCartCost, orderWeight, shippingCostss });
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
        setdeliveryId(costItem.id);
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
        setdeliveryId(costItem.id);
        return parseFloat(costItem.cost);
      }
    }

    // If no applicable cost found, return 0 or some default value
    setdeliveryId(null);
    return 0;
  }

  const handleCouponChange = (e) => {
    setSelectedCoupon(e); // Update selected coupon value
  };

  // Fetch list of coupons from backend API
  const fetchCoupons = async () => {
    try {
      // Fetch user's coupons
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/coupons`,
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
          `${import.meta.env.VITE_TESTING_API}/coupons/${couponId}`,
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
      // console.error("Error fetching user coupons:", error);
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
        `${import.meta.env.VITE_TESTING_API}/coupons`,
        {
          params: {
            code: selectedCoupon,
            ecom_type: 'sofiaco',
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
          `${import.meta.env.VITE_TESTING_API}/users/${user.id}/coupons`,
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
        form.resetFields()
        setcoupon(couponResponse.data.data);
        setuserCoupon(userCouponResponse.data.data);
        // Notify the user about successful coupon application
        toast.success(
          `${
            language === "eng"
              ? `Coupon applied successfully.`
              : "Coupon appliqué avec succès."
          }`,
          {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          }
        );
      } else {
        toast.error(
          `${
            language === "eng"
              ? `Invalid coupon code.`
              : "Code de coupon invalide."
          }`,
          {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          }
        );
      }
    } catch (error) {
      // console.error("Error applying coupon:", error);
      toast.error(
        `${
          language === "eng"
            ? "Failed to apply coupon."
            : "Le coupon n'a pas été appliqué."
        }`,
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        }
      );
    }
  };

  const FetchShippinCost = async (id) => {
    if (addresseslist?.length === 0) {
      setshippingCosts([]);
    } else {
      const activeAddress = addresseslist?.find(
        (address) => address.id === id ? id : user.defaultAdd 
      );
      // console.log(activeAddress.country);
      try {
        const orderCartCost = subtotalAmt;
        const orderWeight = totalWeight;
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/shipping-costs?ecom_type=sofiaco&country_name=${activeAddress.country}`
        );
        setshippingCosts(response.data.data);
        const shippingCost = getShippingCost(
          orderCartCost,
          orderWeight,
          response.data.data
        );
        const roundedShippingCost = parseFloat(shippingCost).toFixed(2);
        setdeliveryFees(roundedShippingCost);
      } catch (error) {
        window.location.reload();
        setLoading(false);
        // console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (colissimoPointData) {
      FetchShippinCost();
    } else {
      FetchShippinCost();
    }
  }, [colissimoPointData]);

  useEffect(() => {
    if (!colissimoPointData) {
      FetchShippinCost();     
    }
  }, [addresseslist, subtotalAmt,totalWeight]);

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
      const addresses = response.data.data;

      // Sort addresses to have the default address first
      const sortedAddresses = addresses.sort((a, b) => {
        if (a.default === "true") return -1;
        if (b.default === "true") return 1;
        return a.id - b.id;
      });

      setAddressesList(sortedAddresses);
      // setdisplayedAddress(1);

      sortedAddresses.forEach((element) => {
        if (element.default === "true") {
          dispatch(editDefaultAdd(element.id));
        }
      });
      // Set loading to false after fetching data
    } catch (error) {
      // console.error("Error fetching addresses:", error);
      // Set loading to false in case of error
    } finally {
      FetchShippinCost();
    }
  };

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
      const sortedPayments = response.data.data.sort((a, b) => {
        if (a.default === "true") return -1;
        if (b.default === "true") return 1;
        return a.id - b.id;
      });
      setPaymentsList(sortedPayments);
      setdisplayedPayment(1);
      // setopenPay(false);
      if (userInfo.default_pay === 'card')
       {response?.data.data.forEach((element) => {
        setdirectPay(false);
        setIspaypal(false)
         if (element.default === "true") {
           dispatch(editDefaultPAY(element.id));
           setPaymentId(element.id)
         }
       });}
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
      // console.log(addresseslist);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Adjust this threshold based on your requirements
      const threshold = documentHeight - windowHeight - 2500;

      // Update the state to hide the container when reaching the bottom
      setContainerVisible(scrollPosition < threshold);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let updatedOrderInvoiceItems = [];
    let totalPrice = 0;
    let totalWeight = 0;
    let totalTVA = 0;
    let totalPricedollar = 0;
    let totalTVAdollar = 0;

    productData.forEach((item) => {
      // Skip the item if _qte_a_terme_calcule is less than 1
      if (item._qte_a_terme_calcule < 1) {
        return;
      }

      // Calculate the price considering the discount
      const discountedPrice = item.discount > 0
        ? item.price_ttc - (item.price_ttc * (item.discount / 100))
        : item.price_ttc;
        const price = discountedPrice ;
        const priceTTC = item.price_ttc;
        const priceNet = item.price * 1;

      // Calculate the cost and TVA
      const cost = priceTTC - (priceTTC - priceNet);
      const discountedCost = item.discount > 0
        ? cost - (cost * (item.discount / 100))
        : cost;
      const tva = item.discount > 0
        ? (priceTTC - priceNet) - ((priceTTC - priceNet) * (item.discount / 100))
        : priceTTC - priceNet;
      // updatedOrderInvoiceItems.push({
      //   article_id: item._id,
      //   name: item.title,
      //   quantity: item.quantity,
      //   cost: parseFloat(discountedCost.toFixed(2)),
      //   tva: parseFloat(tva.toFixed(2)),
      //   total_tva: parseFloat((tva * item.quantity).toFixed(2)),
      //   total_cost: parseFloat((discountedCost * item.quantity).toFixed(2)),
      //   total_price: parseFloat((discountedPrice * item.quantity).toFixed(2)),
      //   review: item.note || "-",
      //   price: discountedPrice,
      //   article_discount: item.discount,
      //   price_without_discount: item.price_ttc,
      //   cost_without_discount: item.price,
      // });
      updatedOrderInvoiceItems.push({
        article_id: item._id,
        name: item.title,
        quantity: item.quantity,
        cost: currency === "eur" ? parseFloat(Number(discountedCost).toFixed(2)) : parseFloat((discountedCost * authCtx.currencyRate).toFixed(2)),
        tva: currency === "eur" ? parseFloat(Number(tva).toFixed(2)) : parseFloat((tva * authCtx.currencyRate).toFixed(2)),
        total_tva: currency === "eur" ? parseFloat((tva * item.quantity).toFixed(2)) : parseFloat(((tva * item.quantity) * authCtx.currencyRate).toFixed(2)),
        total_cost: currency === "eur" ? parseFloat((discountedCost * item.quantity).toFixed(2)): parseFloat(((discountedCost * item.quantity) * authCtx.currencyRate).toFixed(2)),
        total_price: currency === "eur" ? parseFloat((discountedPrice * item.quantity).toFixed(2)) : parseFloat(((discountedPrice * item.quantity) * authCtx.currencyRate).toFixed(2)),
        review: item.note || "-",
        price: currency === "eur" ? parseFloat(Number(discountedPrice).toFixed(2)) : parseFloat((discountedPrice * authCtx.currencyRate).toFixed(2)),
        article_discount: item.discount,
        price_without_discount: currency === "eur" ? parseFloat(Number(item.price_ttc).toFixed(2)): parseFloat((item.price_ttc * authCtx.currencyRate).toFixed(2)),
        cost_without_discount: currency === "eur" ? parseFloat(Number(item.price).toFixed(2)): parseFloat((item.price * authCtx.currencyRate).toFixed(2)),
      });
      

      totalPrice +=  (price * 1).toFixed(2) * item.quantity;
      totalWeight += item.quantity * item.weight;
      totalTVA += (tva * 1).toFixed(2) * item.quantity;
      totalPricedollar +=  (price * authCtx.currencyRate).toFixed(2) * item.quantity;
      totalTVAdollar += (Number(tva).toFixed(2) * authCtx.currencyRate).toFixed(2) * item.quantity;
    });

    setorder_invoice_items(updatedOrderInvoiceItems);
    settotalWeight(totalWeight);

    if (currency === "usd") {
      const sum = Number(totalPricedollar).toFixed(2);
      const fixedtva = totalTVAdollar.toFixed(2)
      
      setsubTotalAmt(sum);
      setTVA(fixedtva);
      setEURTVA(totalTVAdollar);
    } else {
      // For EUR, keep the original values
      
      setsubTotalAmt(parseFloat((totalPrice)));
      setTVA(parseFloat((totalTVA * 1)));
      setEURTVA(totalTVA);
    }
  }, [productData, currency]);

  useEffect(() => {
    if (totalAmt < 0) {
      setTotalAmt(0);
    }
  }, [totalAmt]);

  const stripePromise = loadStripe(
    `pk_test_51Nu98ME6k93Bb6mWMQsVFcHPpzFuXN92URPblTVJXAmLC0yPWLoS6omx9CPEASH4oQRJafTkgZC9gkZvGLNaUzap00bQZl4Qr5`
  );
  

  const CheckOutHandler = async () => {
    if (!user.defaultAdd) {
      toast.error(`${language === 'eng' ? "Please add a default Address." : "Veuillez ajouter une adresse par défaut."}`, {
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
          user_payment_id: directPay ? null : user.defaultPay,
          delivery_id: deliveryId,
          base_price: (subtotalAmt - TVA).toFixed(2),
          tva: TVA,
          ttc_price: subtotalAmt,
          shipping_fees:
            currency === "eur"
              ? deliveryFees
              : (deliveryFees * authCtx.currencyRate).toFixed(2),
          weight: totalWeight,
          ecom_type: "sofiaco",
          date: generatedate(),
          total_price: (totalAmt * 1).toFixed(2),
          review: reviewMsg,
          order_invoice_items: order_invoice_items,
          shipping_type_id: delivery === "standard" ? 40 : 39,
          colissimo_code:
            delivery === "standard" ? null : colissimoPointData?.identifiant,
          currency: currency,
          coupon_amount: coupon.reduction
            ? coupon.type === "Percentage"
              ? calculateReductionAmt(subtotalAmt, coupon.reduction)
              : currency === "usd"
              ? (coupon.reduction * authCtx.currencyRate).toFixed(2)
              : coupon.reduction
            : 0,
            payment_method_id: 17,
            rate: authCtx.currencyRate,
        };
        const requestData1 = {
          user_id: user.id,
          user_address_id: user.defaultAdd,
          user_payment_id: directPay ? null : user.defaultPay,
          delivery_id: deliveryId,
          base_price: subtotalAmt - TVA,
          tva: TVA,
          ttc_price: subtotalAmt,
          shipping_fees:
            currency === "eur"
              ? deliveryFees
              : deliveryFees * authCtx.currencyRate,
          weight: totalWeight,
          ecom_type: "sofiaco",
          tvaAmount: EURTVA,
          date: generatedate(),
          total_price: totalAmt,
          review: reviewMsg,
          order_invoice_items: order_invoice_items,
          currency: currency,
          shippingPrice: delivery !== "standard" ? 0 : deliveryFees,
          shipping_type_id: delivery === "standard" ? 40 : 39,
          colissimo_code:
            delivery === "standard" ? null : colissimoPointData?.identifiant,
          coupon_discount: coupon.reduction ? coupon.reduction : 0,
          coupon_type: coupon.type,
          coupon_amount: coupon.reduction
            ? coupon.type === "Percentage"
              ? calculateReductionAmt(subtotalAmt, coupon.reduction)
              : currency === "usd"
              ? (coupon.reduction * authCtx.currencyRate).toFixed(2)
              : coupon.reduction
            : 0,
            payment_method_id: 41,
            rate: authCtx.currencyRate,
        };
        if (userCoupon.length > 0) {
          requestData.user_coupon_id = userCoupon[0].id;
          requestData1.user_coupon_id = userCoupon[0].id;
        }

        setLoading(true);
        // console.log("deed");
        

        if (delivery === "Colissimo" && !colissimoPointData) {
          toast.error(
            `${
              language === "eng"
                ? "Please select pickup point"
                : "Veuillez sélectionner le point de ramassage"
            }`,
            { hideProgressBar: true }
          );
        } else {
          if (directPay) {
            
            dispatch(addOrderData(requestData1))
            
            // Request to create a Checkout Session from your server
            const response = await axios.post(
              `${import.meta.env.VITE_TESTING_API}/create-checkout-session`,
              requestData1
            );
            const sessionId = response.data.sessionId;

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
              // console.error("Stripe Checkout error:", error);
              toast.error(`${language === 'eng' ? "Error with Stripe Checkout. Please try again." : "Erreur avec Stripe Checkout. Veuillez réessayer."}`);
            }

          } else {
            // Normal order processing
            await axios.post(
              `${import.meta.env.VITE_TESTING_API}/order_invoices`,
              requestData
            );

            dispatch(resetCart());
            navigate("/");
            toast.success(`${language === 'eng' ? `Order success` : "Succès de la commande"}`, {
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

        setLoading(false);
      } catch (error) {
        // console.error("Error in ordering:", error);
        setLoading(false);
        // handleErrorOpen(
        //   error.response?.data?.error || "An unexpected error occurred"
        // );
      }
    }
  };

  const calculateReduction = (subtotalAmt, percentage) => {
    const reduction = parseFloat(subtotalAmt) * (parseFloat(percentage) / 100); // 20% reduction
    const result = parseFloat(subtotalAmt) - parseFloat(reduction);
    return result;
  };
  const calculateReductionAmt = (total, percentage) => {
    const reduction = (total * (percentage / 100)).toFixed(2); // 20% reduction
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
        const total =
          currency === "eur"
            ? parseFloat(deliveryFees) + parseFloat(subTotal)
            : parseFloat(deliveryFees * authCtx.currencyRate) +
              parseFloat(subTotal);
        setTotalAmt(total);
      }
      if (coupon.type === "Percentage") {
        const subTotal = calculateReduction(subtotalAmt, coupon.reduction);
        const total =
          currency === "eur"
            ? parseFloat(deliveryFees) + parseFloat(subTotal)
            : parseFloat(deliveryFees * authCtx.currencyRate) +
              parseFloat(subTotal);
        setTotalAmt(total);
      }
    } else {
      const total =
        currency === "eur"
          ? parseFloat(deliveryFees) + parseFloat(subtotalAmt)
          : parseFloat(deliveryFees * authCtx.currencyRate) +
            parseFloat(subtotalAmt);
      setTotalAmt(total);
    }
  }, [deliveryFees, coupon, subtotalAmt]);

  // Function to check if a coupon has expired
  const isCouponExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    return expiryDateObj < currentDate;
  };

  const checkoutPaypalHandler = async (name) => {
    try {
      const requestData = {
        user_id: user.id,
        user_address_id: user.defaultAdd,
        paypal: true,
        delivery_id: deliveryId,
        base_price: (subtotalAmt - TVA).toFixed(2),
        tva: TVA,
        shipping_fees:
          currency === "eur"
            ? deliveryFees
            : (deliveryFees * authCtx.currencyRate).toFixed(2),
        ttc_price: subtotalAmt,
        weight: totalWeight,
        ecom_type: "sofiaco",
        date: generatedate(),
        total_price: totalAmt,
        review: reviewMsg,
        order_invoice_items: order_invoice_items,
        currency: currency,
        shippingPrice: delivery !== "standard" ? 0 : deliveryFees,
        shipping_type_id: delivery === "standard" ? 40 : 39,
        colissimo_code:
          delivery === "standard" ? null : colissimoPointData?.identifiant,
          coupon_amount: coupon.reduction
            ? coupon.type === "Percentage"
              ? calculateReductionAmt(subtotalAmt, coupon.reduction)
              : currency === "usd"
              ? (coupon.reduction * authCtx.currencyRate).toFixed(2)
              : coupon.reduction
            : 0,
            payment_method_id: 16,
            rate: authCtx.currencyRate,
      };

      if (userCoupon.length > 0) {
        requestData.user_coupon_id = userCoupon[0].id;
      }
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_TESTING_API}/order_invoices`,
        requestData
      );

      dispatch(resetCart());
      navigate("/");
      setLoading(false);
      toast.success(`${language === 'eng' ? `Order success` : "Succès de la commande"}`, {
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
      // console.error("Error in ordering:", error);
      setLoading(false);
      // setErrorMessage(
      //   error.response?.data?.error || "An unexpected error occurred"
      // );
    }
  }

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

  const handleDeliveryChange = (e) => {
    const selectedDelivery = e.target.value;
    setDelivery(selectedDelivery);
    if (selectedDelivery === "Colissimo") {
      setColissimoPopupOpen(true);
    } else {
      setColissimoPopupOpen(false);
      setColissimoPointData(null)
    }
  };

  const handleChange1 = async (id) => {
    setdisplayedPayment(1)
    setopenPay(false);
    setPaymentId(id)
    if (id === 'paypal') {
      setIspaypal(true)
      setdirectPay(false)
    } else if (id === 'direct') {
      setdirectPay(true)
      setIspaypal(false)
    } else {
      setIspaypal(false)
      setdirectPay(false)
      dispatch(editDefaultPAY(id));
      const sortedPayments = response.data.data.sort((a, b) => {
        if (a.id === id ) return -1;
        if (b.id === id ) return 1;
        return a.id - b.id;
      });
      setPaymentsList(sortedPayments);
      // try {
      //   // Update the database to set the selected address as default
      //   await axios.put(
      //     `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments/${id}`,
      //     {
      //       default: "true",
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`, // Include token in the headers
      //       },
      //     }
      //   );
      //   fetchPayments();
      //   toast.success(`${language === 'eng' ? "Default Payment card is set successfully" : "La carte de paiement par défaut a été définie avec succès"}`, {
      //     // Toast configuration
      //     hideProgressBar: true,
      //   });
      // } catch (error) {
      //   console.error("Error setting default payment:", error);
      // }
    }
  };

  const handleChange2 = async (id) => {
    // try {
    //   // Update the database to set the selected address as default
    //   await axios.put(
    //     `${import.meta.env.VITE_TESTING_API}/users/${user.id}/addresses/${id}`,
    //     {
    //       default: "true",
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Include token in the headers
    //       },
    //     }
    //   );
    //   fetchAddresses();
    //   toast.success(`${language === 'eng' ? "Default address is set!" : "L'adresse par défaut est définie !"}`, {
    //     position: "top-right",
    //     autoClose: 1500,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: 0,
    //     theme: "colored",
    //   });
    // } catch (error) {
    //   console.error("Error setting default address:", error);
    // }
    const sortedAddresses = addresseslist.sort((a, b) => {
      if (a.id === id) return -1;
      if (b.id === id) return 1;
      return a.id - b.id;
    });

    setAddressesList(sortedAddresses);
    dispatch(editDefaultAdd(id));
    setdisplayedAddress(1);
    
    if (!colissimoPointData) {
      FetchShippinCost(id);     
    }

  };

  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setPaymentsList((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== id)
      );
      toast.success(`${language === 'eng' ? "Payment card deleted successfully" : "Carte de paiement supprimée avec succès"}`, {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      // console.error("Error deleting payment:", error);
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
      toast.success(`${language === 'eng' ? "Address Deleted" : "Adresse supprimée"}`, {
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

  const [heroData, setHeroData] = useState({});

  const fetchHero = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/website-sections?ecom_type=sofiaco&section_id=checkout-hero`
      );
      setHeroData(response.data.data[0]?.hero_sections[0]);
    } catch (error) {
      // console.error("Error fetching Heroo:", error);
    }
  };
  useEffect(() => {
    fetchHero();
  }, []);


  useEffect(() => {
    if (paymentslist.length > 0 && userInfo.default_pay === 'card') {
     const paymentID = addresseslist.find((item) => item.default === "true")?.id
     setPaymentId(paymentID)
     setdirectPay(false)
     setIspaypal(false)
    } else if (userInfo.default_pay === 'paypal') {
      setPaymentId("paypal")
      setIspaypal(true)
      setdirectPay(false);
    }else if (userInfo.default_pay === 'direct') {
      setPaymentId("direct")
      setdirectPay(true);
      setIspaypal(false)
    }  else if (paymentslist.length === 0 && userInfo.default_pay !== 'direct' && userInfo.default_pay !== 'paypal') {
      setdirectPay(true);
      setPaymentId("direct")
    }
  }, []);


  
  const handleRemoveCoupon = async () => {
    setSelectedCoupon("");
    setcoupon({});
    setuserCoupon([]);
};
  return (
    <div className={classes.cart_container}>
      {loading && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(224, 195, 137, 0.2)', zIndex: 9999 }}><CircularProgress style={{margin:"45vh",color:'var(--primary-color)'}}/></div>} 
      
      <div className={classes.headTitles}>
        <h1>
        {language === "eng" ? "Checkout" : "Procéder au paiement"}</h1>
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
                <h1 style={{ textAlign: "center",fontFamily: "var(--font-family)" }}>
                  {language === "eng"
                    ? "Your Cart is empty!"
                    : "Votre panier est vide!"}</h1>
                <p style={{ textAlign: "center" ,fontFamily: "var(--font-family)"}}>
                  {" "}
                  {language === "eng"
                    ? "You have no items in your shopping cart"
                    : "Vous n'avez aucun article dans votre panier"}
                </p>
                <button
                  className={classes.browseBtn}
                  onClick={() => navigate("/")}
                >
                  {language === "eng" ? "Browse" : "Parcourir"}
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
                    {language === "eng" ? "Address" : "Adresse"}
                    </h2>
                  <button
                    className={classes.btn}
                    onClick={() => {
                      setdisplayedAddress(addresseslist?.length);
                    }}
                  >
                    {language === "eng" ? "My Addresses" : "Mes Adresses"}
                    </button>
                </div>
                {addresseslist?.slice(0, displayedAddress).map((address) => {
                  return (
                    <div className={classes.adressCard}>
                      <RadioGroup
                        value={
                          addresseslist.find((item) => item.id === user.defaultAdd)
                            ?.id
                        }
                        onChange={() =>
                          handleChange2(address.id) 
                          // console.log(address.default)
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
                      <div style={{paddingLeft:'.3em'}}>
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
                        <p>{address.country}, {address.city},{" "} {address.postalcode}</p>
                        <p>
                          {address.address} {address?.address2 && ' , '}{address?.address2?.length > 45 ? address?.address2.substring(0, 45) : address.address}
                        </p>
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
                          {language === "eng" ? "Edit" : "Editer"}
                          </p>
                        {/* <p
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            fontWeight: "600",
                            zIndex:'9'
                          }}
                          onClick={()=>handleDeleteAddress(address.id)}
                        >
                          {language === "eng" ? "Remove" : "Retirer"}
                          </p> */}
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
                  {language === "eng"
                    ? "Add New Address"
                    : "Ajouter une Nouvelle Adresse"}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    margin: "2em 0 .5em 0",
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
                    {language === "eng" ? "Payment Method" : "Mode de Paiement"}
                  </h2>
                  <button
                    className={classes.btn}
                    onClick={() => {
                      setdisplayedPayment(paymentslist?.length);
                      setopenPay(true);
                    }}
                  >
                    {language === "eng"
                      ? "My Payment Methods"
                      : "Mes Modes de Paiement"}
                  </button>
                </div>
                      <RadioGroup
                        value={paymentId}
                        onChange={(e) =>
                          handleChange1(e.target.value)  &
                          setopenPay(false)
                        }
                      >
                {paymentslist?.map((payment) => {
                  return (
                    <>
                    {((!openPay && Number(payment.id) === Number(paymentId)) || openPay) && <div className={classes.adressCard}>
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
                      {/* <Radio defaultChecked value={payment.id} sx={{ color: 'var(--forth-color)','&.Mui-checked': { color: 'var(--forth-color)',},margin:'.5em 0 auto 0'}}/> */}
                      <div>
                        <p style={{ fontSize: "calc(.8rem + .3vw)" }}>
                          <img
                            alt="visa"
                            src={payment.card_type === "Master" ? master : visa}
                            style={{
                              width: "auto",
                              height: "1.5em",
                              margin: "0 1em -.5em 0em",
                            }}
                          />
                          {maskConstant(payment.card_number)}{" "}
                          <span
                            style={{
                              color: "var(--primary-color)",
                              paddingLeft: "2em",
                              fontWeight: "400",
                            }}
                          >
                            {language === "eng" ? "Expires" : "Expire"}{" "}
                            {payment.month}/{payment.year}
                          </span>{" "}
                        </p>
                      </div>
                      <div className={classes.removeCont}>
                        {/* <p
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            marginLeft: "auto",
                            fontWeight: "600",
                          }}
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          {language === "eng" ? "Remove" : "Retirer"}
                        </p> */}
                      </div>
                    </div>}
                    </>
                  );
                })}
               
        {((!openPay && 'paypal'=== paymentId) || openPay) && <div style={{display:'flex', flexDirection:'row'}} className={classes.adressCard}>
        <FormControlLabel
          value='paypal'
          control={
            <Radio
            sx={{
              color: "var(--primary-color)",
              "&.Mui-checked": {
                color: "var(--primary-color)",
              },
              margin: "1em 0",
            }}
            />
          }
          label={<p style={{ margin: "auto 0em auto 1.2em", whiteSpace: "normal" }}>
          {language === "eng"
            ? "Pay with Paypal"
            : "Payer avec Paypal"}
        </p>}
        />
        </div>}
        {((!openPay && 'direct'=== paymentId) || openPay) && <div className={classes.adressCard} style={{display:'flex', flexDirection:'row'}}>
        <FormControlLabel
          value='direct'
          control={
            <Radio
            sx={{
              color: "var(--primary-color)",
              "&.Mui-checked": {
                color: "var(--primary-color)",
              },
              margin: "1em 0",
            }}
            />
          }
          label={
            <p style={{ margin: "auto 0 auto 1.2em", whiteSpace: "normal" }}>
              {language === "eng"
                ? "Direct Pay"
                : "Paiement Direct"}
            </p>
          }
        />
        </div>}
        
                      </RadioGroup>
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
                  {language === "eng"
                    ? "Add New Payment Method"
                    : "Ajouter un Nouveau Mode de Paiement"}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    margin: "2em 0 0em 0",
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
                    {language === "eng" ? "Delivery" : "Livraison"}
                  </h2>
                  {/* <button
                    className={classes.btn}
                    onClick={() => {
                      setdisplayedPayment(paymentslist?.length);
                    }}
                  >
                    {language === 'eng' ? 'My Payment Methods' : "Mon Mode de Paiement"}
                  </button> */}
                </div>
                <div
                  className={classes.adressCard}
                  style={{
                    border: "none",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <RadioGroup
                    value={delivery}
                    onChange={(e) => handleDeliveryChange(e) & handleClose()}
                  >
                    <FormControlLabel
                      value="standard"
                      label={
                        <p style={{ margin: '0 0 0 1.2em' }}>
                          {language === "eng"
                            ? "Standard delivery charges"
                            : "Frais de livraison standard"}
                        </p>
                      }
                      control={
                        <Radio
                          defaultChecked
                          value="standard"
                          sx={{
                            color: "var(--primary-color)",
                            "&.Mui-checked": {
                              color: "var(--primary-color)",
                            },
                            margin: " auto 0",
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      value="Colissimo"
                      label={
                        <p style={{ margin: "auto 0 auto 1.2em", whiteSpace: "normal" }}>
                          {language === "eng"
                            ? "Retriat Point"
                            : "Point de Retriat"}
                        </p>
                      } 
                      onClick={()=>{if (!colissimoPointData?.identifiant) {
                        setColissimoPopupOpen(true)
                      }}}
                      control={
                        <Radio
                          value="Colissimo"
                          sx={{
                            color: "var(--primary-color)",
                            "&.Mui-checked": {
                              color: "var(--primary-color)",
                            },
                            margin: " auto 0",
                          }}
                        />
                      }
                    />
                     {delivery === "Colissimo" && (
                    <p
                      style={{
                        paddingLeft: "3.2em",
                        display: "flex",
                        flexDirection: "row",
                        margin:'0em 0',
                        width: "100%",
                        fontSize: "calc(0.5rem + 0.5vw)",
                      }}
                    >
                      {colissimoPointData?.identifiant}
                    </p>
                  )}
                  </RadioGroup>
                </div>
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
              {language === "eng" ? "Add a note to your order" : "Ajouter une note à votre commande"}
              </h2>
            <TextArea
              name="note"
              rows={5}
              value={reviewMsg}
              onChange={(e) => setreviewMsg(e.target.value)}
              placeholder={language === "eng" ? "Notes about your order, e.g. special delivery notes..." : "Notes concernant votre commande, par exemple des notes spéciales pour la livraison…"}
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
            {ispaypal ? (
                <button
                  className={classes.checkout_btn}
                  onClick={() => setOpenpaypal(true)}
                  disabled={loading || productData?.length === 0}
                  id="footer"
              style={{ margin: "2em 0" }}
                >
                  {language === "eng" ? "Place My Order" : "Valider mon panier"}
                </button>
              ) : (
                <button
                  className={classes.checkout_btn}
                  onClick={CheckOutHandler}
                  disabled={loading || productData?.length === 0}
                  id="footer"
              style={{ margin: "2em 0" }}
                >
                  {language === "eng" ? "Place My Order" : "Valider mon panier"}
                </button>
              )}
            </div>
          )}
        </div>
      <div className={classes.bigContainer} >
        <div className={classes.auth_bg}></div>
        <div className={classes.total_con} id="fixed-component11">
            <div className={classes.total}>
              <div className={classes.totalrows}>
                <h2>{language === "eng" ? "Order Summary" : "Résumé de la commande"}</h2>
                <p style={{ textAlign: "end" }}>
                  ( {productData?.length} ITEMS )
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>{language === "eng" ? "Weight" : "Poids"}</p>
                <p style={{ textAlign: "end" }}>
                {totalWeight} g
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
                <p>Total TTC</p>
                <p style={{ textAlign: "end" }}>
                  {(subtotalAmt * 1).toFixed(2)} {currency == "eur" ? `€` : `$`}
                </p>
              </div>
              <div className={classes.totalrows}>
                <p>
                  {language === "eng" ? "Discount" : "Remise"}{" "}
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
                        )} ${currency === "usd" ? "$" : "€"}`
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
              <div className={classes.totalrows}>
                <p>
                {language === "eng" ? "Shipping Costs" : "Frais de port"}</p>
                <p style={{ textAlign: "end" }}>
                {deliveryFees === 0 ? "Free" : currency === "eur" ?  deliveryFees : (deliveryFees * authCtx.currencyRate).toFixed(2)}{" "}
                {deliveryFees != 0 && (currency === "eur" ? ` €` : ` $`)}
                </p>
              </div>
              <Form
                layout="vertical"
                name="nest-messages"
                form={form}
                onFinish={coupon.type ? handleRemoveCoupon : handleApplyCoupon}
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
                    disabled={coupon.reduction ? true : false}
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
                          coupon.user_id === null &&
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
                <Form.Item style={{width:'100%',}}>
                  <Button
                    size="large"
                    htmlType="submit"
                    className={classes.checkout_btn1}
                  >
                    {coupon.type ? language === "eng" ? "Remove Coupon" : "Supprimer" : language === "eng" ? "Submit" : "Soumettre"}
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
                {Number(totalAmt).toFixed(2)}
                  {currency === "usd" ? "$" : "€"}
                </p>
              </div>
            </div>
            {ispaypal ? (
                <button
                  className={classes.checkout_btn}
                  onClick={() => setOpenpaypal(true)}
                  disabled={loading || productData?.length === 0}
                  id="footer"
              style={{ margin: "2em 0" }}
                >
                  {language === "eng" ? "Place My Order" : "Valider mon panier"}
                </button>
              ) : (
                <button
                  className={classes.checkout_btn}
                  onClick={CheckOutHandler}
                  disabled={loading || productData?.length === 0}
                  id="footer"
              style={{ margin: "2em 0", cursor:'pointer' }}
                >
                  {language === "eng" ? "Place My Order" : "Valider mon panier"}
                </button>
              )}
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
      <Modal
        open={colissimoPopupOpen}
        onClose={() => setColissimoPopupOpen(false)}
        aria-labelledby="colissimo-widget-title"
        aria-describedby="colissimo-widget-description"
        style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}
        // className={classes.modalpopup}
      >
        <Box className={classes.modalpopup1}>
          <div ref={widgetRef} id="monIdDeWidgetColissimo" className=""></div>

          {/* <div id="monIdDeWidgetColissimo" className=""></div> */}
        </Box>
      </Modal>

      <Modal
        open={openpaypal}
        onClose={handleClosepaypal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={classes.modalpopup}
      >
        <Box sx={style} className={classes.modalpopup}>
        <PayPalButtons
  createOrder={(data, actions) => {
    // Calculate the amount based on currency and rate
    const finalAmount =
      currency === "eur"
        ? (totalAmt * authCtx.currencyRate).toFixed(2)
        : Number(totalAmt).toFixed(2);

    // Create the order with the necessary fields
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: finalAmount,
          },
        },
      ],
    });
  }}
  onApprove={(data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
      checkoutPaypalHandler(name);
      // Optionally, handle transaction completion logic here
    });
  }}
  onError={(err) => {
    console.log(err);
    
    toast.error(`${err}`);
  }}
/>

        </Box>
      </Modal>
    </div>
  );
};

export default CheckOut;
