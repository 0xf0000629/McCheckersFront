"use client";

import Image from "next/image";
import styles from "../page.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import RequestComp from "./requestcomp";
import EpicForm from "./epicform";
import ProfilePanel from "../profilepanel";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let basedata = [
  {
    userid: 37,
    modid: 2,
    reason: "annoying",
  },
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
export default function Reports() {
  const [token, setToken] = useState(undefined);

  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);

  const [formActive, setForm] = useState(false);

  const formOpen = () => {
    setForm(true);
  };
  const formClose = () => {
    setForm(false);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [reroll, setReroll] = useState(0);
  const [me, setMe] = useState({
    id: -1,
    firstname: "Guest",
    secondname: "hawk",
    elo: 2300,
    active: true,
    ismod: false, 
    isadmin: false,
  });

  const increment = () => {
    if (count < Math.floor(data.length / 20) + 1) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const adminrights = 0;

  const fetchReqs = async () => {
    const response = await fetch(process.env.REPORT + "/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      setLoading(false);
      console.log("epic");
      let jsondata = response.json().then(jsondata => {
        let loaded = [];
        for (let i = 0; i < jsondata.length; i++) {
          let item = jsondata[i];
          loaded.push({
            modid: item.moderatorId,
            userid: item.userId,
            reason: item.reason,
          });
        }
        setData(loaded);
      });
    } else console.log(response);
  };
  const fetchMe = async () => {
    if (localStorage.getItem("me") != undefined) {
      let loadme = JSON.parse(localStorage.getItem("me"));
      setMe(loadme);
    }
  };

  console.log("redraw");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
    if (!authToken) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    // Function to fetch data
    fetchReqs();
    fetchMe();
  }, [token]);

  const sendtoprofile = id => {
    router.push("/profile/" + id);
  };

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
          <h1>REPORTS</h1>
          <div className={styles.req}>
          <ClipLoader color="#999999" loading={loading} size={150} aria-label="Loading Spinner" data-testid="loader"/>
            {data.slice((count - 1) * 20, count * 20).map(request => (
              <button
                key={request.userid + "_" + request.modid}
                className={styles.leadercard}
                onClick={() => sendtoprofile(request.userid)}
              >
                <div className={styles.leader}>
                  <h2> UserID: {request.userid} </h2>
                  <h2> ReporterModID: {request.modid} </h2>
                </div>
                <div className={styles.leader}>
                  <h2> Reason: {request.reason} </h2>
                </div>
              </button>
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
