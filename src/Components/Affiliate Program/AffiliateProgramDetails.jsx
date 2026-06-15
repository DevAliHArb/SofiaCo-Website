import React, { useState, useEffect } from "react";
import classes from "./AffiliateProgramDetails.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "@hooks/useNavigate";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaDownload, FaCopy } from "react-icons/fa";
import productPlaceholder from "../../assets/bookPlaceholder.png";
import axios from "axios";
import { toast } from "react-toastify";

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

const AffiliateProgramDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const user = useSelector((state) => state.products.userInfo);

  const [loading, setLoading] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);

  const getToken = () =>
    sessionStorage.getItem("token") || localStorage.getItem("token");
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
      const allData = response.data.data;
      const specific = allData.find(
        (affiliate) => affiliate.id === parseInt(id)
      );
      setAffiliateData(specific);
      if (!specific) {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching affiliate:", error);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAffiliate();
    }
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className={classes.loading}>
        {language === "eng" ? "Loading..." : "Chargement..."}
      </div>
    );
  }

  if (!affiliateData) {
    return null;
  }

  const handleCopyLink = () => {
    if (!affiliateData?.is_active) return;
    const urlToCopy =
      affiliateData?.type === "Global"
        ? affiliateData?.coupon?.code
        : `${window.location.origin}/main/productdetails/${affiliateData?.article_id}/${affiliateData.token}`;

    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      toast.success(
        affiliateData.type === "Global"
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
    }
  };

  const handleDownload = async (resourceUrl) => {
    if (!resourceUrl) {
      toast.error(
        language === "eng"
          ? "Invalid download link"
          : "Lien de téléchargement invalide",
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
      return;
    }

    try {
      const loadingToast = toast.loading(
        language === "eng"
          ? "Downloading..."
          : "Téléchargement en cours...",
        {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        }
      );

      const downloadUrl = resourceUrl.includes("?")
        ? `${resourceUrl}&download=true`
        : `${resourceUrl}?download=true`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.download = "";

      const urlParts = resourceUrl.split("/");
      const filenameFromUrl = urlParts[urlParts.length - 1];
      if (filenameFromUrl && filenameFromUrl.includes(".")) {
        link.download = filenameFromUrl;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss(loadingToast);
      toast.success(
        language === "eng" ? "Download started!" : "Téléchargement commencé !",
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
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        language === "eng"
          ? "Download failed. Please try again."
          : "Échec du téléchargement. Veuillez réessayer.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    const totalSeconds = parseInt(timeString);
    if (!isNaN(totalSeconds)) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return timeString;
  };

  return (
    <div className={classes.details_container}>
      <div className={classes.back_btn} onClick={() => navigate(-1)}>
        <FaArrowLeftLong className={classes.back_arrow} />
        {language === "eng" ? "Back" : "Retour"}
      </div>

      <div className={classes.header}>
        <h1 className={classes.headtitle}>
          {language === "eng" ? "Affiliate Details" : "Détails de l'affiliation"}
        </h1>
      </div>

      <h3 className={classes.info_title}>
        {language === "eng" ? "Resources" : "Ressources"}
      </h3>

      <div className={classes.bigContainer}>
        <div className={classes.contentContainer}>
          <div className={classes.resources_section}>
            <div className={classes.table_container}>
              <table className={classes.resources_table}>
                <tbody className={classes.table_body}>
                  {affiliateData?.resources?.map((resource) => (
                    <tr
                      key={resource?.id}
                      className={classes.table_row}
                      style={{ marginBottom: "0", paddingBottom: "0" }}
                    >
                      <td
                        className={classes.name_cell}
                        style={{ border: "none", width: "60%", marginBottom: "0", paddingBottom: "0" }}
                      >
                        <div className={classes.resource_info}>
                          <div className={classes.file_icon}>
                            <span style={{ fontSize: "1.2em" }}>
                              {resource?.type?.split("/")[0] === "image"
                                ? "IMG"
                                : resource?.type?.split("/")[0] === "video"
                                ? "VID"
                                : resource?.type?.split("/")[0] === "audio"
                                ? "AUD"
                                : "FILE"}
                            </span>
                          </div>
                          <div>
                            <p className={classes.file_name}>{resource?.name}</p>
                            <p className={classes.file_type}>{resource?.type}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ border: "none" }} className={classes.table_cell}>
                        {resource?.size} kb
                      </td>
                      <td style={{ border: "none" }} className={classes.table_cell}>
                        {new Date(resource?.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ border: "none" }} className={classes.table_cell}>
                        <button
                          className={classes.download_btn}
                          onClick={() => handleDownload(resource.url)}
                        >
                          <FaDownload />{" "}
                          {language === "eng" ? "Download File" : "Télécharger"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3 className={classes.info_title} style={{ marginTop: "3em" }}>
            {language === "eng" ? "Promotional Content" : "Contenu promotionnel"}
          </h3>

          <div className={classes.promotional_section}>
            <div className={classes.scenario_overview}>
              <h3>{language === "eng" ? "Scenario Overview" : "Aperçu du scénario"}</h3>
              <p>
                {language === "eng"
                  ? affiliateData?.scenario_overview_en
                  : affiliateData?.scenario_overview_fr}
              </p>
            </div>

            <div className={classes.video_content}>
              <h3>{language === "eng" ? "Video Content" : "Contenu vidéo"}</h3>
              <div className={classes.table_container} style={{ borderRadius: "0" }}>
                <table className={classes.video_content_table} style={{ borderRadius: "0" }}>
                  <thead>
                    <tr className={classes.table_header}>
                      <th className={classes.header_cell}>
                        {language === "eng" ? "Title" : "Titre"}
                      </th>
                      <th className={classes.header_cell}>
                        {language === "eng"
                          ? "Scenario that showcases the product's benefits"
                          : "Aperçu du scénario"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className={classes.table_body}>
                    {affiliateData?.promotional_contents?.map((content, index) => (
                      <tr key={index} className={classes.table_row}>
                        <td className={classes.section_cell}>
                          <strong>
                            {language === "eng" ? content.title_en : content.title_fr}
                          </strong>
                          <br />
                          <span className={classes.time_range}>
                            ({formatTime(content.start_time)} -{" "}
                            {formatTime(content.end_time)})
                          </span>
                        </td>
                        <td className={classes.content_cell}>
                          {language === "eng"
                            ? content.description_en
                            : content.description_fr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.affiliate_card}>
          <div className={classes.affiliate_info}>
            <div className={classes.product_image}>
              {affiliateData?.type === "Global" ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "var(--secondary-color)",
                      textAlign: "center",
                      margin: ".3em auto",
                      fontSize: "10em",
                    }}
                  >
                    %
                  </p>
                </div>
              ) : (
                <img
                  src={
                    affiliateData?.article?.articleimage?.[0]?.link ||
                    productPlaceholder
                  }
                  alt={affiliateData?.article?.articleimage?.[0]?.type}
                />
              )}
            </div>

            <div className={classes.affiliate_details}>
              <h3>
                {affiliateData?.type === "Global"
                  ? language === "eng"
                    ? "Affiliate Code"
                    : "Code d'affiliation"
                  : language === "eng"
                  ? "Affiliate Link"
                  : "Lien d'affiliation"}
              </h3>
              <p className={classes.affiliate_url}>
                {affiliateData?.type === "Global"
                  ? language === "eng"
                    ? `Use code: ${affiliateData?.coupon?.code} at checkout`
                    : `Utilisez le code: ${affiliateData?.coupon?.code} à la caisse`
                  : `${window.location.origin}/main/productdetails/${affiliateData?.article_id}/${affiliateData.token}`}
              </p>
              <div className={classes.affiliate_meta}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    className={classes.type_badge}
                    style={{ fontWeight: "700", fontSize: "calc(.6rem + 0.3vw)" }}
                  >
                    {language === "eng" ? "Type" : "Type"}
                  </span>
                  <span className={classes.type_badge}>
                    {affiliateData?.type || "Specific Link"}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    className={classes.type_badge}
                    style={{ fontWeight: "700", fontSize: "calc(.6rem + 0.3vw)" }}
                  >
                    {language === "eng" ? "Status" : "Statut"}
                  </span>
                  <span
                    className={`${classes.status_badge} ${
                      affiliateData?.is_active
                        ? classes.status_active
                        : classes.status_used
                    }`}
                  >
                    {affiliateData?.is_active
                      ? language === "eng"
                        ? "Activated"
                        : "Activé"
                      : language === "eng"
                      ? "Used"
                      : "Utilisé"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            className={classes.copy_btn}
            onClick={handleCopyLink}
            style={{
              backgroundColor: !affiliateData?.is_active ? "#9C9CA3" : undefined,
              cursor: !affiliateData?.is_active ? "not-allowed" : "pointer",
            }}
            disabled={!affiliateData?.is_active}
          >
            <FaCopy />{" "}
            {language === "eng" ? "Copy Link" : "Copier le lien"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgramDetails;
