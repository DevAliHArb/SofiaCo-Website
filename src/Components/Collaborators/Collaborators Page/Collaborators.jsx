import React, { useContext, useEffect, useState } from "react";
import classes from "./Collaborators.module.css";
import collab_image from "../../../assets/collab-head.png";
import { AuteursArray } from "../../Common/Constants/Data";
import Agenda from "../../Home Page/Agenda Section/Agenda";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Drawer } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { addSelectedCollab, deleteSelectedCollab } from "../../Common/redux/productSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthContext from "../../Common/authContext";
import collabPlaceholder from '../../../assets/collab-placeholder.png'
import nodata from '../../../assets/noCollabFound.svg'

const Collaborators = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [type, setType] = useState("All");
  const [major, SetMajor] = useState("All");
  const [typeopen, setTypeopen] = useState(false);
  const [majoropen, SetMajoropen] = useState(false);
  const [letteropen, setletteropen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [pagenbroute, setpagenbroute] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [from, setfrom] = useState(1);
  const [to, setto] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const withFirstLetters = authCtx.collaborators?.map((person) => {
    const firstLetter = person.nom[0].toLowerCase();
    return { ...person, firstLetter };
  });

  console.log(withFirstLetters)
  const filteredAuthors = withFirstLetters.filter(
    (author) =>
      (selectedLetter === "ALL" || author.firstLetter === selectedLetter.toLowerCase()) &&
      (searchQuery === "" ||
        author.nom.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (type === 'All' || author?.type.nom.toLowerCase() === type.toLowerCase())  // Add "which" filter
      // (major === 'All' || author.major === major.toLowerCase()) // Add "which" filter
    );

  const recordsPerPage = 16;
  const lastIndex = currentpage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredAuthors.slice(firstIndex, lastIndex);
  const pagenb = Math.ceil(filteredAuthors.length / recordsPerPage);
  const numbers = [...Array(pagenb + 1).keys()].slice(1);

  const nextpage = () => {
    if (currentpage !== pagenb) {
      setCurrentPage(currentpage + 1);
      setpagenbroute(pagenbroute + 1);
    }
  };

  const next2page = () => {
    setCurrentPage(pagenb);
    setpagenbroute(pagenb);
  };
  
  const changepage = (id) => {
    setCurrentPage(id);
    setpagenbroute(id);
  };
  const prevpage = () => {
    if (currentpage !== 1) {
      setCurrentPage(currentpage - 1);
      setpagenbroute(pagenbroute - 1);
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
      setto(currentpage * 16);
    }
    if (records.length === 0 ) {
      setfrom(0);
    }else {
      setfrom(currentpage * 16 - 15);
    }
  }, [currentpage, records]);
  //   var  = currentpage * 16 - 16;

  function capitalizeFirstLetter(text) {
    if (!text) {
      return text; // Handle empty input gracefully
    }
  
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <div className={classes.collab}>
      <div className={classes.collab_image_con}>
        <img
          src={collab_image}
          alt="registerImage"
          style={{ height: "100%" }}
          className={classes.collab_image}
        />
        <div className={classes.imageContent}>
          <h2 style={{ margin: "0" }}>Collaborators</h2>
          <p style={{ margin: ".2em 0 0 0" }}>Home / Collaborators</p>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.filters}>
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
              placeholder="Search"
              value={searchQuery}
              className={classes.input}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              style={{
                borderRadius: "20px",
                padding: "0em 0em 0 1em",
                background: "var(--secondary-color)",
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
            <div className={classes.dropdownContainer}>
              <button
                className={classes.btn}
                onClick={() => setTypeopen(!typeopen)}
              >
                {type} {typeopen ? <IoIosClose /> : <IoIosArrowDown />}
              </button>
              <div
                className={`${classes.drop_down} ${
                  typeopen ? classes.show : ""
                }`}
              >
                <button onClick={() => setType("All") & setTypeopen(false)}>
                  All
                </button>
                <div className={classes.border}/>
                <button onClick={() => setType("auteur") & setTypeopen(false)}>
                  Auteurs
                </button>
                <div className={classes.border}/>
                <button
                  onClick={() => setType("traducteur") & setTypeopen(false)}
                >
                  Traducteurs
                </button>
                <div className={classes.border}/>
                <button
                  style={{ borderBottom: "none" }}
                  onClick={() => setType("illustrateur") & setTypeopen(false)}
                >
                  Illustrateurs
                </button>
              </div>
            </div>
            {/* <div className={classes.dropdownContainer}>
              <button
                className={classes.btn}
                onClick={() => SetMajoropen(!majoropen)}
              >
                {major} {majoropen ? <IoIosClose /> : <IoIosArrowDown />}
              </button>
              <div
                className={`${classes.drop_down} ${
                  majoropen ? classes.show : ""
                }`}
              >
                <button onClick={() => SetMajor("All") & SetMajoropen(false)}>
                  All
                </button>
                <div className={classes.border}/>
                <button
                  onClick={() => SetMajor("Romans") & SetMajoropen(false)}
                >
                  Romans
                </button>
                <div className={classes.border}/>
                <button
                  onClick={() => SetMajor("Sciences") & SetMajoropen(false)}
                >
                  Sciences
                </button>
                <div className={classes.border}/>
                <button
                  style={{ borderBottom: "none" }}
                  onClick={() => SetMajor("Islam") & SetMajoropen(false)}
                >
                  Islam
                </button>
              </div>
            </div> */}
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
            <h1>No collaborators <br/>were found!</h1>
          </div>
          :
          <div className={classes.grid}>
          {records.map((author) => (
            <div className={classes.card_container} 
            onClick={(event) => {
              event.stopPropagation();
              dispatch(deleteSelectedCollab());
              dispatch(addSelectedCollab(author));
              navigate(`collaborator-details/${author.id}`);
            }}
            >
              <div className={classes.card_img}>
                {author.image === '' ? 
                  <img src={collabPlaceholder} alt="" width="100%" height="100%" /> 
                  : 
                  <img src={`https://api.leonardo-service.com/img/${author.image}`} alt="" width="100%" height="100%" />  
              }
              </div>
              <div className={classes.bookTitle}>
                <h3>{author.nom}</h3>
                {/* <p>{capitalizeFirstLetter(`${author.type}`)}</p> */}
                {/* <p>{capitalizeFirstLetter(`${author.major}`)}</p> */}
              </div>
            </div>
          ))}
        </div>
          }
          <div className={classes.page_control}>
            <div className={classes.show}>
              <p>
                Showing {from}–{to} of {records.length} results
              </p>
            </div>
            <div className={classes.control}>
              <button onClick={prev2page}>
                <MdKeyboardDoubleArrowLeft className={classes.icon} />
              </button>
              <button onClick={prevpage}>
                <MdKeyboardArrowLeft className={classes.icon} />
              </button>
              {numbers.map((n, i) => {
                if (
                  n === pagenbroute ||
                  n === pagenbroute + 1 ||
                  n === pagenbroute + 2
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
                }
                return null;
              })}
              <button onClick={nextpage}>
                <MdKeyboardArrowRight className={classes.icon} />
              </button>
              <button onClick={next2page}>
                <MdKeyboardDoubleArrowRight className={classes.icon} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Agenda />
    </div>
  );
};

export default Collaborators;
