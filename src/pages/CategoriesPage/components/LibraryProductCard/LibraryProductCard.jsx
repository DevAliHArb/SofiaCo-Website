import React, { useContext } from "react";
import classes from "./LibraryProductCard.module.css";
import { useNavigate } from '@hooks/useNavigate';
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../../../Components/Common/authContext";
import { addSelectedBook } from "../../../../Components/Common/redux/productSlice";
import { Rating } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import img from "../../../../assets/bookPlaceholder.png";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const stripHtmlTags = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

const LibraryProductCard = ({ product, isActive, index, activeIndex }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const favoriteData = useSelector((state) => state.products.favorites);

  const getDisplayPrice = (product, discount, currentCurrency, currencyRate) => {
    const basePrice = Number(product?._prix_public_ttc || 0);
    const discountedPrice = discount > 0 ? basePrice - (basePrice * discount / 100) : basePrice;
    
    if (currentCurrency === "eur") {
      return `${discountedPrice.toFixed(2)} €`;
    } else {
      return `${(discountedPrice * currencyRate).toFixed(2)} $`;
    }
  };

  const getOriginalPrice = (product, currentCurrency, currencyRate) => {
    const basePrice = Number(product?._prix_public_ttc || 0);
    
    if (currentCurrency === "eur") {
      return `${basePrice.toFixed(2)} €`;
    } else {
      return `${(basePrice * currencyRate).toFixed(2)} $`;
    }
  };

  const handleClick = () => {
    authCtx.setbookDetails(product);
    dispatch(addSelectedBook(product));
    navigate(`/main/productdetails/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (product.article_variant_combinations && product.article_variant_combinations.length > 0) {
      authCtx.setaddtocartPopupOpen(true);
      authCtx.setaddtocartPopupId(product.id);
    } else {
      authCtx.addToCart({ props: product });
    }
  };

  const handleFavoriteToggle = (event) => {
    event.stopPropagation();
    if (favoriteData?.some((book) => book._favid === product.id)) {
      authCtx.deleteFavorite(product.id);
    } else {
      authCtx.addToFavorite(product);
    }
  };

  return (
    <div
      className={classes.card_container}
      style={{
        transform: index === activeIndex ? 'scale(1)' : 
                   index === activeIndex + 1 || index === activeIndex - 1 ? 'scale(0.85)' : 'scale(0.75)',
        background: index === activeIndex ? '#DDE3EC' : ''
      }}
      onClick={handleClick}
    >
      <div className={classes.card_img}>
        {product._qte_a_terme_calcule < 1 && (
          <div className={classes.out_of_stock}>
            <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
          </div>
        )}
        {product.articleimage?.[0] ? (
          <img
            src={product.articleimage[0].link}
            alt={product.articleimage[0].type}
            className={classes.img}
          />
        ) : (
          <img
            src={img}
            className={classes.img}
            alt={product.designation}
          />
        )}
        <div className={classes.favoriteIcon}>
          {favoriteData?.some((book) => book._favid === product.id) ? (
            <FavoriteIcon
              className={classes.fav}
              onClick={handleFavoriteToggle}
              fontSize="inherit"
            />
          ) : (
            <FavoriteBorderIcon
              className={classes.nonfav}
              fontSize="inherit"
              onClick={handleFavoriteToggle}
            />
          )}
        </div>
      </div>
      <div
        className={classes.bookTitle}
        style={{ opacity: index === activeIndex ? 1 : 0 }}
      >
        <p className={classes.rateContainer}>
          <Rating
            className={classes.rating}
            size='small'
            name="read-only"
            value={product.average_rate}
            precision={0.5}
            readOnly
          />
          <p className={classes.rateText}>{product.average_rate}/5</p>
        </p>
        <p className={classes.productName}>
          {truncateText(stripHtmlTags(product.designation), 50)}
        </p>
        <p className={classes.productDesc}>
          {truncateText(stripHtmlTags(product.descriptif), 40)}
        </p>
        <span className={classes.priceContainer}>
          <p className={classes.currentPrice}>
            {getDisplayPrice(
              product,
              Number(product?.discount || 0),
              currency,
              authCtx.currencyRate
            )}
          </p>
          {product.discount > 0 && (
            <p className={classes.originalPrice}>
              {getOriginalPrice(product, currency, authCtx.currencyRate)}
            </p>
          )}
        </span>
        {product._qte_a_terme_calcule > 0 && (
          <button
            className={classes.buttoncart}
            onClick={handleAddToCart}
          >
            {language === "eng" ? "Add to Cart" : "Ajouter au panier"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LibraryProductCard;
