import React, { useContext, useEffect, useState } from "react";
import classes from "./SearchBox.module.css";
import { ToastContainer, toast } from "react-toastify";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AuthContext from "../authContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSearchData, addSelectedBook, deleteSelectedBook, editSearchData, resetSearchData } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/bookPlaceholder.png";
import { stripHtmlTags, truncateText } from "../TextUtils";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";

const { Search } = Input;

function SearchBox() {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const [selectedOption, setSelectedOption] = useState("Book"); // Default selected option
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [level3Categories, setLevel3Categories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const [catsearchQuery, setCatSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchData = useSelector((state) => state.products.searchData);

  const handleSearchInputChange = (e) => {
    setCatSearchQuery(e.target.value);
  };

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) { // Ensure minimum query length
        setLoading(true);
        const fetchArticles = async () => {
          try {
            let url = `${import.meta.env.VITE_TESTING_API}/articles?ecom_type=sofiaco&`;
            if (selectedOption === "Book") {
              url += `title=${searchQuery}`;
            } else if (selectedOption === "Author") {
              url += `author=${searchQuery}`;
            } else if (selectedOption === "Illustrator" || selectedOption === "Translator") {
              url += `traducteur=${searchQuery}`;
            } else if (selectedOption === "Editor") {
              url += `editor=${searchQuery}`;
            } else if (selectedOption === "Collection") {
              url += `collection=${searchQuery}`;
            } else if (selectedOption === "EAN") {
              url += `_code_barre=${searchQuery}`;
            } else if (selectedOption === "Resume") {
              url += `descriptif=${searchQuery}`;
            }
            const response = await axios.get(url);
            setArticles(response.data.data);
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
    } else if (selectedOption === "Illustrator" || selectedOption === "Translator") {
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

  return (
    <div style={{position:'relative'}}>
      <div className={classes.custom_select}>
        <FormControl
          sx={{ color: "var(--primary-color)", width: 120 }}
          variant="standard"
          style={{
            borderRadius: "5px",
            background: "var(--primary-color)",
            // borderRight:'1px solid var(--primary-color)',
            padding: "0.2em 1% 0% 1%",
            marginLeft: "0",
            textAlign: "center",
            textDecoration: "none",
            outline: "none",
            margin:'0.2em'
          }}
        >
          <Select
            disableUnderline
            displayEmpty
            className={classes.focus}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            sx={{
              fontSize: "calc(0.7rem + 0.3vw)",
              color: "#fff",
              "& svg": {
                // color: '#fff',
                color: "#fff !important", // Change the color of the arrow
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search..."
                value={searchQuery}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <i
                        className="fas fa-search"
                        style={{ color: "#fff" }}
                      ></i>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          >
            <MenuItem value="Book">
              {language === "eng" ? "Books" : "Livres"}
            </MenuItem>
            <MenuItem value="Collection">
              {language === "eng" ? "Collections" : "Collections"}
            </MenuItem>
            <MenuItem value="Author">
              {language === "eng" ? "Authors" : "Auteurs"}
            </MenuItem>
            <MenuItem value="Editor">
              {language === "eng" ? "Editors" : "Editeurs"}
            </MenuItem>
            <MenuItem value="Illustrator">
              {language === "eng" ? "Illustrators" : "Illustrateurs"}
            </MenuItem>
            <MenuItem value="Translator">
              {language === "eng" ? "Translators" : "Traducteurs"}
            </MenuItem>
            <MenuItem value="EAN">{language === 'eng' ? "EAN" : "EAN"}</MenuItem>
            <MenuItem value="Resume">{language === 'eng' ? "Resume" : "Resume"}</MenuItem>
          </Select>
        </FormControl>
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
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          prefix={<SearchOutlined  className={classes.customIcon}/>}
        />
        {articles.length > 0 && searchQuery.length > 1 && (
          <div className={classes.dropdown1}>
            {loading ? (
              <div style={{ padding: '2em', textAlign: 'center' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {articles.map((article, index) => (
                  <div
                    key={index}
                    className={classes.dropdown_card}
                    onClick={() => {
                      authCtx.setbookDetails(article);
                      dispatch(deleteSelectedBook(article.id));
                      dispatch(addSelectedBook(article));
                      setSearchQuery('');
                      navigate(`/bookdetails/${article.id}`);
                    }}
                  >
                    <div className={classes.dropdown_card_img} style={{position:"relative"}}>
            {article?._qte_a_terme_calcule < 1 && <div onClick={(e)=>e.stopPropagation()} className={classes.out_of_stock}>
                        <p>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>
                      </div>}
                      {article.articleimage[0] ? (
                        <img
                          src={`${article.articleimage[0]?.link}`}
                          alt=""
                          width="100%"
                          height="100%"
                          className={classes.img}
                        />
                      ) : (
                        <img src={img} className={classes.img} alt="" width="100%" height="100%" />
                      )}
                    </div>
                    <div className={classes.dropdown_card_content}>
                    <h3 style={{margin:'0'}}>{article.designation}</h3>
                      <p style={{ margin: ".5em 0" }}>{truncateText(stripHtmlTags(article.descriptif), 200)}</p>
                      {article._qte_a_terme_calcule < 1 && <p style={{ color: "red", fontSize: "calc(0.8rem + 0.2vw)",fontWeight: 600 }}>{language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}</p>}
                      <p
                        style={{
                          color: "var(--primary-color)",
                          fontWeight: 600,
                          fontSize: " calc(0.8rem + 0.3vw)",margin:"0"
                        }}
                      >
                        {currency === "eur"
                            ? `${
                              article.remise_catalogue > 0
                                  ? (
                                    article._prix_public_ttc -
                                    article._prix_public_ttc * (article.remise_catalogue / 100)
                                    ).toFixed(2)
                                  : Number(article._prix_public_ttc).toFixed(2)
                              } €`
                            : `${
                              article.remise_catalogue > 0
                                  ? (
                                      (article._prix_public_ttc -
                                        article._prix_public_ttc *
                                          (article.remise_catalogue / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    article._prix_public_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              } $`}  {" "}                   
                     {article.remise_catalogue > 0 && <span style={{opacity: "0.8",textDecoration:'line-through'}} >
                      {currency === "eur" ? `${Number(article._prix_public_ttc).toFixed(2)} € `: `${(article._prix_public_ttc * authCtx.currencyRate ).toFixed(2)} $ `}</span>} 
                      </p>
                       {selectedOption === "Editor" && (
                        <p style={{ color: "red", marginTop:'0.2em' }}>{article.editor?._nom}</p>
                      )}
                      {selectedOption === "Collection" && (
                        <p style={{ color: "red", marginTop:'0.2em' }}>{article.dc_collection}</p>
                      )}
                      {selectedOption === 'EAN' && <p style={{color:'red', marginTop:'0.2em'}}>{article._code_barre}</p>}
                      {selectedOption === 'Resume' && <p style={{color:'red', marginTop:'0.2em'}}>{truncateText(stripHtmlTags(article?.descriptif), 100)}</p>}
                      {selectedOption === "Illustrator" && (
                        <p style={{ color: "red", marginTop:'0.2em' }}>{article.dc_traducteur}</p>
                      )}
                      {selectedOption === "Translator" && (
                        <p style={{ color: "red", marginTop:'0.2em' }}>{article.dc_traducteur}</p>
                      )}
                      {selectedOption === "Author" && (
                        <p style={{ color: "red", marginTop:'0.2em' }}>{article.dc_auteur}</p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBox;
