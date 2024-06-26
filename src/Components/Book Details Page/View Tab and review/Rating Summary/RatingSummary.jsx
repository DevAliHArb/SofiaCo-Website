import React from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./RatingSummary.module.css";
import { Rating } from "@mui/material";

const RatingSummary = () => {
  const bookData = useSelector((state) => state.products.selectedBook[0]);
  const totalRatings = bookData.bookreview?.length || 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    return (
      bookData.bookreview?.filter((rating) => parseInt(rating.rate) === stars)
        .length || 0
    );
  });

  const getPercentage = (count) => ((count / totalRatings) * 100).toFixed(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>CUSTOMERS FEEDBACK</div>
      <div className={styles.rating}>{bookData?.average_rate}</div>
      <Rating
                style={{
                  color: "var(--primary-color)",
                }}
                size="small"
                precision={0.5}
                name="read-only"
                value={bookData?.average_rate}
                readOnly
              />
      <div className={styles.subtext}>Book Rating</div>
      <div className={styles.bars}>
        {[5, 4, 3, 2, 1].map((stars, index) => (
          <div key={stars} className={styles.bar}>
            <LinearProgress
              variant="determinate"
              value={getPercentage(ratingCounts[index])}
              className={styles.barFill}
              sx={{
                flex: 5,
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
            <span>{getPercentage(ratingCounts[index])}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
