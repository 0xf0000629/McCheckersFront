"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import MatchComp from "./requestcomp";
import EpicForm from "./epicform";
import ProfilePanel from "../profilepanel";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let basedata = [
  {
    request: {
      id: 23,
    },
    success: true,
    winner: {
      id: 36,
      firstname: "mike",
      secondname: "hawk",
      elo: 2300,
    },
    loser: {
      id: 37,
      firstname: "mike",
      secondname: "hawk",
      elo: 2300,
    },
    winnerscore: 0,
    loserscore: 0,
    remark: "AWESOME",
    moderator_id: 3,
    moderator_firstname: "richard",
    moderator_secondname: "harrys",
    moderator_elo: 2300,
  },
];
export default function MatchPage() {
  const [token, setToken] = useState(undefined);
  const [count, setCount] = useState(1);
  const [modpriv, setmodpriv] = useState(0);
  const [formActive, setForm] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
    if (!authToken) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchReqs();
    fetchMe();
    setReroll(reroll + 1);
  }, [token]);

  const formOpen = () => {
    setForm(true);
  };
  const formClose = () => {
    setForm(false);
  };

  const [data, setData] = useState([]);
  const [reroll, setReroll] = useState(0);
  const router = useRouter();
  const [me, setMe] = useState({
    id: -1,
    firstname: "Guest",
    secondname: "hawk",
    elo: 2300,
    active: true,
    ismod: false, isadmin: false,
  });

  const increment = () => {
    if (count < Math.floor(data.length / 20) + 1) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const fetchReqs = async () => {
    try {
      const response = await fetch(process.env.MATCH, {
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
              request: {
                id: item.request.id,
                time: item.request.dateTime,
              },
              success: item.isSuccess,
              winner: {
                id: item.winner.id,
                firstname: item.winner.name,
                secondname: item.winner.surname,
                elo: item.winner.elo,
              },
              loser: {
                id: item.loser.id,
                firstname: item.loser.name,
                secondname: item.loser.surname,
                elo: item.loser.elo,
              },
              winnerscore: item.winnerScore,
              loserscore: item.loserScore,
              remark: item.remark,
              friendlymatch: item.friendlyMatch,
              moderator_id: item.moderator?.id,
              moderator_firstname: item.moderator?.name,
              moderator_secondname: item.moderator?.surname,
              moderator_elo: item.moderator?.elo,
            });
          }
          setData(loaded);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMe = async () => {
    if (localStorage.getItem("me") != undefined) {
      let loadme = JSON.parse(localStorage.getItem("me"));

      setMe(loadme);
    }
  };

  console.log("redraw");

  return (
    <div className={styles.page}>
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
        <h1>AVAILABLE MATCHES</h1>
        <div className={styles.req}>
          {data.slice((count - 1) * 20, count * 20).map((request, i) => (
            <MatchComp key={i} match={request} />
          ))}
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
