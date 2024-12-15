'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

let basedata = [
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
  ];

export default function Profile() {
  const token = window.localStorage.getItem('authToken');
  if (!token) {
    console.log("you are not authorized!!!");
    //return;
  }
  const router = useRouter();
  const [data, setData] = useState(basedata);

  useEffect(() => {
    // Function to fetch data
    const fetchLead = async () => {
      const response = await fetch('/api/leader', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        console.log("epic");
        setData(response.json());
      }
      else console.log(response);
    }
    fetchLead();
  }, []);

  const sendtoprofile = (id) => {
    router.push('/profile/'+id);
  }

  return (
    <div className={styles.page}>
      <header>
          <h1>LEADERBOARDS</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.req}>
          {
            data.slice(0, 100).map((player) => (
              <button key={"player"+player.id} className={styles.leadercard} onClick={() => sendtoprofile(player.id)}>
                <div className={styles.reqin}>
                  <h2> {player.firstname} </h2>
                  <h2> {player.secondname} </h2>
                </div>
                <h2> {player.elo} </h2>
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
