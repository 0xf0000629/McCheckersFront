'use client'

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import RequestComp from "./requestcomp";
import EpicForm from "./epicform";
import ProfilePanel from "../profilepanel";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let me = {
  "id": -1,
  "firstname": "Guest",
  "secondname": "hawk",
  "elo": 2300,
  "active": true
}
let basedata = [
  {
    "userid": 37,
    "modid": 2,
    "reason": "annoying"
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
  let auth = true;
  if (!token) {
    auth = false;
    //return;
  }

  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);
  const [reload, setReload] = useState(false);

  const [formActive, setForm] = useState(false);

  const formOpen = () => {setForm(true);};
  const formClose = () => {setForm(false);};

  const [data, setData] = useState(basedata);
  const router = useRouter();
  

  const increment = () => {if (count < (Math.floor(data.length/20)+1))setCount(count + 1);}
  const decrement = () => {if (count > 1) setCount(count - 1);}

  const adminrights = 0;

  const fetchReqs = async () => {
    const response = await fetch(process.env.REQUEST, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    if (response.ok) {
      console.log("epic");
      let jsondata = response.json().then(jsondata => {
        let loaded = [];
        for (let i=0;i<jsondata.length;i++){
          let item = jsondata[i];
          loaded.push({
            "modid": item.moderatorId,
            "userid": item.userId,
            "reason": item.reason,
          });
        }
        setData(loaded);
      });
    }
    else console.log(response);
  }
  const fetchMe = async () => {
    const response = await fetch(process.env.USER+"/me", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    if (response.ok) {
      console.log("got you");
      let jsondata = response.json().then(jsondata => {
        me.id = jsondata.id;
        me.firstname = jsondata.name;
        me.secondname = jsondata.surname;
        me.elo = jsondata.elo;
        me.active = jsondata.active;
        me.ismod = jsondata.isModerator;
      });
    }
    else console.log(response);
  }
  const fetchAdmin = async () => {
    const adminreq = await fetch(process.env.API+'/admin', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    if (adminreq.ok){
      adminrights = 1;
    }
    else console.log("not an admin...");
  }

  console.log("redraw");
  useEffect(() => {
    // Function to fetch data
    fetchReqs();
    fetchMe();
    fetchAdmin();
  }, []);

  const sendtoprofile = (id) => {
    router.push('/profile/'+id);
  }
  if (adminrights == 0)
  return (
    <div className={styles.page}><h1>you are not an admin</h1></div>);
  else
  return (
    <div className={styles.page}>
      <header className={styles.header}>
          <button className={styles.maxbutton} onClick={() => router.push("/requests")}>REQUESTS</button>
          <button className={styles.maxbutton} onClick={() => router.push("/matches")}>MATCHES</button>
          <button className={styles.maxbutton} onClick={() => router.push("/leaderboard")}>LEADERBOARDS</button>
          <ProfilePanel name={me.firstname}/>
      </header>
      <main className={styles.main}>
        <h1>REPORTS</h1>
        {auth == false ? (<h3>not authenticated</h3>) : <></>}
        <div className={styles.req}>
          {
          data.slice((count-1)*20, (count)*20).map((request) => (
            <button key={request.userid+"_"+request.modid} className={styles.leadercard} onClick={() => sendtoprofile(request.userid)}>
                <div className={styles.leader}>
                  <h2> UserID: {request.userid} </h2>
                  <h2> Reported by: {request.modid} </h2>
                </div>
                <div className={styles.leader}>
                  <h2> Reason: {request.reason} </h2>
                </div>
            </button>
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