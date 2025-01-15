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
  editSearchData,
} from "../../Common/redux/productSlice";
import { TbTruckDelivery } from "react-icons/tb";
import { stripHtmlTags, truncateText } from "../../Common Components/TextUtils";
import axios from "axios";
import { MdAddBox } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [categoryItem, setCategoryItem] = useState(null);

  // useEffect(() => {
  //   bookDatas.forEach((element) => {
  //     setbookData(element);
  //   });
  // }, [bookDatas]);

  const [count, setCount] = React.useState(1);

  const handleCountChange = (event) => {
    const value = parseInt(event.target.value, 10);

  // Only set the count if the value is greater than zero
  if  (value > Number(bookData._qte_a_terme_calcule)) {
    // Reset to minimum if the user tries to input a negative or zero value
    setCount(Number(bookData._qte_a_terme_calcule).toFixed(0));
  } else if (value > 0) {
    setCount(value);
  }else {
    // Reset to minimum if the user tries to input a negative or zero value
    setCount(1);
  }
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
    if (user?.id) {
      if (favorite) {
        authCtx.deleteFavorite(bookData.id);
      } else {
        authCtx.addToFavorite(bookData);
      }
      setfavorite(!favorite);
    } else {
      toast.error(`${language === 'eng' ? "Please login to add to wishlist." : "Veuillez vous connecter pour ajouter à votre liste de souhaits."}`, {
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

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken();
  
  const handleSuivreCollab = async () => {
    if (!user) {
        // If user is not defined, throw an error
        toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`);
        return;
    }

    try {
        // Fetch the list of collaborators
        const collaboratorsResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/collaborators?ecom_type=sofiaco`);
        const collaborators = collaboratorsResponse.data;

        const cleanedAuteur = bookData.dc_auteur.trim();
        // Find the collaborator whose nom + prenom matches bookData.dc_auteur
        const collaborator = collaborators.find(collaborator => {
            const fullName = `${collaborator.nom}`;
            // console.log(fullName.toLowerCase())
            // console.log(cleanedAuteur.toLowerCase())
            return fullName.toLowerCase() === cleanedAuteur.toLowerCase();
        });
        
        if (!collaborator) {
            throw new Error('Collaborator not found');
        }

        // Send the subscription request with the found collaborator's id
        const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
            collaborator_id: collaborator.id,
            ecom_type: 'sofiaco'
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Include token in the headers
            }
        });

        // console.log(response.data);
        toast.success(language === "eng" ? `${collaborator.nom} subscribed successfully!` : `${collaborator.nom} s'est abonné avec succès !`, {hideProgressBar: true}); // You can handle the response here
    } catch (error) {
        // console.error('Error:', error);
        toast.error(error.response?.data?.error || error.message);
    }
};

const handleSuivreEditor = async () => {
  if (!user) {
      // If user is not defined, throw an error
      toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`);
      return;
  }

  try {
      // Fetch the list of collaborators
      const collaboratorsResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/collaborators?ecom_type=sofiaco`);
      const collaborators = collaboratorsResponse.data;

      const cleanedAuteur = bookData.editor._nom.trim();
      // Find the collaborator whose nom + prenom matches bookData.dc_auteur
      const collaborator = collaborators.find(collaborator => {
          const fullName = `${collaborator.nom}`;
          // console.log(fullName.toLowerCase())
          // console.log(cleanedAuteur.toLowerCase())
          return fullName.toLowerCase() === cleanedAuteur.toLowerCase();
      });

      if (!collaborator) {
          throw new Error('Collaborator not found');
      }

      // Send the subscription request with the found collaborator's id
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
          collaborator_id: collaborator.id,
          ecom_type: 'sofiaco',
      }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });

      // console.log(response.data);
      toast.success(`${language === 'eng' ? `${collaborator.nom} subscribed successfully!` : `${collaborator.nom} abonné avec succès !!`}`, {hideProgressBar: true}); // You can handle the response here
  } catch (error) {
      // console.error('Error:', error);
      toast.error(error.response?.data?.error || error.message);
  }
};

