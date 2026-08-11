import React, { useEffect } from "react";
import classes from "./NouveautesPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Common/Breadcrumb/Breadcrumb";
import { JsonLd, buildBreadcrumbJsonLd } from "../Common/Seo";
import BooksView from "../Books page/Books View/BooksView";
import NewsLetterSection from "../Home Page/NewsLetter/NewsLetterSection";
import { editSearchData, resetSearchData } from "../Common/redux/productSlice";

const clearCatalogFilters = () => {
  ["stock","categories","collections","multiproductids","publishers","subCategories","subSubCategories","parentCategories","min_price","max_price","rate"].forEach((key) => localStorage.removeItem(key));
};

const NouveautesPage = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);

  useEffect(() => {
    clearCatalogFilters();
    dispatch(resetSearchData());
    dispatch(editSearchData({ newarrival: true }));
    return () => { dispatch(editSearchData({ newarrival: false })); };
  }, [dispatch]);

  const breadcrumbPaths = [
    { en: "Home", fr: "Accueil", url: "/main" },
    { en: "New Arrivals", fr: "Nouveautés", url: "" },
  ];

  return (
    <div className={classes.container}>
      <JsonLd items={[buildBreadcrumbJsonLd(breadcrumbPaths, language)]} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className={classes.header}>
        <div className={classes.headtitle}>
          <h1>{language === "eng" ? "New Arrivals" : "Nouveautés"}</h1>
        </div>
      </div>
      <div className={classes.content}>
        <BooksView />
      </div>
      <NewsLetterSection />
    </div>
  );
};
export default NouveautesPage;
