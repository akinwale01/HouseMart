"use client";

import React from "react";
import styles from "./ScrollingBanner.module.css";

const ScrollingBanner = () => {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.scrollingText}>
        <span>Purchasing Houses has a 20% discount valid till the end of the month</span>
        <span>Purchasing Houses has a 20% discount valid till the end of the month</span>
        <span>Purchasing Houses has a 20% discount valid till the end of the month</span>
        <span>Purchasing Houses has a 20% discount valid till the end of the month</span>
        <span>Purchasing Houses has a 20% discount valid till the end of the month</span>
      </div>
    </div>
  );
};

export default ScrollingBanner;