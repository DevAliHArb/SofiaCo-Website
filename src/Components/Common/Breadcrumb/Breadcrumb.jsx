import React from 'react';
import { useSelector } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';
import classes from './Breadcrumb.module.css';
import { useNavigate } from '@hooks/useNavigate';

/**
 * Breadcrumb Component
 * 
 * Usage Examples:
 * 
 * Simple usage:
 * <Breadcrumb paths={[
 *   { en: 'Home', fr: 'Accueil' },
 *   { en: 'About', fr: 'À propos' }
 * ]} />
 * 
 * Complex usage with multiple levels:
 * <Breadcrumb paths={[
 *   { en: 'Home', fr: 'Accueil' },
 *   { en: 'Products', fr: 'Produits' },
 *   { en: 'Books', fr: 'Livres' },
 *   { en: 'Book Details', fr: 'Détails du livre' }
 * ]} />
 * 
 * Mixed usage (string and object):
 * <Breadcrumb paths={[
 *   { en: 'Home', fr: 'Accueil' },
 *   'Category Name', // Static text
 *   { en: 'Current Page', fr: 'Page actuelle' }
 * ]} />
 */
const Breadcrumb = ({ paths }) => {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const navigate = useNavigate();

  // Function to get the translated text based on current language
  const getTranslatedText = (item) => {
    if (typeof item === 'string') {
      return item; // If it's already a string, return as is
    }
    if (!item) {
      return '';
    }
    const text = language === 'eng' ? item.en : item.fr;
    return typeof text === 'string' ? text : '';
  };

  const visiblePaths = (paths || []).filter((item) => {
    if (!item) {
      return false;
    }
    if (typeof item === 'string') {
      const value = item.trim();
      return value !== '' && value !== 'undefined' && value !== 'null';
    }
    const text = language === 'eng' ? item.en : item.fr;
    return typeof text === 'string' && text.trim() !== '' && text.trim() !== 'undefined' && text.trim() !== 'null';
  });

  return (
    <div className={classes.breadcrumb_container}>
      <p className={classes.breadcrumb}>
        {visiblePaths.map((path, index) => (
          <span key={index} className={classes.breadcrumb_item} style={{cursor:path?.url ? 'pointer' : 'default'}}>
            <span className={classes.breadcrumb_text} onClick={()=>{if(path?.url) navigate(path.url)}}>
              {getTranslatedText(path)}
            </span>
            {index < visiblePaths.length - 1 && (
              <IoIosArrowForward className={classes.breadcrumb_icon} />
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Breadcrumb;
