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
import NoVariants from "../../../assets/NoVariants.png";
import AuthContext from "../../Common/authContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addSearchData,
  addTocart,
  addTocompare,
  addTofavorite,
  deletefavorite,
  editSearchData,
  resetSearchData,
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
  
  
  const handleSuivreCollab = async (collaborator) => {
    if (!user) {
      // If user is not defined, throw an error
      toast.error(
        `${
          language === "eng"
            ? "Please log in first"
            : "Veuillez d'abord vous connecter"
        }`
      );
      return;
    }

    try {

      if (!collaborator) {
        throw new Error("Collaborator not found");
      }

      // Send the subscription request with the found collaborator's id
      const response = await axios.post(
        `${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`,
        {
          collaborator_id: collaborator.id,
          ecom_type: "hanoot",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );

      // console.log(response.data);
      toast.success(`${collaborator.nom} subscribed successfully!`, {
        hideProgressBar: true,
      }); // You can handle the response here
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

const handleCatClick = async () => {
      dispatch(resetSearchData());
      localStorage.removeItem("categories");
      localStorage.removeItem("publishers");
      localStorage.removeItem("collections");
      // Retrieve the existing categories from localStorage (or initialize an empty array)
      let storedCategories =
        JSON.parse(localStorage.getItem("categories")) || [];

      if (storedCategories.includes(categoryItem?.id)) {
        // If the clicked category is already selected, remove it
        return navigate(`/products`)
      } else {
        // Otherwise, add the new category
        storedCategories.push(categoryItem?.id);
      }

      // Update localStorage
      localStorage.setItem("categories", JSON.stringify(storedCategories));

      // Dispatch action to update search data with the updated category list
      dispatch(addSearchData({ category: storedCategories }));

      navigate(`/products`)
    };

    
    const handleFilterCollaborator = (collaboratorId) => {
      localStorage.removeItem("categories");
      localStorage.removeItem("publishers");
      localStorage.removeItem("collections");
      dispatch(resetSearchData());
      dispatch(addSearchData({ collaborators: collaboratorId }));
      navigate(`/products`);
    }

    const handleFilterPublisher = (publisherId) => {
      localStorage.removeItem("categories");
      localStorage.removeItem("publishers");
      localStorage.removeItem("collections");
      dispatch(resetSearchData());
      // Get existing publishers from localStorage or initialize empty array
      const existingPublishers = JSON.parse(localStorage.getItem('publishers')) || [];
      // Add the new publisher ID if it doesn't already exist
      if (!existingPublishers.includes(publisherId)) {
        existingPublishers.push(publisherId);
      }
      // Store the updated array back to localStorage
      localStorage.setItem("publishers", JSON.stringify(existingPublishers));
      navigate(`/products`);
    }
    
    const handleFilterCollection = (collectionId) => {
      localStorage.removeItem('categories'); 
      localStorage.removeItem('publishers'); 
      localStorage.removeItem('collections');
      dispatch(resetSearchData()); 
      
      // Get existing collections from localStorage or initialize empty array
      const existingCollections = JSON.parse(localStorage.getItem('collections')) || [];
      
      // Add the new collection ID if it doesn't already exist
      if (!existingCollections.includes(collectionId)) {
          existingCollections.push(collectionId);
      }
      
      // Store the updated array back to localStorage
      localStorage.setItem('collections', JSON.stringify(existingCollections)); 

      navigate(`/products`);
    }

const [selectedVariants, setSelectedVariants] = useState({});
  const [article_variant_combination, setSelectedCombinationVariants] = useState({});
  useEffect(() => {
    let finalPrice = (bookData?.price * 1); // Start with the base price
  
    // Check if all mandatory variants are selected
    const mandatoryVariants = bookData?.article_variants?.filter(v => v.is_mandatory);
    const allMandatorySelected = mandatoryVariants?.every(variant => selectedVariants[variant.id]);
  
    if (allMandatorySelected) {
      // If all mandatory variants are selected, look for the matching combination
      const selectedVariantItemIds = Object.values(selectedVariants)?.map(item => item.id);
      const matchingCombination = bookData?.article_variant_combinations.find(comb =>
        comb.combination_variant_items?.every(item =>
          selectedVariantItemIds.includes(item.b_usr_article_variant_item_id)
        )
      );
  
      if (matchingCombination) {
        // If a matching combination is found, add its price to the final price
        setSelectedCombinationVariants(matchingCombination)
        finalPrice += parseFloat(matchingCombination.price);
      }
    }
  
    // Iterate over each selected variant
    Object.keys(selectedVariants).forEach((variantId) => {
      const variant = bookData?.article_variants.find(v => v.id === parseInt(variantId));
      const selectedItem = selectedVariants[variantId];
      console.log('testt', selectedItem);
  
      if (!variant.is_mandatory) {
        if (variant.price_type === "change_price") {
          finalPrice = parseFloat(selectedItem.price);  // Replace the base price
        } else if (variant.price_type === "additional") {
          finalPrice += parseFloat(selectedItem.price);  // Add to the base price
        }
      }
    });
  
    // Update the price state with the calculated final price
    // setPrice(finalPrice);
  }, [selectedVariants, bookData]);
  
  const handleVariantSelect = (variantId, item) => {
    setSelectedVariants(prevState => {
      const updatedState = { ...prevState };
      setCount(1)
      // If the same variant item is selected, deselect it
      if (updatedState[variantId] && updatedState[variantId].id === item.id) {
        delete updatedState[variantId];
      } else {
        // Only proceed with selecting the item if its quantity is > 0
        const itemQuantity = item?.quantity || 0;
        const newVariant = bookData?.article_variants?.find(pv => pv.id === parseInt(variantId));
        const isNewVariantMandatory = newVariant?.is_mandatory;
  
        // Prevent selecting non-mandatory variants with quantity <= 0
        if (!isNewVariantMandatory && itemQuantity <= 0) {
          // If it's a non-mandatory variant with no stock, just return the updated state without selecting it
          return updatedState;
        }
  
        // Proceed with selecting the variant if it's either mandatory or has stock for non-mandatory
        updatedState[variantId] = item;
  
        // Apply combination validation for mandatory variants
        if (isNewVariantMandatory) {
          Object.keys(updatedState).forEach(prevVariantId => {
            // Skip checking the currently selected variant itself
            if (parseInt(prevVariantId) === parseInt(variantId)) return;
  
            const prevSelectedVariant = updatedState[prevVariantId];
  
            // Check if the previous variant is mandatory
            const parentVariant = bookData?.article_variants?.find(pv => pv.id === parseInt(prevVariantId));
            const isMandatory = parentVariant?.is_mandatory;
  
            if (isMandatory) {
              const matchingCombinations = bookData?.article_variant_combinations?.filter(comb =>
                comb.combination_variant_items.some(combItem => combItem.b_usr_article_variant_item_id === item.id)
              );
  
              // Find a matching combination with the newly selected variant
              const matchingCombination = matchingCombinations.find(comb => {
                return comb.combination_variant_items.some(
                  combItem =>
                    combItem.b_usr_article_variant_item_id === prevSelectedVariant.id &&
                    comb.combination_variant_items.some(
                      newCombItem => newCombItem.b_usr_article_variant_item_id === item.id
                    )
                );
              });
  
              // If no valid combination or quantity is less than 1, deselect the previous mandatory variant
              if (!matchingCombination || matchingCombination.quantity < 1) {
                delete updatedState[prevVariantId];
              }
            }
          });
        }
      }
  
      return updatedState;
    });
  };
    const AddtoBag = (props) => {
    const allMandatorySelected = bookData?.article_variants?.every((variant) => {
      if (variant.is_mandatory) {
        return selectedVariants[variant.id] !== undefined && selectedVariants[variant.id]?.id !== undefined;
      }
      return true;
    });
  
    if (!allMandatorySelected) {
      toast.error(`Please select all mandatory variants before submitting.`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      return;
    }
  
    const data = {
      ...props,
      items_quantity: count,
      // price: props?.discount && props?.discount > 0 ? `${(props._prix_public_ttc - (props._prix_public_ttc * props?.discount * 0.01)).toFixed(2)}` : (props._prix_public_ttc * 1).toFixed(2),
      selectedvariants: selectedVariants,
      article_variant_combination: article_variant_combination
    };
    authCtx.addToCart(data);
  };
  
    const handleFilterMultiproduct = (multiproductId) => {
      // Clear other filters to focus on this multiproduct
      localStorage.removeItem('categories');
      localStorage.removeItem('publishers');
      localStorage.removeItem('collections');
      dispatch(resetSearchData());

      // Toggle the multiproduct id in localStorage (same behavior as handleMultiProductsChange)
      const existing = JSON.parse(localStorage.getItem('multiproductids')) || [];
      let updated = [];
      if (existing.includes(multiproductId)) {
        updated = existing.filter(id => id !== multiproductId);
      } else {
        updated = [...existing, multiproductId];
      }
      localStorage.setItem('multiproductids', JSON.stringify(updated));

      navigate('/products');
    }
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
            {bookData?.average_rate}/5 ({bookData?.bookreview?.length} {language === 'eng' ? "reviews" : "revues"})
          </p>
        <h1 className={classes.header}>{bookData.designation}</h1>
        <div className={classes.contentss}>
        </div>
        <div className={classes.priceContainer}>
        <p style={{ margin: ".5em auto .5em 0",color:bookData._qte_a_terme_calcule > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600" }}>{bookData._qte_a_terme_calcule > 0 ? ` ${language === "eng" ? "IN STOCK" : "EN STOCK"}` : `${language === "eng" ? "OUT OF STOCK" : "HORS STOCK"}`} </p>
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
                              bookData.discount > 0
                                  ? (
                                    bookData._prix_public_ttc -
                                    bookData._prix_public_ttc * (bookData.discount / 100)
                                    ).toFixed(2)
                                  : Number(bookData._prix_public_ttc).toFixed(2)
                              }`
                            : `$${
                              bookData.discount > 0
                                  ? (
                                      (bookData._prix_public_ttc -
                                        bookData._prix_public_ttc *
                                          (bookData.discount / 100)) *
                                      authCtx.currencyRate
                                    ).toFixed(2)
                                  : (
                                    bookData._prix_public_ttc * authCtx.currencyRate
                                    ).toFixed(2)
                              }`}{" "}
                              {bookData.discount > 0 && <span style={{opacity: "0.8",textDecoration:'line-through',fontSize: "calc(.9rem + 0.3vw)",margin:'0 1em'}} >
                               {currency === "eur" ? `€${Number(bookData._prix_public_ttc).toFixed(2)} `: `$${(bookData._prix_public_ttc * authCtx.currencyRate ).toFixed(2)} `}</span>}  
                    
                     {bookData.discount > 0 && <span style={{background:'var(--primary-color)', color:'#fff', padding:'0.2em 0.8em',fontSize: "calc(.9rem + 0.3vw)",borderRadius:'5px'}} >
                      {bookData.discount}%</span>} 
          </p>
        </div>
        
            {bookData?.article_variants?.map((variant) => {
  return (
    <div key={variant.id}>
      <p
        style={{
          fontWeight: '600',
          fontSize: 'calc(.8rem + .3vw)',
          marginBottom: '0.5em',color:"var(--accent-color)"
        }}
        onClick={() => console.log(selectedVariants)}
      >
        <span style={{color:"var(--secondary-color)"}}>{variant?.nom}</span> {' '}
        <span style={{ fontWeight: "400" }}>
          {/* {selectedVariants[variant.id]?.value} */}
          <span style={{color:"red"}}>{variant?.is_mandatory && "*"}</span>
        </span>
      </p>
      <div className={classes.selectVariant}>
        {variant.variant_items?.map((item) => {
  // Find all combinations that contain the current variant item
  const matchingCombinations = bookData?.article_variant_combinations?.filter(comb =>
    comb.combination_variant_items.some(combItem => combItem.b_usr_article_variant_item_id === item.id)
  );

  // Initialize availableQuantity
  let availableQuantity = 0;
  if (!variant.is_mandatory) {
    // If the variant is not mandatory, take the item's own quantity
    availableQuantity = item.quantity > 0 ? item.quantity : 0;
  } else{

  // Check if any items from other variant_ids are selected
  
  const selectedMandatoryVariants = Object.keys(selectedVariants)
  ?.map(key => ({ key, variant: selectedVariants[key] }))  // Map the objects by key
  ?.filter(({ variant }) => {
    const parentVariant = bookData?.article_variants?.find(pv => pv.id === variant.b_usr_article_variant_id);
    return parentVariant && parentVariant.is_mandatory;
  })
  .reduce((acc, { key, variant }) => {
    acc[key] = variant;  // Add the filtered variants back into an object using the original key
    return acc;
  }, {});

  const selectedOtherVariants = Object.keys(selectedMandatoryVariants)?.filter(variantId => 
    parseInt(variantId) !== variant.id
  );

  if (selectedOtherVariants.length === 0) {
    // No other variants are selected, sum all matching combinations' quantities
    availableQuantity = matchingCombinations.reduce((totalQty, comb) => {
      return totalQty + (comb.quantity > 0 ? comb.quantity : 0);
    }, 0);
  } else {
    // Some other variant items are selected, so filter combinations that match those
    matchingCombinations.forEach(comb => {
      // Check if all selected other variants match the combination items
      const isValidCombination = selectedOtherVariants?.every(variantId => {
        const selectedVariantItem = selectedVariants[variantId];

        // Find the corresponding combination item for the selected other variant
        const combItem = comb.combination_variant_items.find(item => item.variant_item.b_usr_article_variant_id == variantId);

        // Check if the combination item exists and matches the selected variant item
        return combItem && selectedVariantItem.id === combItem.b_usr_article_variant_item_id;
      });

      // If it's a valid combination and has quantity, add it to availableQuantity
      if (isValidCombination && comb.quantity > 0) {
        availableQuantity += comb.quantity;
      }
    });
  }
}
  // Determine if this item should be disabled based on available quantity
  const isVariantDisabled = availableQuantity <= 0;


          return (
            <div
              key={item.id}
              className={classes.variant_item}
              style={{
                padding: item?.image ? '0' : '1.7em 1em',
                border: selectedVariants[variant.id]?.id === item.id
                  ? "2px solid var(--secondary-color)"
                  : "2px solid #D9D9D9",
                opacity: isVariantDisabled ? 0.6 : 1,
              }}
              onClick={(e) => {
                e.preventDefault();
                handleVariantSelect(variant.id, item);
              }}
            >
              {item?.image ? (
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: '4.5em',
                    height: '4.5em',
                    margin: '0',
                    padding: "0",
                    display: 'block'
                  }}
                />
              ) : (
                <p style={{ fontSize:'calc(.6rem + .3vw)', margin: '0' }}>
                  {item.value} 
                  {/* <span style={{color:"red"}}>{variant?.is_mandatory && "”"}</span>  */}
                </p>
              )}
              {isVariantDisabled && (
                <div className={classes.diagonaloverlay}>
                  <img src={NoVariants} alt="" style={{width:"100%",height:"100%"}}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
})}
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
              AddtoBag(bookData);
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
          {/* Grouped Collaborators Rendering */}
          {bookData?.collaborators && bookData?.collaborators.length > 0 && (() => {
            // Group collaborators by type_id
            const groupedCollaborators = bookData.collaborators.reduce((acc, collab) => {
              const typeId = collab.type_id;
              if (!acc[typeId]) {
                acc[typeId] = {
                  type: collab.type,
                  type_fr: collab.type_fr,
                  collaborators: []
                };
              }
              acc[typeId].collaborators.push(collab);
              return acc;
            }, {});

            // Convert to array and render
            return Object.values(groupedCollaborators).map((group, index) => {
              return (
                <div key={index} className={index % 2 === 0 ? classes.char : classes.char}>
                  <p style={{fontWeight:'400', textTransform:'capitalize'}}>{language === 'eng' ? group.type : group.type_fr}</p>
                  <p style={{fontWeight:'400', cursor:'pointer'}}>
                    {group.collaborators.map((collab, idx) => (
                      <span key={idx}>
                        <span
                          onClick={() => handleFilterCollaborator(collab.id)}
                          style={{cursor:'pointer', borderBottom: '1px solid var(--primary-color)'}}
                        >
                          {collab.nom}
                        </span>
                        {idx < group.collaborators.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                </div>
              );
            });
          })()}
          <div className={classes.char}>
            <p >{language === 'eng' ? "Publishing house" : "Maison d'édition" }</p>
            <p style={{cursor:'pointer'}}
              onClick={() => handleFilterPublisher(bookData?.editor?.id)}
            >
              : {bookData?.editor?._nom}
            </p>
          </div>
          <div className={classes.char}>
            <p >{language === 'eng' ? 'Collection' : 'Collection'}</p>
            <p
              onClick={() => handleFilterCollection(bookData?.b_usr_article_collection_id)}
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
              onClick={() => handleCatClick()}
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
          {bookData.characteristics?.map((charac, index) => (
            <div key={index} className={ classes.char}>
              <p>{charac.name}</p>
              <p> : {charac.multiproductData?.map((data, i) => (
                <span key={i}><span
                          onClick={() => handleFilterMultiproduct(data.id)}
                          style={{ cursor: 'pointer', borderBottom: '1px solid var(--primary-color)' }}
                        >{data.name}</span> {i < charac.multiproductData.length - 1 ? ', ' : ''}</span>
              ))}</p>
            </div>
          ))}
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
