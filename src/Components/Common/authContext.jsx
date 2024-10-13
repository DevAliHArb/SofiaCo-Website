import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addInitialcart, addTocart, addTofavorite, changeQuantity, deleteItem, deletefavorite, resetCart, resetfavorite } from './redux/productSlice';
import bookPlaceHolder from "../../assets/bookPlaceholder.png";

const AuthContext = React.createContext({
  selectedcurrency: {},
  setselectedcurrency:() => {},
  reviewData:{},
  setReviewData:() =>{},
  bookDetails:{},
  setbookDetails:() =>{},
  returnData:{},
  setReturnData:() =>{},
  returnEditmode:{},
  setreturnEditmode:() =>{},
  editreturnData:{},
  seteditReturnData:() =>{},
  ReturnSelectedPage: '',
  setReturnSelectedPage: () => {},
  articles: [],
  setArticles: () => {},
  fetchArticles: () => {},
  categories: [],
  setCategories: () => {},
  mydocuments: [],
  setMydocuments: () => {},
  fetchCategories: () => {},
  collections: [],
  setCollections: () => {},
  fetchCollections: () => {},
  themes: [],
  setThemes: () => {},
  fetchThemes: () => {},
  collaborators: [],
  setCollaborators: () => {},
  fetchCollaborators: () => {},
  currencyRate: {},
  setcurrencyRate:()=>{},
  selectedlanguage: {},
  setselectedlanguage:() => {},
  addToCart:() =>{},
  ChangeCartQty:() =>{},
  addToCartWithQty:() =>{},
  deleteFromcart:() =>{},
  addToFavorite:() =>{},
  deleteFavorite:() =>{},
  companySettings: [],
  setCompanySettings: () => {},
  fetchCompanySettings: () => {},

  
  countries: [],
  setCountries: () => {},
});

