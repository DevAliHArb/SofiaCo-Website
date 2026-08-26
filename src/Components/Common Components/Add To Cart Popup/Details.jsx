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
  updateSelectedVariants,
  resetSelectedVariants,
  updateSelectedVariantProduct,
  resetSelectedVariantProduct,
} from "../../Common/redux/productSlice";
import { TbTruckDelivery } from "react-icons/tb";
import { stripHtmlTags, truncateText } from "../../Common Components/TextUtils";
import axios from "axios";
import { MdAddBox } from "react-icons/md";
import { useNavigate } from "@hooks/useNavigate";

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
    const maxQty = Number(resolvedAvailableQty || 0);

  // Only set the count if the value is greater than zero
  if  (maxQty > 0 && value > maxQty) {
    // Reset to minimum if the user tries to input a negative or zero value
    setCount(Number(maxQty).toFixed(0));
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
    return sessionStorage.getItem('token');
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

      const cleanedAuteur = bookData?.dc_editor.trim();
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

const handleCatClick = async () => {
      dispatch(resetSearchData());
      localStorage.removeItem("stock");
      localStorage.removeItem("categories");
      localStorage.removeItem("collections");
      localStorage.removeItem("multiproductids");
      localStorage.removeItem("publishers");
      localStorage.removeItem("subCategories");
      localStorage.removeItem("subSubCategories");
      localStorage.removeItem("parentCategories");
      localStorage.removeItem("min_price");
      localStorage.removeItem("max_price");
      // Retrieve the existing categories from localStorage (or initialize an empty array)
      let storedCategories =
        JSON.parse(localStorage.getItem("categories")) || [];

      if (storedCategories.includes(categoryItem?.id)) {
        // If the clicked category is already selected, remove it
        return navigate(`/main/products`)
      } else {
        // Otherwise, add the new category
        storedCategories.push(categoryItem?.id);
      }

      // Update localStorage
      localStorage.setItem("categories", JSON.stringify(storedCategories));

      // Dispatch action to update search data with the updated category list
      dispatch(addSearchData({ category: storedCategories }));

      navigate(`/main/products`)
    };

    
    const handleFilterCollaborator = (collaboratorName) => {
      const cleanString = (str) => str?.toLowerCase().replace(/[^a-z0-9]/gi, '');
      const collaboratorId = authCtx.collaborators.find(
        collab => cleanString(collab.nom) === cleanString(collaboratorName)
      )?.id;
      localStorage.removeItem("stock");
      localStorage.removeItem("categories");
      localStorage.removeItem("collections");
      localStorage.removeItem("multiproductids");
      localStorage.removeItem("publishers");
      localStorage.removeItem("subCategories");
      localStorage.removeItem("subSubCategories");
      localStorage.removeItem("parentCategories");
      localStorage.removeItem("min_price");
      localStorage.removeItem("max_price");
      dispatch(resetSearchData());
      dispatch(addSearchData({ collaborators: collaboratorId }));
      navigate(`/main/products`);
    }

    const handleFilterPublisher = (publisherId) => {
      localStorage.removeItem("stock");
      localStorage.removeItem("categories");
      localStorage.removeItem("collections");
      localStorage.removeItem("multiproductids");
      localStorage.removeItem("publishers");
      localStorage.removeItem("subCategories");
      localStorage.removeItem("subSubCategories");
      localStorage.removeItem("parentCategories");
      localStorage.removeItem("min_price");
      localStorage.removeItem("max_price");
      dispatch(resetSearchData());
      // Get existing publishers from localStorage or initialize empty array
      const existingPublishers = JSON.parse(localStorage.getItem('publishers')) || [];
      // Add the new publisher ID if it doesn't already exist
      if (!existingPublishers.includes(publisherId)) {
        existingPublishers.push(publisherId);
      }
      // Store the updated array back to localStorage
      localStorage.setItem("publishers", JSON.stringify(existingPublishers));
      navigate(`/main/products`);
    }
    
    const handleFilterCollection = (collectionId) => {
      localStorage.removeItem('stock');
      localStorage.removeItem('categories');
      localStorage.removeItem('collections');
      localStorage.removeItem('multiproductids');
      localStorage.removeItem('publishers');
      localStorage.removeItem('subCategories');
      localStorage.removeItem('subSubCategories');
      localStorage.removeItem('parentCategories');
      localStorage.removeItem('min_price');
      localStorage.removeItem('max_price');
      dispatch(resetSearchData());

      // Get existing collections from localStorage or initialize empty array
      const existingCollections = JSON.parse(localStorage.getItem('collections')) || [];
      
      // Add the new collection ID if it doesn't already exist
      if (!existingCollections.includes(collectionId)) {
          existingCollections.push(collectionId);
      }
      
      // Store the updated array back to localStorage
      localStorage.setItem('collections', JSON.stringify(existingCollections)); 

      navigate(`/main/products`);
    }

const [selectedVariants, setSelectedVariants] = useState({});
  const [article_variant_combination, setSelectedCombinationVariants] = useState({});
  const [selectedVariantProductValues, setSelectedVariantProductValues] = useState({});

  const variantProductFields = bookData?.variant_product?.variant_product_combine_fields || [];
  const variantProductRows = bookData?.variant_product?.variants || [];
  const hasVariantProduct = variantProductFields.length > 0 && variantProductRows.length > 0;

  const normalizeVariantText = (value) => String(value || "").trim().toLowerCase();

  const getVariantFieldNameById = (fieldId) => {
    const result = variantProductFields.find((field) => Number(field.id) === Number(fieldId))?.field_name;
    return normalizeVariantText(result);
  };

  const getVariantProductQty = (variantRow) => {
    return Number(variantRow?.product?._qte_a_terme_calcule || 0);
  };

  const getQtyFromObject = (obj) => {
    return Number(obj?._qte_a_terme_calcule || obj?.quantity || 0);
  };

  const extractProductCombination = (product) => {
    const combination = {};
    if (!product?.article_multi_products || !Array.isArray(product.article_multi_products)) {
      return combination;
    }

    product.article_multi_products.forEach((item) => {
      const fieldName = normalizeVariantText(
        item?.lookup_multiproduct_parent?.nom_fr ||
          item?.lookup_multiproduct_parent?.nom ||
          item?.lookup_multiproduct_parent?.field_name
      );
      const valueText = normalizeVariantText(
        item?.lookup_multiproduct?.nom_fr ||
          item?.lookup_multiproduct?.nom ||
          item?.lookup_multiproduct?.display_text ||
          item?.lookup_multiproduct?.value
      );
      if (fieldName && valueText) {
        combination[fieldName] = valueText;
      }
    });

    return combination;
  };

  const variantProductMatchesSelections = (variantRow, selections) => {
    if (!variantRow?.product) {
      return false;
    }

    const productCombination = extractProductCombination(variantRow.product);
    return Object.entries(selections).every(([fieldId, selectedItem]) => {
      const fieldName = getVariantFieldNameById(fieldId);
      const selectedValue = normalizeVariantText(
        selectedItem?.nom_fr || selectedItem?.nom || selectedItem?.display_text || selectedItem?.value
      );
      return fieldName && selectedValue && productCombination[fieldName] === selectedValue;
    });
  };

  const getCompatibleVariantProducts = (selections) => {
    if (!hasVariantProduct) return [];
    return variantProductRows.filter((variantRow) =>
      variantProductMatchesSelections(variantRow, selections)
    );
  };

  const selectedCompatibleVariantProducts = getCompatibleVariantProducts(selectedVariantProductValues);

  const allVariantProductFieldsSelected =
    hasVariantProduct &&
    variantProductFields.every((field) => selectedVariantProductValues[field.id]);

  const selectedVariantProductRow = allVariantProductFieldsSelected
    ? selectedCompatibleVariantProducts.find((variantRow) => getVariantProductQty(variantRow) > 0) ||
      selectedCompatibleVariantProducts[0]
    : null;

  const selectedVariantProductQty = getVariantProductQty(selectedVariantProductRow);

  const resolvedAvailableQty = hasVariantProduct
    ? (allVariantProductFieldsSelected ? selectedVariantProductQty : 0)
    : Number(getQtyFromObject(article_variant_combination) || bookData?._qte_a_terme_calcule || 0);

  const hasPriceRange = (product) =>
    Number(product?._prix_public_ttc_max || 0) > Number(product?._prix_public_ttc || 0);

  const getDiscountedPrice = (price, discount) => {
    const normalizedPrice = Number(price || 0);
    const normalizedDiscount = Number(discount || 0);
    if (normalizedDiscount <= 0) {
      return normalizedPrice;
    }
    return normalizedPrice - normalizedPrice * (normalizedDiscount / 100);
  };

  const formatPriceValue = (price, currentCurrency, currencyRate) => {
    const normalizedPrice = Number(price || 0);
    if (currentCurrency === "eur") {
      return `€${normalizedPrice.toFixed(2)}`;
    }
    return `$${(normalizedPrice * Number(currencyRate || 1)).toFixed(2)}`;
  };

  const getDisplayPrice = (product, discount, currentCurrency, currencyRate) => {
    const minPrice = getDiscountedPrice(product?._prix_public_ttc, discount);
    if (hasPriceRange(product)) {
      const maxPrice = getDiscountedPrice(product?._prix_public_ttc_max, discount);
      return `${formatPriceValue(minPrice, currentCurrency, currencyRate)} - ${formatPriceValue(maxPrice, currentCurrency, currencyRate)}`;
    }
    return formatPriceValue(minPrice, currentCurrency, currencyRate);
  };

  const getOriginalPrice = (product, currentCurrency, currencyRate) => {
    const minPrice = Number(product?._prix_public_ttc || 0);
    if (hasPriceRange(product)) {
      const maxPrice = Number(product?._prix_public_ttc_max || 0);
      return `${formatPriceValue(minPrice, currentCurrency, currencyRate)} - ${formatPriceValue(maxPrice, currentCurrency, currencyRate)}`;
    }
    return formatPriceValue(minPrice, currentCurrency, currencyRate);
  };

  const selectedPricingProduct = selectedVariantProductRow?.product || bookData;
  const selectedPricingDiscount = Number(
    selectedPricingProduct?.discount ?? bookData?.discount ?? 0
  );
  useEffect(() => {
    setSelectedVariants({});
    setSelectedVariantProductValues({});
    setSelectedCombinationVariants({});
    setCount(1);
    dispatch(resetSelectedVariants());
    dispatch(resetSelectedVariantProduct());
  }, [bookData?.id, dispatch]);

  useEffect(() => {
    dispatch(updateSelectedVariantProduct(selectedVariantProductRow?.product || null));
  }, [dispatch, selectedVariantProductRow]);

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
        const newVariant = bookData?.article_variants?.find(pv => pv.id === parseInt(variantId));
        const isNewVariantMandatory = newVariant?.is_mandatory;
  
        // Allow selecting the variant even if quantity is 0; Add to Cart validation handles stock checks.
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
  
              // If no valid combination is found, deselect the previous mandatory variant.
              if (!matchingCombination) {
                delete updatedState[prevVariantId];
              }
            }
          });
        }
      }
  
      dispatch(updateSelectedVariants(updatedState));
      return updatedState;
    });
  };

  const handleVariantProductSelect = (fieldId, item) => {
    setCount(1);
    setSelectedVariantProductValues((prevState) => {
      const updatedState = { ...prevState };
      if (updatedState[fieldId] && updatedState[fieldId].id === item.id) {
        delete updatedState[fieldId];
        return updatedState;
      }

      updatedState[fieldId] = item;

      const compatible = getCompatibleVariantProducts(updatedState);
      const hasStock = compatible.some((row) => getVariantProductQty(row) > 0);

      if (!hasStock) {
        return { [fieldId]: item };
      }

      return updatedState;
    });
  };
    const AddtoBag = (props) => {
    const mandatoryVariants = (bookData?.article_variants || []).filter((variant) => variant.is_mandatory);
    const allMandatorySelected = mandatoryVariants.every(
      (variant) => selectedVariants[variant.id] !== undefined && selectedVariants[variant.id]?.id !== undefined
    );

    if (mandatoryVariants.length > 0 && !allMandatorySelected) {
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

    if (hasVariantProduct && !allVariantProductFieldsSelected) {
      toast.error(language === 'eng' ? "Please select all options." : "Veuillez sélectionner toutes les options.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      return;
    }

    if (hasVariantProduct && resolvedAvailableQty < 1) {
      toast.error(language === 'eng' ? "Selected options are out of stock." : "Les options sélectionnées sont en rupture de stock.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      return;
    }

    if (Number(count) > Number(resolvedAvailableQty)) {
      toast.error(language === 'eng' ? "Requested quantity exceeds stock." : "La quantité demandée dépasse le stock.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      });
      return;
    }

    const variantProduct = selectedVariantProductRow?.product;
  
    const data = {
      ...props,
      ...(variantProduct ? {
        id: variantProduct.id,
        designation: variantProduct.designation || props.designation,
        _prix_public_ttc: variantProduct._prix_public_ttc ?? props._prix_public_ttc,
        _prix_public_ttc_max: variantProduct._prix_public_ttc_max ?? props._prix_public_ttc_max,
        _qte_a_terme_calcule: variantProduct._qte_a_terme_calcule,
        articleimage: variantProduct.articleimage?.length > 0 ? variantProduct.articleimage : props.articleimage,
        _code_barre: variantProduct._code_barre || props._code_barre,
      } : {}),
      items_quantity: Math.min(Number(count), Number(resolvedAvailableQty)),
      // price: props?.discount && props?.discount > 0 ? `${(props._prix_public_ttc - (props._prix_public_ttc * props?.discount * 0.01)).toFixed(2)}` : (props._prix_public_ttc * 1).toFixed(2),
      selectedvariants: selectedVariants,
      selected_variant_product_values: selectedVariantProductValues,
      selected_variant_product: variantProduct,
      parent_product: hasVariantProduct ? props : undefined,
      article_variant_combination: article_variant_combination
    };
    authCtx.addToCart(data);
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
            {bookData?.average_rate}/5 ({bookData?.bookreview?.length} {language === 'eng' ? "reviews" : "revues"})
          </p>
        <h1 className={classes.header}>{bookData.designation}</h1>
        <div className={classes.contentss}>
        </div>
        <div className={classes.priceContainer}>
        <p style={{ margin: ".5em auto .5em 0",color:hasVariantProduct && !allVariantProductFieldsSelected ? "#868686" : resolvedAvailableQty > 0 ? "var(--forth-color)" : "#EE5858",fontWeight:"600" }}>
          {hasVariantProduct && !allVariantProductFieldsSelected
            ? (language === 'eng' ? 'Select all options' : 'Sélectionnez toutes les options')
            : resolvedAvailableQty > 0
              ? (language === 'eng' ? 'IN STOCK' : 'EN STOCK')
              : (language === 'eng' ? 'OUT OF STOCK' : 'HORS STOCK')}
        </p>
          <p
            style={{
              color: "var(--primary-color)",
              fontSize: "calc(1.3rem + 0.4vw)",
              margin: "auto 0",
              paddingRight: "0.5em",
              fontWeight: "700",
            }}
          >
            {getDisplayPrice(
              selectedPricingProduct,
              selectedPricingDiscount,
              currency,
              authCtx.currencyRate
            )}{" "}
            {selectedPricingDiscount > 0 && (
              <span
                style={{
                  opacity: "0.8",
                  textDecoration: "line-through",
                  fontSize: "calc(.9rem + 0.3vw)",
                  margin: "0 1em",
                }}
              >
                {getOriginalPrice(
                  selectedPricingProduct,
                  currency,
                  authCtx.currencyRate
                )}
              </span>
            )}

            {selectedPricingDiscount > 0 && (
              <span
                style={{
                  background: "var(--primary-color)",
                  color: "#fff",
                  padding: "0.2em 0.8em",
                  fontSize: "calc(.9rem + 0.3vw)",
                  borderRadius: "5px",
                }}
              >
                {selectedPricingDiscount}%
              </span>
            )}
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

{bookData?.variant_product?.variant_product_combine_fields?.map((variant) => {
  return (
    <div key={variant.id}>
      <p
        style={{
          fontWeight: '600',
          fontSize: 'calc(.8rem + .3vw)',
          marginBottom: '0.5em',color:"var(--accent-color)"
        }}
      >
        <span style={{color:"var(--secondary-color)"}}>{variant?.field_name}</span> {' '}
        <span style={{ fontWeight: "400" }}>
          <span style={{color:"red"}}>*</span>
        </span>
      </p>
      <div className={classes.selectVariant}>
        {variant.values?.map((item) => {
          const nextSelections = {
            ...selectedVariantProductValues,
            [variant.id]: item,
          };

          const compatibleRowsForItem = getCompatibleVariantProducts(nextSelections);
          const availableQuantity = compatibleRowsForItem.reduce(
            (sum, variantRow) => sum + Math.max(0, getVariantProductQty(variantRow)),
            0
          );
          const isVariantDisabled = availableQuantity <= 0;

          return (
            <div
              key={item.id}
              className={classes.variant_item}
              style={{
                padding: item?.image ? '0' : '1.7em 1em',
                border: selectedVariantProductValues[variant.id]?.id === item.id
                  ? "2px solid var(--secondary-color)"
                  : "2px solid #D9D9D9",
                opacity: isVariantDisabled ? 0.6 : 1,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault();
                handleVariantProductSelect(variant.id, item);
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
                  {item.display_text || item.value || item.nom || item.nom_fr}
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
            disabled={resolvedAvailableQty < 1}
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
          disabled={resolvedAvailableQty < 1} style={{cursor:resolvedAvailableQty < 1 &&'not-allowed'}}
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
      </div>
    </>
  );
};

export default Details;
