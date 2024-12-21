import React, { useState } from 'react';
import styles from "../page.module.css";
import ClipLoader from "react-spinners/ClipLoader";

export default function EpicForm({ isOpen, onClose, onSubmit }){
  if (!isOpen) return null; // Do not render if the pop-up is not open

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create request</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <h2>ROOM:</h2>
            <input id="room" name="room" required />
          </div>
          <div className={styles.formGroup}>
            <h2>LOCATION:</h2>
            <input id="location" name="location" required />
          </div>
          <div className={styles.formGroup}>
            <h2>TIME:</h2>
            <input type="datetime-local" id="time" name="time" required />
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};