import React, { useContext, useState } from 'react';
import AuthContext from '../../authContext';
import { useDispatch, useSelector } from 'react-redux';
import { resetSearchData, addSelectedCategory } from '../../redux/productSlice';
import { useNavigate } from "@hooks/useNavigate";
import { Tooltip } from '@mui/material';
import allcat from '../../../../assets/icons/all-cat.svg';
import classes from './LanCurrSelect.module.css';

export default function LanCurrSelect() {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredSubCategoryId, setHoveredSubCategoryId] = useState(null);

  // Use allarticleFamille from authCtx as the full subcategories list
  const subCategories = authCtx?.allarticleFamille || [];

  const getSubcategories = (parentId) =>
    subCategories
      ?.filter((item) => Number(item.b_usr_parentcategorie_id) === Number(parentId))
      ?.sort((a, b) => (a.type_nom || '').localeCompare(b.type_nom || '')) || [];

  const getChildSubcategories = (subCategoryId) =>
    authCtx?.subsubCategories
      ?.filter((item) => Number(item.b_usr_articlecategorie_id) === Number(subCategoryId))
      ?.sort((a, b) => (a.nom || '').localeCompare(b.nom || '')) || [];

  const slugify = (str) =>
    (str || '').toString().trim().replace(/\s+/g, '-').toLowerCase();

  const handleAllCategoryClick = () => {
    dispatch(resetSearchData());
    navigate(`/main/products`);
  };

  const handleParentCategoryClick = (parentId, parentName) => {
    navigate(`/main/cp/${slugify(parentName)}/${parentId}`);
  };

  const handleSubCategoryClick = (id, name, parentName, parentId) => {
    const currentSubCategories = JSON.parse(localStorage.getItem('subCategories')) || [];
    currentSubCategories.push(id);
    localStorage.setItem('subCategories', JSON.stringify(currentSubCategories));
    navigate(`/main/cp/${slugify(parentName)}/${slugify(name)}/${id}`);
  };

  const handleChildSubCategoryClick = (id, childName, subCategoryId, subCategoryName, parentName) => {
    localStorage.setItem('subSubCategories', JSON.stringify([id]));
    navigate(`/main/cp/${slugify(parentName)}/${slugify(subCategoryName)}/${slugify(childName)}/${id}`);
  };

  return (
    <>
      <div className={classes.categoriesNav}>
        <Tooltip title={language === 'eng' ? 'All Products' : 'Tous Nos Produits'}>
          <div
            className={classes.categoryIcon}
            onClick={handleAllCategoryClick}
          >
            <img src={allcat} alt="All Products" />
          </div>
        </Tooltip>

        {authCtx?.articleFamilleParents?.slice(0, 8).map((parent) => (
          <div
            key={parent.id}
            className={classes.categoryIconWrapper}
            onMouseEnter={() => { setHoveredCategoryId(parent.id); setHoveredSubCategoryId(null); }}
            onMouseLeave={() => { setHoveredCategoryId(null); setHoveredSubCategoryId(null); }}
          >
            <Tooltip title={language === 'eng' ? parent.nom : (parent.nom_fr || parent.nom)}>
              <div
                className={classes.categoryIcon}
                onClick={() => handleParentCategoryClick(parent.id, parent.nom)}
              >
                <img
                  src={parent.dark_image || allcat}
                  alt={parent.nom}
                />
              </div>
            </Tooltip>

            {hoveredCategoryId === parent.id && getSubcategories(parent.id).length > 0 && (
              <div
                className={classes.categoryDropdown}
                onMouseEnter={() => setHoveredCategoryId(parent.id)}
                onMouseLeave={() => { setHoveredCategoryId(null); setHoveredSubCategoryId(null); }}
              >
                <div className={classes.dropdownHeader}>
                  {language === 'eng' ? parent.nom : (parent.nom_fr || parent.nom)}
                </div>
                <div className={classes.dropdownContent}>
                  {getSubcategories(parent.id).map((sub) => (
                    <div
                      key={sub.id}
                      className={classes.dropdownItemWrapper}
                      onMouseEnter={() => setHoveredSubCategoryId(sub.id)}
                      onMouseLeave={() => setHoveredSubCategoryId(null)}
                    >
                      <div
                        className={classes.dropdownItem}
                        onClick={() => handleSubCategoryClick(sub.id, sub.type_nom || sub.nom, parent.nom, parent.id)}
                      >
                        {sub.dark_image && (
                          <img
                            src={sub.dark_image}
                            alt={sub.type_nom || sub.nom}
                            className={classes.catIcon}
                          />
                        )}
                        <span>
                          {language === 'eng' ? (sub.type_nom || sub.nom) : (sub.nom_fr || sub.type_nom || sub.nom)}
                        </span>
                        {getChildSubcategories(sub.id).length > 0 && (
                          <span className={classes.childIndicator}>›</span>
                        )}
                      </div>

                      {hoveredSubCategoryId === sub.id && getChildSubcategories(sub.id).length > 0 && (
                        <div className={classes.childDropdown}>
                          {getChildSubcategories(sub.id).map((child) => (
                            <div
                              key={child.id}
                              className={classes.childDropdownItem}
                              onClick={() =>
                                handleChildSubCategoryClick(
                                  child.id,
                                  child.nom,
                                  sub.id,
                                  sub.type_nom || sub.nom,
                                  parent.nom
                                )
                              }
                            >
                              {child.dark_image && (
                                <img
                                  src={child.dark_image}
                                  alt={child.nom}
                                  className={classes.catIcon}
                                />
                              )}
                              <span>
                                {language === 'eng' ? child.nom : (child.nom_fr || child.nom)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </>
  );
}
