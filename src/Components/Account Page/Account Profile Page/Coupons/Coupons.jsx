import React, { useEffect, useRef, useState } from "react";
import classes from "./Coupons.module.css";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { addTocart, resetfavorite } from "../../../Common/redux/productSlice";
import EmptyWishlist from "../../../../assets/EmptyWishlist.png";
import { MenuItem, Select } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import { HiMiniTicket } from "react-icons/hi2";
import axios from "axios";
import nodata from '../../../../assets/nocoupon.svg'

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import data from '../../../../Data.json'
const rows = [
  {
    coupon: "PROMO-BLACKFRIDAY%",
    Expiration: "15/12/2023",
    Reduction: "10% off",
    status: "AVAILABLE",
  },
  {
    coupon: "PROMO-HIVER+",
    Expiration: "15/12/2023",
    Reduction: "5$ off",
    status: "AVAILABLE",
  },
  {
    coupon: "PROMO-PRINTEMPS",
    Expiration: "15/12/2023",
    Reduction: "Livraison Free",
    status: "EXPIRED",
  },
  {
    coupon: "PROMO-NOEL",
    Expiration: "15/12/2023",
    Reduction: "Livraison Free",
    status: "USED",
  },
];

const Coupons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteData = useSelector((state) => state.products.favorites);
  const user = useSelector((state) => state.products.userInfo);

  const [thecoupon, setthecoupon] = useState("");
  const [loading, setLoading] = useState(true);
  const [couponsData, setCouponsData] = useState([]);
  const [form] = Form.useForm();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchUserCoupons = async () => {
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

      setLoading(false);
      // Save coupon data in state
      setCouponsData(resolvedCoupons);
    } catch (error) {
      // console.error("Error fetching user coupons:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCoupons();
  }, [user]);

  const AddCoupon = async () => {
    setLoading(true);
    try {
      // First, fetch the coupon by code
      const couponResponse = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/coupons?ecom_type=sofiaco&code=${thecoupon}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      // Handle the response containing the coupon data
      const coupon = couponResponse?.data.data;

      // Check if a coupon was found
      if (coupon?.length === 0) {
        toast.error(language === "eng" ? "Coupon not found" : "Coupon non trouvé", {
          hideProgressBar:true
        });
        return;
      }

      // Add the coupon to the user_coupons table
      // Assuming you have a user ID stored in a variable named 'user.id'
      const userId = user.id;
      await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${userId}/coupons`,
        {
          coupon_id: `${coupon.id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      // Reset the form to clear the input field
      setthecoupon("");
      form.resetFields();

      fetchUserCoupons();

      toast.success(language === "eng" ? "Coupon added successfully" : "Coupon ajouté avec succès", {
        // Toast configuration
        hideProgressBar: true,
      });
    } catch (error) {
      const errorMessage = error.response.data.error;
      if (errorMessage?.coupon_id) {
        toast.error(errorMessage.coupon_id[0], {
          hideProgressBar: true,
        });
      } else {
        // console.error("Error adding coupon:", error);
        toast.error(errorMessage, {
          hideProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      // Find the user_coupons entry where coupon_id matches the row.id
      const userCouponResponse = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      // Filter the user_coupons to find the entry matching the row.id
      const userCoupon = userCouponResponse.data.data.find(
        (coupon) => coupon.coupon_id === id
      );

      if (!userCoupon) {
        // Handle the case where the user_coupon entry is not found
        // console.error("User coupon not found");
        return;
      }

      // Get the ID of the user_coupons entry
      const userCouponId = userCoupon.id;

      // Delete the user_coupon entry using its ID
      await axios.delete(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/coupons/${userCouponId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      // Remove the coupon from the UI by filtering the couponsData state
      setCouponsData((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id)
      );

      // Display success message
      toast.success(language === "eng" ? "Coupon deleted successfully" : "Coupon supprimé avec succès", {
        hideProgressBar: true,
      });
    } catch (error) {
      // console.error("Error deleting coupon:", error);
      // Display error message
      toast.error(language === "eng" ? "Error deleting coupon" : "Erreur lors de la suppression du coupon", {
        hideProgressBar: true,
      });
    }
  };

  // Function to check if a coupon has expired
  const isCouponExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    return expiryDateObj < currentDate;
  };

  return (
    <div className={classes.coupon_con}>
      <div className={classes.header}>
        <div className={classes.headtitle}>
          <h3 style={{ fontWeight: "600", marginTop: "0.2em" }}>
          {data.AccountProfilePage.Coupons.subtitle[language]}
          </h3>
        </div>
      </div>
      <Form form={form} onFinish={AddCoupon} 
          className={classes.form}>
          <Form.Item
            name="coupon"
            rules={[
              { required: true, message: "Please input the coupon code!" },
            ]}
            className={classes.input}
          >
            <Input
              name="Coupon"
              size="medium"
              prefix={
                <HiMiniTicket
                  style={{ color: "var(--primary-color)", fontSize: "2em" }}
                />
              }
              placeholder={language === 'eng' ? "Your Coupon here" : "Votre Coupon ici"}
              onChange={(e) => setthecoupon(e.target.value)}
              style={{
                border: "none",
                textAlign: "center",
                padding: ".6em ",
                borderRadius: ".7em",
                height: "3.2em",
                fontFamily:'var(--font-family)'
              }}
            />
          </Form.Item>
          <Button
            htmlType="submit"
            disabled={loading ? true : false}
            size="large"
            className={classes.browseBtn}
            style={{
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {language === 'eng' ? "+ Add a new coupon" : "+ Ajouter Votre Coupon"}
          </Button>
      </Form>
      <div className={classes.cardsContainer}>
        <div className={classes.tableHead}>
          <p>Coupon</p>
          <p>Code</p>
          <p>{language === "eng" ? "Expiry" : "Expiration "}</p>
          <p>{language === 'eng' ? "Value" : "Valeur " }</p>
          <p>Status</p>
        </div>
      </div>
      {loading ? (
        <div style={{ width: "100#", height: "100%", margin: "auto" }}>
          Loading...
        </div>
      ) : (
        <>
          {couponsData?.length === 0 ? 
        <div className={classes.nodata}>
          <div className={classes.nodata_img}>
            <img src={nodata} alt="" />
          </div>
          <h1>{language === 'eng' ? "No coupons found!" : "Aucun coupon n'a été trouvé !"}</h1>
        </div>
          :
          <>
          {couponsData?.map((props) => {
            return (
              <div className={classes.tableRow} onClick={()=>console.log(props)} style={{background: !isCouponExpired(props.expiry) && props.active === "true" ? "var(--primary-color)" : ""}}>
                <p><span className={classes.mob_only} style={{fontWeight:700}}>{language === 'eng' ? 'Coupon' : 'Coupon'} :</span> {props.title}</p>
                <p><span className={classes.mob_only} style={{fontWeight:700}}>{language === "eng" ? "Code" : "Code"}:</span> {props.code}</p>
                <p><span className={classes.mob_only} style={{fontWeight:700}}>{language === "eng" ? "Expiry" : "Expiration"}:</span> {props.expiry.substring(0, 10)}</p>
                <p><span className={classes.mob_only} style={{fontWeight:700}}>{language === "eng" ? "Value" : "Valeur"}:</span> {props.reduction} {props.type.toLowerCase() === 'percentage' ? "%" : currency === "usd" ? "$" : "€"}</p>
                {isCouponExpired(props.expiry) ? (
                  <p>
                    <span
                      style={{
                        padding: "0.5em 0",
                        background: "transparent",
                        borderRadius: "1em",
                        color: "#fff",
                      }}
                    >
                     {language === 'eng' ? "Expired" : "Expiré" } 
                     </span>
                  </p>
                ) : (
                  <>
                    {
props.user_id !== null ?
                    
                    <p>
                    <span
                      style={{
                        padding: "0.5em 0",
                        background: "transparent",
                        borderRadius: "1em",
                        color: "#fff",
                      }}
                    >
                     {language === 'eng' ? "Used" : "Utilisé" } 
                     </span>
                  </p>
                  :  
                  <p>
                  <span
                    style={{
                      padding: "0.5em 0",
                      background: "var(--primary-color)",
                      borderRadius: "1em",
                      color: "#fff",
                    }}
                  >
                    {language === 'eng' ? "Available" : "Disponible"}
                  </span>
                </p>
                  }
                  </>
                )}
                <button
                  className={classes.deleteBtn}
                  onClick={(e) => {
                    handleDeleteCoupon(props.id);
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={DeleteIcon}
                    style={{ width: "1.6em", marginTop: ".1em" }}
                  />
                </button>
              </div>
            );
          })}
        </>
      }
        </>
      )}
    </div>
  );
};

export default Coupons;
