import React, { useContext, useEffect, useState } from "react";
import classes from "./Publishers.module.css";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { Drawer } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { addSelectedCollab, deleteSelectedCollab } from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../Common/authContext";
import collabPlaceholder from '../../../assets/collab-placeholder.png'
import nodata from '../../../assets/noCollabFound.svg'
import OurSelectionBanner from "../../Common Components/Our Selection Banner/OurSelectionBanner";
import Deals from '../../Home Page/Deals/Deals'
import abs from '../../../assets/collab-abs.png'
import axios from "axios";
import data from '../../../Data.json'

const Publishers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [type, setType] = useState("All");
  const [letteropen, setletteropen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );

  const withFirstLetters = authCtx.publishers?.map((person) => {
    const firstLetter = person?.title[0]?.toLowerCase();
    return { ...person, firstLetter };
  });


  const filteredAuthors = withFirstLetters.filter(
    (author) =>
      (selectedLetter === "ALL" || author.firstLetter === selectedLetter?.toLowerCase()) &&
      (searchQuery === "" ||
        author.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (type === 'All' || author?.type?.name.toLowerCase() === type.toLowerCase())  // Add "which" filter
      // (major === 'All' || author.major === major.toLowerCase()) // Add "which" filter
    );

  const recordsPerPage = 15;
  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredAuthors.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(filteredAuthors.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);

  const scrollToTop = () => {
    document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
  };

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1);
      scrollToTop()
    }
  };

  const next2page = () => {
    setCurrentPage(pagenb);
    setpagenbroute(pagenb);
  };
  
  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id);
    scrollToTop()
  };
  const prevpage = () => {
    if (currentpage !== 1) {
      setCurrentPage(currentpage - 1);
      setpagenbroute(pagenbroute - 1);
      scrollToTop()
    }
  };
  const prev2page = () => {
    setCurrentPage(1);
    setpagenbroute(1);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  const handleAuthorSelect = (author) => {
    onAuthorSelect(author);
    setIsDropdownOpen(false); // Close dropdown on author selection
  };

  useEffect(() => {
    if (currentpage == pagenb) {
      setto(records.length);
    } else if (records.length === 0 ) {
      setto(0);
    } else{
      setto(currentpage * 15);
    }
    if (records.length === 0 ) {
      setfrom(0);
    }else {
      setfrom(currentpage * 15 - 14);
    }
  }, [currentpage, records]);
  //   var  = currentpage * 16 - 16;

  function capitalizeFirstLetter(text) {
    if (!text) {
      return text; // Handle empty input gracefully
    }
  
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  
  const [heroData, setHeroData] = useState({});

  
    const fetchHero = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_TESTING_API}/website-sections?ecom_type=sofiaco&section_id=collaborators-hero`);
        setHeroData(response.data.data[0]?.hero_sections[0])
      } catch (error) {
        // console.error('Error fetching services:', error);
      }
    };
  useEffect(() => {
    fetchHero();
  }, []);


  const gettype = (type) => {
    switch (type) {
      case "All":
        const name = language === "eng" ? "All" : "Tout";
        return name;
      case "auteur":
        const name1 = language === "eng" ? "Authors" : "Auteurs";
        return name1;
      case "traducteur":
        const  name2 = language === "eng" ? "Translators" : "Traducteurs";
       return name2;
       case "illustrateur":
         const  name3 = language === "eng" ? "Illustators" : "Illustrateurs";
        return name3;
        case "editeur":
          const  name4 = language === "eng" ? "Editor" : "Editeur";
         return name4;
      default:
        return "";
    }
  };
  return (
    <div className={classes.collab}>
      <img src={abs} alt="" className={classes.img_abs}/>
      <OurSelectionBanner props={heroData} />
      <div className={classes.content} id='top'>
        <div className={classes.filters}>
            
        <div className={classes.header}>
          <h1 onClick={()=>console.log(records)}>{data.Collections.CollectionsPage.title[language]}</h1>
        </div>
          <div
            style={{
              width: "100%",
              borderRadius: "20px",
              background: "#fff",
              border: "1px solid #f3f3f3",
              // padding: "1% 0",
            }}
            className={classes.custom_select_mob}
          >
            <input
              type="text"
              placeholder={language === 'eng' ? "Search" : "Recherche" }
              value={searchQuery}
              className={classes.input}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              style={{
                borderRadius: "20px",
                padding: "0em 0em 0 1em",
                background: "var(--accent-color)",
                margin: "auto 0",
              }}
            />
            <button
              className={classes.btn1}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <SearchIcon />
            </button>
          </div>
          <div className={classes.filter_btns}>
            <div className={classes.dropdownContainer_letters}>
              <button
                className={classes.btn_letters}
                onClick={() => setletteropen(!letteropen)}
              >
                {selectedLetter}{" "}
                {letteropen ? <IoIosClose /> : <IoIosArrowDown />}
              </button>
              <div
                className={`${classes.drop_down_letters} ${
                  letteropen ? classes.show : ""
                }`}
              >
                {[
                  "ALL",
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "M",
                  "N",
                  "O",
                  "P",
                  "Q",
                  "R",
                  "S",
                  "T",
                  "U",
                  "V",
                  "W",
                  "X",
                  "Y",
                  "Z",
                ].map((letter) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      onClick={() =>
                        setSelectedLetter(`${letter}`) & setletteropen(false)
                      }
                    >
                      {letter}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.letters_con}>
          {[
            "ALL",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
          ].map((letter) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                key={letter}
                className={`${
                  selectedLetter === letter
                    ? classes.letters_con_button_active
                    : classes.letters_con_button
                }`}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
              {selectedLetter === letter && (
                <div className={classes.pointer}></div>
              )}
            </div>
          ))}
        </div>
        <div className={classes.grid_con}>
          {records.length === 0 ?  
          <div className={classes.nodata}>
            <div className={classes.nodata_img}>
              <img src={nodata} alt="" />
            </div>
            {language === 'eng' ? (
  <h1>No publishers <br /> were found!</h1>
) : (
  <h1>Aucun editeur <br /> n'a été trouvé !</h1>
)}
          </div>
          :
          <div className={classes.grid}>
          {records.map((props) => (
            
            <div key={props.id}  onClick={(event) => {
              event.stopPropagation();
              dispatch(deleteSelectedCollab());
              dispatch(addSelectedCollab(props));
              navigate(`/publishers/${props.id}/details`);
            }}
           className={classes.card_container}>
              <div className={classes.card_img}>
                <div className={classes.card_imgimg}>
                {!props.image || props.image === '' ? 
                  <img src={collabPlaceholder} alt="" width="100%" height="100%" /> 
                  : 
                  <img src={`${props.image}`} alt="" width="100%" height="100%" />  
              } 
                </div>
                <div className={classes.card_text}>
                    <div className={classes.hovered_title}>
                      <h2>{props.title}</h2>
                    </div>
                      <p className={classes.p}>{language === 'eng' ? props.type?.name : props.type?.name_fr}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
          }
          <div className={classes.page_control}>
            <div className={classes.show}>
              <p>
              {language === 'eng' ? (
  <>Showing {from}–{to} of {filteredAuthors.length} results</>
) : (
  <>Affichage de {from}–{to} sur {filteredAuthors.length} résultats</>
)}
              </p>
            </div>
            <div className={classes.control}>
              {/* <button onClick={prev2page}>
                <MdKeyboardDoubleArrowLeft className={classes.icon1} />
              </button> */}
              <button onClick={prevpage}>
                <FaArrowLeftLong className={classes.icon1} />
              </button>
              {numbers.map((n, i) => {
                if (
                  n === 1 ||
                  n === pagenb ||
                  n === currentpage - 1 ||
                  n === currentpage ||
                  n === currentpage + 1 ||
                  (n === currentpage + 2 && currentpage === 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        changepage(n);
                        setpagenbroute(n);
                      }}
                      className={`${
                        pagenbroute === n ? classes.selectednb : classes.nb
                      }`}
                    >
                      {n}
                    </button>
                  );
                } else if (
                  n === currentpage - 2 ||
                  n === currentpage + 3
                ) {
                  return (
                    <span key={i} className={classes.ellipsis}>...</span>
                  );
                }
                return null;
              })}
              <button onClick={nextpage}>
                <FaArrowRightLong className={classes.icon1} />
              </button>
              {/* <button onClick={next2page}>
                <MdKeyboardDoubleArrowRight className={classes.icon1} />
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <Deals />
    </div>
  );
};

export default Publishers;