const handleSuivreTranslator = async () => {
  if (!user) {
      // If user is not defined, throw an error
      toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`);
      return;
  }

  try {
      // Fetch the list of collaborators
      const collaboratorsResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/collaborators?ecom_type=sofiaco`);
      const collaborators = collaboratorsResponse.data;

      const cleanedAuteur = bookData.dc_traducteur.trim();
      // Find the collaborator whose nom + prenom matches bookData.dc_auteur
      const collaborator = collaborators.find(collaborator => {
          const fullName = `${collaborator.nom}`;
          // console.log(fullName.toLowerCase())
          // console.log(cleanedAuteur.toLowerCase())
          return fullName.toLowerCase() === cleanedAuteur.toLowerCase();
      });

      if (!collaborator) {
          throw new Error('Collaborator not found');
      }

      // Send the subscription request with the found collaborator's id
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
          collaborator_id: collaborator.id,
          ecom_type: 'sofiaco',
      }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });

      // console.log(response.data);
      toast.success(`${language === 'eng' ? `${collaborator.nom} subscribed successfully!` : `${collaborator.nom} abonné avec succès !!`}`, {hideProgressBar: true}); // You can handle the response here
  } catch (error) {
      // console.error('Error:', error);
      toast.error(error.response?.data?.error || error.message);
  }
};

const handleSuivreIllustrateur = async () => {
  if (!user) {
      // If user is not defined, throw an error
      toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`);
      return;
  }

  try {
      // Fetch the list of collaborators
      const collaboratorsResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/collaborators?ecom_type=sofiaco`);
      const collaborators = collaboratorsResponse.data;

      const cleanedAuteur = bookData.dc_illustrateur.trim();
      // Find the collaborator whose nom + prenom matches bookData.dc_auteur
      const collaborator = collaborators.find(collaborator => {
          const fullName = `${collaborator.nom}`;
          // console.log(fullName.toLowerCase())
          // console.log(cleanedAuteur.toLowerCase())
          return fullName.toLowerCase() === cleanedAuteur.toLowerCase();
      });

      if (!collaborator) {
          throw new Error('Collaborator not found');
      }

      // Send the subscription request with the found collaborator's id
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
          collaborator_id: collaborator.id,
          ecom_type: 'sofiaco',
      }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });

      // console.log(response.data);
      toast.success(`${language === 'eng' ? `${collaborator.nom} subscribed successfully!` : `${collaborator.nom} abonné avec succès !!`}`, {hideProgressBar: true}); // You can handle the response here
  } catch (error) {
      // console.error('Error:', error);
      toast.error(error.response?.data?.error || error.message);
  }
};

