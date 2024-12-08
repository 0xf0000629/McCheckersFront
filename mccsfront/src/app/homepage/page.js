'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import RequestComp from "./requestcomp";

const data = [
    {
      "id": 1,
      "room": 234,
      "building": "ADDRESS",
      "time": "2020-11-20 11:30:00",
      "moderator_id": 23,
      "moderator_firstname": "richard",
      "moderator_secondname": "harrys",
      "moderator_elo": 2300,
      "players": [
        {
          "id": 36,
          "firstname": "mike",
          "secondname": "hawk",
          "elo": 2300,
        },
        {
          "id": 49,
          "firstname": "may",
          "secondname": "coxlon",
          "elo": 2300,
        }
      ]
    }
  ];
for (let i=2;i<=50;i++){
  data.push({
    "id": i,
    "room": Math.floor(Math.random()*1000%300),
    "building": "ADDRESS",
    "time": "2020-11-20 11:30:00",
    "moderator_id": 23,
    "moderator_firstname": "richard",
    "moderator_secondname": "harrys",
    "moderator_elo": 2300,
    "players": [
      {
        "id": 36,
        "firstname": "mike",
        "secondname": "hawk",
        "elo": 2300,
      },
      {
        "id": 49,
        "firstname": "may",
        "secondname": "coxlon",
        "elo": 2300,
      }
    ]
  });
}
export default function Homepage() {
  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);

  const increment = () => {if (count < (Math.floor(data.length/20)+1))setCount(count + 1);}
  const decrement = () => {if (count > 1) setCount(count - 1);}

  return (
    <div className={styles.page}>
      <header>
          <button className={styles.normalbutton} onClick={() => setmodpriv(1-modpriv)}>
            BECOME Moderator
          </button>
          {modpriv==0 ? "no mod :(" : "mod :)"}
      </header>
      <main className={styles.main}>
        <div className={styles.req}>
          {
          data.slice((count-1)*20, (count)*20).map((request) => (
            <RequestComp
              id={request.id}
              place={{"room": request.room, "building": request.building}}
              time={request.time}
              mod={{"surname": request.moderator_secondname, "name": request.moderator_firstname, "elo": request.moderator_elo}}
              players={request.players}
              onClick={() => alert(`You clicked: ${request.id}`)}
              key={request.id}
              modbutton={modpriv==1 ? () => alert("request to delete " + request.id) : undefined}
            />
          ))
          }
        </div>
      </main>
      <footer className={styles.footer}>
          <button className={styles.roundbutton} onClick={decrement}>
            -
          </button>
          <h1>{count}</h1>
          <button className={styles.roundbutton} onClick={increment}>
            +
          </button>
      </footer>
    </div>
  );
}
