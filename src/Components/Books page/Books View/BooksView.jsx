import React, { useContext, useEffect, useState, useRef } from "react";
import BooksList from "./Books List/BooksList";
import classes from "./BooksView.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, TextField } from "@mui/material";
import Slider from '@mui/material-next/Slider';
import { useLocation, useParams } from "react-router-dom";
import ScrollToTop from "../../Common/ScrollToTop";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Rating from "@mui/material/Rating";import { IoMdClose } from "react-icons/io";


import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSearchData, editSearchData, resetSearchData } from "../../Common/redux/productSlice";
import AuthContext from "../../Common/authContext";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';


const BooksView = ({carttoggle}) => {
  const [value, setValue] = useState([0, 100]);
  const location = useLocation();
  const { id: subcatageoryId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [rate, setrate] = useState(0);
  const searchData = useSelector((state) => state.products.searchData);
  const user = useSelector((state) => state.products.userInfo);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const [selectedPrice, setSelectedPrice] = useState([
    searchData[0]?.min_price ? searchData[0]?.min_price : 0,
    searchData[0]?.max_price ? searchData[0]?.max_price : 9999,
  ]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const authCtx = useContext(AuthContext);
  const [catChemin, setCatChemin] = useState("");
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedRate, setSelectedRate] = useState(0);
  const [changepricetoggle, setchangePricetoggle] = useState(false);
  const [parentCategoriesOpen, setparentCategoriesOpen] = useState(true);
  const [subCategoriesOpen, setsubCategoriesOpen] = useState(true);
  const [themesOpen, setthemesOpen] = useState(false);
  const [publishinghouseOpen, setpublishinghouseOpen] = useState(false);
  const [collectionsOpen, setcollectionsOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [totalArticlesNumber, setTotalArticlesNumber] = useState(null);
  const [inStock, setinStock] = useState(localStorage.getItem("stock") || null);
  const [isdiscount, setisdiscount] = useState(localStorage.getItem("discount") || []);
  
  const [selectedFilters, setSelectedFilters] = useState({
    rate: [],
    size: [],
    hair_type: [],
    gender: [],
    formula: [],
    style: [],
    material: [],
    furniture_style: [],
    furniture_material: [],
    skin_type: [],
    skin_tone: [],
    texture: [],
    diet: [],
    allergens: [],
    age: [],
    flavor: []
  });
  const [filterValues, setfilterValues] = useState([]);
  // Search inputs for dropdowns (drawer & main)
  const [parentCategorySearch, setParentCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [themeSearch, setThemeSearch] = useState("");
  const [publisherSearch, setPublisherSearch] = useState("");
  const [collectionSearch, setCollectionSearch] = useState("");
  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  // Per-dynamic-filter searches
  const [dynamicFilterSearches, setDynamicFilterSearches] = useState({});
  // Loading flags for debounced searches
  const [searchLoading, setSearchLoading] = useState({});
  const searchTimeouts = useRef({});

  // Helper: case-insensitive contains
  const contains = (text = "", q = "") =>
    text?.toString().toLowerCase().includes(q.trim().toLowerCase());

   const filterTreeByQuery = (nodes, query) => {
    if (!query || query.trim() === "") return nodes;
    const q = query.trim().toLowerCase();
    const filterNode = (node) => {
      const nameMatch = contains(node._nom, q) || contains(node._nom_fr, q) || contains(node.nom, q);
      let children = [];
      if (Array.isArray(node.children) && node.children.length > 0) {
        children = node.children.map(filterNode).filter(Boolean);
      }
      if (nameMatch || children.length > 0) {
        return { ...node, children: children.length > 0 ? children : node.children };
      }
      return null;
    };
    return nodes.map(filterNode).filter(Boolean);
  };

  // Debounced setter helper
  const handleDebouncedSearch = (key, value, setter, delay = 0) => {
    setSearchLoading((s) => ({ ...s, [key]: true }));
    if (searchTimeouts.current[key]) clearTimeout(searchTimeouts.current[key]);
    searchTimeouts.current[key] = setTimeout(() => {
      setter(value);
      setSearchLoading((s) => ({ ...s, [key]: false }));
      delete searchTimeouts.current[key];
    }, delay);
  };
  const [expanded, setExpanded] = useState({
    categories: false,
    editor: false,
    ratings: false,
    prix: false,
    stock: false,
    age: true,
    size: true,
    gender: true,
    hair_type: true,
    formula: true,
    style: true,
    material: true,
    furniture_style: true,
    furniture_material: true,
    skin_type: true,
    skin_tone: true,
    texture: true,
    diet: true,
    allergens: true,
    flavor: true
});
  
  const selectedCategoryId = useSelector((state) => state.products.selectedCategoryId);
    React.useEffect(() => {
              setfilterValues([]);
              setArticles([]);
              FetchFilters();
              fetchArticles();
      }, [selectedCategoryId, authCtx.articleFamilleParents]); 
  
    useEffect(() => {
      fetchArticles();
    }, []);

// Listen for changes to localStorage in other tabs or windows

  
  const FetchFilters = async () => {
    try {
      const storedParentCategories = JSON.parse(localStorage.getItem("parentCategories")) || [];
      
      let url = `${import.meta.env.VITE_TESTING_API}/multi-product-values?`;
      
      // If selectedCategoryId is null or undefined, use storedParentCategories
      if (selectedCategoryId === null || selectedCategoryId === undefined || selectedCategoryId === 'null') {
        if (storedParentCategories.length > 0) {
          const categoryParams = storedParentCategories
            .map(id => `category_parent_id[]=${id}`)
            .join('&');
          url += categoryParams;
        } else {
        const categoryParams = authCtx.articleFamilleParents
            .map(item => `category_parent_id[]=${item.id}`)
            .join('&');
          url += categoryParams;
        }
      } else {
        url += `category_parent_id[]=${selectedCategoryId}`;
      }
      
      const response = await axios.get(url);
      const filtersValue = response.data.filter(item => item.values && item.values.length > 0); 
      setfilterValues(filtersValue)
      // console.log('filtersValue',filtersValue);
    } catch (error) {
      console.error("Error fetching filters value:", error);
    }
}

  useEffect(() => {
    FetchFilters()
  },[])

  const handleMultiProductsChange = (value) => {
    const newSelectedMultiproduct = value;

    // Retrieve and parse stored multiproducts (ensure it's an array)
    let storedmultiproducts = JSON.parse(localStorage.getItem("multiproductids")) || [];

    if (storedmultiproducts.includes(newSelectedMultiproduct)) {
      // If already selected, remove it
      storedmultiproducts = storedmultiproducts.filter(
        (col) => col !== newSelectedMultiproduct
      );
    } else {
      // Otherwise, add the new multiproduct
      storedmultiproducts.push(newSelectedMultiproduct);
    }

    // Update localStorage with the new multiproducts array
    localStorage.setItem("multiproductids", JSON.stringify(storedmultiproducts));

    // Dispatch action to update search data

    setArticles([]); // Reset articles
  };

  
  // Retrieve stored collections as an array
  const selectedMultiproducts =
    JSON.parse(localStorage.getItem("multiproductids")) || [];

  // Function to check if a collection is selected
  const isMultiproductSelected = (multiproductId) => {
    return selectedMultiproducts.includes(multiproductId);
  };
  

  const toggleDropdown = (dropdown) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [dropdown]: !prevExpanded[dropdown],
    }));
  };


  const changechemin = async () => {
    const storedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];

    if (storedCategories.length > 0) {
      try {
        // Fetch category paths for all selected categories
        const responses = await Promise.all(
          storedCategories.map((categoryId) =>
            axios.get(
              `${import.meta.env.VITE_TESTING_API}/categories/${categoryId}`
            )
          )
        );

        // Extract paths from the responses
        const categoryPaths = responses.map(
          (response) => response.data.data.chemin
        );

        // Update the state with the category paths
        setCatChemin(categoryPaths.join("; ")); // Adjust how you display multiple paths
      } catch (error) {
        console.error("Error fetching category paths:", error);
        // Handle error appropriately
      }
    } else {
      setCatChemin(""); // Reset if no category is selected
    }
  };

  function TreeNode({ data, level, fetchArticles, color }) {
    const [isExpanded, setIsExpanded] = useState(
      localStorage.getItem(`isExpanded_${data.id}`) === 'true' // Retrieve isExpanded from localStorage
    );
    const dispatch = useDispatch();
  
    useEffect(() => {
      localStorage.setItem(`isExpanded_${data.id}`, isExpanded); // Save isExpanded to localStorage
    }, [data.id, isExpanded]);


    const handleChildClick = async (id, event) => {
      event.stopPropagation();
      setIsOpen(false);

      // Retrieve the existing categories from localStorage (or initialize an empty array)
      let storedCategories =
        JSON.parse(localStorage.getItem("categories")) || [];

      if (storedCategories.includes(id)) {
        // If the clicked category is already selected, remove it
        storedCategories = storedCategories.filter((catId) => catId !== id);
      } else {
        // Otherwise, add the new category
        storedCategories.push(id);
      }

      // Update localStorage
      localStorage.setItem("categories", JSON.stringify(storedCategories));

      // Dispatch action to update search data with the updated category list
      dispatch(addSearchData({ category: storedCategories }));

      setIsExpanded(!isExpanded);
      setArticles([]); // Clear previous articles
      // fetchArticles(selectedDate, 1);
      changechemin();
    };

    const toggleNode = () => {
      if (data.children) {
        setIsExpanded(!isExpanded);
      }
    };

    let fontWeight;
    let fontSize;
    if (level === 0) {
      fontWeight = "600"; // Parent node
      fontSize = "calc(0.7rem + 0.4vw)";
    } else if (level === 1) {
      fontWeight = "600"; // Subparent node
      fontSize = "calc(0.6rem + 0.4vw)";
    } else {
      fontWeight = "600"; // Child node
      fontSize = "calc(0.5rem + 0.3vw)";
    }
    
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    return (
      <div
        style={{
          paddingLeft: `${level * 0.5}em`,
          margin: "0.5em 0",
        }}
      >
        <div
        
          style={{
            color: isExpanded ? "var(--primary-color)" : color,
            fontSize: `calc(1rem - ${level * 0.06}vw)`,
            display: 'flex',
            flexDirection: "row",
          }}
        >
          {Array.isArray(data.children) && data.children.length > 0 && (
            <KeyboardArrowRightOutlinedIcon
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', margin: "auto 0" }}
              onClick={toggleNode}
              className={classes.listBox}
            />
          )}
          <input
            type="checkbox"
            checked={storedCategories.includes(data.id)}
            className={classes.checkbox}
            style={{
              marginRight: "5px",
              width: "1.3em",
              height: "1.3em",
              marginLeft: Array.isArray(data.children) && data.children.length > 0 && data.niveau !== 4 ? "3px" : "1.6em",
            }}
            onClick={(event) => handleChildClick(data.id, event)}
          />          <p
            style={{ 
              margin: "auto 0", 
              width:'100%',
              display: "flex", 
              cursor: "pointer",
              background: "transparent",
            }}
            onClick={(event) => handleChildClick(data.id, event)}
          >
            {data._nom}
          </p>
        </div>
        {isExpanded && Array.isArray(data.children) && data.children.length > 0 && (
          <div>
            {data.children.map((child, index) => (
              <TreeNode
                key={child.id || index}
                data={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
 
  
  // Dynamically create arrays for each collaborator type
  const collaboratorsByType = React.useMemo(() => {
    if (!authCtx.collaboratorsTypes || !authCtx.collaborators) return {};
    
    return authCtx.collaboratorsTypes.reduce((acc, type) => {
      acc[type?.name_fr] = authCtx.collaborators.filter(
        (collaborator) => collaborator.type?.name_fr === type?.name_fr
      );
      return acc;
    }, {});
  }, [authCtx.collaboratorsTypes, authCtx.collaborators]);

  const initialState = React.useMemo(() => {
    if (!authCtx.collaboratorsTypes) return {};
    
    return authCtx.collaboratorsTypes.reduce((acc, type) => {
      const typeKey = type?.name_fr.toLowerCase().replace(/\s+/g, '_');
      acc[typeKey] = false;
      return acc;
    }, {});
  }, [authCtx.collaboratorsTypes]);

  const getStoredExpansionState = () => {
    const storedState = localStorage.getItem("expandedNodes");
    return storedState ? { ...initialState, ...JSON.parse(storedState) } : initialState;
  };

  const [expandedNodes, setExpandedNodes] = useState({});

  // Update expandedNodes when initialState changes
  React.useEffect(() => {
    setExpandedNodes(getStoredExpansionState());
  }, [authCtx.collaboratorsTypes]);

  useEffect(() => {
    localStorage.setItem("expandedNodes", JSON.stringify(expandedNodes));
  }, [expandedNodes]);

  const handleExpand = (fieldName) => {
    setExpandedNodes((prev) => {
      const newState = {
        ...prev,
        [fieldName]: !prev[fieldName], // Toggle only the selected node
      };
      localStorage.setItem("expandedNodes", JSON.stringify(newState)); // Save immediately
      return newState;
    });
  };

  const CollaboratorTreeNode = React.memo(
    ({
      title,
      collaborators,
      searchQuery,
      fieldName,
      isExpanded,
      setIsExpanded,
      collaboratorSearchValue = "",
    }) => {
      const selectedCollaborators = searchData[0]?.collaborators || [];

      const toggleNode = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        // Save the expanded state to localStorage
        localStorage.setItem(`${title}_isExpanded`, JSON.stringify(newState));
      };

      const handleCollaboratorClick = (collaborator, e) => {
        e.stopPropagation(); // Stop the event from bubbling up to the parent div (which triggers toggleNode)
        searchQuery(collaborator); // Trigger the search query
      };

      const isCollaboratorSelected = (collaboratorNom) => {
        return selectedCollaborators.includes(collaboratorNom);
      };

      // Apply client-side search filter then sort
      const filtered = collaborators.filter((c) =>
        contains(c.nom || c.title || "", collaboratorSearchValue)
      );
      const sortedCollaborators = filtered
        .map((collaborator) => ({
          ...collaborator,
          nom: (collaborator.nom || collaborator.title || "").trim(),
        }))
        .sort((a, b) => a.nom.localeCompare(b.nom));

      return (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={toggleNode}
          >
            <KeyboardArrowRightOutlinedIcon className={classes.collabTreeColor}
              style={{
                transform: isExpanded ? "rotate(90deg)" : "none",
              }}
            />
            <h3 className={classes.collabTreeColor}
              style={{
                marginTop: "0.3em",
                marginBottom: "0.3em",
                fontSize: "calc(0.8rem + 0.3vw)",
                fontWeight: "700",
              }}
            >
              {title}
            </h3>
          </div>

          {isExpanded && (
            <div
              style={{
                maxHeight: "200px",
                height: "fit-content",
                overflowY: "scroll",
                paddingLeft: "2em",
              }}
            >
              {sortedCollaborators.map((collaborator) => {
                const isChecked = isCollaboratorSelected(collaborator.id);

                return (
                  <div
                    key={collaborator.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5em",
                    }}
                    onClick={(e) => handleCollaboratorClick(collaborator, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      className={classes.checkbox}
                      style={{
                        marginRight: "3px",
                        width: "1.3em",
                        height: "1.3em",
                      }}
                    />
                    <p
                      style={{
                        margin: "auto 0 auto 5%",
                        width: "92%",
                        display: "flex",
                        cursor: "pointer",
                      }}
                    >
                      {collaborator.nom}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  );

  const storedCategory = localStorage.getItem("categories");
  const storedCollec = localStorage.getItem("collections");
  const storedmultiproducts = localStorage.getItem("multiproductids");
  const storedPublisher = localStorage.getItem("publishers");
  const storedParentCategories = localStorage.getItem("parentCategories");
  const storedSubCategories = localStorage.getItem("subCategories");
  useEffect(() => {
    changechemin();
  }, [searchData[0]?.category, storedCategory, storedCollec, storedPublisher, storedmultiproducts, storedParentCategories, storedSubCategories]);

  useEffect(() => {
    fetchArticles(null, null, null, 1);
  }, [searchData[0], storedCategory, storedCollec, storedPublisher, storedmultiproducts, storedParentCategories, storedSubCategories]);

  useEffect(() => {
    if (Array.isArray(authCtx.categories)) {
      setCategories(authCtx.categories);
    } else {
      console.error("Data property does not contain an array of categories:", authCtx.categories);
    }
  }, [authCtx.categories]);
  
  useEffect(() => {
    const collection = localStorage.getItem('collection');
    const category = localStorage.getItem('category');
    fetchArticles(selectedRate, collection, category, 1 );
  }, [selectedRate]);

  const fetchArticles = async ( rate, collectionId, id,page) => {
    let CatID = id;
    setLoading(true);
    try {
      // Create a base URL with selectedPrice
      const url = `${import.meta.env.VITE_TESTING_API}/articles`;

      const selectedtitleParam = searchData[0]?.title
        ? `&title=${searchData[0].title}`
        : "";

        const selectedauthorParam = searchData[0]?.author
        ? "&" + searchData[0].author.split("; ").map(value => `author[]=${encodeURIComponent(value)}`).join("&")
        : "";   
  
        const selectededitorParam = searchData[0]?.editor
        ? "&" + searchData[0].editor.split("; ").map(value => `editor[]=${encodeURIComponent(value)}`).join("&")
        : "";

      const selectedtraducteurParam = searchData[0]?.traducteur
      ? "&" + searchData[0].traducteur.split("; ").map(value => `traducteur[]=${encodeURIComponent(value)}`).join("&")
        : "";

        const selectedillustrateurParam = searchData[0]?.illustrateur
        ? "&" + searchData[0].illustrateur.split("; ").map(value => `illustrateur[]=${encodeURIComponent(value)}`).join("&")
        : "";

        
      const selectedbestseller = searchData[0]?.bestseller === true
      ? `&bestseller`
      : "";

        
      const storedminprice = localStorage.getItem("min_price");
      const selectedminPriceParam = storedminprice
        ? `&min_price=${storedminprice}`
        : "";

        const storedmaxprice = localStorage.getItem("max_price");
      const selectedmaxPriceParam = storedmaxprice
        ? `&max_price=${storedmaxprice}`
        : "";

        const Pagenum = page ? `page=${page}`: 'page=1'

      // Get the category from localStorage if available
      const storedCollection =
      JSON.parse(localStorage.getItem("collections")) || [];
    const selectedCollecParam =
      storedCollection.length > 0
        ? `&` +
          storedCollection
            .map((collecId) => `collection[]=${collecId}`)
            .join("&")
        : "";

        // Get the category from localStorage if available
      const storedPublisher =
      JSON.parse(localStorage.getItem("publishers")) || [];
    const selectedPubliParam =
      storedPublisher.length > 0
        ? `&` +
          storedPublisher
            .map((publiId) => `publisher[]=${publiId}`)
            .join("&")
        : "";

    const storedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    const selectedCatParam =
      storedCategories.length > 0
        ? `&` +
          storedCategories.map((catId) => `category[]=${catId}`).join("&")
        : "";

        
        const storedInStock= localStorage.getItem("stock");
        const selectedStockParam = storedInStock
          ? `&in_stock=${storedInStock}`
          : ``;
        
          // const storedInDiscount = localStorage.getItem("discount");
          // const selectedDiscount = storedInDiscount !== null && storedInDiscount !== "null"
          //   ? `&editor_discount=${storedInDiscount}`
          //   : ``;
            
      const storedInDiscount =
      JSON.parse(localStorage.getItem("discount")) || [];
    const selectedDiscount =
    storedInDiscount.length > 0
        ? `&` +
        storedInDiscount
            .map((collecId) => `editor_discount[]=${collecId}`)
            .join("&")
        : "";

          
      const selectedResumeParam = searchData[0]?.resume
      ? `&descriptif=${searchData[0].resume}`
      : "";

    const selectedEANParam = searchData[0]?.ean
      ? `&_code_barre=${searchData[0].ean}`
      : "";


        const storedRate = localStorage.getItem("rate");
        const selectedRateParam = storedRate && storedRate !== 0
        ? `&rate=${storedRate}`
        : ``;

      const UserIdParam = `&user_id=${user?.id ? user.id : null}`;
      

        const selectedCollabParam = searchData[0]?.collaborators
        ? "&" + searchData[0].collaborators.map(value => `collaborator[]=${value}`).join("&")
        : "";

      const selectedCategoryParentParent = selectedCategoryId === 'null' || selectedCategoryId === null
        ? ""
        : `&articlefamilleparent_id=${selectedCategoryId}`;
        
      const storedmultiproducts = 
        JSON.parse(localStorage.getItem("multiproductids")) || [];
     const selectedmultiproductsParam =
        storedmultiproducts.length > 0
          ? `&` +
            storedmultiproducts
              .map((mproductId) => `multiproduct[]=${mproductId}`)
              .join("&")
          : "";
          
      // Check if route is /products/subcategory/:id and get subcategory id
      let selectedsubCategoryParam = "";
      if (location.pathname.startsWith("/products/subcategory/") && subcatageoryId && subcatageoryId !== "null") {
        selectedsubCategoryParam = `&articlefamille_id=${subcatageoryId}`;
      }

      
        // Get the category from localStorage if available
      const storedParentCategories =
      JSON.parse(localStorage.getItem("parentCategories")) || [];
    const selectedParentCategoriesParam =
      storedParentCategories.length > 0
        ? `&` +
          storedParentCategories
            .map((parentCatId) => `articlecategoryparent_id[]=${parentCatId}`)
            .join("&")
        : "";

        
        // Get the category from localStorage if available
      const storedsubCategories =
      JSON.parse(localStorage.getItem("subCategories")) || [];
    const selectedsubCategoriesParam =
      storedsubCategories.length > 0
        ? `&` +
          storedsubCategories
            .map((subCatId) => `articlecategory_id[]=${subCatId}`)
            .join("&")
        : "";

      const selectedSmartData = searchData[0]?.smartdata 
      ? `&smart_search=${searchData[0].smartdata}`
      : "";

    // Get the category from localStorage if available
      // Finalize the URL by combining all parameters
      const finalUrl = `${url}?${Pagenum}${selectedRateParam}${selectedillustrateurParam}${selectedCategoryParentParent}${selectedsubCategoriesParam}${selectedParentCategoriesParam}${selectedCollabParam}${selectedmultiproductsParam}${UserIdParam}${selectedCollecParam}${selectedStockParam}${selectedDiscount}${selectedPubliParam}${selectedEANParam}${selectedResumeParam}${selectedSmartData}${selectedbestseller}${selectedCatParam}${selectededitorParam}${selectedauthorParam}${selectedtraducteurParam}${selectedminPriceParam}${selectedmaxPriceParam}${selectedsubCategoryParam}&ecom_type=sofiaco`;
      // Fetch articles using the finalized URL
      const response = await axios.get(finalUrl);

      // If page > 1 or articles exist, append new data to the current articles
      if (page && page !== 1) {
        setArticles((prevArticles) => [...prevArticles, ...response.data.data]);
      } else {
        // Otherwise, replace the articles
        setArticles(response.data.data);
      }
      // Set the total articles number
      setTotalArticlesNumber(response.data?.total);
    } catch (error) {
      // console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

 const toggle = () => {
   setIsOpen(!isOpen);
 };

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }, [location]);

 
  const handleChange = (event, newValue) => {
    setSelectedPrice(newValue);
  };

  const handleChangeStock = (event) => {
    const newStockValue = event.target.value;
    console.log(newStockValue);
    if (newStockValue) {
      setinStock(newStockValue);
      localStorage.setItem("stock", newStockValue);
    } else {
    setinStock(null);
    localStorage.setItem("stock", null);
    }
    fetchArticles(null, null, null, 1);
  };

  const handleDiscountChange = (event) => {
    const newDiscountValue = event;

    // Retrieve and parse stored collections (ensure it's an array)
    let storedCollec = JSON.parse(localStorage.getItem("discount")) || [];

    if (storedCollec.includes(newDiscountValue)) {
      // If already selected, remove it
      storedCollec = storedCollec.filter(
        (col) => col !== newDiscountValue
      );
    } else {
      // Otherwise, add the new collection
      storedCollec.push(newDiscountValue);
    }
    setisdiscount(storedCollec)
    localStorage.setItem("discount", JSON.stringify(storedCollec));
    fetchArticles(null, null, null, 1);
  };

  const handleMinChange = (event) => {
    const newValue = event.target.value;
    const updatedValue = [...selectedPrice];
  
    // Ensure the value is a valid number and not empty
    if (!isNaN(newValue) && newValue !== "") {
      updatedValue[0] = parseInt(newValue, 10); // Convert to an integer
    } else {
      updatedValue[0] = 0; // Or set a default value
    }
    
    setSelectedPrice(updatedValue);
  };
  
  const handleMaxChange = (event) => {
    const newValue = event.target.value;
    const updatedValue = [...selectedPrice];
  
    // Ensure the value is a valid number and not empty
    if (!isNaN(newValue) && newValue !== "") {
      updatedValue[1] = parseInt(newValue, 10); // Convert to an integer
    } else {
      updatedValue[1] = 0; // Or set a default value
    }
  
    setSelectedPrice(updatedValue);
  };

  const resetLocalStorageItems = () => {
    // Iterate over all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Check if the key starts with the prefix "isExpanded_"
      if (key.startsWith("isExpanded_")) {
        // If it matches, delete the item from localStorage
        localStorage.removeItem(key);
      }
    }
    // Optionally, you can add a message or perform any other action after deletion
    // console.log("Items with prefix 'isExpanded_' deleted from localStorage.");
  };
  const ResetRateHandle = async () => {
    setSelectedRate(0)
    localStorage.removeItem("rate");
    setArticles([])
    fetchArticles(null, null, null, 1);
  }

  const ResetfilterHandle = async () => {
    setSelectedPrice([0, 9999]);
    setCatChemin("");
    setSelectedCollection("all");
    setSelectedRate(0)
    setinStock(null);
    setisdiscount([]);
    localStorage.removeItem("discount");
    localStorage.removeItem("stock");
    localStorage.removeItem("categories");
    localStorage.removeItem("collections");
    localStorage.removeItem("publishers");
    localStorage.removeItem("subCategories");
    localStorage.removeItem("parentCategories");
    localStorage.removeItem("multiproductids");
    localStorage.removeItem("rate");
    localStorage.removeItem("min_price");
    localStorage.removeItem("max_price");
    resetLocalStorageItems();
    setchangePricetoggle(!changepricetoggle)
    dispatch(resetSearchData());
    setIsOpen(false);
    try {
      const url = `${import.meta.env.VITE_TESTING_API}/articles`;

      const selectedarticleFamilleId = (selectedCategoryId !== 'null' && selectedCategoryId !== null)
      ? `&articlefamilleparent_id=${selectedCategoryId}`
      : "";
      
      // Check if route is /products/subcategory/:id and get subcategory id
      let selectedsubCategoryParam = "";
      if (location.pathname.startsWith("/products/subcategory/") && subcatageoryId && subcatageoryId !== "null") {
        selectedsubCategoryParam = `&articlefamille_id=${subcatageoryId}`;
      }
      const response = await axios.get(
        `${url}?ecom_type=sofiaco&selected_date=any&page=1${selectedarticleFamilleId}${selectedsubCategoryParam}`
      );
      setArticles(response.data.data);
      setTotalArticlesNumber(response.data?.total)
    } catch (error) {
      // console.error("Error fetching categories:", error);
      // toast.error("Failed to fetch categories.");
    }
  };

  const RefineHandle = () => {
    setArticles([]);
    const newData = {}; // Initialize newData for dispatch
  
    // Reverse values if min is greater than max
    let minPrice = selectedPrice[0];
    let maxPrice = selectedPrice[1];
  
    if (minPrice > maxPrice) {
      // Swap min and max if necessary
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }
  
    // Save the corrected prices to localStorage
    localStorage.setItem("min_price", minPrice);
    localStorage.setItem("max_price", maxPrice);
    
    // Update selectedPrice state with the corrected order
    setSelectedPrice([minPrice, maxPrice]);
  
    setchangePricetoggle(!changepricetoggle);
  
    // Update newData with the corrected prices
    newData.min_price = minPrice;
    newData.max_price = maxPrice;
  
    // Dispatch the updated data
    dispatch(addSearchData(newData));
    
    // Fetch updated articles based on the new price range
    fetchArticles(null, null, null, 1);
    
    // Close the modal or dialog
    setIsOpen(false);
  };

  
  const handleChangeRate = (event) => {
    const newSelectedRate = event.target.value;
    setSelectedRate(newSelectedRate);
    localStorage.setItem("rate", newSelectedRate);
    // Call fetchArticles function with the new selectedDate
    fetchArticles(newSelectedRate, null, null, 1);
  };

  const handleChangeCollection = (event) => {
    const newSelectedCollection = event;

    // Retrieve and parse stored collections (ensure it's an array)
    let storedCollec = JSON.parse(localStorage.getItem("collections")) || [];

    if (storedCollec.includes(newSelectedCollection)) {
      // If already selected, remove it
      storedCollec = storedCollec.filter(
        (col) => col !== newSelectedCollection
      );
    } else {
      // Otherwise, add the new collection
      storedCollec.push(newSelectedCollection);
    }

    // Update localStorage with the new collections array
    localStorage.setItem("collections", JSON.stringify(storedCollec));

    // Dispatch action to update search data

    setArticles([]); // Reset articles
  };
const handleChangePublisher = (event) => {
    const newSelectedPublisher = event;

    // Retrieve and parse stored publishers (ensure it's an array)
    let storedPublishers = JSON.parse(localStorage.getItem("publishers")) || [];

    if (storedPublishers.includes(newSelectedPublisher)) {
      // If already selected, remove it
      storedPublishers = storedPublishers.filter(
        (pub) => pub !== newSelectedPublisher
      );
    } else {
      // Otherwise, add the new publisher
      storedPublishers.push(newSelectedPublisher);
    }

    // Update localStorage with the new publishers array
    localStorage.setItem("publishers", JSON.stringify(storedPublishers));

    // Dispatch action to update search data

    setArticles([]); // Reset articles
  };
  // Retrieve stored collections as an array
  const selectedCollections =
    JSON.parse(localStorage.getItem("collections")) || [];

  // Function to check if a collection is selected
  const isCollectionSelected = (collectionNom) => {
    return selectedCollections.includes(collectionNom);
  };
  // Retrieve stored publishers as an array
  const selectedPublishers =
    JSON.parse(localStorage.getItem("publishers")) || [];

  // Function to check if a publisher is selected
  const isPublisherSelected = (publisherNom) => {
    return selectedPublishers.includes(publisherNom);
  };
  const isDiscountSelected = (discount) => {
    return isdiscount?.includes(discount);
  };


  
const handleChangeParentCategory = (event) => {
    const newSelectedParentCategory = event;

    // Retrieve and parse stored parent categories (ensure it's an array)
    let storedParentCategories = JSON.parse(localStorage.getItem("parentCategories")) || [];

    if (storedParentCategories.includes(newSelectedParentCategory)) {
      // If already selected, remove it
      storedParentCategories = storedParentCategories.filter(
        (cat) => cat !== newSelectedParentCategory
      );
    } else {
      // Otherwise, add the new parent category
      storedParentCategories.push(newSelectedParentCategory);
    }

    // Update localStorage with the new parent categories array
    localStorage.setItem("parentCategories", JSON.stringify(storedParentCategories));

    // Dispatch action to update search data
    setfilterValues([]);
    FetchFilters();
    setArticles([]); // Reset articles
  };

  // Retrieve stored parent categories as an array
  const selectedParentCategories =
    JSON.parse(localStorage.getItem("parentCategories")) || [];

  // Function to check if a parent category is selected
  const isParentCategorySelected = (categoryID) => {
    if (!categoryID) return false;
    return selectedParentCategories.some(
      (cat) => cat === categoryID
    );
  };


const handleChangeSubCategory = (event) => {
    const newSelectedSubCategory = event;

    // Retrieve and parse stored sub categories (ensure it's an array)
    let storedSubCategories = JSON.parse(localStorage.getItem("subCategories")) || [];

    if (storedSubCategories.includes(newSelectedSubCategory)) {
      // If already selected, remove it
      storedSubCategories = storedSubCategories.filter(
        (subCat) => subCat !== newSelectedSubCategory
      );
    } else {
      // Otherwise, add the new sub category
      storedSubCategories.push(newSelectedSubCategory);
    }

    // Update localStorage with the new sub categories array
    localStorage.setItem("subCategories", JSON.stringify(storedSubCategories));

    // Dispatch action to update search data

    setArticles([]); // Reset articles
  };

  // Retrieve stored sub categories as an array
  const selectedSubCategories =
    JSON.parse(localStorage.getItem("subCategories")) || [];

  // Function to check if a sub category is selected
  const isSubCategorySelected = (subCategoryID) => {
    if (!subCategoryID) return false;
    return selectedSubCategories.some(
      (subCat) => subCat === subCategoryID
    );
  };

  const parsedStoredParentCategories = JSON.parse(storedParentCategories || '[]');
  const isLibrary = Number(selectedCategoryId) === 1 || parsedStoredParentCategories.includes(1) || (parsedStoredParentCategories.length === 0 && (selectedCategoryId === null || selectedCategoryId === 'null'));

  // Dynamic tree mapping based on category_level_ids
  const getCategoryTree = () => {
  // Support both companySettings and companysettings for backward compatibility
  let rawLevels = authCtx.companySettings?.category_level_ids || '';
  // Parse string to array of numbers
  const levels = typeof rawLevels === 'string' ? rawLevels.split(',').map(l => Number(l.trim())).filter(Boolean) : Array.isArray(rawLevels) ? rawLevels : [];
  if (!Array.isArray(levels) || levels.length === 0) return [];
    // Helper: get all possible parent reference keys
    const allParentKeys = [
      'b_usr_articletheme_id',
      'b_usr_articletheme_id1',
      'b_usr_articletheme_id2',
    ];

    // Recursive function to build tree for a given level
    const buildTree = (parentId, levelIdx) => {
      const niveau = levels[levelIdx];
      return categories
        .filter(cat => {
          if (cat.niveau !== niveau) return false;
          if (levelIdx === 0) return true;
          // For child levels, match any parent reference to parentId
          for (const key of allParentKeys) {
            if (cat[key] === parentId) return true;
          }
          return false;
        })
        .sort((a, b) => a._nom.localeCompare(b._nom))
        .map(cat => ({
          ...cat,
          children: (levelIdx + 1 < levels.length)
            ? buildTree(cat.id, levelIdx + 1)
            : undefined
        }));
    };
    return buildTree(null, 0);
  };
  const mappedCategories = getCategoryTree();
  
  const list = (anchor) => (
    <>
    <Box
    sx={{ width: "85%" }}
      role="presentation"
      className={classes.container}
    >
      <IoMdClose style={{position:'absolute', top:'1em', right:'20%', width:'2em', height:'2em', color:'#fff', zIndex:'10'}} onClick={toggle}/>
      <List>
      <ListItem >
          <div style={{display:'flex',position:'relative', flexDirection:'column',fontFamily:'var(--font-family)' ,width:'96%', color:'#fff'}}>
        <h1>{language === 'eng' ? "Filter" : "Filtre " }</h1>
        <div className={classes.filter}>
          
          {(selectedCategoryId === null || selectedCategoryId === 'null') && <div className={classes.categories}>
            <h2
              onClick={() => setparentCategoriesOpen(!parentCategoriesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "CATEGORIES" : "CATÉGORIES"}{" "}
              </span>
              {parentCategoriesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
            {parentCategoriesOpen && (
              <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                <div style={{ padding: '0 0.6em 0.6em 0' }}>
                  <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search parent...' : 'Rechercher...'} value={parentCategorySearch} onChange={(e) => handleDebouncedSearch('parent-drawer', e.target.value, setParentCategorySearch)} fullWidth />
                </div>
                {authCtx?.articleFamilleParents?.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''))?.map((parent) => {
                  if (parentCategorySearch && !contains(parent.nom, parentCategorySearch)) return null;
                  const isChecked = isParentCategorySelected(parent.id);

                  return (
                    <div key={parent.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeParentCategory(parent.id)}>
                      <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                      <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer" }}>{parent.nom}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>}

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          {<div className={classes.categories}>
            <h2
              onClick={() => setsubCategoriesOpen(!subCategoriesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "SUB CATEGORIES" : "SOUS CATEGORIES"}{" "}
              </span>
              {subCategoriesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
            {subCategoriesOpen && (
              <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                <div style={{ padding: '0 0.6em 0.6em 0' }}>
                  <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search sub...' : 'Rechercher...'} value={subCategorySearch} onChange={(e) => handleDebouncedSearch('sub-drawer', e.target.value, setSubCategorySearch)} fullWidth />
                </div>
                {authCtx?.articleFamille?.filter(parent => selectedParentCategories.length === 0 || selectedParentCategories.includes(parent.b_usr_parentcategorie_id))?.sort((a, b) => ((a.type_nom || '')).localeCompare((b.type_nom || ''))).map((parent) => {
                  if (subCategorySearch && !contains(parent.type_nom, subCategorySearch)) return null;
                  const isChecked = isSubCategorySelected(parent.id);

                  return (
                    <div key={parent.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeSubCategory(parent.id)}>
                      <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                      <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer" }}>{parent.type_nom}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>}

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          {isLibrary && <>
          <div className={classes.categories}>
            <h2
              onClick={() => setthemesOpen(!themesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Themes" : "Thèmes"}{" "}
              </span>
              {themesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {themesOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search theme...' : 'Rechercher...'} value={themeSearch} onChange={(e) => handleDebouncedSearch('theme-drawer', e.target.value, setThemeSearch)} fullWidth />
                  </div>
                {filterTreeByQuery(mappedCategories, themeSearch)?.sort((a, b) => ((a._nom || a._nom_fr || '')).localeCompare((b._nom || b._nom_fr || '')))?.map((parent, index) => (
                  <TreeNode
                    key={index}
                    data={parent}
                    fetchArticles={fetchArticles}
                    setArticles={setArticles}
                    level={0}
                  />
                ))}
                </div>
              )}
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          <div className={classes.categories}>
            <h2
              onClick={() => setpublishinghouseOpen(!publishinghouseOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Publishing House" : "Maisons d'édition"}{" "}
              </span>
              {publishinghouseOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {publishinghouseOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search publisher...' : 'Rechercher...'} value={publisherSearch} onChange={(e) => handleDebouncedSearch('publisher-drawer', e.target.value, setPublisherSearch)} fullWidth />
                  </div>
                  {authCtx?.publishers?.sort((a, b) => ((a.title || a.name || '')).localeCompare((b.title || b.name || '')))?.map((publisher) => {
                    if (publisherSearch && !contains(publisher.title, publisherSearch)) return null;
                    const isChecked = isPublisherSelected(publisher.id);

                    return (
                      <div key={publisher.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangePublisher(publisher.id)}>
                        <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                        <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer", color: "var(--secondary-color)" }}>{publisher.title}</p>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          <div className={classes.categories}>
            <h2
              onClick={() => setcollectionsOpen(!collectionsOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Collections" : "Collections"}{" "}
              </span>
              {collectionsOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {collectionsOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search collection...' : 'Rechercher...'} value={collectionSearch} onChange={(e) => handleDebouncedSearch('collection-drawer', e.target.value, setCollectionSearch)} fullWidth />
                  </div>
                  {authCtx?.collections?.map((collection) => {
                    if (collectionSearch && !contains(collection.nom, collectionSearch)) return null;
                    const isChecked = isCollectionSelected(collection.id);

                    return (
                      <div key={collection.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeCollection(collection.id)}>
                        <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                        <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer", color: "var(--secondary-color)" }}>{collection.nom}</p>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
          
          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
 
          <div className={classes.categories}>
            <h2
              onClick={() => setCollaboratorsOpen(!collaboratorsOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Collaborators" : "Collaborateurs"}{" "}
              </span>
              {collaboratorsOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              <div className={classes.dropdown}
                  style={{  margin:'0em auto ' }}>
            {collaboratorsOpen && (
                <div className={classes.dropdown} style={{ height:'fit-content', margin:'0em auto ', paddingTop:collaboratorsOpen ? '0' : '4%' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search collaborators...' : 'Rechercher...'} value={collaboratorSearch} onChange={(e) => handleDebouncedSearch('collab-drawer', e.target.value, setCollaboratorSearch)} fullWidth />
                  </div>
                  {authCtx.collaboratorsTypes?.map((type) => {
                    const typeName = type?.name_fr;
                    const typeKey = typeName.toLowerCase().replace(/\s+/g, '_');
                    const collaborators = collaboratorsByType[typeName] || [];
                    const title = type.nom_pluriel_fr || typeName.charAt(0).toUpperCase() + typeName.slice(1) + 's';

                    return (
                      <CollaboratorTreeNode key={typeKey} title={title} isExpanded={expandedNodes[typeKey]} setIsExpanded={() => handleExpand(typeKey)} collaborators={collaborators} fieldName={typeName} searchQuery={(props)=>dispatch(addSearchData({collaborators: props.id}))} collaboratorSearchValue={collaboratorSearch} />
                    );
                  })}
                </div>
            )}
                      </div>
          </div>
          </>}
          
          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          {/* multi product filters */}
        {/* Multi product filters with independent dropdowns and checkboxes */}
        {filterValues?.length > 0 && filterValues.map((filter, index) => {
          // Each filter gets its own expanded state key
          const filterKey = `filter_${index}`;
          const isOpen = expanded[filterKey] || false;
          return (
            <>
              <div className={classes.categories} key={filterKey}>
              <h2
                onClick={() => toggleDropdown(filterKey)}
                style={
                  isOpen
                    ? {
                        display: "grid",
                        gridTemplateColumns: "80% 20%",
                        borderWidth: '100%',
                        cursor: 'pointer',
                      }
                    : {
                        display: "grid",
                        gridTemplateColumns: "80% 20%",
                        borderBottom: "none",
                        cursor: 'pointer',
                      }
                }
              >
                <span style={{ paddingLeft: '2%' }}>
                  {language === "eng" ? filter?.nom : filter?.nom_fr}
                </span>
                {isOpen ? (
                  <span
                    style={{
                      margin: "auto",
                      paddingRight: "0",
                      rotate: "180deg",
                    }}
                  >
                    <IoIosArrowDown style={{ color: 'var(--primary-color)' }} />
                  </span>
                ) : (
                  <span style={{ margin: "auto", paddingLeft: "0" }}>
                    <IoIosArrowDown style={{ color: 'var(--primary-color)' }} />
                  </span>
                )}
              </h2>
              {isOpen && (
                <div className={classes.dropdown}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    {/* per-filter drawer search */}
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search...' : 'Rechercher...'} value={(dynamicFilterSearches && dynamicFilterSearches[`filter_search_${index}`]) || ''} onChange={(e) => {
                      const key = `filter_search_${index}`;
                      handleDebouncedSearch(key, e.target.value, (v) => setDynamicFilterSearches(prev => ({ ...prev, [key]: v })));
                    }} fullWidth />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                    {filter?.values?.filter(val => {
                      const searchVal = (dynamicFilterSearches && dynamicFilterSearches[`filter_search_${index}`]) || '';
                      if (!searchVal) return true;
                      return contains(val.nom || val.nom_fr || val.label || '', searchVal);
                    })?.sort((a, b) => {
                        const aLabel = (language === 'eng' ? a.nom : a.nom_fr) || a.nom || '';
                        const bLabel = (language === 'eng' ? b.nom : b.nom_fr) || b.nom || '';
                        return aLabel.localeCompare(bLabel);
                      })?.map((props) => {
                      const isSelected = isMultiproductSelected(props.id);
                      return (
                        <label
                          key={props.id}
                          className={classes.ageSelect}
                          style={{
                          borderColor: filter?.values?.length > 0 ? 'var(--primary-color)' : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '0.2em 0.5em',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMultiProductsChange(props.id)}
                          className={classes.checkbox}
                          style={{
                            marginRight: "1em",
                            width: "1.3em",
                            height: "1.3em",
                          }}
                        />
                        {language === "eng" ? props?.nom : props?.nom_fr}
                      </label>
                    )})}
                  </div>
                </div>
              )}
              </div>

              <Divider  
              color="var(--secondary-color)"
              width="88%"
              style={{margin:'0.5em auto'}}
              />
            </>
          );
        })}



          <div className={classes.categories}>
            <h2>{language === 'eng' ? "Stock" : "Stock" }</h2>
              <div className={classes.dropdown}>
              <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue='all'
                    value={inStock}
                    name="radio-buttons-group"
                    onChange={handleChangeStock}
                  >
                    <FormControlLabel
                      value={null}
                      control={
                        <Radio style={{color:'var(--primary-color)'}} />
                      }
                      label={language === "eng" ? 'All' : "Tout"}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio style={{color:'var(--primary-color)'}}/>}
                      label={language === 'eng' ? "In Stock" : "En stock" } // Make sure item.nom is a string
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio style={{color:'var(--primary-color)'}}/>}
                      label={language === 'eng' ? "Out Of Stock" : "En rupture de stock" } // Make sure item.nom is a string
                    />
                  </RadioGroup>
                </FormControl>
              </div>
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          <div className={classes.categories}>
            <h2>{language === 'eng' ? "Price" : "Prix" }</h2>
              <div className={classes.dropdown}>
                <div style={{display:'flex',width:'95%', flexDirection:'row',justifyContent:'space-between'}}>
                  <TextField
                  style={{width:'48%',textAlign:'center',padding:'0'}}
                  type="number"
                  variant="standard"
                    InputProps={{
                      inputProps: {
                        min: 0,

                        style: {
                          color: 'var(--secondary-color)', 
                          border: 'none',
                          borderBottomColor: 'var(--secondary-color)',
                        },
                      },
                    }}
                    value={selectedPrice[0]}
                    onChange={handleMinChange}
                  />
                  <TextField
                  style={{width:' 48%',textAlign:'center',padding:'0'}}
                  type="number"
                  variant="standard"
                  InputProps={{
                    inputProps: {
                      min: 0,
                      style: {
                        color: 'var(--secondary-color)', 
                        borderColor: 'var(--secondary-color)',
                      },
                    },
                  }}
                    value={selectedPrice[1]}
                    onChange={handleMaxChange}
                  />
                  </div>
          <div style={{position:'relative',justifyContent:'flex-end'}}>
          <p style={{width:'fit-content',margin:'2em 0 0em 0',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={RefineHandle}><u>{language === "eng" ? "Refine" : "Affiner"}</u></p>
          </div>
              </div>
          </div>

          <div>
          <p style={{width:'fit-content',margin:'0 0 1em 7.5%',color:'#fff',cursor:'pointer',fontWeight:'500', fontFamily:'var(--font-family)'}} onClick={ResetfilterHandle}><u>{language === "eng" ? "Reset All" : "Réinitialiser"}</u></p>
          </div>
        </div>
        </div>
        </ListItem>
      </List>
    </Box>
    </>
  );
  const getAriaValueText = (value) => {
    return `$${value}`;
  };

  return (
    <div className={classes.bigContainer}>
      <div className={classes.content}>
        <div className={classes.filter_con}>
        <h1>{language === 'eng' ? "Filter" : "Filtre " }</h1>
        <div className={classes.filter}>
          <div>
          <p style={{width:'fit-content',color:'#fff',cursor:'pointer',fontWeight:'500', fontFamily:'var(--font-family)', background:'var(--primary-color)', padding:'0.5em 1em', borderRadius:'0.5em', textDecoration:'none', margin:'0.5em 0.5em 0em auto' }} onClick={ResetfilterHandle}><u>{language === "eng" ? "Reset All" : "Réinitialiser"}</u></p>
          </div>
          
          {(selectedCategoryId === null || selectedCategoryId === 'null') && <div className={classes.categories}>
            <h2
              onClick={() => setparentCategoriesOpen(!parentCategoriesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "CATEGORIES" : "CATÉGORIES"}{" "}
              </span>
              {parentCategoriesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
            {parentCategoriesOpen && (
              <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                <div style={{ padding: '0 0.6em 0.6em 0' }}>
                  <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search parent...' : 'Rechercher...'} value={parentCategorySearch} onChange={(e) => handleDebouncedSearch('parent-drawer', e.target.value, setParentCategorySearch)} fullWidth />
                </div>
                {authCtx?.articleFamilleParents?.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''))?.map((parent) => {
                  if (parentCategorySearch && !contains(parent.nom, parentCategorySearch)) return null;
                  const isChecked = isParentCategorySelected(parent.id);

                  return (
                    <div key={parent.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeParentCategory(parent.id)}>
                      <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                      <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer" }}>{parent.nom}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>}

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          {<div className={classes.categories}>
            <h2
              onClick={() => setsubCategoriesOpen(!subCategoriesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "SUB CATEGORIES" : "SOUS CATEGORIES"}{" "}
              </span>
              {subCategoriesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
            {subCategoriesOpen && (
              <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                <div style={{ padding: '0 0.6em 0.6em 0' }}>
                  <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search sub...' : 'Rechercher...'} value={subCategorySearch} onChange={(e) => handleDebouncedSearch('sub-drawer', e.target.value, setSubCategorySearch)} fullWidth />
                </div>
                {authCtx?.articleFamille?.filter(parent => selectedParentCategories.length === 0 || selectedParentCategories.includes(parent.b_usr_parentcategorie_id))?.sort((a, b) => ((a.type_nom || '')).localeCompare((b.type_nom || ''))).map((parent) => {
                  if (subCategorySearch && !contains(parent.type_nom, subCategorySearch)) return null;
                  const isChecked = isSubCategorySelected(parent.id);

                  return (
                    <div key={parent.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeSubCategory(parent.id)}>
                      <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                      <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer" }}>{parent.type_nom}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>}

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          {isLibrary && <>
          <div className={classes.categories}>
            <h2
              onClick={() => setthemesOpen(!themesOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Themes" : "Thèmes"}{" "}
              </span>
              {themesOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {themesOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search theme...' : 'Rechercher...'} value={themeSearch} onChange={(e) => handleDebouncedSearch('theme-drawer', e.target.value, setThemeSearch)} fullWidth />
                  </div>
                {filterTreeByQuery(mappedCategories, themeSearch)?.sort((a, b) => ((a._nom || a._nom_fr || '')).localeCompare((b._nom || b._nom_fr || '')))?.map((parent, index) => (
                  <TreeNode
                    key={index}
                    data={parent}
                    fetchArticles={fetchArticles}
                    setArticles={setArticles}
                    level={0}
                  />
                ))}
                </div>
              )}
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          <div className={classes.categories}>
            <h2
              onClick={() => setpublishinghouseOpen(!publishinghouseOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Publishing House" : "Maisons d'édition"}{" "}
              </span>
              {publishinghouseOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {publishinghouseOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search publisher...' : 'Rechercher...'} value={publisherSearch} onChange={(e) => handleDebouncedSearch('publisher-drawer', e.target.value, setPublisherSearch)} fullWidth />
                  </div>
                  {authCtx?.publishers?.sort((a, b) => ((a.title || a.name || '')).localeCompare((b.title || b.name || '')))?.map((publisher) => {
                    if (publisherSearch && !contains(publisher.title, publisherSearch)) return null;
                    const isChecked = isPublisherSelected(publisher.id);

                    return (
                      <div key={publisher.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangePublisher(publisher.id)}>
                        <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                        <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer", color: "var(--secondary-color)" }}>{publisher.title}</p>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

          <div className={classes.categories}>
            <h2
              onClick={() => setcollectionsOpen(!collectionsOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Collections" : "Collections"}{" "}
              </span>
              {collectionsOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              {collectionsOpen && (
                <div className={classes.dropdown} style={{ maxHeight: "400px", height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search collection...' : 'Rechercher...'} value={collectionSearch} onChange={(e) => handleDebouncedSearch('collection-drawer', e.target.value, setCollectionSearch)} fullWidth />
                  </div>
                  {authCtx?.collections?.map((collection) => {
                    if (collectionSearch && !contains(collection.nom, collectionSearch)) return null;
                    const isChecked = isCollectionSelected(collection.id);

                    return (
                      <div key={collection.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em" }} onClick={(e) => handleChangeCollection(collection.id)}>
                        <input type="checkbox" checked={isChecked} className={classes.checkbox} style={{ marginRight: "0px", width: "1.3em", height: "1.3em" }} />
                        <p style={{ margin: "auto 0 auto 2%", width: "92%", display: "flex", cursor: "pointer", color: "var(--secondary-color)" }}>{collection.nom}</p>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
          
          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
 
          <div className={classes.categories}>
            <h2
              onClick={() => setCollaboratorsOpen(!collaboratorsOpen)}
              style={{
                display: "grid",
                gridTemplateColumns: "80% 20%", 
              }}
            >
              <span>
              {language === "eng" ? "Collaborators" : "Collaborateurs"}{" "}
              </span>
              {collaboratorsOpen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                    
                  }}
                >
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}}/>
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown style={{color:'var(--primary-color)', cursor:'pointer'}} />
                </span>
              )}
            </h2>
              <div className={classes.dropdown}
                  style={{  margin:'0em auto ' }}>
            {collaboratorsOpen && (
                <div className={classes.dropdown} style={{ height:'fit-content', margin:'0em auto ', paddingTop:collaboratorsOpen ? '0' : '4%' }}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search collaborators...' : 'Rechercher...'} value={collaboratorSearch} onChange={(e) => handleDebouncedSearch('collab-drawer', e.target.value, setCollaboratorSearch)} fullWidth />
                  </div>
                  {authCtx.collaboratorsTypes?.map((type) => {
                    const typeName = type?.name_fr;
                    const typeKey = typeName.toLowerCase().replace(/\s+/g, '_');
                    const collaborators = collaboratorsByType[typeName] || [];
                    const title = type.nom_pluriel_fr || typeName.charAt(0).toUpperCase() + typeName.slice(1) + 's';

                    return (
                      <CollaboratorTreeNode key={typeKey} title={title} isExpanded={expandedNodes[typeKey]} setIsExpanded={() => handleExpand(typeKey)} collaborators={collaborators} fieldName={typeName} searchQuery={(props)=>dispatch(addSearchData({collaborators: props.id}))} collaboratorSearchValue={collaboratorSearch} />
                    );
                  })}
                </div>
            )}
                      </div>
          </div>
          </>}
          
          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          {/* multi product filters */}
        {/* Multi product filters with independent dropdowns and checkboxes */}
        {filterValues?.length > 0 && filterValues.map((filter, index) => {
          // Each filter gets its own expanded state key
          const filterKey = `filter_${index}`;
          const isOpen = expanded[filterKey] || false;
          return (
            <>
              <div className={classes.categories} key={filterKey}>
              <h2
                onClick={() => toggleDropdown(filterKey)}
                style={
                  isOpen
                    ? {
                        display: "grid",
                        gridTemplateColumns: "80% 20%",
                        borderWidth: '100%',
                        cursor: 'pointer',
                      }
                    : {
                        display: "grid",
                        gridTemplateColumns: "80% 20%",
                        borderBottom: "none",
                        cursor: 'pointer',
                      }
                }
              >
                <span style={{ paddingLeft: '2%' }}>
                  {language === "eng" ? filter?.nom : filter?.nom_fr}
                </span>
                {isOpen ? (
                  <span
                    style={{
                      margin: "auto",
                      paddingRight: "0",
                      rotate: "180deg",
                    }}
                  >
                    <IoIosArrowDown style={{ color: 'var(--primary-color)' }} />
                  </span>
                ) : (
                  <span style={{ margin: "auto", paddingLeft: "0" }}>
                    <IoIosArrowDown style={{ color: 'var(--primary-color)' }} />
                  </span>
                )}
              </h2>
              {isOpen && (
                <div className={classes.dropdown}>
                  <div style={{ padding: '0 0.6em 0.6em 0' }}>
                    {/* per-filter drawer search */}
                    <TextField size="small" variant="standard" placeholder={language === 'eng' ? 'Search...' : 'Rechercher...'} value={(dynamicFilterSearches && dynamicFilterSearches[`filter_search_${index}`]) || ''} onChange={(e) => {
                      const key = `filter_search_${index}`;
                      handleDebouncedSearch(key, e.target.value, (v) => setDynamicFilterSearches(prev => ({ ...prev, [key]: v })));
                    }} fullWidth />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                    {filter?.values?.filter(val => {
                      const searchVal = (dynamicFilterSearches && dynamicFilterSearches[`filter_search_${index}`]) || '';
                      if (!searchVal) return true;
                      return contains(val.nom || val.nom_fr || val.label || '', searchVal);
                    })?.sort((a, b) => {
                        const aLabel = (language === 'eng' ? a.nom : a.nom_fr) || a.nom || '';
                        const bLabel = (language === 'eng' ? b.nom : b.nom_fr) || b.nom || '';
                        return aLabel.localeCompare(bLabel);
                      })?.map((props) => {
                      const isSelected = isMultiproductSelected(props.id);
                      return (
                        <label
                          key={props.id}
                          className={classes.ageSelect}
                          style={{
                          borderColor: filter?.values?.length > 0 ? 'var(--primary-color)' : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '0.2em 0.5em',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMultiProductsChange(props.id)}
                          className={classes.checkbox}
                          style={{
                            marginRight: "1em",
                            width: "1.3em",
                            height: "1.3em",
                          }}
                        />
                        {language === "eng" ? props?.nom : props?.nom_fr}
                      </label>
                    )})}
                  </div>
                </div>
              )}
              </div>

              <Divider  
              color="var(--secondary-color)"
              width="88%"
              style={{margin:'0.5em auto'}}
              />
            </>
          );
        })}



          <div className={classes.categories}>
            <h2>{language === 'eng' ? "Stock" : "Stock" }</h2>
              <div className={classes.dropdown}>
              <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue='all'
                    value={inStock}
                    name="radio-buttons-group"
                    onChange={handleChangeStock}
                  >
                    <FormControlLabel
                      value={null}
                      control={
                        <Radio style={{color:'var(--primary-color)'}} />
                      }
                      label={language === "eng" ? 'All' : "Tout"}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio style={{color:'var(--primary-color)'}}/>}
                      label={language === 'eng' ? "In Stock" : "En stock" } // Make sure item.nom is a string
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio style={{color:'var(--primary-color)'}}/>}
                      label={language === 'eng' ? "Out Of Stock" : "En rupture de stock" } // Make sure item.nom is a string
                    />
                  </RadioGroup>
                </FormControl>
              </div>
          </div>

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          <div className={classes.categories}>
            <h2>{language === 'eng' ? "Price" : "Prix" }</h2>
              <div className={classes.dropdown}>
                <div style={{display:'flex',width:'95%', flexDirection:'row',justifyContent:'space-between'}}>
                  <TextField
                  style={{width:'48%',textAlign:'center',padding:'0'}}
                  type="number"
                  variant="standard"
                    InputProps={{
                      inputProps: {
                        min: 0,

                        style: {
                          color: 'var(--secondary-color)', 
                          border: 'none',
                          borderBottomColor: 'var(--secondary-color)',
                        },
                      },
                    }}
                    value={selectedPrice[0]}
                    onChange={handleMinChange}
                  />
                  <TextField
                  style={{width:' 48%',textAlign:'center',padding:'0'}}
                  type="number"
                  variant="standard"
                  InputProps={{
                    inputProps: {
                      min: 0,
                      style: {
                        color: 'var(--secondary-color)', 
                        borderColor: 'var(--secondary-color)',
                      },
                    },
                  }}
                    value={selectedPrice[1]}
                    onChange={handleMaxChange}
                  />
                  </div>
          <div style={{position:'relative',justifyContent:'flex-end'}}>
          <p style={{width:'fit-content',margin:'2em 0 0em 0',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={RefineHandle}><u>{language === "eng" ? "Refine" : "Affiner"}</u></p>
          </div>
              </div>
          </div>

        

          <div>
          <p className={classes.resetAll} onClick={ResetfilterHandle}>{language === 'eng' ? "Reset All" : "Réinitialiser " }</p>
          </div>
        </div>
        </div>
        <div>
        <BooksList
            toggle={toggle}
            fetchArticles={fetchArticles}
            carttoggle={carttoggle}
            filteredartciles={articles}
            catChemin={catChemin}
            loading={loading}
            selectedRate={selectedRate}
            selectedPrice={changepricetoggle}
            totalArticlesNumber={totalArticlesNumber}
          />
        </div>
      </div>
      <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={isOpen}
            onClose={toggle}
            PaperProps={{
              style: {
                height: '100%',
                // margin:'10em 0',
                width: '100%',
                background:'transparent',
                alignSelf:'start' // You can adjust the width as needed
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
    </div>
  );
};

export default BooksView ;