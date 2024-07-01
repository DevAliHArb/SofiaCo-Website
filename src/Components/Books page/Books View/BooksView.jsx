import React, { useContext, useEffect, useState } from "react";
import BooksList from "./Books List/BooksList";
import classes from "./BooksView.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, TextField } from "@mui/material";
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
import Rating from "@mui/material/Rating";

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

  const changechemin = async () => {
    try {
      const storedCategory = localStorage.getItem("category");
      // Fetch category path data from the backend API
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/categories/${storedCategory}`
      ); // Adjust the URL as per your backend API
      const categoryPath = response.data.data.chemin; // Assuming the response contains the category path

      // Update the state with the category path
      setCatChemin(categoryPath);
    } catch (error) {
      console.error("Error fetching category path:", error);
      // Handle error appropriately
    }
  }

  function TreeNode({ data, level, fetchArticles }) {
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

         // Check if the clicked category is the same as the currently stored category
  if (localStorage.getItem("category") === id.toString()) {
    return; // Exit early if the category is already selected
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
        console.log(selectedRate)
        fetchArticles(selectedRate, null,id, 1);
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
            color: isExpanded ? "var(--primary-color)" : "var(--accent-color)",
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
              background: storedCategory && storedCategory === data.id.toString() ? 'var(--secondary-color)' : 'transparent'
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
      console.error(
        "Data property does not contain an array of categories:",
        authCtx.categories
      );
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
      const url = `https://api.leonardo-service.com/api/bookshop/articles`;

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

        const selectedCollectionParam = collectionId && collectionId !== 'all'
        ? `&collection=${collectionId}`
        : ``;

        const storedRate = localStorage.getItem("rate");
        const selectedRateParam = storedRate && storedRate !== 0
        ? `&rate=${storedRate}`
        : ``;

      // Finalize the URL by combining all parameters
      const finalUrl = `${url}?${Pagenum}${selectedRateParam}${selectedCollectionParam}${selectedtitleParam}${selectedbestseller}${selectedCatParam}${selectededitorParam}${selectedauthorParam}${selectedcollectionParam}${selectedtraducteurParam}${selectedminPriceParam}${selectedmaxPriceParam}&ecom_type=albouraq`;

      // Fetch articles using the finalized URL
      const response = await axios.get(finalUrl);

      if ( !rate && !selectedCollectionParam && !CatID && articles.length > 0) {
        setArticles((prevArticles) => [...prevArticles, ...response.data.data]);
      } else {
        // Otherwise, set the fetched data as articles
        setArticles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
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
    console.log("Items with prefix 'isExpanded_' deleted from localStorage.");
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
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/articles?ecom_type=albouraq`
      );
      setArticles(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  const RefineHandle = () => {
    setArticles([]);
    const newData = {}; // Copy the existing searchData item at index 0

    localStorage.setItem("min_price", selectedPrice[0]);
    localStorage.setItem("max_price", selectedPrice[1]);
    setchangePricetoggle(!changepricetoggle)
    // Update or add properties based on conditions
    if (newData.min_price) {
      newData.min_price = selectedPrice[0];
    } else {
      newData.min_price = selectedPrice[0];
    }

    if (newData.max_price) {
      newData.max_price = selectedPrice[1];
    } else {
      newData.max_price = selectedPrice[1];
    }

    dispatch(editSearchData(newData));
    fetchArticles();
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
    sx={{ width: "100%" }}
      role="presentation"
      className={classes.container}
    >
      <List>
      <ListItem disablePadding>
          <ListItemButton> 
          <div style={{display:'flex',position:'relative', flexDirection:'column',fontFamily:'montserrat' ,width:'100%'}}>
            <h2 style={{color:'var(--accent-color)',width:'85%',margin:'1em auto 2em auto'}}> Filters</h2>
            <button style={{position:'absolute',top:'1.8em', right:'1.8em', color:'#fff',backgroundColor:"var(--forth-color)",borderRadius:".5em",border:'none'}}>
              <CloseIcon style={{fontSize:'1.5em',marginTop:'.2em'}} onClick={toggle}/>
            </button>
          <div className={classes.categories}>
            <h2>Categories</h2>
              <div className={classes.dropdown}
                  style={{ height: "400px", overflowY: "scroll" }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0}/>
                  );
                })}
              </div>
          </div>
          {/* <div className={classes.categories}>
            <h2 style={{marginBottom:'1em'}}> Collections </h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "400px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
              <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue='all'
                    value={selectedCollection}
                    name="radio-buttons-group"
                    onChange={handleChangeCollection}
                  >
                    <FormControlLabel
                      value='all'
                      control={
                        <Radio />
                      }
                      label='All'
                    />
                   {authCtx.collections?.slice(0,30).map((item) => (
  <FormControlLabel
    key={item.id}
    value={item.nom}
    control={<Radio />}
    label={item.nom} // Make sure item.nom is a string
  />
))}
                  </RadioGroup>
                </FormControl>
              </div>
          </div> */}
          <div className={classes.categories}>
            <h2>Prix</h2>
              <div className={classes.dropdown}>
                <div style={{display:'flex',width:'95%', flexDirection:'row',justifyContent:'space-between', marginTop:'1em'}}>
                  <TextField
                  style={{width:' 4em',textAlign:'center',padding:'0'}}
                  size="small"
                    InputProps={{
                      inputProps: {
                        min: 0, // Set the minimum value to 0 to enforce positivity
                        style: {
                          color: 'var(--accent-color)', 
                          borderColor: 'var(--accent-color)',
                        },
                      },
                    }}
                    value={selectedPrice[0]}
                    onChange={handleMinChange}
                  />
                  <TextField
                  style={{width:' 4em',textAlign:'center',padding:'0'}}
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 0, // Set the minimum value to 0 to enforce positivity
                      style: {
                        color: 'var(--accent-color)', 
                        borderColor: 'var(--accent-color)',
                      },
                    },
                  }}
                    value={selectedPrice[1]}
                    onChange={handleMaxChange}
                  /></div>
                  <div style={{position:'relative',justifyContent:'flex-end'}}>
                  <p style={{width:'fit-content',margin:'2em 0 0 auto ',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={RefineHandle}><u>Refine</u></p>
                  </div>
              </div>
          </div>
          <div className={classes.categories}>
            <h2 style={{marginBottom:'1em'}}> Rating</h2>
              <div className={classes.dropdown}>
              <Rating
                  style={{
                      color: "#712A2E",
                  }}
                  size='large'
                  name="rate"
                  value={rate}
                  onChange={handleChangeRate}
              />
              </div>
          </div>
          <div>
          <p style={{width:'fit-content',margin:'0 0 1em 7.5%',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={resetSearchData}><u>Reset</u></p>
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
        <div>
        <h1></h1>
        <div className={classes.filter}>
          <div className={classes.categories}>
            <h2>Categories</h2>
              <div className={classes.dropdown}
                  style={{ maxHeight: "400px",height:'fit-content', overflowY: "scroll", margin:'1em auto ' }}>
                {mappedParents.map((data) => {
                  return (
                      <TreeNode data={data} level={0}/>
                  );
                })}
              </div>
          </div>
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
          </div>
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
                          color: 'var(--secondary-color)', 
                          border: 'none',
                          borderBottomColor: 'var(--accent-color)',
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
                        color: 'var(--accent-color)', 
                        borderColor: 'var(--accent-color)',
                      },
                    },
                  }}
                    value={selectedPrice[1]}
                    onChange={handleMaxChange}
                  />
                  </div>
          <div style={{position:'relative',justifyContent:'flex-end'}}>
          <p style={{width:'fit-content',margin:'2em 0 1em 0',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={RefineHandle}><u>Refine</u></p>
          </div>
              </div>
          </div>
          <div className={classes.categories}>
            <h2 style={{marginBottom:'1em'}}> Rating</h2>
              <div className={classes.dropdown}>
              <Rating
                  style={{
                      color: "#712A2E",
                  }}
                  size='large'
                  name="rate"
                  value={selectedRate}
                  onChange={handleChangeRate}
              />
              </div>
              <p style={{width:'fit-content',margin:'0 0 1em 7.5%',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={ResetRateHandle}><u>Reset</u></p>
          </div>
          <div>
          <p style={{width:'fit-content',margin:'0 0 1em 7.5%',color:'var(--primary-color)',cursor:'pointer',fontWeight:'500'}} onClick={ResetfilterHandle}><u>Reset All</u></p>
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