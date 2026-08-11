import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./SubCategoriesPage.module.css";
import { useParams, useLocation } from "react-router-dom";
import AuthContext from "../../Components/Common/authContext";
import CatHero from "../CategoriesPage/components/Hero/Hero";
import FAQSection from "../CategoriesPage/components/FAQ/FAQSection";
import BooksView from "../../Components/Books page/Books View/BooksView";
import MainCat from "./components/MainCategories/MainCat";
import { addSelectedCategory } from "../../Components/Common/redux/productSlice";
import Breadcrumb from "../../Components/Common/Breadcrumb/Breadcrumb";
import Seo, { buildBreadcrumbJsonLd } from "../../Components/Common/Seo";
import OurSelection from "../CategoriesPage/components/OurSelection/OurSelection";
import NewsLetterSection from "../../Components/Home Page/NewsLetter/NewsLetterSection";

// Helper function to slugify and sanitize text
const slugify = (text, placeholder = "product") => {
  if (!text || text.trim() === "") return placeholder;
  const slug = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all symbols except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "");
  return slug || placeholder; // Remove leading/trailing hyphens
};

const SubCategoriesPage = () => {
  const authCtx = useContext(AuthContext);
  const { catId, id } = useParams();
  const location = useLocation();
  const selectedCategoryId = catId || id;
  const dispatch = useDispatch();
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency,
  );
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language,
  );
  const [subCategoryData, setsubCategoryData] = useState({});
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    if (selectedCategoryId) {
      const selectedIndex = authCtx.allarticleFamille?.find(
        (item) => Number(item.id) === Number(selectedCategoryId),
      );
      setsubCategoryData(selectedIndex); // Adjust index to account for the 'All Categories' item
    }
  }, [selectedCategoryId, authCtx.allarticleFamille]);

  useEffect(() => {
    if (subCategoryData?.b_usr_parentcategorie_id) {
      const selectedIndex = authCtx.articleFamilleParents?.find(
        (item) =>
          Number(item.id) === Number(subCategoryData.b_usr_parentcategorie_id),
      );
      setCategoryData(selectedIndex); // Adjust index to account for the 'All Categories' item
    }
  }, [subCategoryData, authCtx.articleFamilleParents]);

  const breadcrumbPaths = [
    { en: "Home", fr: "Accueil", url: "/main" },
    {
      en: `${categoryData?.nom}`,
      fr: `${categoryData?.nom}`,
      url: `/main/cp/${slugify(categoryData?.nom)}/${categoryData?.id}`,
    },
    {
      en: `${subCategoryData?.type_nom}`,
      fr: `${subCategoryData?.type_nom}`,
      url: "",
    },
  ];

  const normalizeMetaValue = (value) =>
    typeof value === "string" ? value.trim() : "";

  const metaTitle = normalizeMetaValue(
    subCategoryData?.meta_title ||
      (language === "eng"
        ? subCategoryData?.title_en
        : subCategoryData?.title_fr) ||
      subCategoryData?.type_nom ||
      subCategoryData?.nom,
  );

  const metaDescription = normalizeMetaValue(
    subCategoryData?.meta_description ||
      (language === "eng"
        ? subCategoryData?.description1_en
        : subCategoryData?.description1_fr) ||
      (language === "eng"
        ? subCategoryData?.description2_en
        : subCategoryData?.description2_fr),
  );

  const keyword = normalizeMetaValue(
    subCategoryData?.keywords || subCategoryData?.nom,
  );

  return (
    <>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path={location.pathname}
        image={subCategoryData?.image}
        keywords={keyword}
        jsonLd={buildBreadcrumbJsonLd(breadcrumbPaths, language)}
      />
      <div>
        <CatHero categoryData={subCategoryData} />
        <Breadcrumb paths={breadcrumbPaths} />

        <MainCat
          categoryData={categoryData}
          subCategoryData={subCategoryData}
        />
        <BooksView />
        {subCategoryData?.description2_fr && (
          <div className={classes.catContent}>
            {subCategoryData?.subtitle_2 && (
              <div className={classes.headtitle} style={{ margin: "auto" }}>
                <h2>{subCategoryData?.subtitle_2}</h2>
              </div>
            )}
            <p>
              {language === "eng"
                ? subCategoryData?.description2_en
                : subCategoryData?.description2_fr}
            </p>
          </div>
        )}
        <OurSelection subcatId={subCategoryData?.id} />
        <FAQSection
          faqParams={{
            field: "b_usr_articlecategorie_id",
            id: subCategoryData?.id,
          }}
        />
        <NewsLetterSection />
      </div>
    </>
  );
};

export default SubCategoriesPage;
