import React, { useContext, useState } from "react";
import classes from "./BestSellersPage.module.css";
import { useSelector } from "react-redux";
import AuthContext from "../Common/authContext";
import Library from "./Library Section/Library";
import Breadcrumb from "../Common/Breadcrumb/Breadcrumb";
import { JsonLd, buildBreadcrumbJsonLd } from "../Common/Seo";
import { IoIosArrowDown } from "react-icons/io";

const BestSellersPage = () => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const authCtx = useContext(AuthContext);
  const [parentCategorySearch, setParentCategorySearch] = useState("");
  const [selectedParentCategories, setSelectedParentCategories] = useState(() => JSON.parse(localStorage.getItem("parentCategories")) || []);
  const [parentCategoriesOpen, setParentCategoriesOpen] = useState(true);

  const breadcrumbPaths = [
    { en: "Home", fr: "Accueil", url: "/main" },
    { en: "Best Sellers", fr: "Meilleures Ventes", url: "" },
  ];

  const handleChangeParentCategory = (id) => {
    setSelectedParentCategories((prev) => {
      const updated = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      localStorage.setItem("parentCategories", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetCategories = () => {
    setSelectedParentCategories([]);
    localStorage.removeItem("parentCategories");
  };

  const visibleParents = authCtx?.articleFamilleParents
    ? [...authCtx.articleFamilleParents].sort((a, b) => {
        const aS = selectedParentCategories.includes(a.id);
        const bS = selectedParentCategories.includes(b.id);
        if (aS && !bS) return -1;
        if (!aS && bS) return 1;
        return 0;
      })
    : [];

  const displayedParents = selectedParentCategories.length > 0
    ? visibleParents.filter((p) => selectedParentCategories.includes(p.id))
    : visibleParents;

  return (
    <div className={classes.bigcontainer}>
      <JsonLd items={[buildBreadcrumbJsonLd(breadcrumbPaths, language)]} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className={classes.header}>
        <div className={classes.headtitle}>
          <h1>{language === "eng" ? "Best Sellers" : "Meilleures Ventes"}</h1>
        </div>
      </div>
      <div className={classes.filterLayout}>
        <div className={classes.filter}>
          <div className={classes.filterHeader}>
            <h2>{language === "eng" ? "Filters" : "Filtres"}</h2>
          </div>
          <div className={classes.categories}>
            <h2 onClick={() => setParentCategoriesOpen(!parentCategoriesOpen)} style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
              <span>{language === "eng" ? "Parent Categories" : "Catégories Parentales"}</span>
              <span style={{ margin: "auto", rotate: parentCategoriesOpen ? "180deg" : "0deg" }}>
                <IoIosArrowDown style={{ color: "var(--primary-color)", cursor: "pointer" }} />
              </span>
            </h2>
            {parentCategoriesOpen && (
              <div className={classes.dropdown} style={{ maxHeight: "400px", overflowY: "scroll", margin: "1em auto" }}>
                <div style={{ padding: "0 0.6em 0.6em 0.6em" }}>
                  <input type="search" placeholder={language === "eng" ? "Search..." : "Rechercher..."} value={parentCategorySearch} onChange={(e) => setParentCategorySearch(e.target.value)} style={{ width: "100%", padding: "0.5em", marginBottom: "0.5em", borderRadius: ".5em", border: "1px solid #868686" }} />
                </div>
                {authCtx?.articleFamilleParents?.filter((p) => { const q = parentCategorySearch.trim().toLowerCase(); return !q || p.nom?.toLowerCase().includes(q) || p.nom_fr?.toLowerCase().includes(q); })?.sort((a, b) => (a.nom || "").localeCompare(b.nom || "")).map((parent) => (
                  <div key={parent.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em", cursor: "pointer" }} onClick={() => handleChangeParentCategory(parent.id)}>
                    <input type="checkbox" checked={selectedParentCategories.includes(parent.id)} readOnly className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                    <p style={{ margin: "auto 0 auto 2%", width: "92%", color: "var(--primary-color)", cursor: "pointer" }}>{language === "eng" ? parent.nom : (parent.nom_fr || parent.nom)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={classes.filterActions}>
            <button className={classes.resetFilter} onClick={handleResetCategories} type="button">{language === "eng" ? "Reset Filters" : "Réinitialiser"}</button>
          </div>
        </div>
        <div className={classes.main}>
          {displayedParents.map((item) => (
            <Library key={item.id} title_en={item.nom} title_fr={item.nom_fr || item.nom} id={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default BestSellersPage;
