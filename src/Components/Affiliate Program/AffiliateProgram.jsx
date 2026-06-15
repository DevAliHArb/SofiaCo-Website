import React, { useEffect, useState } from "react";
import classes from "./AffiliateProgram.module.css";
import { Divider, Form, Input, Button } from "antd";
import { useNavigate } from "@hooks/useNavigate";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { CgInfo } from "react-icons/cg";
import placeholder from "../../assets/bookPlaceholder.png";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { IoIosLink } from "react-icons/io";
import { editUser } from "../Common/redux/productSlice";

// Helper function to slugify and sanitize text
const slugify = (text, fallback = "product") => {
  if (!text || text.trim() === "") return fallback;
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  maxHeight: "80%",
  bgcolor: "#fff",
  boxShadow: 24,
  fontSize: "calc(0.7rem + 0.2vw)",
  fontFamily: "var(--font-family)",
  overflowY: "scroll",
  borderRadius: "0.4em",
};

const AffiliateProgram = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const user = useSelector((state) => state.products.userInfo);
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Redeem modal states
  const [redeemForm] = Form.useForm();
  const [redeemOpen, setRedeemOpen] = React.useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);

  const handleRedeemOpen = () => {
    setRedeemOpen(true);
    redeemForm.resetFields();
  };
  const handleRedeemClose = () => {
    setRedeemOpen(false);
    redeemForm.resetFields();
  };

  const [loading, setLoading] = useState(false);
  const [affiliateData, setAffiliateData] = useState([]);
  const [affiliateEarnings, setAffiliateEarnings] = useState([]);

  const getToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");
  const token = getToken();

  const fetchAffiliate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/affiliate-programs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAffiliateData(response.data.data);
    } catch (error) {
      console.error("Error fetching affiliate:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(editUser(response.data.data));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchAffiliate();
    fetchUser();
  }, []);

  // Process affiliate earnings whenever affiliateData changes
  useEffect(() => {
    if (affiliateData && affiliateData.length > 0) {
      const allEarnings = [];
      affiliateData.forEach((affiliateProgram) => {
        if (affiliateProgram.affiliate_earnings?.length > 0) {
          affiliateProgram.affiliate_earnings.forEach((earning) => {
            allEarnings.push({ ...earning, affiliateProgram });
          });
        }
      });
      const sortedEarnings = allEarnings.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB - dateA;
      });
      setAffiliateEarnings(sortedEarnings);
    } else {
      setAffiliateEarnings([]);
    }
  }, [affiliateData]);

  const handleRedeemSubmit = async (values) => {
    setRedeemLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/affiliate-redeems`,
        {
          user_id: user.id,
          redeem_amount: parseFloat(values.amount),
          iban: values.iban,
          bic: values.bic,
          bank_name: values.bank_name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        language === "eng"
          ? "Redeem request submitted successfully!"
          : "Demande de rachat soumise avec succès!",
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
      fetchUser();
      handleRedeemClose();
    } catch (error) {
      console.error("Error submitting redeem:", error);
      toast.error(
        error.response?.data?.message ||
          (language === "eng"
            ? "Failed to submit redeem request"
            : "Échec de la soumission de la demande de rachat"),
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <>
      <div className={classes.coupon_con}>
        <div className={classes.back_btn} onClick={() => navigate("/account/profile")}>
          <FaArrowLeftLong className={classes.back_arrow} />
          {language === "eng" ? "Back" : "Retour"}
        </div>

        <div className={classes.header}>
          <h1 className={classes.headtitle}>
            {language === "eng" ? "Affiliate Program" : "Programme d'affiliation"}
          </h1>
        </div>

        <div className={classes.bigContainer}>
          <div className={classes.contentContainer}>
            <h3 className={classes.info_title} onClick={fetchAffiliate}>
              {language === "eng" ? "Affiliate Program" : "Programme d'affiliation"}
            </h3>

            <div className={classes.cardsContainer}>
              <table className={classes.affiliateTable}>
                <thead>
                  <tr className={classes.tableHead}>
                    <th>{language === "eng" ? "Affiliate Link" : "Lien d'affiliation"}</th>
                    <th style={{ borderRight: "1px solid transparent" }}>
                      {language === "eng" ? "Type" : "Type"}
                    </th>
                    <th style={{ borderRight: "1px solid transparent", textAlign: "center" }}>
                      {language === "eng" ? "Status" : "Statut"}
                    </th>
                    <th style={{ borderRight: "1px solid transparent" }}></th>
                    <th style={{ borderRight: "1px solid transparent" }}></th>
                  </tr>
                </thead>
                <tbody className={classes.list_con}>
                  {affiliateData?.map((link, index) => (
                    <tr key={index} className={classes.tableRow}>
                      <td className={classes.linkCell}>
                        <div className={classes.linkContent}>
                          <div className={classes.linkIcon}>
                            <div className={classes.iconCircle}>
                              {link.type === "Global" ? (
                                <span>%</span>
                              ) : (
                                <img
                                  src={
                                    link?.article?.articleimage?.[0]?.link ||
                                    placeholder
                                  }
                                  alt={link?.article?.articleimage?.[0]?.type}
                                />
                              )}
                            </div>
                          </div>
                          <div className={classes.linkInfo}>
                            {link.type === "Global" ? (
                              <p className={classes.promoCode}>
                                {language === "eng"
                                  ? "Use code: "
                                  : "Utilisez le code: "}
                                <strong>{link?.coupon?.code}</strong>
                                {language === "eng"
                                  ? " at checkout and enjoy instant savings."
                                  : " à la caisse et profitez d'économies instantanées."}
                              </p>
                            ) : (
                              <p className={classes.linkUrl}>{`${window.location.origin}/main/productdetails/${link?.article_id}/${link.token}`}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={classes.typeCell}>
                        <p>{link.type}</p>
                      </td>
                      <td className={classes.statusCell}>
                        <span
                          className={`${classes.statusBadge} ${
                            link.is_active ? classes.statusActive : classes.statusUsed
                          }`}
                        >
                          {link.is_active
                            ? language === "eng"
                              ? "Activated"
                              : "Activé"
                            : language === "eng"
                            ? "Used"
                            : "Utilisé"}
                        </span>
                      </td>
                      <td className={classes.statusCell}>
                        <CgInfo
                          style={{
                            color: "var(--primary-color)",
                            fontSize: "1.5em",
                            margin: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/affiliate/${link.id}/details/${link.id}`)}
                        />
                      </td>
                      <td className={classes.actionCell}>
                        <button
                          className={classes.copyBtn}
                          style={{
                            backgroundColor: !link.is_active ? "#9C9CA3" : undefined,
                            cursor: !link.is_active ? "not-allowed" : "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!link.is_active) return;
                            const urlToCopy =
                              link.type === "Global"
                                ? link?.coupon?.code
                                : `${window.location.origin}/main/productdetails/${link?.article_id}/${link.token}`;
                            navigator.clipboard.writeText(urlToCopy);
                            toast.success(
                              link.type === "Global"
                                ? language === "eng"
                                  ? "Code copied to clipboard!"
                                  : "Code copié dans le presse-papiers !"
                                : language === "eng"
                                ? "Link copied to clipboard!"
                                : "Lien copié dans le presse-papiers !",
                              {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                theme: "colored",
                              }
                            );
                          }}
                        >
                          <IoIosLink style={{ margin: "auto .2em auto 0", fontSize: "1.5em" }} />
                          {language === "eng" ? "Copy" : "Copier"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={classes.cardsContainer}>
              <h3 className={classes.info_title}>
                {language === "eng" ? "Earnings" : "Revenus"}
              </h3>
              <table className={classes.earningsTable}>
                <thead>
                  <tr className={classes.tableHead}>
                    <th>{language === "eng" ? "Purchases" : "Achats"}</th>
                    <th>{language === "eng" ? "Order #" : "Commande #"}</th>
                    <th>{language === "eng" ? "Date" : "Date"}</th>
                    <th>
                      {language === "eng"
                        ? "Commissions Earned"
                        : "Commissions gagnées"}
                    </th>
                  </tr>
                </thead>
                <tbody className={classes.list_con}>
                  {affiliateEarnings.map((earning) => (
                    <tr key={earning.id} className={classes.tableRow}>
                      <td className={classes.purchaseCell}>
                        <div className={classes.purchaseInfo}>
                          <div className={classes.iconCircle}>
                            {earning.affiliateProgram?.type === "Global" ? (
                              <span>%</span>
                            ) : (
                              <img
                                src={
                                  earning.affiliateProgram?.article?.articleimage?.[0]?.link ||
                                  placeholder
                                }
                                alt={
                                  earning.affiliateProgram?.article?.articleimage?.[0]?.type
                                }
                              />
                            )}
                          </div>
                          <div>
                            {earning.affiliateProgram?.type === "Global" &&
                              earning.affiliateProgram?.coupon && (
                                <p className={classes.promoCode}>
                                  {language === "eng" ? "Promo Code " : "Code Promo "}
                                  <strong>{earning.affiliateProgram.coupon.code}</strong>
                                </p>
                              )}
                            {earning.affiliateProgram?.type === "Specific" && (
                              <p className={classes.linkUrl}>
                                {earning.affiliateProgram?.article?.designation ||
                                  "Specific Link"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={classes.orderCell}>
                        <p>#{earning.order_invoice_id || "N/A"}</p>
                      </td>
                      <td className={classes.dateCell}>
                        <p>
                          {earning.created_at
                            ? new Date(earning.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </td>
                      <td className={classes.commissionCell}>
                        <p className={classes.commissionAmount}>
                          {currency === "eur"
                            ? `€${Number(earning.commission_amount).toFixed(2)}`
                            : `$${Number(earning.commission_amount).toFixed(2)}`}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={classes.c}>
            <div className={classes.summaryCard}>
              <h4 style={{ marginTop: "0" }}>
                {language === "eng" ? "How it Works?" : "Comment ça marche ?"}
              </h4>
              <p className={classes.redeemAmount}>
                {language === "eng"
                  ? "Earn commissions by promoting our products! Join our affiliate program, share your unique link, and get rewarded for every sale you refer."
                  : "Gagnez des commissions en faisant la promotion de nos produits ! Rejoignez notre programme d'affiliation, partagez votre lien unique et soyez récompensé pour chaque vente que vous référez."}
              </p>
              <p className={classes.learnMore} onClick={handleOpen}>
                {language === "eng"
                  ? "Learn More and Start Earning!"
                  : "En savoir plus et commencer à gagner !"}
              </p>
            </div>

            <div className={classes.summaryCard}>
              <h4 style={{ marginTop: "0" }}>
                {language === "eng" ? "Minimum Payout" : "Paiement minimum"}
              </h4>
              <p className={classes.redeemAmount}>
                {language === "eng"
                  ? "Affiliates need to accumulate earnings greater than €10 before they can request a withdrawal."
                  : "Les affiliés doivent accumuler des gains supérieurs à 10 € avant de pouvoir demander un retrait."}
              </p>
              <h4>
                {language === "eng"
                  ? "Total Commission Earned"
                  : "Commission totale gagnée"}
              </h4>
              <h2 className={classes.totalAmount}>€{user?.affiliate_earnings_count || 0}</h2>
              <p className={classes.learnMore} onClick={handleRedeemOpen}>
                {language === "eng" ? "Redeem Amount" : "Montant à échanger"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="affiliate-info-modal"
        sx={{ overflow: "hidden", border: "none" }}
      >
        <Box sx={style}>
          <div
            style={{
              width: "90%",
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              margin: "0.2em auto 0 auto",
            }}
          >
            <p
              style={{
                fontWeight: "600",
                margin: "1em 0em 0.2em 0em",
                fontSize: "calc(1rem + 0.4vw)",
                color: "var(--secondary-color)",
                width: "fit-content",
              }}
            >
              {language === "eng"
                ? "SofiaCo Affiliate Program"
                : "Programme d'affiliation SofiaCo"}
            </p>
            <div
              style={{
                flex: 1,
                padding: "1.5em",
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
                overflow: "auto",
              }}
            >
              <p
                style={{
                  marginBottom: "1.5em",
                  fontSize: "calc(0.7rem + 0.2vw)",
                  lineHeight: "1.5",
                  color: "#333",
                }}
              >
                {language === "eng"
                  ? "Join the SofiaCo affiliate program and earn commissions by sharing our products with your network!"
                  : "Rejoignez le programme d'affiliation SofiaCo et gagnez des commissions en partageant nos produits avec votre réseau !"}
              </p>

              <div style={{ marginBottom: "2em" }}>
                <h3
                  style={{
                    color: "var(--secondary-color)",
                    fontSize: "calc(.7rem + 0.2vw)",
                    marginBottom: "1em",
                    fontWeight: "600",
                  }}
                >
                  {language === "eng" ? "1. How it Works" : "1. Fonctionnement"}
                </h3>
                <ul
                  style={{
                    paddingLeft: "1.5em",
                    fontSize: "calc(.7rem + 0.2vw)",
                    lineHeight: "1.6",
                    color: "#333",
                  }}
                >
                  <li style={{ marginBottom: "0.8em" }}>
                    {language === "eng"
                      ? "Share your unique affiliate link or coupon code with your audience."
                      : "Partagez votre lien d'affiliation unique ou votre code coupon avec votre audience."}
                  </li>
                  <li style={{ marginBottom: "0.8em" }}>
                    {language === "eng"
                      ? "When someone makes a purchase using your link, you earn a commission."
                      : "Lorsqu'une personne effectue un achat via votre lien, vous gagnez une commission."}
                  </li>
                  <li style={{ marginBottom: "0.8em" }}>
                    {language === "eng"
                      ? "Redeem your earnings once you reach the minimum payout threshold of €10."
                      : "Échangez vos gains une fois que vous atteignez le seuil minimum de paiement de 10 €."}
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: "1em" }}>
                <h3
                  style={{
                    color: "var(--secondary-color)",
                    fontSize: "calc(.7rem + 0.2vw)",
                    marginBottom: "1em",
                    fontWeight: "600",
                  }}
                >
                  {language === "eng" ? "2. Terms of Use" : "2. Conditions d'utilisation"}
                </h3>
                <ul
                  style={{
                    paddingLeft: "1.5em",
                    fontSize: "calc(.7rem + 0.2vw)",
                    lineHeight: "1.5",
                    color: "#555",
                  }}
                >
                  <li style={{ marginBottom: "0.5em" }}>
                    {language === "eng"
                      ? "Commission rates vary per affiliate program type."
                      : "Les taux de commission varient selon le type de programme d'affiliation."}
                  </li>
                  <li style={{ marginBottom: "0.5em" }}>
                    {language === "eng"
                      ? "Earnings can be tracked from your affiliate dashboard."
                      : "Les gains peuvent être suivis depuis votre tableau de bord d'affiliation."}
                  </li>
                  <li style={{ marginBottom: "0.5em" }}>
                    {language === "eng"
                      ? "Withdrawal requests are processed within 5-7 business days."
                      : "Les demandes de retrait sont traitées dans un délai de 5 à 7 jours ouvrables."}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Redeem Amount Modal */}
      <Modal
        open={redeemOpen}
        onClose={handleRedeemClose}
        aria-labelledby="redeem-modal-title"
        sx={{ overflow: "hidden", border: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "#fff",
            boxShadow: 24,
            borderRadius: "8px",
            p: 4,
            outline: "none",
          }}
        >
          <div style={{ fontFamily: "var(--font-family)" }}>
            <h2
              style={{
                margin: "0 0 1em 0",
                fontSize: "calc(1rem + 0.3vw)",
                fontWeight: "600",
                color: "#333",
                textAlign: "start",
              }}
            >
              {language === "eng" ? "Redeem Amount" : "Montant à échanger"}
            </h2>
            <Form
              form={redeemForm}
              layout="vertical"
              onFinish={handleRedeemSubmit}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <Form.Item
                name="amount"
                label={
                  <p style={{ color: "var(--secondary-color)", fontWeight: "500", fontFamily: "var(--font-family)", margin: "0" }}>
                    {language === "eng" ? "Amount" : "Montant"}
                  </p>
                }
                rules={[
                  { required: true, message: language === "eng" ? "Amount is required" : "Le montant est requis" },
                  { pattern: /^\d*\.?\d*$/, message: language === "eng" ? "Please enter a valid number" : "Veuillez saisir un nombre valide" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const numValue = parseFloat(value);
                      if (numValue < 10) {
                        return Promise.reject(new Error(language === "eng" ? "Minimum amount is €10" : "Le montant minimum est de 10€"));
                      }
                      if (numValue > (user?.affiliate_earnings_count || 0)) {
                        return Promise.reject(new Error(language === "eng" ? "Amount exceeds available balance" : "Le montant dépasse le solde disponible"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  style={{ border: "1px solid #868686", backgroundColor: "#F2F2F2", height: "2.5em" }}
                />
              </Form.Item>

              <Form.Item
                name="iban"
                label={
                  <p style={{ color: "var(--secondary-color)", fontWeight: "500", fontFamily: "var(--font-family)", margin: "0" }}>
                    IBAN
                  </p>
                }
                rules={[
                  { required: true, message: language === "eng" ? "IBAN is required" : "L'IBAN est requis" },
                  { pattern: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/, message: language === "eng" ? "Please enter a valid IBAN" : "Veuillez saisir un IBAN valide" },
                ]}
              >
                <Input
                  size="large"
                  placeholder={language === "eng" ? "Enter your IBAN" : "Saisissez votre IBAN"}
                  style={{ border: "1px solid #868686", backgroundColor: "#F2F2F2", height: "2.5em" }}
                />
              </Form.Item>

              <Form.Item
                name="bic"
                label={
                  <p style={{ color: "var(--secondary-color)", fontWeight: "500", fontFamily: "var(--font-family)", margin: "0" }}>
                    BIC/SWIFT
                  </p>
                }
                rules={[
                  { required: true, message: language === "eng" ? "BIC is required" : "Le BIC est requis" },
                  { pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, message: language === "eng" ? "Please enter a valid BIC/SWIFT code" : "Veuillez saisir un code BIC/SWIFT valide" },
                ]}
              >
                <Input
                  size="large"
                  placeholder={language === "eng" ? "Enter your BIC/SWIFT code" : "Saisissez votre code BIC/SWIFT"}
                  style={{ border: "1px solid #868686", backgroundColor: "#F2F2F2", height: "2.5em" }}
                />
              </Form.Item>

              <Form.Item
                name="bank_name"
                label={
                  <p style={{ color: "var(--secondary-color)", fontWeight: "500", fontFamily: "var(--font-family)", margin: "0" }}>
                    {language === "eng" ? "Bank Name" : "Nom de la banque"}
                  </p>
                }
                rules={[
                  { required: true, message: language === "eng" ? "Bank name is required" : "Le nom de la banque est requis" },
                  { min: 2, message: language === "eng" ? "Bank name must be at least 2 characters" : "Le nom de la banque doit contenir au moins 2 caractères" },
                ]}
              >
                <Input
                  size="large"
                  placeholder={language === "eng" ? "Enter your bank name" : "Saisissez le nom de votre banque"}
                  style={{ border: "1px solid #868686", backgroundColor: "#F2F2F2", height: "2.5em" }}
                />
              </Form.Item>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "1.5em 0 0 auto" }}>
                <Button
                  onClick={handleRedeemClose}
                  style={{ padding: "10px 20px", border: "1px solid transparent", borderRadius: "4px", backgroundColor: "#fff", color: "#666", fontSize: "calc(0.8rem + 0.1vw)", fontFamily: "var(--font-family)", height: "auto" }}
                >
                  {language === "eng" ? "Discard" : "Annuler"}
                </Button>
                <Button
                  htmlType="submit"
                  loading={redeemLoading}
                  style={{ padding: "10px 20px", border: "none", borderRadius: "4px", backgroundColor: "var(--primary-color)", color: "#fff", fontSize: "calc(0.8rem + 0.1vw)", fontFamily: "var(--font-family)", height: "auto" }}
                >
                  {language === "eng" ? "Redeem Amount" : "Échanger le montant"}
                </Button>
              </div>
            </Form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AffiliateProgram;
