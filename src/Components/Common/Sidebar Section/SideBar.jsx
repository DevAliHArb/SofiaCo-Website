import classes from "./SideBar.module.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IoIosArrowDown } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function SideBar({ toggle, isOpen }) {
  
  const [isExpanded, setIsExpanded] = React.useState('');
  
  const list = (anchor) => ( 
    <>
    <button style={{position:'absolute',top:'1.5em',backgroundColor:'transparent',border:'none', right:'1em', color:'#fff'}}>
      <HighlightOffIcon style={{width:'1.2em', height:'1.2em',color:'#FFC799'}} onClick={toggle}/>
    </button>
    <Box
      // sx={{ height: "fit-content !important" }}
      role="presentation"
      className={classes.container}
    >
      
      <List>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'SOFIADIS') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('SOFIADIS')
                                }}} className={classes.navLink}>
            SOFIADIS
              {isExpanded === 'SOFIADIS' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'SOFIADIS' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                    La sofiadis aujourd'hui
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                    Contacts & adresses
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'DISTRIBUTION') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('DISTRIBUTION')
                                }}} className={classes.navLink}>
            DISTRIBUTION
              {isExpanded === 'DISTRIBUTION' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'DISTRIBUTION' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Qu'est-ce que la Distribution?
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Contacts & adresses
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'DIFFUSION') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('DIFFUSION')
                                }}} className={classes.navLink}>
            DIFFUSION
              {isExpanded === 'DIFFUSION' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'DIFFUSION' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                  Qu'est-ce que la diffusion?
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Notre partenaire diffuseur
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'EDITEURS') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('EDITEURS')
                                }}} className={classes.navLink}>
            EDITEURS
              {isExpanded === 'EDITEURS' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'EDITEURS' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Relation éditeurs
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Liste des éditeurs
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'LIBRAIRIES') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('LIBRAIRIES')
                                }}} className={classes.navLink}>
            LIBRAIRIES
              {isExpanded === 'LIBRAIRIES' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'LIBRAIRIES' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Site extranet
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Informations SOFIADIS
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                NOUVEAUTÉS / CATALOGUE
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Conditions Générales de vente
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div>
            <h3 onClick={()=>{if (isExpanded === 'NUMÉRIQUE') {
                                  setIsExpanded('')
                                } else {
                                  setIsExpanded('NUMÉRIQUE')
                                }}} className={classes.navLink}>
            NUMÉRIQUE
              {isExpanded === 'NUMÉRIQUE' ? (
                <span style={{ margin: "auto", paddingRight: "0", rotate: "180deg"}} >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h3>
        <Divider color="#FFC799" width="100%"/>
            {isExpanded === 'NUMÉRIQUE' && (
              <div style={{width:'70%',marginLeft:'20%'}}>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Qu'est ce que le numérique?
                </p>
                <p className={classes.subCaregory} onClick={()=>toast.info('En Cours De Construction!')}>
                Contact et Adresse
                </p>
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text} onClick={()=>toast.info('En Cours De Construction!')}>
            <div>
            <h3 onClick={()=>{setIsExpanded('')}} className={classes.navLink}>
            CONTACT
            </h3>
        
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        
      </List>
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
          width: '100%',
          background:'transparent',
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


{/* <ListItem disablePadding>
          <ListItemButton>
            <ListItemText className={classes.text}>
            <div className={classes.categories}>
            <h2
              onClick={() => setcatisopen(!catopen)}
              style={
                catopen
                  ? {
                      display: "grid",
                      gridTemplateColumns: "80% 20%",
                      borderBottom: "1px solid #B6D8ED",
                      paddingLeft: "0%",
                      paddingBottom: "4%",
                    }
                  : {
                      display: "grid",
                      gridTemplateColumns: "80% 20%",
                      borderBottom: "none",
                    }
              }
            >
              LES CATEGORIES{" "}
              {catopen ? (
                <span
                  style={{
                    margin: "auto",
                    paddingRight: "0",
                    rotate: "180deg",
                  }}
                >
                  <IoIosArrowDown />
                </span>
              ) : (
                <span style={{ margin: "auto", paddingLeft: "0" }}>
                  <IoIosArrowDown />
                </span>
              )}
            </h2>
            {catopen && (
              <div className={classes.dropdown}>
                {treeData.map((data) => {
                  return (
                    <div>
                        <TreeNode data={data} level={0} toggle={toggle}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
            </ListItemText>
          </ListItemButton>
        </ListItem>

      <Divider color="white" width="100%"/>
      */}