import React, { useContext, useEffect, useState } from "react";
import BooksList from "./Books List/BooksList";
import classes from "./BooksView.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, TextField } from "@mui/material";
import Slider from '@mui/material-next/Slider';
import { useLocation } from "react-router-dom";
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
import { editSearchData, resetSearchData } from "../../Common/redux/productSlice";
import AuthContext from "../../Common/authContext";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';


const BooksView = ({carttoggle}) => {
  const [value, setValue] = useState([0, 100]);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [rate, setrate] = useState(0);
  const searchData = useSelector((state) => state.products.searchData);
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
  const [parents, setParents] = useState([]);
  const [subparents, setSubparents] = useState([]);
  const [childrens, setChildrens] = useState([]);
  const authCtx = useContext(AuthContext);
  const [catChemin, setCatChemin] = useState("");
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedRate, setSelectedRate] = useState(0);
  const [changepricetoggle, setchangePricetoggle] = useState(false);
  const [totalArticlesNumber, setTotalArticlesNumber] = useState(null);
  const [inStock, setinStock] = useState(null);

  const changechemin = async () => {
    try {
      const storedCategory = localStorage.getItem("category");
      
      if (storedCategory) {
        // Fetch category path data from the backend API
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/api/bookshop/categories/${storedCategory}`
      ); // Adjust the URL as per your backend API
      const categoryPath = response.data.data.chemin; // Assuming the response contains the category path

      // Update the state with the category path
      setCatChemin(categoryPath);
      } else{
        setCatChemin('')
      }
    } catch (error) {
      // console.error("Error fetching category path:", error);
      // Handle error appropriately
    }
  }

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

     if (localStorage.getItem("category") === id.toString()) {
    // If the clicked category is already selected, deselect it
    localStorage.removeItem("category"); // Clear the selected category from local storage
    // Dispatch the action to clear the search data
    dispatch(editSearchData({ category: null }));
    setArticles([]); // Clear the articles list
    fetchArticles(selectedRate,null, null, 1);
    setCatChemin("");// Fetch articles with no category
    changechemin();
    return; // Exit early as the category was deselected
  }

      const clickedCategory = authCtx.categories.find(
        (category) => category.id === id
      );

      if (clickedCategory) {
        // Create the new search data array
        const newCategoryData = { category: id };

        localStorage.setItem("category", id);
        // Dispatch the action to edit the search data
        dispatch(editSearchData(newCategoryData));
        setIsExpanded(!isExpanded);
        // Fetch articles with the new category ID
        // fetchArticles(null, id);
        setArticles([])
        fetchArticles(selectedRate,null, null, 1);
        changechemin()
      }
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
    
    const storedCategory = localStorage.getItem("category");
    return (
      <div
        style={{
          paddingLeft: level === 0 ? "0" : `${level == 1 ? "3em" : "1.5em"}`,
          margin: "0.5em 0",
        }}
      >
        <div
          style={{
            color: isExpanded ? "var(--primary-color)" : color,
            fontSize:
              level === 0 ? "calc(0.8rem + 0.3vw)" : "calc(0.7rem + 0.3vw)",
              display:'flex'
          }}
        >
          {level !== 2 && <KeyboardArrowRightOutlinedIcon  style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }} onClick={toggleNode} className={classes.listBox} />}
          <p
            style={{ 
              margin: "0", 
              width:'100%',
              display: "flex", 
              cursor: "pointer",
              background: storedCategory && storedCategory === data.id.toString() ? 'var(--authbg-color)' : 'transparent'
            }}
            onClick={(event) => handleChildClick(data.id, event)}
          >
            {data._nom}
          </p>
        </div>
        {isExpanded && data.children && (
          <>
            {data.children.map((child, index) => (
              <p key={index}>
                <TreeNode
                  data={child}
                  level={level + 1}
                />
              </p>
            ))}
          </>
        )}
      </div>
    );
  }
  
  useEffect(() => {
    changechemin()
  },[searchData[0]?.category])

  useEffect(() => {
    if (Array.isArray(authCtx.categories)) {
      // Extract the array of categories from the data property
      const categories = authCtx.categories;

      // Categorize categories based on their niveau
      categories.forEach((category) => {
        const niveau = category.niveau;

        if (niveau === 1) {
          setParents((prevParent) => [...prevParent, category]);
        } else if (niveau === 2) {
          setSubparents((prevSubparent) => [...prevSubparent, category]);
        } else if (niveau === 3) {
          setChildrens((prevChild) => [...prevChild, category]);
        }
      });
    } else {
      // console.error(
      //   "Data property does not contain an array of categories:",
      //   authCtx.categories
      // );
    }
  }, [authCtx.categories]);

  useEffect(() => {
    fetchArticles();
  }, [searchData[0]?.category]);
  
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
      const url = `${import.meta.env.VITE_TESTING_API}/api/bookshop/articles`;

      const selectedtitleParam = searchData[0]?.title
        ? `&title=${searchData[0].title}`
        : "";

      const selectedauthorParam = searchData[0]?.author
        ? `&author=${searchData[0].author}`
        : "";

      const selectedcollectionParam = searchData[0]?.collection
        ? `&collection=${searchData[0].collection}`
        : "";

      const selectededitorParam = searchData[0]?.editor
        ? `&editor=${searchData[0].editor}`
        : "";

      const selectedtraducteurParam = searchData[0]?.traducteur
        ? `&traducteur=${searchData[0].traducteur}`
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

      const storedCategory = localStorage.getItem("category");
      const selectedCatParam = storedCategory
        ? `&category=${storedCategory}`
        : ``;
        
        const storedInStock= localStorage.getItem("stock");
        const selectedStockParam = storedInStock
          ? `&in_stock=${storedInStock}`
          : ``;

        const selectedCollectionParam = collectionId && collectionId !== 'all'
        ? `&collection=${collectionId}`
        : ``;

        const storedRate = localStorage.getItem("rate");
        const selectedRateParam = storedRate && storedRate !== 0
        ? `&rate=${storedRate}`
        : ``;

      // Finalize the URL by combining all parameters
      const finalUrl = `${url}?${Pagenum}${selectedRateParam}${selectedCollectionParam}${selectedStockParam}${selectedtitleParam}${selectedbestseller}${selectedCatParam}${selectededitorParam}${selectedauthorParam}${selectedcollectionParam}${selectedtraducteurParam}${selectedminPriceParam}${selectedmaxPriceParam}&ecom_type=sofiaco`;

      // Fetch articles using the finalized URL
      const response = await axios.get(finalUrl);

      // If page > 1 or articles exist, append new data to the current articles
      if (page !== 1) {
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
    window.scrollTo(0, 0);
  }, [location]);

 
  const handleChange = (event, newValue) => {
    setSelectedPrice(newValue);
  };

  const handleMinChange = (event) => {
    const newValue = event.target.value;
    const updatedValue = [...selectedPrice];
    updatedValue[0] = newValue;
    setSelectedPrice(updatedValue);
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

  const handleMaxChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    const updatedValue = [...selectedPrice];
    updatedValue[1] = newValue;
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
    localStorage.removeItem("category");
    localStorage.removeItem("rate");
    localStorage.removeItem("min_price");
    localStorage.removeItem("max_price");
    resetLocalStorageItems();
    setchangePricetoggle(!changepricetoggle)
    dispatch(resetSearchData());
    setIsOpen(false);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/api/bookshop/articles?ecom_type=sofiaco`
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
    dispatch(editSearchData(newData));
    
    // Fetch updated articles based on the new price range
    fetchArticles();
    
    // Close the modal or dialog
    setIsOpen(false);
  };
  

  
  const handleChangeCollection = (event) => {
    const newSelectedCollection = event.target.value;
    localStorage.removeItem("category");
    setCatChemin("");
    setSelectedCollection(newSelectedCollection);
    // Call fetchArticles function with the new selectedDate
    fetchArticles(0, newSelectedCollection, null, 1);
  };

  
  const handleChangeRate = (event) => {
    const newSelectedRate = event.target.value;
    setSelectedRate(newSelectedRate);
    localStorage.setItem("rate", newSelectedRate);
    // Call fetchArticles function with the new selectedDate
    fetchArticles(newSelectedRate, null, null, 1);
  };

  const mapSubparentsToParents = () => {
    return parents.map((parent) => {
      const subparentsWithChildren = subparents.map((subparent) => {
        const childrenForSubparent = childrens.filter(
          (child) => child.b_usr_articletheme_id === subparent.id
        );
        return { ...subparent, children: childrenForSubparent };
      });

      const children = subparentsWithChildren.filter(
        (subparent) => subparent.b_usr_articletheme_id === parent.id
      );

      return { ...parent, children };
    });
  };
  // Map subparents and children to parents
  const mappedParents = mapSubparentsToParents();
  
  const list = (anchor) => (
    <>
    <Box
    sx={{ width: "85%" }}
      role="presentation"
      className={classes.container}
    >
      <IoMdClose style={{position:'absolute', top:'1em', right:'20%', width:'2em', height:'2em', color:'#fff', zIndex:'10'}} onClick={toggle}/>
      <List>
      <ListItem disablePadding>
          <ListItemButton> 
          <div style={{display:'flex',position:'relative', flexDirection:'column',fontFamily:'var(--font-family)' ,width:'96%', color:'#fff'}}>
        <h1>Filter</h1>
        <div className={classes.filter}>
          <div className={classes.categories}>
            <h2>Categories</h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "200px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0} color='#fff'/>
                  );
                })}
              </div>
          </div>


          {/* <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

        
          <div className={classes.categories}>
            <h2>Editeur</h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "400px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0}/>
                  );
                })}
              </div>
          </div> */}

