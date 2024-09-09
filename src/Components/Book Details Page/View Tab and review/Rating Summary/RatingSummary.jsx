import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./RatingSummary.module.css";
import { Rating } from "@mui/material";

const RatingSummary = () => {
  const bookData = useSelector((state) => state.products.selectedBook[0]);
  const language = useSelector(
    (state) => state.products.selectedLanguage[0].Language
  );
  const totalRatings = bookData.bookreview?.length || 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    return (
      bookData.bookreview?.filter((rating) => parseInt(rating.rate) === stars)
        .length || 0
    );
  });

  const getPercentage = (count) => {
    if (totalRatings === 0) {
      return 0; // Return 0 if there are no ratings
    } else {
      return ((count / totalRatings) * 100).toFixed(0); // Calculate percentage otherwise
    }
  };
  
  // Function to calculate average rating
  const calculateAverageRating = () => {
    const reviews = bookData?.bookreview;
    if (!reviews || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rate), 0);
    return (totalRating / reviews.length).toFixed(1); // Adjust precision as needed
  };

  useEffect(() => {
    calculateAverageRating()
  }, [bookData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>{language === 'eng' ? "CUSTOMERS FEEDBACK" : "COMMENTAIRES DES CLIENTS"}</div>
      <div className={styles.rating}>{calculateAverageRating()}</div>
      <Rating
        style={{
          color: "var(--primary-color)",
        }}
        size="small"
        precision={0.5}
        name="read-only"
        value={calculateAverageRating()}
        readOnly
      />
     <div className={styles.subtext}>{language === 'eng' ? "Book Rating" : "Cote du livre"}</div>
      <div className={styles.bars}>
        {[5, 4, 3, 2, 1].map((stars, index) => (
          <div key={stars} className={styles.bar}>
            <LinearProgress
              variant="determinate"
              value={getPercentage(ratingCounts[index])}
              className={styles.barFill}
              sx={{
                flex: 3,
                height: 4,
                margin: '0 0.5rem',
                borderRadius: '5px',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'var(--primary-color)',
                }
              }}
            />
            <span>
              <Rating
                style={{
                  color: "var(--primary-color)",
                }}
                size="small"
                precision={0.5}
                name="read-only"
                value={stars}
                readOnly
              />
            </span>
            <span style={{color:'var(--secondary-color)'}}>{getPercentage(ratingCounts[index])}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
