import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./SubSubCategoriesPage.module.css";
import { useParams } from "react-router-dom";
import AuthContext from "../../Components/Common/authContext";
import CatHero from "../CategoriesPage/components/Hero/Hero";
import FAQSection from "../CategoriesPage/components/FAQ/FAQSection";
import BooksView from "../../Components/Books page/Books View/BooksView";
import { addSelectedCategory } from "../../Components/Common/redux/productSlice";
import Breadcrumb from "../../Components/Common/Breadcrumb/Breadcrumb";
import { Helmet } from "react-helmet-async";
import OurSelection from "../CategoriesPage/components/OurSelection/OurSelection";
import NewsLetterSection from "../../Components/Home Page/NewsLetter/NewsLetterSection";

// Helper function to slugify and sanitize text
const slugify = (text, placeholder = "product") => {
  if (!text || text.trim() === "") return placeholder;
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all symbols except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

const SubSubCategoriesPage = () => {
  const authCtx = useContext(AuthContext);
  const { catId, id } = useParams();
  const selectedCategoryId = catId || id;
  const dispatch = useDispatch();
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency,
  );
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language,
  );
  const [categoryData, setcategoryData] = useState({});
  const [subCategoryData, setsubCategoryData] = useState({});
  const [subsubCategoryData, setSubsubCategoryData] = useState({});

  useEffect(() => {
    if (selectedCategoryId && authCtx.categories) {
      const selectedIndex = authCtx.categories?.find(
        (item) => Number(item.id) === Number(selectedCategoryId),
      );
      setSubsubCategoryData(selectedIndex || {});

      if (selectedIndex?.b_usr_articlecategorie_id) {
        const subCategory = authCtx.articleFamille?.find(
          (item) => Number(item.id) === Number(selectedIndex.b_usr_articlecategorie_id),
        );
        setsubCategoryData(subCategory || {});

        if (subCategory?.b_usr_parentcategorie_id) {
          const parentCategory = authCtx.articleFamilleParents?.find(
            (item) => Number(item.id) === Number(subCategory.b_usr_parentcategorie_id),
          );
          setcategoryData(parentCategory || {});
        }
      }
    }
  }, [selectedCategoryId, authCtx.categories, authCtx.articleFamille, authCtx.articleFamilleParents]);

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
      url: `/main/cp/${slugify(categoryData?.nom)}/${slugify(subCategoryData?.type_nom)}/${subCategoryData?.id}`,
    },
    {
      en: `${subsubCategoryData?.nom}`,
      fr: `${subsubCategoryData?.nom}`,
      url: "",
    },
  ];

  const normalizeMetaValue = (value) =>
    typeof value === "string" ? value.trim() : "";
  const metaTitle = normalizeMetaValue(
    subsubCategoryData?.meta_title ||
      (language === "eng"
        ? subsubCategoryData?.title_en
        : subsubCategoryData?.title_fr) ||
      subsubCategoryData?.nom,
  );
  const metaDescription = normalizeMetaValue(
    subsubCategoryData?.meta_description ||
      (language === "eng"
        ? subsubCategoryData?.description1_en
        : subsubCategoryData?.description1_fr) ||
      (language === "eng"
        ? subsubCategoryData?.description2_en
        : subsubCategoryData?.description2_fr),
  );
  const keyword = normalizeMetaValue(
    subsubCategoryData?.keywords || subsubCategoryData?.nom,
  );
  const secondaryKeyword = normalizeMetaValue(
    subsubCategoryData?.secondary_keywords || subCategoryData?.type_nom,
  );
  const longTailText = normalizeMetaValue(subsubCategoryData?.long_tail_text);

  return (
    <>
      <Helmet>
        {metaTitle && <title>{metaTitle}</title>}
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {keyword && <meta name="keywords" content={keyword} />}
        {secondaryKeyword && (
          <meta name="secondary_keywords" content={secondaryKeyword} />
        )}
        {longTailText && <meta name="long_tail_text" content={longTailText} />}
      </Helmet>
      <div>
        <CatHero categoryData={subsubCategoryData} />
        <Breadcrumb paths={breadcrumbPaths} />
        <BooksView />
        {subsubCategoryData?.description2_fr && (
          <div className={classes.catContent}>
            {subsubCategoryData?.subtitle_2 && (
              <div className={classes.headtitle} style={{ margin: "auto" }}>
                <h2>{subsubCategoryData?.subtitle_2}</h2>
              </div>
            )}
            <p>
              {language === "eng"
                ? subsubCategoryData?.description2_en
                : subsubCategoryData?.description2_fr}
            </p>
          </div>
        )}

        <OurSelection subsubcatId={subsubCategoryData?.id} />
        <FAQSection
          faqParams={{
            field: "b_usr_articlesouscategorie_id",
            id: subsubCategoryData?.id,
          }}
        />
        <NewsLetterSection />
      </div>
    </>
  );
};

export default SubSubCategoriesPage;
