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
      "moderator_firstname": "richard",
      "moderator_secondname": "harrys",
      "moderator_elo": 2300,
      "players": [
        {
          "id": 36,
          "firstname": "mike",
          "secondname": "hawk",
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
  const [reload, setReload] = useState(false);

  const increment = () => {if (count < (Math.floor(data.length/20)+1))setCount(count + 1);}
  const decrement = () => {if (count > 1) setCount(count - 1);}

  function tryjoin(id, modpriv){
    const index = data.findIndex(item => item.id === id);
    if (index !== -1){
      if (modpriv == 0){
        if (data[index].players.length < 2){
          //request
          alert("requested");
        }
        else alert("this request is full!");
      }
      else{
        if (data[index].moderator_id == undefined){
          //request
          alert("requested");
        }
        else alert("this request already has a moderator in charge!");
      }
    }
    else alert("this request doesn't exist");
  }

  function request_del(id){
    const response = 1;
    if (response == 1){
      const index = data.findIndex(item => item.id === id);
      if (index !== -1) {
          data.splice(index, 1);
      }
      alert("request GONE");
      setReload(!reload);
    }
    else alert("uh-oh");
  }


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
              mod={{"id": request.moderator_id, "surname": request.moderator_secondname, "name": request.moderator_firstname, "elo": request.moderator_elo}}
              players={request.players}
              onClick={() => alert(`You clicked: ${request.id}`)}
              key={request.id}
              joinbutton={() => tryjoin(request.id, modpriv)}
              modbutton={modpriv==1 ? () => request_del(request.id) : undefined}
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
