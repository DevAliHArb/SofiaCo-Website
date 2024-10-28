import React, { useEffect, useState } from "react";
import classes from "./Subscriptions.module.css";
import {
  Box,
  Divider,
  FormControl,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import EmptySubs from "../../../assets/EmptySubs.png";
import DeleteIcon from "../../../assets/DeleteIcon.svg";
import collabPlaceholder from "../../../assets/collab-placeholder.png";
import collecPlaceholder from "../../../assets/Collectionplaceholder.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import {
  addCollection,
  addSelectedCollab,
  deleteSelectedCollab,
} from "../../Common/redux/productSlice";

const Enordertrackcategories = [
  { category: "All", id: 1 ,label_en:'All' , label_fr:"Tous"},
  { category: "Categories", id: 3 ,label_en:'Categories' , label_fr:" Catégories"},
  { category: "Collaborators", id: 2 ,label_en:'Collaborators' , label_fr:" Collaborateurs"},
  { category: "Collections", id: 3 ,label_en:'Collections' , label_fr:" Collections"},
];

const Subscriptions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.products.userInfo);
  const language = useSelector((state) => state.products.selectedLanguage[0].Language);
  const [selectedCategory, setselectedCategory] = useState("All");
  const [selectedOrder, setselectedOrder] = useState({});
  const [isSelected, setisSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categoryId, setcategoryId] = useState(0);
  const [data, setData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const token = getToken();

  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      // Fetch collaborator_id from subscriptions
      const response1 = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const collaboratorIds = response1.data.data
        .map((item) => item.collaborator_id)
        .filter((id) => id !== null);

      // console.log(collaboratorIds);

         // Check if collaboratorIds array is empty
    if (collaboratorIds.length === 0) {
      // console.log("No collaborators to fetch");
      return; // Exit the function if there are no collaborators
    }

      // Assuming collaboratorIds is an array of IDs
      const queryParams = collaboratorIds.map((id) => `ids[]=${id}`).join("&");
      const url = `https://api.leonardo-service.com/api/bookshop/collaborators?${queryParams}`;

      const response2 = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });

      // console.log(response2);
      setData(response2?.data);
    } catch (error) {
      // console.error("Error fetching collaborators:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCollections = async () => {
    setLoading(true);
    try {
      // Fetch collaborator_id from subscriptions
      const response1 = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const collectionIds = response1.data.data
        .map((item) => item.collection_id)
        .filter((id) => id !== null);
      
         // Check if collaboratorIds array is empty
    if (collectionIds.length === 0) {
      // console.log("No collections to fetch");
      return; // Exit the function if there are no collaborators
    }

      // Assuming collaboratorIds is an array of IDs
      const queryParams = collectionIds.map((id) => `ids[]=${id}`).join("&");
      const url = `https://api.leonardo-service.com/api/bookshop/collections?${queryParams}`;

      const response2 = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });

      console.log(response2);
      setCollectionData(response2?.data);
    } catch (error) {
      // console.error("Error fetching collaborators:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch collaborator_id from subscriptions
      const response1 = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions?ecom_type=sofiaco`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const categoryIds = response1.data.data
        .map((item) => item.category_id)
        .filter((id) => id !== null);
      // console.log(response1.data.data);
      
         // Check if collaboratorIds array is empty
    if (categoryIds.length === 0) {
      // console.log("No collections to fetch");
      return; // Exit the function if there are no collaborators
    }

      // Assuming collaboratorIds is an array of IDs
      const queryParams = categoryIds.map((id) => `ids[]=${id}`).join("&");
      const url = `https://api.leonardo-service.com/api/bookshop/categories?${queryParams}`;

      const response2 = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });

      // console.log(response2);
      setCategoryData(response2?.data);
    } catch (error) {
      // console.error("Error fetching collaborators:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCollaborators();
    fetchCollections();
    fetchCategories()
  }, []);

  const handleChange = (e) => {
    // if (e.target.value === "Collections") {
    //   setData(collectionData);
    // } else if (e.target.value === "Collaborators") {
    //   setData(data);
    // } else {
    //   setData(data);
    // }
    setselectedCategory(e.target.value);
  };

  const handleDeleteCollaborator = async (collaboratorId) => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // Find the subscription entry where user_id matches user.id and collaborator_id matches collaboratorId
      const subscription = response.data.data.find(
        (sub) =>
          sub.user_id === user.id && sub.collaborator_id === collaboratorId
      );
  
      if (!subscription) {
        // console.error("Subscription not found");
        return;
      }
  
      // Get the ID of the subscription entry
      const subscriptionId = subscription.id;
  
      // console.log(subscriptionId);
      // Send a DELETE request to the API endpoint with the subscriptionId
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Display success message
      toast.success(
        language === "eng" ? "Collaborator deleted successfully." : "Collaborateur supprimé avec succès.", {
        hideProgressBar: true,
      });
  
      setData((prevData) =>
        prevData.filter((collab) => collab.id !== collaboratorId)
      );
    } catch (error) {
      // console.error("Error deleting collaborator:", error);
      // Display error message
      toast.error(language === "eng" ? "Error deleting collaborator." : "Erreur lors de la suppression du collaborateur.", {
        hideProgressBar: true,
      });
    }
  };
  
  const handleDeleteCollection = async (collectionId) => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // Find the subscription entry where user_id matches user.id and collection_id matches collectionId
      const subscription = response.data.data.find(
        (sub) => sub.user_id === user.id && sub.collection_id === collectionId
      );
  
      // console.log(subscription);
  
      if (!subscription) {
        // console.error("Subscription not found");
        return;
      }
  
      // Get the ID of the subscription entry
      const subscriptionId = subscription.id;
  
      // Send a DELETE request to the API endpoint with the subscriptionId
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Display success message
      toast.success(language === "eng" ? "Collection deleted successfully." : "Collection supprimée avec succès.", {
        hideProgressBar: true,
      });
  
      
      setCollectionData((prevData) =>
        prevData.filter((collec) => collec.id !== collectionId)
      );
    } catch (error) {
      // console.error("Error deleting collection:", error);
      // Display error message
      toast.error(language === "eng" ? "Error deleting collection." : "Erreur lors de la suppression de la collection.", {
        hideProgressBar: true,
      });
    }
  };
  

  const handleDeleteCategory = async (catId) => {
    try {
      const response = await axios.get(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      // Find the subscription entry where user_id matches user.id and collection_id matches collectionId
      const subscription = response.data.data.find(
        (sub) => sub.user_id === user.id && sub.category_id === catId
      );
  
      // console.log(subscription);
  
      if (!subscription) {
        // console.error("Subscription not found");
        return;
      }
  
      // Get the ID of the subscription entry
      const subscriptionId = subscription.id;
  
      // Send a DELETE request to the API endpoint with the subscriptionId
      await axios.delete(
        `https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Display success message
      toast.success(`${language === 'eng' ? "Category deleted successfully" : "Catégorie supprimée avec succès"}`, {
        hideProgressBar: true,
      });
  
      
      setCategoryData((prevData) =>
        prevData.filter((cat) => cat.id !== catId)
      );
    } catch (error) {
      // console.error("Error deleting collection:", error);
      // Display error message
      toast.error(`${language === 'eng' ? "Error deleting collection" : "Erreur lors de la suppression d'une collection"}`, {
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <div className={classes.settingsContainer}>
        <div className={classes.header}>
          <div />
          <div className={classes.headtitle}>
            <h3 style={{ fontWeight: "600", marginTop: "0.2em" }}>
            {language === 'eng' ? "My Subscriptions" : "Mes Abonnements" }
            </h3>
          </div>
            <Select
              onChange={handleChange}
              value={selectedCategory}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              className={classes.selectt}
              style={{
                border: "none",
                textAlign: "center",
                maxWidth: "100%",
                height: "2.5em",
                borderRadius: ".7em",
                color: "#DED8CC",
                backgroundColor: "var(--forth-color)",
              }}
            >
              {Enordertrackcategories?.map((props) => {
                return (
                  <MenuItem
                    value={props.category}
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #DED8CC",
                      color: "var(--primary-color)",
                      backgroundColor: "var(--forth-color)",
                    }}
                  >
                    {language === 'eng' ? props.label_en : props.label_fr}
                  </MenuItem>
                );
              })}
            </Select>
        </div>
        <div className={classes.grid_con}>
          
        {(data?.length === 0 && collectionData?.length === 0 && CategoryData?.length === 0 ) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
                marginTop:'2em',gridColumn:'1 / -1'
              }}
            >
              <div style={{width:'fit-content',margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family-primary)',fontSize:'calc(.7rem + .3vw)'}}>
                <div style={{width:'fit-content',margin:'auto'}}>
                <img alt='EmptyWishlist' src={EmptySubs} style={{width:"7em" , height:"auto"}}/>
                </div>
                <h1 style={{textAlign:'center'}}>{language === 'eng' ? "You have no" : "Vous n'avez pas" }<br/>{language === 'eng' ? "subscriptions yet!" : " encore d'abonnements!" }</h1>
              </div>
            </div>
          ) : (
            <div className={classes.grid}>
              {(selectedCategory === "Collaborators" && data?.length === 0) ? <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
                marginTop:'2em',gridColumn:'1 / -1'
              }}
            >
              <div style={{width:'fit-content',margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family-primary)',fontSize:'calc(.7rem + .3vw)'}}>
                <div style={{width:'fit-content',margin:'auto'}}>
                <img alt='EmptyWishlist' src={EmptySubs} style={{width:"7em" , height:"auto"}}/>
                </div>
                <h1 style={{textAlign:'center'}}>{language === 'eng' ? "You have no" : "Vous n'avez pas" }<br/>{language === 'eng' ? "subscriptions yet!" : " encore d'abonnements!" }</h1>
              </div>
            </div> : <> 
            {selectedCategory !== "Collections" && selectedCategory !== "Categories" && (
                <>
                  {data?.map((collab) => {
                    if (loading) {
                      return <div>Loading...</div>; // Render a loading indicator while fetching data
                    }
                    return (
                      <div
                        className={classes.card_container}
                        onClick={(event) => {
                          event.stopPropagation();
                          dispatch(deleteSelectedCollab());
                          dispatch(addSelectedCollab(collab));
                          navigate(
                            `/collaborators/${collab.id}/details`
                          );
                        }}
                      >
                        <div
                          className={classes.card_img}
                          style={
                            collab.bg
                              ? {
                                  background: `${collab.bg}`,
                                  padding: "4em 0em",
                                  height: "5em",
                                }
                              : { height: "13em" }
                          }
                        >
                          {collab.image === "" ? (
                            <img
                              src={collabPlaceholder}
                              alt=""
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            <img
                              src={`${collab.image}`}
                              alt=""
                              width="100%"
                              height="100%"
                            />
                          )}
                          <button
                            className={classes.deleteBtn}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteCollaborator(collab.id);
                            }}
                          >
                            <img
                              src={DeleteIcon}
                              style={{ width: "1.2em", margin: "auto" }}
                            />
                          </button>
                        </div>
                        <p>{collab.nom}</p>
                      </div>
                    );
                  })}
                </>
              )}
              </>}
  
             {(selectedCategory === "Collections" && collectionData?.length === 0) ? <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
                marginTop:'2em',gridColumn:'1 / -1'
              }}
            >
              <div style={{width:'fit-content',margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family-primary)',fontSize:'calc(.7rem + .3vw)'}}>
                <div style={{width:'fit-content',margin:'auto'}}>
                <img alt='EmptyWishlist' src={EmptySubs} style={{width:"7em" , height:"auto"}}/>
                </div>
                <h1 style={{textAlign:'center'}}>{language === 'eng' ? "You have no" : "Vous n'avez pas" }<br/>{language === 'eng' ? "subscriptions yet!" : " encore d'abonnements!" }</h1>
              </div>
              </div> : <> {selectedCategory !== "Collaborators" && selectedCategory !== "Categories" && (
                <>
                  {collectionData?.map((collection) => {
                    return (
                      <div
                        className={classes.card_container}
                        onClick={(event) => {
                          event.stopPropagation();
                          dispatch(addCollection({ ...collection, description: collection.discriptif }));
                          navigate(`/collections/${collection.id}/details`);
                        }}
                      >
                        <div
                          className={classes.card_img}
                          style={
                            collection.bg
                              ? {
                                  background: `${collection.bg}`,
                                  padding: "4em 0em",
                                  height: "5em",
                                }
                              : { height: "13em" }
                          }
                        >
                          {collection.image !== null ? (
                            <img
                              src={collection.image}
                              alt=""
                              style={{
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <img
                            src={collecPlaceholder}
                              alt=""
                              style={{
                                objectFit: "contain",
                              }}
                            />
                          )}
                          <button
                            className={classes.deleteBtn}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteCollection(collection.id);
                            }}
                          >
                            <img
                              src={DeleteIcon}
                              style={{ width: "1.2em", margin: "auto" }}
                            />
                          </button>
                        </div>
                        <p>{collection.nom}</p>
                      </div>
                    );
                  })}
                </>
              )}
              </>}
              
             {(selectedCategory === "Categories" && CategoryData?.length === 0) ? <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "2em",
                padding: "5%",
                margin: "auto",
                marginTop:'2em',gridColumn:'1 / -1'
              }}
            >
              <div style={{width:'fit-content',margin:"auto", color:'var(--accent-color)',fontFamily:'var(--font-family-primary)',fontSize:'calc(.7rem + .3vw)'}}>
                <div style={{width:'fit-content',margin:'auto'}}>
                <img alt='EmptyWishlist' src={EmptySubs} style={{width:"7em" , height:"auto"}}/>
                </div>
                <h1 style={{textAlign:'center'}}>{language === 'eng' ? "You have no" : "Vous n'avez pas" }<br/>{language === 'eng' ? "subscriptions yet!" : " encore d'abonnements!" }</h1>
              </div>
            </div> : <> {selectedCategory !== "Collaborators" && selectedCategory !== "Collections" && (
                <>
                  {CategoryData?.map((collection) => {
                    return (
                      <div
                        className={classes.card_container}
                        // onClick={(event) => {
                        //   event.stopPropagation();
                        //   dispatch(addCollection(collection));
                        //   navigate(`/collection-details/${collection.id}`);
                        // }}
                      >
                        <div
                          className={classes.card_img}
                          style={
                            collection.bg
                              ? {
                                  background: `${collection.bg}`,
                                  padding: "4em 0em",
                                  height: "5em",
                                }
                              : { height: "13em" }
                          }
                        >
                          {collection?.image === null ? (
                            <img
                              src={collecPlaceholder}
                              alt=""
                              width="50%"
                              height="50%"
                              style={{
                                objectFit: "contain",
                                margin: "5em auto 00 0 ",
                              }}
                            />
                          ) : (
                            <img
                              src={collecPlaceholder}
                              alt=""
                              width="50%"
                              height="50%"
                              style={{
                                objectFit: "contain",
                                margin: "5em auto 00 0 ",
                              }}
                            />
                          )}
                          <button
                            className={classes.deleteBtn}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteCategory(collection.id);
                            }}
                          >
                            <img
                              src={DeleteIcon}
                              style={{ width: "1.2em", margin: "auto" }}
                            />
                          </button>
                        </div>
                        <p>{collection._nom}</p>
                      </div>
                    );
                  })}
                </>
              )}
              </>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