<Divider  
          color="#fff"
          width="88%"
          style={{margin:'0.5em auto'}}
        />


          <div className={classes.categories}>
            <h2>Stock</h2>
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
                        <Radio style={{color:'#fff'}} />
                      }
                      label='All'
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio style={{color:'#fff'}}/>}
                      label={language === 'eng' ? "In Stock" : "En stock" } // Make sure item.nom is a string
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio style={{color:'#fff'}}/>}
                      label={language === 'eng' ? "Out Of Stock" : "En rupture de stock" } // Make sure item.nom is a string
                    />
                  </RadioGroup>
                </FormControl>
              </div>
          </div>
          <Divider  
          color="#fff"
          width="88%"
          style={{margin:'0.5em auto'}}
        />
          <div className={classes.categories}>
            <h2>Prix</h2>
              <div className={classes.dropdown}>
                <div style={{display:'flex',width:'95%', flexDirection:'row',justifyContent:'space-between', marginTop:'1em'}}>
                  <TextField
                  style={{width:'48%',textAlign:'center',padding:'0'}}
                  type="number"
                  variant="standard"
                    InputProps={{
                      inputProps: {
                        min: 0,

                        style: {
                          color: '#fff', 
                          border: 'none',
                          borderBottomColor: '#fff',
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
                        color: '#fff', 
                        borderColor: '#fff',
                      },
                    },
                  }}
                    value={selectedPrice[1]}
                    onChange={handleMaxChange}
                  />
                  </div>
          <div style={{position:'relative',justifyContent:'flex-end'}}>
          <p style={{width:'fit-content',margin:'2em 0 1em 0',color:'#fff',cursor:'pointer',fontWeight:'500', fontFamily:'var(--font-family)'}} onClick={RefineHandle}><u>Refine</u></p>
          </div>
              </div>
          </div>


          <div>
          <p style={{width:'fit-content',margin:'0 0 1em 7.5%',color:'#fff',cursor:'pointer',fontWeight:'500', fontFamily:'var(--font-family)'}} onClick={ResetfilterHandle}><u>Reset All</u></p>
          </div>
        </div>
        </div>
          </ListItemButton>
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
        <h1>Filter</h1>
        <div className={classes.filter}>
          <div className={classes.categories}>
            <h2>Categories</h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "400px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0} color='var(--secondary-color)'/>
                  );
                })}
              </div>
          </div>


          {/* <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />

        
          <div className={classes.categories}>
            <h2>Editeur</h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "400px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0}/>
                  );
                })}
              </div>
          </div> */}

          <Divider  
          color="var(--secondary-color)"
          width="88%"
          style={{margin:'0.5em auto'}}
        />


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
                      label='All'
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
          <Divider  
          color="var(--secondary-color)"
          width="100%"
          style={{margin:'0.5em auto'}}
        />
          </div>
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
          <p style={{width:'fit-content',margin:'2em 0 0em 0',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={RefineHandle}><u>Refine</u></p>
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