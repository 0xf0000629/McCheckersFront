"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePanel from "../profilepanel";

let basedata = [
  {
    id: 36,
    username: "mike",
    elo: 2300,
    rank: "GOAT",
    matches: 120,
  },
  {
    id: 49,
    username: "may",
    elo: 2300,
    rank: "GOAT",
    matches: 120,
  },
];

export default function Profile() {
  const [token, setToken] = useState(undefined);

  const router = useRouter();
  const [data, setData] = useState([]);

  const [searchbar, setSearch] = useState("");
  const [reroll, setReroll] = useState(0);
  const [me, setMe] = useState({
    id: -1,
    firstname: "Guest",
    secondname: "hawk",
    elo: 2300,
    active: true,
    ismod: false,
  });

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const fetchMe = async () => {
    if (localStorage.getItem("me") != undefined) {
      let loadme = JSON.parse(localStorage.getItem("me"));
      setMe(me);
    }
  };

  const fetchLead = async () => {
    try {
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
              username: item.username,
              elo: item.elo,
              rank: item.rank,
              matches: item.totalMatches,
            });
          }
          setData(loaded);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
    if (!authToken) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchLead();
    fetchMe();
    setReroll(reroll + 1);
  }, [token]);

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
        <ProfilePanel name={me.firstname} token={token} />
      </header>
      <main className={styles.main}>
        <h1>LEADERBOARDS</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchbar}
          onChange={handleSearch}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <div className={styles.reqin}>
          {data
            .filter(item => item.username.startsWith(searchbar))
            .slice(0, 100)
            .map(player => (
              <button
                key={"player" + player.id}
                className={styles.leadercard}
                onClick={() => sendtoprofile(player.id)}
              >
                <div className={styles.leader}>
                  <h2> {player.username} </h2>
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
