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
      toast.error('Please log in first');
      return;
  }
    try {
      const response = await axios.post(`https://api.leonardo-service.com/api/bookshop/users/${user.id}/subscriptions`, {
        collaborator_id: id,
      }, {
        headers: {
            Authorization: `Bearer ${token}` // Include token in the headers
        }
    });
      console.log(response.data);
      toast.success(`${CollaboratorData.nom} subscribed successfully!`) // You can handle the response here
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.error)
    }
  };

  return (
    <div> <div className={classes.login_con}>
      <OurSelectionBanner />
      <div className={classes.cardContainer}>
        <div className={classes.card} >
          <h1 style={{fontWeight:'600'}}>{CollaboratorData.nom}</h1>
          {/* <p style={{color:'var(--accent-color)',fontWeight:"500"}}>{CollaboratorData.type}</p> */}
          <p style={{color:'var(--accent-color)',fontWeight:"500"}}>{CollaboratorData.biographie}</p>
          <div className={classes.emailCont}>
            <div className={classes.iconCont}><IoMailOutline style={{fontSize:'1.2em',marginTop:'.3em'}}/>
           </div> <p style={{margin:'auto 0',fontWeight:"500"}}>{CollaboratorData.email}</p>
          </div>
          <button className={classes.suivreBtn}  onClick={()=>handleSuivreClick(CollaboratorData.id)}>Subscribe</button>
        </div>
        <div className={classes.colabImage}>
        {CollaboratorData.image === '' ? 
                    <img src={collabPlaceholder} alt="" width="100%" height="100%" /> 
                    : 
                    <img src={`https://api.leonardo-service.com/img/${CollaboratorData.image}`} alt="" width="100%" height="100%" />  
                }
          <div className={classes.emailContMob}>
            <div className={classes.iconCont}><IoMailOutline style={{fontSize:'1.2em',marginTop:'.3em'}}/>
           </div> <p style={{margin:'auto 0',fontWeight:"500"}}>{CollaboratorData.email}</p>
          </div>
          <button className={classes.suivreBtnMob} onClick={()=>handleSuivreClick(CollaboratorData.id)}>Suivre</button>
        </div>
      </div> 
        <div className={classes.biogrContainer}>
          <h1>Biographie</h1>
          <p style={{fontWeight:"500"}}>{CollaboratorData.biographie}</p>
        </div>
    </div>
        <Video />
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