export const AuthContextProvider = (props) => {

  const [selectedcurrency, setselectedcurrency] = useState('€');
  const [reviewData, setReviewData] = useState([]);
  const [bookDetails, setbookDetails] = useState({});
  const [returnData, setReturnData] = useState([]);
  const [editreturnData, seteditReturnData] = useState({});
  const [returnEditmode, setreturnEditmode] = useState(false);
  const [ReturnSelectedPage, setReturnSelectedPage] = useState('all');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mydocuments, setMydocuments] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collections, setCollections] = useState([]);
  const [themes, setThemes] = useState([]);
  const [currencyRate, setcurrencyRate] = useState(null);
  const [selectedlanguage, setselectedlanguage] = useState('fr');
  const [companySettings, setCompanySettings] = useState([]);
  const [editors, setEditors] = useState([]);
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const productData = useSelector((state)=>state.products.productData);
  const favorites = useSelector((state)=>state.products.favorites);
  const user = useSelector((state)=>state.products.userInfo);
  const token = localStorage.getItem('token');
   
  const fetchfavandcartSettings = async () => {
    if (user) {
  try {
    const cartResponse = await axios.get(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/cart`, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
    const userCart = cartResponse.data.data; 
    dispatch(resetCart());
    
    // console.log('Error in Login:', userCart);
    userCart.forEach(cartItem => {
        const article_id = cartItem.article_id;
        const foundBook = articles.find(book => book.id === article_id);
            dispatch(addInitialcart({
              cart_id: cartItem.id,
              _id: cartItem.article.id,
              title: cartItem.article.designation,
              author: cartItem.article.dc_auteur,
              image: cartItem.article.articleimage[0]?.link ? cartItem.article.articleimage[0].link : bookPlaceHolder,
              price: cartItem.article.prixpublic,
              _qte_a_terme_calcule: cartItem.article?._qte_a_terme_calcule,
              discount: cartItem.discount,
              quantity: cartItem.quantity,
              description: cartItem.article.descriptif,
              weight: cartItem.article._poids_net,
              price_ttc: cartItem.article._prix_public_ttc,
              removed: cartItem.removed,
              article_stock: cartItem.article.article_stock
            }));
    });

    const favoriteResponse = await axios.get(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/favorite`, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
    const favoriteCart = favoriteResponse.data.data; // Assuming cart data is returned in the response
    dispatch(resetfavorite());
    favoriteCart.forEach(favtItem => {
        const article_id = favtItem.article_id;
            dispatch(addTofavorite({
              id: favtItem.id,
              _favid: favtItem.article.id,
              favtitle: favtItem.article.designation,
              favauthor: favtItem.article.dc_auteur,
              favimage: favtItem.article.articleimage[0]?.link ? favtItem.article.articleimage[0].link : bookPlaceHolder,
              favprice: favtItem.article.prixpublic,
              _qte_a_terme_calcule: favtItem.article?._qte_a_terme_calcule,
              favdescription: favtItem.article.descriptif,
              favquantity: 1,
              discount: favtItem.discount,
              weight: favtItem.article._poids_net,
              price_ttc: favtItem.article._prix_public_ttc,
              removed: favtItem.removed,
              article_stock: favtItem.article.article_stock
            }));
    });
} catch (error) {
    // console.error('Error in Login:', error);
}
      
    }
}
const fetchArticles = async () => {
  try {
    const response = await axios.get(
      'https://api.leonardo-service.com/api/bookshop/articles?ecom_type=albouraq'
    );
    const articlesData = response.data.data;
    setArticles(articlesData);

    // Extract unique editors
    const editorsMap = new Map();
    articlesData.forEach(article => {
      if (article.editor && article.editor._nom) {
        editorsMap.set(article.editor.id, { id: article.editor.id, nom: article.editor._nom });
      }
    });

    setEditors(Array.from(editorsMap.values()));
    fetchfavandcartSettings();
  } catch (error) {
    // console.error('Error fetching articles:', error);
  }
};



  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/categories?ecom_type=albouraq`);
      setCategories(response.data);
    } catch (error) {
      // console.error('Error fetching categories:', error);
    }
  };

  
  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/collaborators?ecom_type=sofiaco`);
      setCollaborators(response.data);
    } catch (error) {
      // console.error('Error fetching collaborators:', error);
      // toast.error('Failed to fetch categories.');
    }
  };
  const fetchCollections = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/collections?ecom_type=sofiaco`);
      setCollections(response.data);
    } catch (error) {
      // console.error('Error fetching collections:', error);
    }
  };

  const fetchMyDocuments = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/my-documents?ecom_type=sofiaco`);
      setMydocuments(response.data);
    } catch (error) {
      // console.error('Error fetching my documents:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/countries?ecom_type=bookshop`);
      setCountries(response.data);
    } catch (error) {
      // console.error('Error fetching countries:', error);
    }
  };
  
  const fetchThemes = async () => {
    // try {
    //   const response = await axios.get(`https://api.leonardo-service.com/api/bookshop/themes`);
    //   setThemes(response.data);
    // } catch (error) {
    //   console.error('Error fetching themes:', error);
    //   // toast.error('Failed to fetch categories.');
    // }
  };
  

  const addToCarthandler = async ({props , carttoggle}) => {
    if (!user) {
      toast.error(language === "eng" ? "Please login to add to cart." : "Veuillez vous connecter pour ajouter au panier.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } else {
      const item = productData.find(item => item._id === props.id);
     if (!item) {
     try {
      const response = await axios.post("https://api.leonardo-service.com/api/bookshop/cart", {
        user_id: user.id,
        article_id: props.id,
        quantity: 1,
        ecom_type: 'sofiaco'
      });
      dispatch(addTocart({
        _id: props.id,
        title: props.designation,
        author: props.dc_auteur,
        image: props.articleimage[0]?.link ? props.articleimage[0].link : bookPlaceHolder,
        price: props.prixpublic,
        _qte_a_terme_calcule: props._qte_a_terme_calcule,
        quantity: 1,
        discount: props.discount,
        description: props.descriptif,
        cart_id: response.data.data.id,
        weight: props._poids_net,
        price_ttc: props._prix_public_ttc,
        article_stock:props.article_stock
      }));
      if (carttoggle) {
        carttoggle();
      }
      toast.success(language === "eng" ? `${props.name ? props.name : "Article"} is added` : `${props.name ? props.name : "Article"} a été ajouté`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } catch (error) {
      // console.error("Error adding to cart:", error);
      toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    };
     } else {
      const newQuantity = item.quantity + 1;
        axios.put(`https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`, {
          quantity: newQuantity,
          })
          .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(addTocart({
                  _id: props.id,
                }))
                toast.success(language === "eng" ? `${props.name ? props.name : "Book"} is added` : `${props.name ? props.name : "Livre"} a été ajouté`, {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: 0,
                  theme: "colored",
                });
                if (carttoggle) {
                  carttoggle();
                }
          })
          .catch((error) => {
              // console.error("Error in PUT request:", error);
              toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              });
          });
      
    }
    }
   
  }

  const addToCartWithQtyhandler = async (props) => {
    const item = productData.find(item => item._id === props.id);
     if (!item) {
     try {
      const response = await axios.post("https://api.leonardo-service.com/api/bookshop/cart", {
        user_id: user.id,
        article_id: props.id,
        quantity: props.quantity,
        ecom_type: 'sofiaco'
      });
      dispatch(addTocart({
        _id: props.id,
        title: props.designation,
        author: props.dc_auteur,
        image: props.image,
        price: props.prixpublic,
        _qte_a_terme_calcule: props._qte_a_terme_calcule,
        discount: props.discount,
        quantity: props.quantity,
        description: props.descriptif,
        weight: props._poids_net,
        cart_id: response.data.data.id,
        price_ttc: props._prix_public_ttc,
        article_stock: props.article_stock
      }));

      toast.success(language === "eng" ? `${props.name ? props.name : "Article"} is added` : `${props.name ? props.name : "Article"} a été ajouté`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } catch (error) {
      // console.error("Error adding to cart:", error);
      toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    };
     } else {
      const newQuantity = Number(item.quantity) + Number(props.quantity);
      axios.put(`https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`, {
          quantity: newQuantity,
          })
          .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(addTocart({
                  _id: props.id,
                  quantity: props.quantity,
                }))
                toast.success(language === "eng" ? `${props.name ? props.name : "Article"} is added` : `${props.name ? props.name : "Article"} a été ajouté`, {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: 0,
                  theme: "colored",
                });
          })
          .catch((error) => {
              // console.error("Error in PUT request:", error);
              toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              });
          });
      
    }
  }
  const changeCartQtyhandler = async (props) => {
     if (props.quantity > 0)  {
      // console.log("helooo",props.id, props.quantity);
      axios.put(`https://api.leonardo-service.com/api/bookshop/cart/${props.id}`, {
          quantity: props.quantity,
          })
          .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(
                changeQuantity({
                  _id: props._id,
                  quantity: props.quantity,
                })
              )
                toast.success(language === "eng" ? `${props.name ? props.name : "Article"} is added` : `${props.name ? props.name : "Article"} a été ajouté`, {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: 0,
                  theme: "colored",
                });
          })
          .catch((error) => {
              // console.error("Error in PUT request:", error);
              toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              });
          });
      
    }
  }
  const deleteFromcarthandler = async (props) => {
    const item = productData.find(item => item._id === props);
    axios.delete(`https://api.leonardo-service.com/api/bookshop/cart/${item.cart_id}`)
      .then(() => {
          // console.log("delete request successful:");
          dispatch(deleteItem(props))
            toast.success(language === "eng" ? "Book is removed." : "Le livre est supprimé.", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            });
      })
      .catch((error) => {
          // console.error("Error in delete request:", error);
          toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
      });
     
  }

  const fetchCompanySettings = async () => {
    try {
      const response = await axios.get('https://api.leonardo-service.com/api/bookshop/company-settings/3');
      setCompanySettings(response.data.data);
      if (response.data.data?.usd_rate) {
        setcurrencyRate(response.data.data?.usd_rate)
      }
    } catch (error) {
      // console.error('Error fetching company settings:', error);
    }
  };

  const addToFavoritehandler = async (props) => {
    const item = favorites.find(item => item._favid === props.id);
     try {
      const response = await axios.post("https://api.leonardo-service.com/api/bookshop/favorites", {
        user_id: user.id,
        article_id: props.id,
        ecom_type: 'sofiaco'
      });
      dispatch(addTofavorite({
        id: response.data.data.id,
        _favid: props.id,
        favtitle: props.designation,
        favauthor: props.dc_auteur,
        favimage: props.articleimage[0]?.link ? props.articleimage[0].link : bookPlaceHolder,
        favprice: props.prixpublic,
        _qte_a_terme_calcule: props._qte_a_terme_calcule,
        discount: props.discount,
        favquantity: 1,
        favdescription: props.descriptif,
        weight: props._poids_net,
        price_ttc: props._prix_public_ttc,
        article_stock: props.article_stock
      }));

      toast.success(language === "eng" ? `${props.name ? props.name : "Article"} is added` : `${props.name ? props.name : "Article"} a été ajouté`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } catch (error) {
      // console.error("Error adding to Favorites:", error);
      toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    };
     
  }

  const deleteFavoritehandler = async (props) => {
    const item = favorites.find(item => item._favid === props);
    // console.log(props)
     try {
      const response = await axios.delete(`https://api.leonardo-service.com/api/bookshop/favorites/${item.id}`);
      dispatch(deletefavorite(item.id));

      toast.success(language === "eng" ? `${props.name ? props.name : "Book"} is removed from Favorites` : `${props.name ? props.name : "Livre"} a été retiré des Favoris`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    } catch (error) {
      // console.error("Failed to remove book from Favorite:", error);
      toast.error(language === "eng" ? "Failed to add item to cart." : "Échec de l'ajout de l'article au panier.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
    };
  }

  const setselectedCurrencyhandler = (selectedcurrency) => {
    setselectedcurrency(selectedcurrency)
  }
  
  const setReviewDatahandler = (reviewData) => {
    setReviewData(reviewData)
  }
  
  const setBookDetailshandler = (reviewData) => {
    setbookDetails(reviewData)
  }

  const seteditReturnDatahandler = (editreturnData) => {
    seteditReturnData(editreturnData)
  }
  
  const setReturnDatahandler = (returnData) => {
    setReturnData(returnData)
  }

  const setCompanySettingshandler = (articles) => {
    setCompanySettings(articles)
  }

  
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchCollaborators();
    fetchCollections();
    fetchThemes();
    fetchCompanySettings();
    fetchMyDocuments();
    fetchCountries();
  }, []);

  const contextValue = {
    editors,
    selectedcurrency: selectedcurrency,
    reviewData: reviewData,
    bookDetails: bookDetails,
    returnData: returnData,
    editreturnData: editreturnData,
    returnEditmode: returnEditmode,
    articles: articles,
    fetchArticles: fetchArticles,
    categories: categories,
    fetchCategories: fetchCategories,
    collaborators: collaborators,
    fetchCollaborators: fetchCollaborators,
    collections: collections,
    fetchCollections: fetchCollections,
    themes: themes,
    mydocuments,
    fetchMyDocuments,
    setMydocuments,
    fetchThemes: fetchThemes,
    setreturnEditmode: setreturnEditmode,
    setselectedcurrency: setselectedCurrencyhandler,
    setReviewData: setReviewDatahandler,
    setbookDetails: setBookDetailshandler,
    seteditReturnData: seteditReturnDatahandler,
    setReturnData: setReturnDatahandler,
    ReturnSelectedPage: ReturnSelectedPage,
    setReturnSelectedPage: setReturnSelectedPage,

    currencyRate: currencyRate,
    selectedlanguage: selectedlanguage,
    companySettings: companySettings,
    fetchCompanySettings: fetchCompanySettings,
    setcurrencyRate: setcurrencyRate,
    setselectedlanguage: setselectedlanguage,
    deleteFromcart: deleteFromcarthandler,
    addToCart: addToCarthandler,
    ChangeCartQty: changeCartQtyhandler,
    addToCartWithQty: addToCartWithQtyhandler,
    addToFavorite: addToFavoritehandler,
    deleteFavorite: deleteFavoritehandler,
    setCompanySettings: setCompanySettingshandler,

    countries,
  }

  
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;