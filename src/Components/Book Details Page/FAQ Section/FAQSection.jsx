import React, { useEffect } from "react";
import classes from "./FAQSection.module.css";
import FAQCard from "./FAQCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { JsonLd, buildFaqJsonLd } from "../../Common/Seo";

const FAQSection = ({ faqParams }) => {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language,
  );
  const [faqData, setFAQData] = React.useState([]);

  const fetchFAQData = async () => {
    if (!faqParams?.id || !faqParams?.field) {
      setFAQData([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/faq-questions?ecom_type=sofiaco&${faqParams.field}=${faqParams.id}`,
      );
      setFAQData(response.data);
    } catch (error) {
      // console.error('Error fetching FAQ data:', error);
    }
  };

  useEffect(() => {
    fetchFAQData();
  }, [faqParams?.field, faqParams?.id]);

  return (
    <div className={classes.faq_container}>
      <JsonLd items={[buildFaqJsonLd(faqData, language)]} />
      {faqData?.length > 0 && (
        <div
          className={classes.header}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: "2em",
            width: "80%",
          }}
        >
          <div className={classes.headtitle} style={{ margin: "auto" }}>
            <h1 style={{ textAlign: "center" }}>
              {language === "eng" ? "FAQ’S" : "FAQS"}
            </h1>
          </div>
        </div>
      )}
      <div className={classes.faq_content}>
        <div className={classes.faqCardContainer}>
          {faqData?.map((card) => {
            return (
              <FAQCard
                key={card.id}
                title={
                  language === "eng" ? card?.question_en : card?.question_fr
                }
                description={
                  language === "eng"
                    ? card?.answers[0]?.answer_en
                    : card?.answers[0]?.answer_fr
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
