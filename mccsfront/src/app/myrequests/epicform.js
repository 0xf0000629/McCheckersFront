import React, { useState } from 'react';
import styles from "../page.module.css";
import { useEffect } from 'react';

export default function EpicForm({ onClose, onSubmit, players }){
  console.log(players);
  const [loser, loserSet] = useState(0);
  const [winner, winnerSet] = useState(0);

  const handleL = (event) => {
    loserSet(event.target.checked);
  };
  const handleW = (event) => {
    winnerSet(event.target.checked);
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
              <option value="0">0</option>
              <option value="1">1</option>
              {loser != "2" ? <option value="2">2</option> : <></>}
          </select>
          <select onChange={handleL} id="score2" name="score2" style={{ padding: '8px', marginRight: '10px' }}>
              <option value="0">0</option>
              <option value="1">1</option>
              {winner != "2" ? <option value="2">2</option> : <></>}
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