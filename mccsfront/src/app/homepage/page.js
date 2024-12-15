'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import RequestComp from "./requestcomp";
import EpicForm from "./epicform";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let basedata = [
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
/*for (let i=2;i<=50;i++){
  basedata.push({
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
}*/
export default function Homepage() {
  const token = window.localStorage.getItem('authToken');
  if (!token) {
    alert("you are not authorized!!!");
    return;
  }

  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);
  const [reload, setReload] = useState(false);

  const [formActive, setForm] = useState(false);

  const formOpen = () => {setForm(true);};
  const formClose = () => {setForm(false);};

  const [data, setData] = useState(basedata);
  

  const increment = () => {if (count < (Math.floor(data.length/20)+1))setCount(count + 1);}
  const decrement = () => {if (count > 1) setCount(count - 1);}

  
  console.log("redraw");
  async () => {
    const response = await fetch('/requests', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    if (response.ok) {
      console.log("epic");
      setData(response.json());
    }
    else console.log(response);
  }

  const create_req = async (e) => {
    e.preventDefault();
    formClose();
    const formData = new FormData(e.target);
    const reqdata = Object.fromEntries(formData.entries());

    const response = await fetch('/requests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ roomId: Number(reqdata.room), dateTime: reqdata.time, creatorId: 1 }),
    });

    if (response.ok){
      data.push({
        "id": 100,
        "room": reqdata.room,
        "building": reqdata.location,
        "time": reqdata.time,
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
      });
      setData([...data]);
    }
    else console.log(response);
  }

  async function tryjoin(id, modpriv){
    const index = data.findIndex(item => item.id === id);
    if (index !== -1){
      if (modpriv == 0){
        if (data[index].players.length < 2){
          const response = await fetch('/requests/' + id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
          });
          if (response.ok)
            alert("cool");
          else console.log(response);
        }
        else alert("this request is full!");
      }
      else{
        if (data[index].moderator_id == undefined){
          const response = await fetch('/requests/' + id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
          });
          if (response.ok)
            alert("cool");
          else console.log(response);
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
      setData([...data]);
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
          <button className={styles.roundbutton} onClick={() => formOpen()}>
            +
          </button>
          <EpicForm
            isOpen={formActive}
            onClose={formClose}
            onSubmit={create_req}
          />
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
