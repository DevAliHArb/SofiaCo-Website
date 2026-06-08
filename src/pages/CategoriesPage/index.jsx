import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CategoriesPage.module.css";
import { useParams } from "react-router-dom";
import AuthContext from "../../Components/Common/authContext";
import axios from "axios";
import CatHero from "./components/Hero/Hero";
import FAQSection from "./components/FAQ/FAQSection";
import BooksView from "../../Components/Books page/Books View/BooksView";
import MainCat from "./components/MainCategories/MainCat";
import { addSelectedCategory } from "../../Components/Common/redux/productSlice";
import Breadcrumb from "../../Components/Common/Breadcrumb/Breadcrumb";
import { Helmet } from "react-helmet-async";
import OurSelection from "./components/OurSelection/OurSelection";
import NewsLetterSection from "../../Components/Home Page/NewsLetter/NewsLetterSection";

const CategoriesPage = () => {
  const authCtx = useContext(AuthContext);
  const { catId } = useParams();
  const dispatch = useDispatch();
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency,
  );
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language,
  );
  const [categoryData, setcategoryData] = useState({});

  const fetchAbout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/article-famille/${catId}`,
        {
          ecom_type: `${import.meta.env.VITE_ECOM_TYPE}`,
        },
      );
      setcategoryData(response.data);
      console.log("Response data:", response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  useEffect(() => {
    fetchAbout();
    dispatch(addSelectedCategory(String(catId)));
  }, [catId]);

  const breadcrumbPaths = [
    { en: "Home", fr: "Accueil", url: "/main" },
    { en: `${categoryData?.nom}`, fr: `${categoryData?.nom}`, url: "" },
  ];

  const normalizeMetaValue = (value) =>
    typeof value === "string" ? value.trim() : "";
  const metaTitle = normalizeMetaValue(
    categoryData?.meta_title ||
      (language === "eng" ? categoryData?.title_en : categoryData?.title_fr) ||
      categoryData?.nom,
  );
  const metaDescription = normalizeMetaValue(
    categoryData?.meta_description ||
      (language === "eng"
        ? categoryData?.description1_en
        : categoryData?.description1_fr) ||
      (language === "eng"
        ? categoryData?.description2_en
        : categoryData?.description2_fr),
  );
  const keyword = normalizeMetaValue(
    categoryData?.keywords || categoryData?.nom,
  );
  const secondaryKeyword = normalizeMetaValue(
    categoryData?.secondary_keywords || categoryData?.type_nom,
  );
  const longTrainText = normalizeMetaValue(categoryData?.long_tail_text);

  return (
    <>
      <Helmet>
        {metaTitle && <title>{metaTitle}</title>}
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {keyword && <meta name="keyword" content={keyword} />}
        {secondaryKeyword && (
          <meta name="secondary_keyword" content={secondaryKeyword} />
        )}
        {longTrainText && (
          <meta name="long_train_text" content={longTrainText} />
        )}
      </Helmet>
      <div>
        <CatHero categoryData={categoryData} />
        <Breadcrumb paths={breadcrumbPaths} />
        <div className={classes.catContent}>
          {categoryData?.title_fr && (
            <div className={classes.headtitle} style={{ margin: "auto" }}>
              <h2>
                {language === "eng"
                  ? categoryData?.title_en
                  : categoryData?.title_fr}
              </h2>
            </div>
          )}
          <p>
            {language === "eng"
              ? categoryData?.description1_en
              : categoryData?.description1_fr}
          </p>
        </div>
        <MainCat categoryData={categoryData} />
        <BooksView />
        {categoryData?.description2_fr && (
          <div className={classes.catContent}>
            {categoryData?.subtitle_2 && (
              <div className={classes.headtitle} style={{ margin: "auto" }}>
                <h2>{categoryData?.subtitle_2}</h2>
              </div>
            )}
            <p>
              {language === "eng"
                ? categoryData?.description2_en
                : categoryData?.description2_fr}
            </p>
          </div>
        )}
        <OurSelection catId={categoryData?.id} />
        <FAQSection
          faqParams={{
            field: "b_usr_parentcategorie_id",
            id: categoryData?.id,
          }}
        />
        <NewsLetterSection />
      </div>
    </>
  );
};

export default CategoriesPage;
