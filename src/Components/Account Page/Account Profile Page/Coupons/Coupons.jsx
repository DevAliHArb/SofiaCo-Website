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

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchUserCoupons = async () => {
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

      setLoading(false);
      // Save coupon data in state
      setCouponsData(resolvedCoupons);
    } catch (error) {
      console.error("Error fetching user coupons:", error);
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
        `https://api.leonardo-service.com/api/bookshop/coupons?code=${thecoupon}`,
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
        toast.error("Coupon not found", {
          // Toast configuration
        });
        return;
      }

      console.log(coupon.id);
      // Add the coupon to the user_coupons table
      // Assuming you have a user ID stored in a variable named 'user.id'
      const userId = user.id;
      await axios.post(
        `https://api.leonardo-service.com/api/bookshop/users/${userId}/coupons`,
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

      toast.success("Coupon added successfully", {
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
        console.error("Error adding coupon:", error);
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
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/coupons`,
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
        console.error("User coupon not found");
        return;
      }

      // Get the ID of the user_coupons entry
      const userCouponId = userCoupon.id;

      // Delete the user_coupon entry using its ID
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/coupons/${userCouponId}`,
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
      toast.success("Coupon deleted successfully", {
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      // Display error message
      toast.error("Error deleting coupon", {
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
            Mes Coupons{" "}
          </h3>
        </div>
      </div>
      <Form form={form} onFinish={AddCoupon}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "2em 1.5em",
            margin: "1em 0 2em 0",
            fontSize: "calc(0.7rem + 0.3vw)",
          }}
        >
          <Form.Item
            name="coupon"
            rules={[
              { required: true, message: "Please input the coupon code!" },
            ]}
            style={{
              border: ".15em solid var(--accent-color)",
              borderRadius: ".7em",
              width: "25em",
              maxWidth: "100%",
              margin: "0",
              height: "fit-content",
            }}
          >
            <Input
              name="Coupon"
              size="medium"
              prefix={
                <HiMiniTicket
                  style={{ color: "var(--forth-color)", fontSize: "1.5em" }}
                />
              }
              placeholder="Votre Coupon ici"
              onChange={(e) => setthecoupon(e.target.value)}
              style={{
                border: "none",
                textAlign: "center",
                padding: ".6em ",
                borderRadius: ".7em",
                height: "3.2em",
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
            Ajouter Votre Coupon
          </Button>
        </div>
      </Form>
      <div className={classes.cardsContainer}>
        <div className={classes.tableHead}>
          <p>Coupon</p>
          <p>Code</p>
          <p>Expiration Date</p>
          <p>Value</p>
          <p>Type</p>
        </div>
      </div>
      {loading ? (
        <div style={{ width: "100#", height: "100%", margin: "auto" }}>
          Loading...
        </div>
      ) : (
        <>
          {couponsData?.map((props) => {
            return (
              <div className={classes.tableRow}>
                <p>{props.title}</p>
                <p>{props.code}</p>
                <p>{props.expiry.substring(0, 10)}</p>
                <p>{props.reduction}</p>
                <p>{props.type}</p>
                {props.active !== "true" ? (
                  <p>
                    <span
                      style={{
                        padding: "0.5em 1em",
                        background: "var(--primary-color)",
                        borderRadius: "1em",
                        color: "#fff",
                      }}
                    >
                      Used
                    </span>
                  </p>
                ) : (
                  <p></p>
                )}
                {isCouponExpired(props.expiry) ? (
                  <p>
                    <span
                      style={{
                        padding: "0.5em 1em",
                        background: "var(--primary-color)",
                        borderRadius: "1em",
                        color: "#fff",
                      }}
                    >
                      Expired
                    </span>
                  </p>
                ) : (
                  <p></p>
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
      )}
    </div>
  );
};

export default Coupons;
