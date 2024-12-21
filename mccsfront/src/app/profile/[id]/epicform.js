import React, { useState } from 'react';
import styles from "../../page.module.css";

export default function EpicForm({ isOpen, onClose, onSubmit }){
  if (!isOpen) return null; // Do not render if the pop-up is not open

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Block this user</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <h2>TIME:</h2>
            <input className={styles.inputbig} type="datetime-local" id="time" name="time" required />
          </div>
          <div className={styles.formGroup}>
            <h2>REMARKS: </h2>
            <textarea id="cause" name="cause" placeholder="Your comments..."></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};