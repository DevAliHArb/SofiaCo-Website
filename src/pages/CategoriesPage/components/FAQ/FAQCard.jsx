import React, { useState } from "react";
import classes from "./FAQSection.module.css";
import SouthIcon from "@mui/icons-material/South";

const FAQCard = ({ title, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${classes.faqCard} ${isExpanded ? classes.expanded : ""}`}
      onClick={toggleDescription}
    >
      <div style={{ width: "96%", margin: "auto" }}>
        <h2 style={{ width: "93%" }}>{title}</h2>
        <p className={classes.description}>{description}</p>
        {description && <SouthIcon className={classes.arrow} />}
      </div>
    </div>
  );
};

export default FAQCard;
