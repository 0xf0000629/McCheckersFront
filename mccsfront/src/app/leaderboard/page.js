"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
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
  
export default function Profile() {
  const token = window.localStorage.getItem("authToken");
  let auth = true;
  if (!token) {
    auth = false;
    //return;
  }

  const router = useRouter();
  const [data, setData] = useState(basedata);

  const [searchbar, setSearch] = useState("");
  const [reroll, setReroll] = useState(0);
  const [me, setMe] = useState({
    "id": -1,
    "firstname": "Guest",
    "secondname": "hawk",
    "elo": 2300,
    "active": true,
    "ismod": false
  });

  const handleSearch = (e) => {setSearch(e.target.value);};

  const fetchMe = async () => {
    if (localStorage.getItem("me") != undefined){
      let loadme = localStorage.getItem("me");
      setMe(me);
    }
  }

  const fetchLead = async () => {
    try{
      const response = await fetch(process.env.LEADERBOARD, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("epic");
        let jsondata = response.json().then(jsondata => {
          let loaded = [];
          for (let i = 0; i < jsondata.length; i++) {
            let item = jsondata[i];
            loaded.push({
              id: item.id,
              firstname: item.name,
              secondname: item.surname,
              elo: item.elo,
              rank: item.rank,
              matches: item.totalMatches,
            });
          }
          setData(loaded);
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    // Function to fetch data
    fetchLead();
    fetchMe();
    setReroll(reroll+1);
  }, []);

  const sendtoprofile = id => {
    router.push("/profile/" + id);
  };

  return (
    <div className={styles.page}>
      {console.log("redraw")}
      <header className={styles.header}>
        <button
          className={styles.maxbutton}
          onClick={() => router.push("/requests")}
        >
          REQUESTS
        </button>
        <button
          className={styles.maxbutton}
          onClick={() => router.push("/matches")}
        >
          MATCHES
        </button>
        <button
          className={styles.maxbutton}
          onClick={() => router.push("/leaderboard")}
        >
          LEADERBOARDS
        </button>
        <ProfilePanel name={me.firstname}  token={token}/>
      </header>
      <main className={styles.main}>
        <h1>LEADERBOARDS</h1>
        {auth == false ? <h3>not authenticated</h3> : <></>}
        <input
          type="text"
          placeholder="Search..."
          value={searchbar}
          onChange={handleSearch}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <div className={styles.reqin}>
          {data
            .filter(item =>
              (item.firstname + " " + item.secondname).startsWith(searchbar)
            )
            .slice(0, 100)
            .map(player => (
              <button
                key={"player" + player.id}
                className={styles.leadercard}
                onClick={() => sendtoprofile(player.id)}
              >
                <div className={styles.leader}>
                  <h2> {player.firstname} </h2>
                  <h2> {player.secondname} </h2>
                </div>
                <div className={styles.leader}>
                  <h2>
                    {" "}
                    {player.elo}, {player.rank}
                  </h2>
                </div>
                <div className={styles.leader}>
                  <h2> Matches won: {player.matches} </h2>
                </div>
              </button>
            ))}
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
