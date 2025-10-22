import React, { useContext, useEffect, useState } from "react";
import classes from "./SearchBox.module.css";
import { ToastContainer, toast } from "react-toastify";
import { Divider, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addSearchData,
  addSelectedBook,
  deleteSelectedBook,
  editSearchData,
  resetSearchData,
} from "../../redux/productSlice";
import { useNavigate } from "react-router-dom";
import img from "../../../../assets/bookPlaceholder.png";
import {
  FormControl,
  MenuItem,
  Rating,
  Select,
  TextField,
} from "@mui/material";
import { IoClose, IoHeart, IoHeartOutline } from "react-icons/io5";
import { BsBagPlus } from "react-icons/bs";
import AuthContext from "../../authContext";
import { stripHtmlTags, truncateText } from "../../TextUtils";

const { Search } = Input;

function SearchBox(ParentProps) {
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const currency = useSelector(
    (state) => state.products.selectedCurrency[0].currency
  );
    const user = useSelector((state) => state.products.userInfo);
  const [selectedOption, setSelectedOption] = useState("Book"); // Default selected option
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [level3Categories, setLevel3Categories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bookData, setBookData] = useState({});
  const authCtx = useContext(AuthContext);
  const [catsearchQuery, setCatSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorite, setfavorite] = useState(true);
  const favoriteData = useSelector((state) => state.products.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchData = useSelector((state) => state.products.searchData);

  const handleSearchInputChange = (e) => {
    setCatSearchQuery(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        // Ensure minimum query length
        setLoading(true);
        const fetchArticles = async () => {
          try {
            const SelectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
            let articleFamilleIdParam = '';
            if (SelectedCategoryId && SelectedCategoryId !== 'null') {
              articleFamilleIdParam = `&articlefamilleparent_id=${SelectedCategoryId}`;
            }
            let url = `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&${articleFamilleIdParam}`;

            url += `smart_search=${searchQuery}`;
            const response = await axios.get(url);
            setArticles(response.data.data);
            setBookData(response.data?.data[0]);
          } catch (error) {
            // toast.error(`${language === 'eng' ? "Failed to fetch articles." : "Échec de la recherche d'articles."}`);
          } finally {
            setLoading(false);
          }
        };
        fetchArticles();
      }
    }, 500); // 1 second delay

    return () => clearTimeout(timer); // Cleanup on component unmount or when searchQuery changes
  }, [searchQuery, selectedOption, language]);

  const handleSearchSubmit = () => {
    localStorage.removeItem("category");
    localStorage.removeItem("collection");
    localStorage.removeItem("date");
    dispatch(resetSearchData());

    // Initialize the search object
    let search = {};

    // Dynamically set the search key based on the selected option
    if (selectedOption === "Book") {
      search = { title: searchQuery };
    } else if (selectedOption === "Author") {
      search = { author: searchQuery };
    } else if (
      selectedOption === "Illustrator" ||
      selectedOption === "Translator"
    ) {
      search = { traducteur: searchQuery };
    } else if (selectedOption === "Editor") {
      search = { editor: searchQuery };
    } else if (selectedOption === "Collection") {
      search = { collection: searchQuery };
    } else if (selectedOption === "EAN") {
      search = { ean: searchQuery };
    } else if (selectedOption === "Resume") {
      search = { resume: searchQuery };
    }

    // Dispatch the search data, combining with existing search data if necessary
    dispatch(editSearchData({ ...search }));

    // If the current path is /products, reload the page, otherwise navigate
    if (window.location.pathname === "/books") {
      window.location.reload(); // Reload if already on /products
    } else {
      navigate("/books"); // Navigate to /products if not already there
    }

    // Clear the search query
    setSearchQuery("");
  };

  const [count, setCount] = React.useState(1);

  const handleCountChange = (event) => {
    const value = parseInt(event.target.value, 10);

    // Only set the count if the value is greater than zero
    if (value > Number(bookData?._qte_a_terme_calcule)) {
      // Reset to minimum if the user tries to input a negative or zero value
      setCount(Number(bookData?._qte_a_terme_calcule).toFixed(0));
    } else if (value > 0) {
      setCount(value);
    } else {
      // Reset to minimum if the user tries to input a negative or zero value
      setCount(1);
    }
  };

  useEffect(() => {
    {
      favoriteData?.some((book) => book?._favid === bookData?.id)
        ? setfavorite(true)
        : setfavorite(false);
    }
  }, [bookData]);

  const FavoriteClick = () => {
    if (user) {
      if (favorite) {
        authCtx.deleteFavorite(bookData?.id);
      } else {
        authCtx.addToFavorite(bookData);
      }
      setfavorite(!favorite);
    } else {
      toast.error(
        `${
          language === "eng"
            ? `Please log in to add favorites.`
            : "Veuillez vous connecter pour ajouter des favoris."
        }`,
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        }
      );
    }
  };
  const remise = authCtx.remise
    ? bookData?.remise_catalogue
    : bookData?.discount || 0;
  return (
    <div
      style={{
        margin: "auto 0",
        width: "100%",
        display: "flex",
        alignItems: "center",
        columnGap: "1em",
        justifyContent: "center",
        zIndex: '1000',
      }}
    >
      <div className={classes.custom_select}>
        <Input
          type="text"
          placeholder={
            selectedOption === "Book"
              ? language === "eng"
                ? "Search..."
                : "Recherche..."
              : language === "eng"
              ? `Find your ${selectedOption.toLowerCase()} books here...`
              : `Trouvez vos livres ${selectedOption.toLowerCase()} ici...`
          }
          value={searchQuery}
          className={classes.input}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
          suffix={<div style={{display:'flex', flexDirection:'row', columnGap:'0.5em'}}><IoClose onClick={() => ParentProps.setIsSearchBar(false)} className={classes.close_mob} /><SearchOutlined className={classes.customIcon} /></div>}
        />
        { searchQuery.length > 1 && (
          <div className={classes.dropdown1}>
            {loading ? (
              <div style={{ padding: "2em", textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div className={classes.dropdown_data}>
                <div className={classes.list}>
                  <p className={classes.result}>{language === "eng" ? "Results for" : "Résultats pour"} "{searchQuery}" ({articles?.length})</p>
                  {articles.map((article, index) => {
                    const remise = authCtx.remise
                      ? article.remise_catalogue
                      : article.discount || 0;
                    const lastindex = articles?.length - 1;
                    return (
                      <div
                        key={index}
                        className={classes.dropdown_card}
                        onMouseEnter={() => setBookData(article)}
                        style={{
                          marginBottom: lastindex && "1em",
                          // boxShadow:
                          //   bookData?.id === article?.id &&
                          //   "0px 16px 16px 0px rgba(0,0,0,0.2)",
                        }}
                        onClick={() => {
                          authCtx.setbookDetails(article);
                          dispatch(deleteSelectedBook(article.id));
                          dispatch(addSelectedBook(article));
                          setSearchQuery("");
                          navigate(`/bookdetails/${article.id}`);
                        }}
                      >
                        <div
                          className={classes.dropdown_card_img}
                          style={{ position: "relative" }}
                        >
                          {article?._qte_a_terme_calcule < 1 && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={classes.out_of_stock}
                            >
                              <p style={{fontSize:'small'}}>
                                {language === "eng" ? "sold out" : "Épuisé"}
                              </p>
                            </div>
                          )}
                          {article.articleimage[0] ? (
                            <img
                              src={`${article.articleimage[0]?.link}`}
                              alt=""
                              width="100%"
                              height="100%"
                              className={classes.img}
                            />
                          ) : (
                            <img
                              src={img}
                              className={classes.img}
                              alt=""
                              width="100%"
                              height="100%"
                            />
                          )}
                        </div>
                        <div className={classes.dropdown_card_content}>
                          
                  <h1
                    className={classes.header_small}
                  >
                    {article.designation}
                  </h1>
                  <p style={{ margin: ".0em 0 .3em 0", fontSize: "small" }}>
                    {language === "eng" ? "by" : "par"}{" "}
                    <span
                      style={{ fontWeight: "600", textTransform: "capitalize" }}
                    >
                      {" "}
                      {truncateText(stripHtmlTags(article.dc_auteur), 500)}
                    </span>
                  </p>

                  <p
                    style={{
                      color: "var(--dark-color)",
                      fontSize: "large",
                      margin: "0 0",
                      paddingRight: "0.5em",
                      fontWeight: "700",
                    }}
                  >
                    {currency === "eur"
                      ? `${
                          remise > 0
                            ? (
                                article._prix_public_ttc -
                                article._prix_public_ttc * (remise / 100)
                              ).toFixed(2)
                            : Number(article._prix_public_ttc).toFixed(2)
                        } €`
                      : `${
                          remise > 0
                            ? (
                                (article._prix_public_ttc -
                                  article._prix_public_ttc * (remise / 100)) *
                                authCtx.currencyRate
                              ).toFixed(2)
                            : (
                                article._prix_public_ttc * authCtx.currencyRate
                              ).toFixed(2)
                        } $`}{" "}
                    {remise > 0 && (
                      <span
                        style={{
                          opacity: "0.8",
                          textDecoration: "line-through",
                          fontSize: "medium",
                          color: "#A3A3A3",
                        }}
                      >
                        {currency === "eur"
                          ? `${Number(article._prix_public_ttc).toFixed(2)} € `
                          : `${(
                              article._prix_public_ttc * authCtx.currencyRate
                            ).toFixed(2)} $ `}
                      </span>
                    )}
                    {remise > 0 && (
                      <span
                        style={{
                          background: "#fff",
                          color: "var(--dark-color)",
                          padding: "0.2em 0.5em",
                          fontSize: "calc(.7rem + 0.3vw)",
                          borderRadius: "5px",
                          marginLeft: "0.5em",
                        }}
                      >
                        {remise}% Off
                      </span>
                    )}
                  </p>

                  <div
                    className={classes.rate}
                    style={{
                      maxWidth: "100%",
                      width: "fit-content",
                      margin: ".2em 0 0.5em 0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      alignItems:"center", color: "#FF9017"
                    }}
                  >
                    <Rating
                      value={article.average_rate}
                      precision={0.1} // Allows half-star ratings
                      readOnly // Prevents user interactions if needed
                      style={{
                        fontSize: "1.5em",
                        color: "#FF9017",
                        margin: "auto 0.2em auto 0",
                      }}
                    />
                      {bookData?.average_rate}/5 ({bookData?.bookreview?.length} {language === 'eng' ? "reviews" : "revues"})
                      <span
                        style={{
                          margin: "auto auto auto 0.5em",
                          color:
                            article._qte_a_terme_calcule > 0
                              ? "var(--green-color)"
                              : "var(--red-color)",
                          fontWeight: "600",
                        }}
                      >
                        {article._qte_a_terme_calcule > 0
                          ? `${language === "eng" ? "In Stock" : "En Stock"}`
                          : `${
                              language === "eng" ? "Sold Out" : "Épuisé"
                            }`}{" "}
                      </span>
                  </div>
                  <p className={classes.desc}>
                    {truncateText(stripHtmlTags(article.descriptif), 500)}
                  </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {bookData && <div className={classes.contantContainer}>
                  <div className={classes.detail_img}>
                    {bookData?._qte_a_terme_calcule < 1 && (
                      <div
                        style={{ cursor: "pointer" }}
                        className={classes.out_of_stock}
                      >
                        <p>{language === "eng" ? "sold out" : "Épuisé"}</p>
                      </div>
                    )}
                    <img
                      src={bookData && bookData.articleimage &&
                        bookData?.articleimage[0]
                          ? bookData?.articleimage[0]?.link
                          : img
                      }
                      alt=""
                    />
                  </div>
                  <h1
                    className={classes.header}
                    onClick={() => console.log(bookData)}
                  >
                    {bookData?.designation}
                  </h1>
                  <p style={{ margin: ".0em 0 .3em 0", fontSize: "medium" }}>
                    {language === "eng" ? "by" : "par"}{" "}
                    <span
                      style={{ fontWeight: "600", textTransform: "capitalize" }}
                    >
                      {" "}
                      {truncateText(stripHtmlTags(bookData?.dc_auteur), 500)}
                    </span>
                  </p>

                  <p
                    style={{
                      color: "var(--dark-color)",
                      fontSize: "calc(1.3rem + 0.4vw)",
                      margin: "0 0",
                      paddingRight: "0.5em",
                      fontWeight: "700",
                    }}
                  >
                    {currency === "eur"
                      ? `${
                          remise > 0
                            ? (
                                bookData?._prix_public_ttc -
                                bookData?._prix_public_ttc * (remise / 100)
                              ).toFixed(2)
                            : Number(bookData?._prix_public_ttc).toFixed(2)
                        } €`
                      : `${
                          remise > 0
                            ? (
                                (bookData?._prix_public_ttc -
                                  bookData?._prix_public_ttc * (remise / 100)) *
                                authCtx.currencyRate
                              ).toFixed(2)
                            : (
                                bookData?._prix_public_ttc * authCtx.currencyRate
                              ).toFixed(2)
                        } $`}{" "}
                    {remise > 0 && (
                      <span
                        style={{
                          opacity: "0.8",
                          textDecoration: "line-through",
                          fontSize: "medium",
                          color: "#A3A3A3",
                        }}
                      >
                        {currency === "eur"
                          ? `${Number(bookData?._prix_public_ttc).toFixed(2)} € `
                          : `${(
                              bookData?._prix_public_ttc * authCtx.currencyRate
                            ).toFixed(2)} $ `}
                      </span>
                    )}
                    {remise > 0 && (
                      <span
                        style={{
                          background: "#fff",
                          color: "var(--dark-color)",
                          padding: "0.2em 0.5em",
                          fontSize: "calc(.7rem + 0.3vw)",
                          borderRadius: "5px",
                          marginLeft: "0.5em",
                        }}
                      >
                        {remise}% Off
                      </span>
                    )}
                  </p>

                  <div
                    className={classes.rate}
                    style={{
                      maxWidth: "100%",
                      width: "fit-content",
                      margin: ".2em 0 0.5em 0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      value={bookData.average_rate}
                      precision={0.1} // Allows half-star ratings
                      readOnly // Prevents user interactions if needed
                      style={{
                        fontSize: "1.5em",
                        color: "#FF9017",
                        margin: "auto 0.2em auto 0",
                      }}
                    />
                      {bookData?.average_rate}/5 ({bookData?.bookreview?.length} {language === 'eng' ? "reviews" : "revues"})
                      <span
                        style={{
                          margin: "auto auto auto 0.5em",
                          color:
                            bookData._qte_a_terme_calcule > 0
                              ? "var(--green-color)"
                              : "var(--red-color)",
                          fontWeight: "600",
                        }}
                      >
                        {bookData._qte_a_terme_calcule > 0
                            ? `${language === "eng" ? "In Stock" : "En Stock"}`
                          : `${
                              language === "eng" ? "Sold Out" : "Épuisé"
                            }`}{" "}
                      </span>
                  </div>
                  <p className={classes.desc}>
                    {truncateText(stripHtmlTags(bookData?.descriptif), 500)}
                  </p>
                  <div className={classes.bottonsContainer}>
                    <button
                      className={classes.add_to_cart}
                      disabled={
                        bookData?._qte_a_terme_calcule > 0 ? false : true
                      }
                      style={{
                        cursor:
                          bookData?._qte_a_terme_calcule > 0
                            ? "pointer"
                            : "not-allowed",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        authCtx.addToCartWithQty({
                          ...bookData,
                          quantity: count,
                        });
                      }}
                    >
                      <BsBagPlus className={classes.add_to_cart_icon} />{" "}
                      {language === "eng" ? "Add to cart" : "Ajouter Au Panier"}
                    </button>
                    <div
                      className={classes.favoriteBtn}
                      onClick={FavoriteClick}
                    >
                      {favorite ? (
                        <IoHeart
                          style={{ fontSize: "1.8em", margin: "auto" }}
                        />
                      ) : (
                        <IoHeartOutline
                          style={{ fontSize: "1.8em", margin: "auto" }}
                        />
                      )}
                    </div>
                  </div>
                </div>}
              </div>
            )}
          </div>
        )}
      </div>
      <p
        className={classes.close_web}
        onClick={() => ParentProps.setIsSearchBar(false)}
      >
        <IoClose style={{ margin: "auto" }} /> {language === "eng" ? "Cancel" : "Annuler"}
      </p>
    </div>
  );
}

export default SearchBox;
