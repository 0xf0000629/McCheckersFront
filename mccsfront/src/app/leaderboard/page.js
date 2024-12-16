'use client'

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePanel from "../profilepanel";

let basedata = [
    {
      "id": 36,
      "firstname": "mike",
      "secondname": "hawk",
      "elo": 2300,
      "rank": "GOAT",
      "matches": 120
    },
    {
      "id": 49,
      "firstname": "may",
      "secondname": "coxlon",
      "elo": 2300,
      "rank": "GOAT",
      "matches": 120
    }
  ];

  let me = {
    "id": -1,
    "firstname": "Guest",
    "secondname": "hawk",
    "elo": 2300,
    "active": true
  }
  
export default function Profile() {
  const token = window.localStorage.getItem('authToken');
  let auth = true;
  if (!token) {
    auth = false;
    //return;
  }
  
  const router = useRouter();
  const [data, setData] = useState(basedata);

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

  useEffect(() => {
    // Function to fetch data
    const fetchLead = async () => {
      const response = await fetch(process.env.LEADERBOARD, {
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
              "id": item.id,
              "firstname": item.name,
              "secondname": item.surname,
              "elo": item.elo,
              "rank": item.rank,
              "matches": item.totalMatches
            });
          }
          setData(loaded);
        });
      }
      else console.log(response);
    }
    fetchLead();
    fetchMe();
  }, []);

  const sendtoprofile = (id) => {
    router.push('/profile/'+id);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
          <button className={styles.maxbutton} onClick={() => router.push("/requests")}>REQUESTS</button>
          <button className={styles.maxbutton} onClick={() => router.push("/matches")}>MATCHES</button>
          <button className={styles.maxbutton} onClick={() => router.push("/leaderboard")}>LEADERBOARDS</button>
          <ProfilePanel name={me.firstname}/>
      </header>
      <main className={styles.main}>
        <h1>LEADERBOARDS</h1>
        {auth == false ? (<h3>not authenticated</h3>) : <></>}
        <div className={styles.reqin}>
          {
            data.slice(0, 100).map((player) => (
              <button key={"player"+player.id} className={styles.leadercard} onClick={() => sendtoprofile(player.id)}>
                <div className={styles.leader}>
                  <h2> {player.firstname} </h2>
                  <h2> {player.secondname} </h2>
                </div>
                <div className={styles.leader}>
                  <h2> {player.elo}, {player.rank}</h2>
                </div>
                <div className={styles.leader}>
                  <h2> Matches won: {player.matches} </h2>
                </div>
              </button>
            ))
          }
        </div>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
