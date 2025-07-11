import axios from "axios";
import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addInitialcart,
  addTocart,
  addTofavorite,
  changeQuantity,
  deleteItem,
  deletefavorite,
  resetCart,
  resetfavorite,
  removeUser,
} from "./redux/productSlice";
import bookPlaceHolder from "../../assets/bookPlaceholder.png";

const AuthContext = React.createContext({
  selectedcurrency: {},
  setselectedcurrency: () => {},
  reviewData: {},
  setReviewData: () => {},
  bookDetails: {},
  setbookDetails: () => {},
  returnData: {},
  setReturnData: () => {},
  returnEditmode: {},
  setreturnEditmode: () => {},
  editreturnData: {},
  seteditReturnData: () => {},
  ReturnSelectedPage: "",
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
  remiseCatalogues: [],
  setCollections: () => {},
  fetchCollections: () => {},
  themes: [],
  setThemes: () => {},
  fetchThemes: () => {},
  collaborators: [],
  setCollaborators: () => {},
  fetchCollaborators: () => {},
  currencyRate: {},
  setcurrencyRate: () => {},
  selectedlanguage: {},
  setselectedlanguage: () => {},
  addToCart: () => {},
  ChangeCartQty: () => {},
  addToCartWithQty: () => {},
  deleteFromcart: () => {},
  addToFavorite: () => {},
  deleteFavorite: () => {},
  companySettings: [],
  setCompanySettings: () => {},
  fetchCompanySettings: () => {},
  fetchfavandcartSettings: () => {},

  publishers: [],
  setPublishers: () => {},

  countries: [],
  setCountries: () => {},

  societeConfig: [],
  setSocieteConfig: () => {},
});