const handleSuivreCollection = async () => {
  if (!user) {
      // If user is not defined, throw an error
      toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`);
      return;
  }

  try {
      // Fetch the list of collaborators
      const collectionsResponse = await axios.get(`${import.meta.env.VITE_TESTING_API}/collections?ecom_type=sofiaco`);
      const collections = collectionsResponse.data;
      const cleanedCollec = bookData.dc_collection.trim();
      // Find the collaborator whose nom + prenom matches bookData.dc_auteur
      const Collectiondata = collections.find(collaborator => {
          const fullName = `${collaborator.nom}`;
          // console.log(fullName.toLowerCase())
          // console.log(cleanedCollec.toLowerCase())
          return fullName.toLowerCase() === cleanedCollec.toLowerCase();
      });

      if (!Collectiondata) {
          throw new Error('Collection not found');
      }

      // Send the subscription request with the found collaborator's id
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
          collection_id: Collectiondata.id,
          ecom_type: 'sofiaco'
      }, {
          headers: {
              Authorization: `Bearer ${token}` // Include token in the headers
          }
      });

      // console.log(response.data);
      toast.success(`${language === 'eng' ? `${Collectiondata.nom} subscribed successfully!` : `${Collectiondata.nom} abonné avec succès !!`}`, {hideProgressBar: true}); // You can handle the response here
  } catch (error) {
      // console.error('Error:', error);
      toast.error(error.response?.data?.error || error.message);
  }
};

useEffect(() => {
  const foundItem = authCtx.categories.find(category => category.id === bookData.b_usr_articletheme_id);
  setCategoryItem(foundItem);
}, [bookData.b_usr_articletheme_id, authCtx.categories]);

const handleSuivreCategory = async () => {
  if (!user) {
    // If user is not defined, throw an error
    toast.error(`${language === 'eng' ? "Please log in first" : "Veuillez d'abord vous connecter"}`, {hideProgressBar: true});
    return;
}
  try {
    const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
      category_id: categoryItem?.id,
      ecom_type: 'sofiaco'
    }, {
      headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
      }
  });
    // console.log(response.data);
    toast.success(`${language === 'eng' ? `${categoryItem?._nom} subscribed successfully!` : `${categoryItem._nom} abonné avec succès !!`}`, {hideProgressBar: true}) // You can handle the response here
  } catch (error) {
    // console.error('Error:', error);
    toast.error(error.response?.data?.error, {hideProgressBar: true})
  }
};

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
        <p style={{ margin: ".5em auto .5em 0",color:bookData._qte_a_terme_calcule > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600" }}>{bookData._qte_a_terme_calcule > 0 ? `${(bookData._qte_a_terme_calcule * 1).toFixed(0)} in stock` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
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
                              bookData.remise_catalogue > 0
                                  ? (
                                    bookData._prix_public_ttc -
                                    bookData._prix_public_ttc * (bookData.remise_catalogue / 100)
                                    ).toFixed(2)
                                  : Number(bookData._prix_public_ttc).toFixed(2)
                              }`
                            : `$${
                              bookData.remise_catalogue > 0
                                  ? (
                                      (bookData._prix_public_ttc -
                                        bookData._prix_public_ttc *
                                          (bookData.remise_catalogue / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    bookData._prix_public_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}{" "}
                              {bookData.remise_catalogue > 0 && <span style={{opacity: "0.8",textDecoration:'line-through',fontSize: "calc(.9rem + 0.3vw)",margin:'0 1em'}} >
                               {currency === "eur" ? `€${Number(bookData._prix_public_ttc).toFixed(2)} `: `$${(bookData._prix_public_ttc * authCtx.currencyRate ).toFixed(2)} `}</span>}  
                    
                     {bookData.remise_catalogue > 0 && <span style={{background:'var(--primary-color)', color:'#fff', padding:'0.2em 0.8em',fontSize: "calc(.9rem + 0.3vw)",borderRadius:'5px'}} >
                      {bookData.remise_catalogue}%</span>} 
          </p>
        </div>
        <div className={classes.bottonsContainer}>
          <TextField
            type="number"
            value={count}
            disabled={bookData._qte_a_terme_calcule < 1}
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
          disabled={bookData._qte_a_terme_calcule < 1} style={{cursor:bookData._qte_a_terme_calcule < 1 &&'not-allowed'}}
            className={classes.addToCartBtn}
            onClick={(event) => {
              event.stopPropagation();
              authCtx.addToCartWithQty( {...bookData, quantity: count} );
            }}
          >
            {" "}
            {language === 'eng' ? 'Add to cart' : 'Ajouter Au Panier'}
          </button>
                          <div className={classes.favoriteIcon}
                            onClick={FavoriteClick}
                          >
                            {favoriteData?.some(
                              (book) => book._favid === bookData.id
                            ) ? (
                              <FavoriteIcon
                                className={classes.fav}
                                fontSize="inherit"
                              />
                            ) : (
                              <FavoriteBorderIcon
                                className={classes.nonfav}
                                fontSize="inherit"
                              />
                            )}
                          </div>
        </div>
        <div className={classes.char_con}>
          <div className={classes.char}>
            <p>{language === 'eng' ? 'Author' : 'Auteur'}</p>
            <p style={{cursor:'pointer'}}
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(editSearchData({ author: bookData.dc_auteur }));
                navigate(`/books`);
              }}
            >
              : {bookData.dc_auteur}
            </p>
            {bookData.dc_auteur && bookData.dc_auteur !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreCollab}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
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
            {bookData.dc_traducteur && bookData.dc_traducteur !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreTranslator}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
          </div>
          <div className={classes.char}>
            <p > {language === 'eng' ? 'Illustrator' : 'Illustrateur'}</p>
            <p >: {bookData.dc_illustrateur}</p>
            {bookData.dc_illustrateur && bookData.dc_illustrateur !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreIllustrateur}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
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
            {bookData.editor && bookData.editor !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreEditor}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
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
            {bookData.dc_collection && bookData.dc_collection !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreCollection}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Category' : 'Catégorie'}</p>
            <p
              onClick={() => {
                localStorage.removeItem("category");
                dispatch(
                  editSearchData({
                    category: bookData.b_usr_articletheme_id,
                  })
                );
                navigate(`/books`);
              }}
              style={{ cursor: "pointer" }}
            >
              : {categoryItem?._nom}
            </p>
            {categoryItem && categoryItem?._nom !== "" && <span  style={{
                background: "var(--primary-color)",
                color:'#fff',
                height:'fit-content',
                fontWeight: "500",
                cursor: "pointer",
                borderRadius:'0.2em',
                padding:'0.2em 0.5em',
                margin:'auto',
                display:'flex'
              }}
               onClick={handleSuivreCategory}> 
                <MdAddBox style={{fontSize:'1.5em', margin:'auto'}}/> 
               </span>}
          </div>
          <div className={classes.char}>
            <p >EAN</p>
            <p >: {bookData._code_barre}</p>
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
