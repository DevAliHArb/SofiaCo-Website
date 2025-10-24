import classes from "./SideBar.module.css";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaDeleteLeft,
  FaRegUser,
  FaUser,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../authContext";
import axios from "axios";
import { addSelectedCategory, changeCurrency, changeLanguage, editSearchData, removeUser } from "../redux/productSlice";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import ColoredLogo from "../../../assets/navbar/favicon.svg";
import allcat from "../../../assets/icons/all-cat.svg";

import { GoPerson } from "react-icons/go";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";



export default function SideBar({ toggle, isOpen }) {
  
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const currency = useSelector((state) => state.products.selectedCurrency[0].currency);
  const user = useSelector((state) => state.products.userInfo);
  const [catopen, setcatisopen] = useState(false);
  const [langopen, setLangisopen] = useState(false);
  const [currenopen, setcurrenisopen] = useState(false);
  const location = useLocation();
  const [parents, setParents] = useState([]);
  const [subparents, setSubparents] = useState([]);
  const [childrens, setChildrens] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext);
  const [catChemin, setCatChemin] = useState("");

    // For LanCurrSelect categories
    const articleFamille = authCtx.articleFamilleParents || [];
    // Handler for category click (same as LanCurrSelect)
    const handleCategoryMobClick = (route, id) => {
      // localStorage.setItem('route', route || 'all');
      dispatch(addSelectedCategory( id === null ? null : String(id) ));
      toggle();
    };

  
  const getToken = () => {
    return localStorage.getItem("token");
  };
  const token = getToken();
   
  const logout = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');

      // If token is not available, there's no need to logout
      if (!token) {
        return;
      }

      // Set up headers with the token
      const headers = {
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      };

      // Send a POST request to the logout endpoint
      await axios.get(`${import.meta.env.VITE_TESTING_API}/logout`, { headers });

      // Remove the token from local storage after successful logout
      localStorage.removeItem('token');

      dispatch(removeUser()) ;
      toggle();
      // Show toast message
      import('react-toastify').then(({ toast }) => {
        toast.success(language === 'eng' ? 'Logged out successfully.' : 'Déconnexion réussie.', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: 'colored',
        });
      });
      // navigate(`/login`);
      // Add any additional logic you may need, such as redirecting the user to the login page or updating the application state
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any errors that occur during logout
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      // Perform any additional actions after successful logout
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error
    }
  };

  React.useEffect(() => {
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
  
function TreeNode({ data, level, fetchArticles }) {
  const [isExpanded, setIsExpanded] = React.useState(
    localStorage.getItem(`isExpanded_${data.id}`) === 'true' // Retrieve isExpanded from localStorage
  );

  useEffect(() => {
    localStorage.setItem(`isExpanded_${data.id}`, isExpanded); // Save isExpanded to localStorage
  }, [data.id, isExpanded]);

  const handleChildClick = async (id, event) => {
    event.stopPropagation();
    // console.log("Clicked on child with ID:", id);
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
      navigate('/books')
      if (window.location.pathname === '/books') {
        window.location.reload();
      }
      toggle()
      try {
        const storedCategory = localStorage.getItem("category");
        // Fetch category path data from the backend API
        const response = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/categories/${storedCategory}`
        ); // Adjust the URL as per your backend API
        const categoryPath = response.data.data.chemin; // Assuming the response contains the category path

        // Update the state with the category path
        setCatChemin(categoryPath);
        // console.log(categoryPath);
      } catch (error) {
        // console.error("Error fetching category path:", error);
        // Handle error appropriately
      }
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
        paddingLeft: level === 0 ? "0" : `${level === 1 ? "3em" : "1.5em"}`,
        margin: "0.5em 0",
      }}
    >
      <div
        style={{
          color: 'var(--primary-color)',
          marginLeft:'1.4em',
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
                fetchArticles={fetchArticles}
              />
            </p>
          ))}
        </>
      )}
    </div>
  );
}
  const list = (anchor) => ( 
    <>
    <button style={{position:'absolute',top:'1em', right:'1em', color:'var(--secondary-color)', borderRadius:'50%', fontSize:'large',padding:'0.3em .5em', border:'none'}} onClick={toggle}>
      X
    </button>
    <Link to="/">
        <img src={ColoredLogo} style={{maxWidth:'10em', margin:'1em'}} alt="logodark" />
    </Link>
    <Box
      sx={{ height: "fit-content !important" }}
      role="presentation"
      // onClick={toggle}
      // onKeyDown={toggle}
      className={classes.container}
    >
      
      <List>
        
     {user?.id ? <div style={{width:'90%',padding:"4% 0",display:'flex',flexDirection:"row",margin:'auto',cursor:"pointer"}} className={classes.profileBtn} onClick={()=>toggle() & navigate('/account/profile')}>
        <div style={{width:'3em',height:'3em',backgroundColor:"var(--secondary-color)",borderRadius:"50%",display:'flex'}}>
          <GoPerson style={{color:'white',fontSize:'1.5em',margin:"auto"}}/>
        </div>
        <p style={{color:"#272E38",textAlign:'start',margin:'0 0 0 .5em'}}><span style={{fontWeight:"600"}}>{user.first_name} {user.last_name}</span><br/>{language === 'eng' ? "My Account" : "My Account"} </p>
      </div> : 
      <div style={{width:'100%',display:'flex',flexDirection:"column",marginBottom:"1em"}}>
        <button className={classes.loginBtn} onClick={()=>toggle() & navigate('/login')}>login</button>
        <button className={classes.loginBtn} style={{color:"#111",background:'#fff'}} onClick={()=>toggle() & navigate('/register')}>Create Account</button>
        </div>}

        
<Divider  style={{
  width:'90%',
  margin:'1em auto',
  background:'#D9D9D9',
}}/>


          {/* New categoriesmob div for LanCurrSelect categories with open/close dropdown */}
          <div className={classes.categoriesmob} style={{margin: '1em 0'}}>
            <h2
              onClick={() => setcatisopen(!catopen)}
               style={
                        catopen
                          ? {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              background:'var',
                              textTransform:"capitalize",cursor:'pointer'
                            }
                          : {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              borderBottom: "none",
                              textTransform:"capitalize",cursor:'pointer'
                            }
                      }
                    >
                {language === 'eng' ? 'Categories' : 'Catégories'}
              {catopen ? (
                <span style={{margin: 'auto 0 auto auto', paddingRight: '0', display: 'flex'}}>
                  <IoIosArrowDown style={{margin:'auto'}}/>
                </span>
              ) : (
                <span style={{margin: 'auto 0 auto auto', paddingLeft: '0', rotate: '-90deg', display: 'flex'}}>
                  <IoIosArrowDown />
                </span>
              )}
            </h2>
            {catopen && (
              <div className={classes.dropdown} style={{width:"100%"}}>
                {/* All category */}
                <div style={{display: 'flex', alignItems: 'center', gap: '0.7em', cursor: 'pointer', padding: '0.7em 0'}} onClick={() => handleCategoryMobClick('/', null)}>
                  <img src={allcat} alt="" style={{width:'1.7em'}}/>
                  <span style={{color:'#111', fontWeight: 54000}}>{language === 'eng' ? 'All' : 'Tous'}</span>
                </div>
                {/* Render each category from articleFamille */}
                {authCtx.articleFamilleParents?.map(item => (
                  <div key={item.id} style={{display: 'flex', alignItems: 'center', gap: '0.7em', cursor: 'pointer', padding: '0.7em 0'}} onClick={() => handleCategoryMobClick(item.route, item.id)}>
                    <img src={allcat} alt="" style={{width:'1.7em'}}/>
                    <span style={{color:'#111', fontWeight: 400,textTransform: 'capitalize'}}>{item?.nom}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        <Link  to='/' style={{textDecoration: 'none', color:'white',background:'red'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>{language === 'eng' ? "Home" : "Accueil"} </p>
          </ListItemButton>
        </ListItem>
        </Link>


        {/* <Link  to='/books' style={{textDecoration: 'none', color:'white'}} onClick={toggle}> */}


        <Link  to='/books' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>{language === 'eng' ? "Products" : "Produits"} </p>
          </ListItemButton>
        </ListItem>
        </Link>
        
        {/* <Link  to='/collaborators' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>{language === 'eng' ? "COLLABORATORS" : "COLLABORATEUR"} </p>
          </ListItemButton>
        </ListItem>
        </Link>
        

        <Link  to='/collections' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>{language === 'eng' ? "COLLECTIONS" : "COLLECTION"} </p>
          </ListItemButton>
        </ListItem>
        </Link> */}





        <Link  to='/about' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>{language === 'eng' ? "About Us" : "A Propos"} </p>
          </ListItemButton>
        </ListItem>
        </Link>



        <Link  to='/events' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>
            {language === 'eng' ? "Events" : "Evènements"} 
            </p>
          </ListItemButton>
        </ListItem>
        </Link>

        <Link  to='/publishers' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>
            {language === 'eng' ? 'Publishing House' : 'Maison d’édition'}
            </p>
          </ListItemButton>
        </ListItem>
        </Link>
        
                <Link  to='/collaborators' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
                <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
                    <p className={classes.text}>
                    {language === 'eng' ? "Collaborators" : "Collaborateurs" }
                    </p>
                  </ListItemButton>
                </ListItem>
                </Link>
                
        




        <Link  to='/contact' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>
            Contact
            </p>
          </ListItemButton>
        </ListItem>
        </Link>
{/* 
        <Link  to='/legal-information' style={{textDecoration: 'none', color:'white'}} onClick={toggle}>
        <ListItem disablePadding>
          <ListItemButton style={{padding:'0'}}>
            <p className={classes.text}>
            {language === "eng" ? "LEGAL INFORMATION" : "MENTIONS LEGALES"}
            </p>
          </ListItemButton>
        </ListItem>
        </Link> */}

{user?.id && <Divider className={classes.divider} style={{
  width:'90%',
  margin:'1em auto',
  background:'#D9D9D9',
}}/>}
<Divider className={classes.dividerMob} style={{
  width:'90%',
  margin:'1em auto',
  background:'#D9D9D9',
}}/>
{user?.id && <ListItem disablePadding onClick={logout}>
          <ListItemButton style={{padding:'0 0 .3em 0'}}>
            <p className={classes.text} style={{color:'var(--secondary-color)'}}>
            <LogoutOutlinedIcon style={{ marginBottom: "-0.2em",fontSize: "calc(1.3rem + 0.3vw)", }} />{" "}
            {language === 'eng' ? "Logout" : "Déconnexion" }
            </p>
          </ListItemButton>
        </ListItem>}
<ListItem disablePadding>
                <div className={classes.categoriesmob}>
                    <h2
                      onClick={() => setLangisopen(!langopen)}
                      style={
                        langopen
                          ? {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              background:'var',
                              textTransform:"uppercase",cursor:'pointer'
                            }
                          : {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              borderBottom: "none",
                              textTransform:"uppercase",cursor:'pointer'
                            }
                      }
                    >
                       {language === "eng" ? "Eng - US" : "Français - FR"}{" "}
                      {langopen ? (
                        <span
                          style={{
                            margin: "auto 0 auto auto",
                            paddingRight: "0",display:'flex'
                          }}
                        >
                          <IoIosArrowDown  style={{margin:"auto"}}/>
                        </span>
                      ) : (
                        <span style={{ margin: "auto 0 auto auto", paddingLeft: "0",rotate: "-90deg",display:'flex' }}>
                          <IoIosArrowDown />
                        </span>
                      )}
                    </h2>
                    {langopen && (
                      <div
                        className={classes.dropdown}
                      >
                          <p onClick={async () => {
                              const lan = 'eng';
                                dispatch(changeLanguage({ Language: lan }));
                              try {
                                await axios.put(
                                  `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
                                  { 'language':lan },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                              } catch (error) {
                                // console.error("Error updating language:", error);
                              }
                              toggle();
                            }} className={classes.text} style={{margin:"0.5em 0 .5em 2.5em",textTransform:"uppercase", background: language === "eng" ? "var(--primary-color)" : '',color: language === "eng" ? "#fff" : '',cursor:"pointer"}}> Eng - US</p>
                          <p onClick={async () => {
                              const lan = 'fr';
                                dispatch(changeLanguage({ Language: lan }));
                              try {
                                await axios.put(
                                  `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
                                  { 'language':lan },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                              } catch (error) {
                                // console.error("Error updating language:", error);
                              }
                              toggle();
                            }} className={classes.text} style={{margin:"0 0 .5em 2.5em",textTransform:"uppercase", background: language === "fr" ? "var(--secondary-color)" : '',color: language === "fr" ? "#fff" : '',cursor:"pointer"}}>Français - FR</p>
                      </div>
                    )}
                  </div>
          </ListItem>
        
        <ListItem disablePadding>
                <div className={classes.categoriesmob}>
                    <h2
                      onClick={() => setcurrenisopen(!currenopen)}
                      style={
                        currenopen
                          ? {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              background:'var',
                              textTransform:"uppercase",cursor:'pointer'
                            }
                          : {
                              display: "grid",
                              gridTemplateColumns: "80% 20%",
                              borderBottom: "none",
                              textTransform:"uppercase",cursor:'pointer'
                            }
                      }
                    >
                      {currency} - {currency === "eur" ? `€`: `$`}
                      {currenopen ? (
                        <span
                          style={{
                            margin: "auto 0 auto auto",
                            paddingRight: "0",display:'flex'
                          }}
                        >
                          <IoIosArrowDown />
                        </span>
                      ) : (
                        <span style={{ margin: "auto 0 auto auto", paddingLeft: "0",rotate: "-90deg",display:'flex' }}>
                          <IoIosArrowDown />
                        </span>
                      )}
                    </h2>
                    {currenopen && (
                      <div
                        className={classes.dropdown}
                      >
                          <p onClick={async (event) => {
                                  const cur = "usd";
                                    dispatch(changeCurrency({ currency: cur }));
                                  try {
                                    await axios.put(
                                      `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
                                      { 'currency':cur },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                  } catch (error) {
                                    // console.error("Error updating currency:", error);
                                  }
                                  toggle();
                                  setcurrenisopen(false);
                                }} className={classes.text} style={{margin:"0.5em 0 .5em 2.5em",textTransform:"uppercase",cursor:'pointer',background: currency === "usd" ? "var(--primary-color)" : '',color: currency === "usd" ? "#fff" : ''}}> USD - $</p>
                          <p onClick={async (event) => {
                              const cur = "eur";
                                dispatch(changeCurrency({ currency: cur }));
                              try {
                                await axios.put(
                                  `${import.meta.env.VITE_TESTING_API}/users/${user.id}`,
                                  { 'currency':cur },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                              } catch (error) {
                                // console.error("Error updating currency:", error);
                              };
                              toggle();
                              setcurrenisopen(false);
                            }} className={classes.text} style={{margin:"0 0 .5em 2.5em",textTransform:"uppercase",cursor:'pointer',background: currency === "eur" ? "var(--primary-color)" : '',color: currency === "eur" ? "#fff" : ''}}>EUR - €</p>
                      </div>
                    )}
                  </div>
          </ListItem>
      </List>
      
          <div className={classes.sidebar_socials}>
            {authCtx.companySettings.facebook && (
              <a
                href={authCtx.companySettings.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className={classes.sidebar_icon} />
              </a>
            )}
            {authCtx.companySettings.youtube && (
              <a
                href={authCtx.companySettings.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className={classes.sidebar_icon} />
              </a>
            )}
            {authCtx.companySettings.twitter && (
              <a
                href={authCtx.companySettings.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className={classes.sidebar_icon} />
              </a>
            )}
            {authCtx.companySettings.tiktok && (
              <a
                href={authCtx.companySettings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fa-brands fa-tiktok"
                  style={{ fontSize: "2em", color: "#9B8DF4", margin: "0 1em" }}
                ></i>
              </a>
            )}
            {authCtx.companySettings.insta && (
              <a
                href={authCtx.companySettings.insta}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className={classes.sidebar_icon} />
              </a>
            )}
          </div>
    </Box>
    </>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor} >
          <Drawer 
          anchor={anchor} 
          open={isOpen} 
          onClose={toggle}  
          PaperProps={{
        style: {
          height: '100%',
          // margin:'10em 0',
          width: 'fit-content',
          background:'#fff',
          alignSelf:'start' // You can adjust the width as needed
        },
      }}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