export const AuthContextProvider = (props) => {
  const [selectedcurrency, setselectedcurrency] = useState("€");
  const [reviewData, setReviewData] = useState([]);
  const [bookDetails, setbookDetails] = useState({});
  const [returnData, setReturnData] = useState([]);
  const [editreturnData, seteditReturnData] = useState({});
  const [returnEditmode, setreturnEditmode] = useState(false);
  const [ReturnSelectedPage, setReturnSelectedPage] = useState("all");
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mydocuments, setMydocuments] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collections, setCollections] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [remiseCatalogues, setremiseCatalogues] = useState([]);
  const [societeConfig, setSocieteConfig] = useState([]);
  const [themes, setThemes] = useState([]);
  const [currencyRate, setcurrencyRate] = useState(null);
  const [selectedlanguage, setselectedlanguage] = useState("fr");
  const [companySettings, setCompanySettings] = useState([]);
  const [editors, setEditors] = useState([]);
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.products.productData);
  const favorites = useSelector((state) => state.products.favorites);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const user = useSelector((state) => state.products.userInfo);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);

  const fetchfavandcartSettings = async () => {
    if (user) {
      try {
        const cartResponse = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/users/${user.id}/cart?user_id=${
            user?.id ? user.id : null
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        const userCart = cartResponse.data.data;
        dispatch(resetCart());

        // console.log('Error in Login:', userCart);
        userCart.forEach((cartItem) => {
          const article_id = cartItem.article_id;
          const foundBook = articles.find((book) => book.id === article_id);
          console.log("testt", cartItem);
          dispatch(
            addInitialcart({
              cart_id: cartItem.id,
              _id: cartItem.article.id,
              title: cartItem.article.designation,
              author: cartItem.article.dc_auteur,
              image: cartItem.article.articleimage[0]?.link
                ? cartItem.article.articleimage[0].link
                : bookPlaceHolder,
              price: cartItem.article.prixpublic,
              _qte_a_terme_calcule: cartItem.article?._qte_a_terme_calcule,
              discount: cartItem.article?.discount,
              average_rate: cartItem.average_rate,
              quantity: cartItem.quantity,
              description: cartItem.article.descriptif,
              weight: cartItem.article._poids_net,
              price_ttc: cartItem.article._prix_public_ttc,
              removed: cartItem.removed,
              article_stock: cartItem.article.article_stock,
            })
          );
        });

        const favoriteResponse = await axios.get(
          `${import.meta.env.VITE_TESTING_API}/users/${
            user.id
          }/favorite?user_id=${user?.id ? user.id : null}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the headers
            },
          }
        );
        const favoriteCart = favoriteResponse.data.data; // Assuming cart data is returned in the response
        dispatch(resetfavorite());
        favoriteCart.forEach((favtItem) => {
          const article_id = favtItem.article_id;
          dispatch(
            addTofavorite({
              id: favtItem.id,
              _favid: favtItem.article.id,
              favtitle: favtItem.article.designation,
              favrate: favtItem.average_rate,
              favauthor: favtItem.article.dc_auteur,
              favimage: favtItem.article.articleimage[0]?.link
                ? favtItem.article.articleimage[0].link
                : bookPlaceHolder,
              favprice: favtItem.article.prixpublic,
              _qte_a_terme_calcule: favtItem.article?._qte_a_terme_calcule,
              favdescription: favtItem.article.descriptif,
              favquantity: 1,
              discount: favtItem.article?.discount,
              weight: favtItem.article._poids_net,
              price_ttc: favtItem.article._prix_public_ttc,
              removed: favtItem.removed,
              article_stock: favtItem.article.article_stock,
            })
          );
        });
      } catch (error) {
        // console.error('Error in Login:', error);
      }
    }
  };
  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/articles?ecom_type=sofiaco&user_id=${user?.id ? user.id : null}`
      );
      const articlesData = response.data.data;
      setArticles(articlesData);

      // Extract unique editors
      const editorsMap = new Map();
      articlesData.forEach((article) => {
        if (article.editor && article?.dc_editor) {
          editorsMap.set(article.editor.id, {
            id: article.editor.id,
            nom: article?.dc_editor,
          });
        }
      });

      setEditors(Array.from(editorsMap.values()));
    } catch (error) {
      // console.error('Error fetching articles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/categories?ecom_type=sofiaco&user_id=${user?.id ? user.id : null}`
      );
      const sorteddata = [...response.data].sort((a, b) =>
        a._nom.localeCompare(b._nom)
      );
      setCategories(sorteddata);
    } catch (error) {
      // console.error('Error fetching categories:', error);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/collaborators?ecom_type=sofiaco&user_id=${user?.id ? user.id : null}`
      );
      const sorteddata = [...response.data].sort((a, b) =>
        a.nom.localeCompare(b.nom)
      );
      setCollaborators(sorteddata);
    } catch (error) {
      // console.error('Error fetching collaborators:', error);
      // toast.error('Failed to fetch categories.');
    }
  };
  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/collections?ecom_type=sofiaco&user_id=${user?.id ? user.id : null}`
      );
      const sorteddata = [...response.data].sort((a, b) =>
        a.nom.localeCompare(b.nom)
      );
      setCollections(sorteddata);
    } catch (error) {
      // console.error('Error fetching collections:', error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/publishers?ecom_type=sofiaco&user_id=${user?.id ? user.id : null}`
      );
      const sorteddata = [...response.data].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setPublishers(sorteddata);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchRemiseCatalogues = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_TESTING_API
        }/distinct-remise-catalogue?ecom_type=sofiaco`
      );
      setremiseCatalogues(response.data);
    } catch (error) {
      // console.error('Error fetching collections:', error);
    }
  };

  const fetchMyDocuments = async () => {
    try {
      // const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/my-documents?client_id=${user.client_id}`);
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/my-documents?client_id=${
          user.client_id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setMydocuments(response.data);
    } catch (error) {
      // console.error('Error fetching my documents:', error);
    }
  };

  const fetchSocieteConfig = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/societe-config`
      );
      setSocieteConfig(response.data);
    } catch (error) {
      // console.error('Error fetching collections:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/countries?ecom_type=sofiaco`
      );
      setCountries(response.data);
    } catch (error) {
      // console.error('Error fetching countries:', error);
    }
  };

  const fetchThemes = async () => {
    // try {
    //   const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/themes`);
    //   setThemes(response.data);
    // } catch (error) {
    //   console.error('Error fetching themes:', error);
    //   // toast.error('Failed to fetch categories.');
    // }
  };

  const addToCarthandler = async ({ props, carttoggle }) => {
    if (!user) {
      toast.info(
        language === "eng"
          ? "Log in to make your basket."
          : "Se connecter pour faire son panier.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        }
      );
    } else {
      const item = productData.find((item) => item._id === props.id);
      if (!item) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_TESTING_API}/cart`,
            {
              user_id: user.id,
              article_id: props.id,
              quantity: 1,
              ecom_type: "sofiaco",
            }
          );
          dispatch(
            addTocart({
              _id: props.id,
              title: props.designation,
              author: props.dc_auteur,
              image: props.articleimage[0]?.link
                ? props.articleimage[0].link
                : bookPlaceHolder,
              price: props.prixpublic,
              _qte_a_terme_calcule: props._qte_a_terme_calcule,
              quantity: 1,
              discount: props.discount,
              average_rate: props.average_rate,
              description: props.descriptif,
              cart_id: response.data.data.id,
              weight: props._poids_net,
              price_ttc: props._prix_public_ttc,
              article_stock: props.article_stock,
            })
          );
          if (carttoggle) {
            carttoggle();
          }
          toast.success(
            language === "eng"
              ? `${props.name ? props.name : "Article"} is added`
              : `${props.name ? props.name : "Article"} a été ajouté`,
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
        } catch (error) {
          // console.error("Error adding to cart:", error);
          toast.error(
            language === "eng"
              ? "Failed to add item to cart."
              : "Échec de l'ajout de l'article au panier.",
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
      } else {
        const newQuantity = item.quantity + 1;
        if (newQuantity <= item._qte_a_terme_calcule) {
          axios
            .put(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`, {
              quantity: newQuantity,
            })
            .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(
                addTocart({
                  _id: props.id,
                })
              );
              toast.success(
                language === "eng"
                  ? `${props.name ? props.name : "Book"} is added`
                  : `${props.name ? props.name : "Livre"} a été ajouté`,
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
              if (carttoggle) {
                carttoggle();
              }
            })
            .catch((error) => {
              // console.error("Error in PUT request:", error);
              toast.error(
                language === "eng"
                  ? "Failed to add item to cart."
                  : "Échec de l'ajout de l'article au panier.",
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
            });
        } else {
          toast.info(
            language === "eng"
              ? "No more items in stock"
              : "Plus d'articles en stock",
            {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    }
  };

  const addToCartWithQtyhandler = async (props) => {
    console.log(props);
    if (!user) {
      toast.info(
        language === "eng"
          ? "Log in to make your basket."
          : "Se connecter pour faire son panier.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        }
      );
    } else {
      const maxQuantity = props._qte_a_terme_calcule;
      const item = productData.find((item) => item._id === props.id);
      if (!item) {
        try {
          setIsLoading(true);
          const response = await axios.post(
            `${import.meta.env.VITE_TESTING_API}/cart?ecom_type=sofiaco`,
            {
              user_id: user.id,
              article_id: props.id,
              quantity: props.quantity,
            }
          );
          dispatch(
            addTocart({
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
              article_stock: props.article_stock,
            })
          );
        } catch (error) {
          // console.error("Error adding to cart:", error);
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        const newQuantity =
          Number(item.quantity * 1) + Number(props.quantity * 1);
        const newQuantityMax = Number(maxQuantity) - Number(item.quantity * 1);
        setIsLoading(true);
        if (Number(newQuantity) > Number(maxQuantity)) {
          axios
            .put(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`, {
              quantity: Number(maxQuantity).toFixed(0),
            })
            .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(
                addTocart({
                  _id: props.id,
                  quantity: Number(newQuantityMax).toFixed(0),
                })
              );
              setIsLoading(false);
            })
            .catch((error) => {
              // console.error("Error in PUT request:", error);
              setIsLoading(false);
            });
        } else {
          axios
            .put(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`, {
              quantity: newQuantity,
            })
            .then((response) => {
              // console.log("PUT request successful:", response.data);
              dispatch(
                addTocart({
                  _id: props.id,
                  quantity: props.quantity,
                })
              );
            })
            .catch((error) => {
              // console.error("Error in PUT request:", error);
              setIsLoading(false);
            });
        }
      }
    }
  };
  const changeCartQtyhandler = async (props) => {
    if (props.quantity > 0) {
      // console.log("helooo",props.id, props.quantity);
      axios
        .put(`${import.meta.env.VITE_TESTING_API}/cart/${props.id}`, {
          quantity: props.quantity,
        })
        .then((response) => {
          // console.log("PUT request successful:", response.data);
          dispatch(
            changeQuantity({
              _id: props._id,
              quantity: props.quantity,
            })
          );
          toast.success(
            language === "eng"
              ? `${props.name ? props.name : "Article"} is added`
              : `${props.name ? props.name : "Article"} a été ajouté`,
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
        })
        .catch((error) => {
          // console.error("Error in PUT request:", error);
          toast.error(
            language === "eng"
              ? "Failed to add item to cart."
              : "Échec de l'ajout de l'article au panier.",
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
        });
    }
  };
  const deleteFromcarthandler = async (props) => {
    const item = productData.find((item) => item._id === props);
    axios
      .delete(`${import.meta.env.VITE_TESTING_API}/cart/${item.cart_id}`)
      .then(() => {
        // console.log("delete request successful:");
        dispatch(deleteItem(props));
        toast.success(
          language === "eng" ? "Book is removed." : "Le livre est supprimé.",
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
      })
      .catch((error) => {
        // console.error("Error in delete request:", error);
        toast.error(
          language === "eng"
            ? "Failed to add item to cart."
            : "Échec de l'ajout de l'article au panier.",
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
      });
  };

  const fetchCompanySettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TESTING_API}/company-settings/3`
      );
      setCompanySettings(response.data.data);
      if (response.data.data?.usd_rate) {
        setcurrencyRate(response.data.data?.usd_rate);
      }
    } catch (error) {
      // console.error('Error fetching company settings:', error);
    }
  };

  const addToFavoritehandler = async (props) => {
    if (!user?.id) {
      toast.error(
        `${
          language === "eng"
            ? "Please login to add to Wishlist."
            : "Veuillez vous connecter pour ajouter à la liste de souhaits."
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
    } else {
      const item = favorites.find((item) => item._favid === props.id);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_TESTING_API}/favorites`,
          {
            user_id: user.id,
            article_id: props.id,
            ecom_type: "sofiaco",
          }
        );
        dispatch(
          addTofavorite({
            id: response.data.data.id,
            _favid: props.id,
            favtitle: props.designation,
            favrate: props.average_rate,
            favauthor: props.dc_auteur,
            favimage: props.articleimage[0]?.link
              ? props.articleimage[0].link
              : bookPlaceHolder,
            favprice: props.prixpublic,
            _qte_a_terme_calcule: props._qte_a_terme_calcule,
            discount: props.discount,
            favquantity: 1,
            favdescription: props.descriptif,
            weight: props._poids_net,
            price_ttc: props._prix_public_ttc,
            article_stock: props.article_stock,
          })
        );

        toast.success(
          `${
            language === "eng"
              ? `Product is added to Favorites`
              : "Le produit est ajouté à la liste de souhaits"
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
      } catch (error) {
        console.error("Error adding to Favorites:", error);
        toast.error(
          `${
            language === "eng"
              ? "Failed to add item to Wishlist."
              : "Échec de l'ajout d'un article à la liste de souhaits."
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
    }
  };

  const deleteFavoritehandler = async (props) => {
    const item = favorites.find((item) => item._favid === props);
    // console.log(props)
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_TESTING_API}/favorites/${item.id}`
      );
      dispatch(deletefavorite(item.id));

      toast.success(
        language === "eng"
          ? `${props.name ? props.name : "Book"} is removed from Favorites`
          : `${props.name ? props.name : "Livre"} a été retiré des Favoris`,
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
    } catch (error) {
      // console.error("Failed to remove book from Favorite:", error);
      toast.error(
        language === "eng"
          ? "Failed to add item to cart."
          : "Échec de l'ajout de l'article au panier.",
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

  const FetchUserData = async () => {
    await fetchfavandcartSettings();
  };

  const checkUserLoggedIn = async () => {
    // Only check if user exists and has an ID
    if (!user?.id) {
      dispatch(removeUser());
      localStorage.removeItem("token");
      return { is_logged_in: false };
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TESTING_API}/is-user-logged-in`,
        { user_id: user.id }
      );

      // If response indicates user is not logged in, remove user from state
      if (!response.data.is_logged_in) {
        dispatch(removeUser());
        localStorage.removeItem("token");
      } else {
        FetchUserData();
      }

      return response.data;
    } catch (error) {
      // If request fails (e.g., unauthorized), assume user is not logged in
      dispatch(removeUser());
      localStorage.removeItem("token");
      return { is_logged_in: false };
    }
  };

  const setselectedCurrencyhandler = (selectedcurrency) => {
    setselectedcurrency(selectedcurrency);
  };

  const setReviewDatahandler = (reviewData) => {
    setReviewData(reviewData);
  };

  const setBookDetailshandler = (reviewData) => {
    setbookDetails(reviewData);
  };

  const seteditReturnDatahandler = (editreturnData) => {
    seteditReturnData(editreturnData);
  };

  const setReturnDatahandler = (returnData) => {
    setReturnData(returnData);
  };

  const setCompanySettingshandler = (articles) => {
    setCompanySettings(articles);
  };

  useEffect(() => {
    const initializeApp = async () => {
      fetchSocieteConfig();
      await checkUserLoggedIn();
      fetchArticles();
      fetchCategories();
      fetchCollaborators();
      fetchCollections();
      fetchRemiseCatalogues();
      fetchThemes();
      fetchCompanySettings();
      fetchMyDocuments();
      fetchCountries();
      fetchPublishers();
    };

    initializeApp();
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
    collections,
    fetchCollections,
    themes: themes,
    mydocuments,
    remiseCatalogues: remiseCatalogues,
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
    fetchfavandcartSettings: fetchfavandcartSettings,

    countries,

    societeConfig,

    publishers,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
