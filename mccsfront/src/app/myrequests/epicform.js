import React, { useState } from 'react';
import styles from "../page.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect } from 'react';

export default function EpicForm({ onClose, onSubmit, players }){
  console.log(players);
  const [options1, setOptions1] = useState(['0', '1', '2']);
  const [options2, setOptions2] = useState(['0', '1', '2']);
  const [loser, loserSet] = useState(0);
  const [winner, winnerSet] = useState(0);

  const handleL = (event) => {
    loserSet(event.target.value);
    if (event.target.value === '2') {
      setOptions1(['0', '1']);
    } else {
      setOptions1(['0', '1', '2']);
    }
  };
  const handleW = (event) => {
    winnerSet(event.target.value);
    if (event.target.value === '2') {
      setOptions2(['0', '1']);
    } else {
      setOptions2(['0', '1', '2']);
    }
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Pop-Up Form</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <h2>Successful? </h2>
            <input type="checkbox" id="succ" name="succ"/>
          </div>

          <div className={styles.formGroup}>
            <h2>WINNER: </h2>
            <select id="winner" name="winner" style={{ padding: '8px', marginRight: '10px' }}>
                <option value="0">{players[0].firstname + ' ' + players[0].secondname}</option>
                <option value="1">{players[1].firstname + ' ' + players[1].secondname}</option>
            </select>
          </div>

          <select onChange={handleW} id="score1" name="score1" style={{ padding: '8px', marginRight: '10px' }}>
            {options1.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select onChange={handleL} id="score2" name="score2" style={{ padding: '8px', marginRight: '10px' }}>
            {options2.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className={styles.formGroup}>
            <h2>REMARKS: </h2>
            <textarea id="remarks" name="remarks" placeholder="Your comments..."></textarea>
          </div>


          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};