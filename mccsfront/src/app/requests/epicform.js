"use client";

import React, { useEffect, useState } from 'react';
import styles from "../page.module.css";
import ClipLoader from "react-spinners/ClipLoader";

export default function EpicForm({ isOpen, onClose, onSubmit }){
  if (!isOpen) return null; // Do not render if the pop-up is not open
  const [options1, setOptions1] = useState([ 
      'Abbey Road st. 22',
      'Bourbon st. 43',
      'Novocheckerskaya st. 1244',
      'Broadway st. 47',
      'Oxford st. 525A',
      'Wale  st. 6',
      'Pacific Coast Highway st. 11'
  ]);
  const [options2, setOptions2] = useState([]);

  useEffect(() => {
    let rooms = [];
    for (let i=100;i<=799;i++){
      rooms.push(i+'');
    }
    setOptions2(rooms);
  }, []);

  const [roomv, roomSet] = useState(0);
  const [locationv, locationSet] = useState(0);

  const handleL = (event) => {
    locationSet(event.target.value);
  };
  const handleR = (event) => {
    roomSet(event.target.value);
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create request</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <h2>LOCATION:</h2>
            <select onChange={handleL} id="location" name="location">
              {options1.map((option, id) => (
                <option key={option} value={id+1}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <h2>ROOM:</h2>
            <select onChange={handleR} id="room" name="room">
              {options2.slice((locationv-1)*100, (locationv)*100).map((option, id) => (
                <option key={option} value={id+1}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <h2>TIME:</h2>
            <input className={styles.inputbig} type="datetime-local" id="time" name="time" required />
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};