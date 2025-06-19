import React, { useEffect, useState } from 'react'
import Video from './Video Section/Video'
import classes from "./CollaboratorDetails.module.css";
import collabPlaceholder from '../../../assets/collab-placeholder.png'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { IoMailOutline } from "react-icons/io5";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OurSelectionBanner from '../../Common Components/Our Selection Banner/OurSelectionBanner';
import MoreAbout from './More About Collab/MoreAbout';

// description
// image
// major
// name
// type

const CollaboratorDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [CollaboratorData, setCollaboratorData] = useState({});
  const user = useSelector((state) => state.products.userInfo);

  const CollaboratorData = useSelector((state) => state.products.selectedCollaborator[0]);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const token = getToken();

  // useEffect(() => {
  //   Collaborators.forEach(element => {
  //     setCollaboratorData(element)
  //   });
  // }, [Collaborators]);
  
  const handleSuivreClick = async (id) => {
    if (!user) {
      // If user is not defined, throw an error
      toast.error(language === "eng" ? "Please log in first." : "Veuillez vous connecter d'abord.");
      return;
  }
    try {
      const response = await axios.post(`${import.meta.env.VITE_TESTING_API}/users/${user.id}/subscriptions`, {
        collaborator_id: id,
        ecom_type: 'sofiaco',
      }, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
      // console.log(response.data);
      toast.success(language === "eng" ? `${CollaboratorData.nom} subscribed successfully!` : `${CollaboratorData.nom} s'est abonné avec succès !`) // You can handle the response here
    } catch (error) {
      // console.error('Error:', error);
      toast.error(error.response.data.error)
    }
  };
  
  const [heroData, setHeroData] = useState({});

  
    const fetchHero = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/website-sections?ecom_type=sofiaco&section_id=collaborator-details-hero`);
        setHeroData(response.data.data[0]?.hero_sections[0])
      } catch (error) {
        // console.error('Error fetching services:', error);
      }
    };
  useEffect(() => {
    fetchHero();
  }, []);

  return (
    <div> <div className={classes.login_con}>
      <OurSelectionBanner props={heroData} />
      <div className={classes.cardContainer}>
        <div className={classes.card} >
          <h1 style={{fontWeight:'600'}} onClick={() => console.log(CollaboratorData)}>{CollaboratorData.nom}</h1>
          <p style={{fontWeight:"500", textTransform:'capitalize'}}>{language === 'eng' ? CollaboratorData.type?.name : CollaboratorData.type?.name_fr}</p>
          <p>{CollaboratorData.biographie}</p>
          <button onClick={()=>handleSuivreClick(CollaboratorData.id)}>{language === 'eng' ? "Follow" : "Suivre" }</button>
          {/* <div className={classes.emailCont}>
            <div className={classes.iconCont}><IoMailOutline style={{fontSize:'1.2em',marginTop:'.3em'}}/>
           </div> <p style={{margin:'auto 0',fontWeight:"500"}}>{CollaboratorData.email}</p>
          </div> */}
        </div>
        <div className={classes.colabImage}>
        {CollaboratorData.image === null || CollaboratorData.image === '' ? 
                    <img src={collabPlaceholder} alt="" width="100%" height="100%" /> 
                    : 
                    <img src={`${CollaboratorData.image}`} alt="" width="100%" height="100%" />  
                }
          {/* <div className={classes.emailContMob}>
            <div className={classes.iconCont}><IoMailOutline style={{fontSize:'1.2em',marginTop:'.3em'}}/>
           </div> <p style={{margin:'auto 0',fontWeight:"500"}}>{CollaboratorData.email}</p>
          </div> */}
        </div>
      </div> 
        {/* <div className={classes.biogrContainer}>
          <h1>Biographie</h1>
          <p style={{fontWeight:"500"}}>{CollaboratorData.biographie}</p>
        </div> */}
    </div>
        {/* <Video /> */}
        <MoreAbout />
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ color: "red" }}
      /> */}
    </div>
  )
}

export default CollaboratorDetails
