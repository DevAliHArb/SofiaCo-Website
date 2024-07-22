import React, { useContext, useEffect, useState } from "react";
import classes from "./Details.module.css";
import Rating from "@mui/material/Rating";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Divider, FormControl, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
// import paypal from "../../../assets/pay-pal.png";
// import visa from "../../../assets/visa.png";
// import mastercard from "../../../assets/master-card.png";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { FaTwitter, FaFacebookF, FaPinterestP } from "react-icons/fa";
import AuthContext from "../../Common/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addTocart,
  addTocompare,
  addTofavorite,
  deletefavorite,
} from "../../Common/redux/productSlice";
import { TbTruckDelivery } from "react-icons/tb";
import { stripHtmlTags, truncateText } from "../../Common Components/TextUtils";

const Details = () => {
  const authCtx = useContext(AuthContext);
  const user = useSelector((state) => state.products.userInfo);
  const dispatch = useDispatch();
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [selectedOption, setSelectedOption] = useState("CATÉGORIES");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorite, setfavorite] = useState(true);
  const favoriteData = useSelector((state) => state.products.favorites);
  // const [bookData, setbookData] = useState({});
  const bookData = useSelector((state) => state.products.selectedBook[0]);
  const [averageRating, setaverageRating] = useState(0);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );

  // useEffect(() => {
  //   bookDatas.forEach((element) => {
  //     setbookData(element);
  //   });
  // }, [bookDatas]);

  const [count, setCount] = React.useState(1);

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  useEffect(() => {
    const calculateAverageRating = () => {
      if (
        !bookData.bookreview ||
        !Array.isArray(bookData.bookreview) ||
        bookData.bookreview.length === 0
      ) {
        return 0; // Return 0 if there are no reviews or if bookreview is not an array
      }

      const validRatings = bookData.bookreview.filter(
        (review) => !isNaN(parseFloat(review.rate))
      );

      if (validRatings.length === 0) {
        return 0; // Return 0 if there are no valid ratings
      }

      const totalRatings = bookData.bookreview.reduce(
        (accumulator, review) => accumulator + parseFloat(review.rate),
        0
      );
      let reviewsCount = bookData.bookreview.length;

      return totalRatings / reviewsCount;
    };

    const averageRate = calculateAverageRating();
    setaverageRating(averageRate);
  }, [bookData]);

  useEffect(() => {
    {
      favoriteData.some((book) => book._favid === bookData.id)
        ? setfavorite(true)
        : setfavorite(false);
    }
  }, [bookData]);

  const FavoriteClick = () => {
    if (user) {
      if (favorite) {
        authCtx.deleteFavorite(bookData.id);
      } else {
        authCtx.addToFavorite(bookData);
      }
      setfavorite(!favorite);
    } else {
      toast.error(`Please log in to add favorites.`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    }
  };
  const numberOptions = Array.from({ length: 50 }, (_, index) => index + 1);
  return (
    <>
      <div className={classes.contantContainer}>
          <p style={{ color: "var(--primary-color)", fontSize: "small", display:'flex', flexDirection:'row' }}>
            <span>ISBN: {bookData._code_barre}</span>
            <Rating
              style={{
                color: "var(--primary-color)",
                margin: "auto .5em 0 0.8em",
              }}
              size="small"
              name="read-only"
              value={averageRating}
              readOnly
              precision={0.1}
            />
            {averageRating.toFixed(1)}/{bookData.bookreview?.length}
          </p>
        <h1 className={classes.header}>{bookData.designation}</h1>
        <div className={classes.contentss}>
        </div>
        <div className={classes.priceContainer}>
          <p
            style={{
              color: "var(--primary-color)",
              fontSize: "calc(1.3rem + 0.4vw)",
              margin: "auto 0",
              paddingRight: "0.5em",
              fontWeight: "700",
            }}
          >
            {currency === "eur"
                            ? `€${
                              bookData.discount > 0
                                  ? (
                                    bookData.prixpublic -
                                    bookData.prixpublic * (bookData.discount / 100)
                                    ).toFixed(2)
                                  : Number(bookData.prixpublic).toFixed(2)
                              }`
                            : `$${
                              bookData.discount > 0
                                  ? (
                                      (bookData.prixpublic -
                                        bookData.prixpublic *
                                          (bookData.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    bookData.prixpublic * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}{" "}
          </p>
        </div>
        <div className={classes.bottonsContainer}>
          <TextField
            type="number"
            value={count}
            onChange={handleCountChange}
            InputProps={{
              inputProps: { min: 1 },
              style: {
                margin: "0",
                height: "2.5em",
                backgroundColor: "#fff",
                color: "var(--secondary-color)",
              },
            }}
            className={classes.inputt}
          />
          <button
            className={classes.addToCartBtn}
            onClick={(event) =>
              authCtx.addToCart({ props: bookData }) &
              event.stopPropagation()
            }
          >
            {" "}
            {language === 'eng' ? 'Add to cart' : 'Ajouter Au Panier'}
          </button>
                          <div className={classes.favoriteIcon}>
                            {favoriteData?.some(
                              (book) => book._favid === bookData.id
                            ) ? (
                              <FavoriteIcon
                                className={classes.fav}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  authCtx.deleteFavorite(bookData.id);
                                }}
                                fontSize="inherit"
                              />
                            ) : (
                              <FavoriteBorderIcon
                                className={classes.nonfav}
                                fontSize="inherit"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  authCtx.addToFavorite(bookData);
                                }}
                              />
                            )}
                          </div>
        </div>
        <div className={classes.char_con}>
          <div className={classes.char}>
            <p>{language === 'eng' ? 'Author' : 'Auteur'}</p>
            <p
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(editSearchData({ author: bookData.dc_auteur }));
                navigate(`/books`);
              }}
            >
              : {bookData.dc_auteur}
            </p>
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Translator' : 'Traducteur'}</p>
            <p
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(
                  editSearchData({ traducteur: bookData.dc_traducteur })
                );
                navigate(`/books`);
              }}
              style={{  cursor: "pointer" }}
            >
              : {bookData.dc_traducteur}
            </p>
          </div>
          <div className={classes.char}>
            <p > {language === 'eng' ? 'Illustrator' : 'Illustrateur'}</p>
            <p >: {bookData.dc_illustrateur}</p>
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Collection' : 'Collection'}</p>
            <p
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(
                  editSearchData({ collection: bookData.dc_collection })
                );
                navigate(`/books`);
              }}
              style={{ cursor: "pointer" }}
            >
              : {bookData.dc_collection}
            </p>
          </div>
          <div className={classes.char}>
            <p > {language === 'eng' ? 'Editor' : 'Editeur'}</p>
            <p
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(editSearchData({ editor: bookData.editor?._nom }));
                navigate(`/books`);
              }}
              style={{ cursor: "pointer" }}
            >
              : {bookData.editor?._nom}
            </p>
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Number pf pages' : 'Nombre de pages'}</p>
            <p >: {bookData.nbpages}</p>
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Publish date' : 'Date de parution'}</p>
            <p >
              : {bookData.dc_parution?.substring(0, 10)}
            </p>
          </div>
          <div className={classes.resume_content}>
          <p >{language === 'eng' ? 'Resume' : 'Résumé'}</p>
          <p>
            : {truncateText(stripHtmlTags(bookData.descriptif), 500)}
          </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
