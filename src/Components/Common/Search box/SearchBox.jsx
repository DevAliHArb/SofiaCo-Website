import React, { useContext, useEffect, useState } from "react";
import classes from "./SearchBox.module.css";
import { ToastContainer, toast } from "react-toastify";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AuthContext from "../authContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSearchData, addSelectedBook, deleteSelectedBook, editSearchData } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/bookPlaceholder.png";

const { Search } = Input;

function SearchBox() {
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = "https://api.leonardo-service.com/api/bookshop/articles?";
      // Adjust search query parameters based on the selected option
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
      }
      const response = await axios.get(url);
      // Update the state with fetched articles
      setArticles(response.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch();
    }
  }, [searchQuery, selectedOption]);

  const handleSearchSubmit = () => {
    localStorage.removeItem('category'); 
    dispatch(editSearchData({ ...searchData[0], title: searchQuery }));
    navigate("/books"); 
    if (window.location.pathname === '/books') {
      window.location.reload();
    }
    setSearchQuery('');
  };

  return (
    <>
      <div className={classes.custom_select}>
        <Input
          type="text"
          placeholder={
            selectedOption === "Book"
              ? language === "eng"
                ? "Search..."
                : ""
              : language === "eng"
              ? `Find your ${selectedOption.toLowerCase()} books here...`
              : `Trouvez vos livres ${selectedOption.toLowerCase()} ici...`
          }
          value={searchQuery}
          className={classes.input}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
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
                    <div className={classes.dropdown_card_img}>
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
                      <h3>{article.designation}</h3>
                      <p>{article.prixpublic}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBox;
