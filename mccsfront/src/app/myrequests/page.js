"use client";

import Image from "next/image";
import styles from "../page.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import RequestComp from "./requestcomp";
import EpicForm from "./epicform";
import ProfilePanel from "../profilepanel.js";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let basedata = [
  {
    id: 1,
    room: 234,
    building: "ADDRESS",
    time: "2020-11-20 11:30:00",
    moderator_firstname: "richard",
    moderator_secondname: "harrys",
    moderator_elo: 2300,
    players: [
      {
        id: -1,
        firstname: "mike",
        secondname: "hawk",
        elo: 2300,
      },
      {
        id: 2,
        firstname: "joe",
        secondname: "mama",
        elo: 2300,
      },
    ],
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
export default function MyRequests() {
  const [token, setToken] = useState(undefined);
  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);
  const [reroll, setReroll] = useState(0);
  const [me, setMe] = useState({
    id: -1,
    firstname: "Guest",
    secondname: "hawk",
    elo: 2300,
    active: true,
    ismod: false, isadmin: false,
  });

  const [formActive, setForm] = useState(false);
  const [reqfocus, setRF] = useState(-1);
  const formClose = () => {
    setForm(false);
  };

  const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

  const [matchp, setmatchp] = useState([]);

  const formOpen = (f, pl) => {
    setmatchp(pl);
    setForm(true);
    setRF(f);
  };

  const router = useRouter();

  const increment = () => {
    if (count < Math.floor(data.length / 20) + 1) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const fetchReqs = async () => {
    const response = await fetch(process.env.REQUEST, {
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
            id: item.id,
            room: item.roomId,
            building: "",
            time: item.dateTime,
            moderator_id: item.moderator?.id,
            moderator_firstname: item.moderator?.name,
            moderator_secondname: item.moderator?.surname,
            moderator_elo: item.moderator?.elo,
            players: [],
          });
          for (let j = 0; j < item.participants.length; j++) {
            loaded[loaded.length - 1].players.push({
              id: item.participants[j].id,
              firstname: item.participants[j].name,
              secondname: item.participants[j].surname,
              elo: item.participants[j].elo,
            });
          }
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

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
    if (!authToken) {
      router.push("/");
    }
  }, []);

  console.log("redraw");
  useEffect(() => {
    if (!token) return;
    fetchMe();
    fetchReqs();
  }, [token]);

  const report_req = async e => {
    e.preventDefault();
    formClose();
    const formData = new FormData(e.target);
    const reqdata = Object.fromEntries(formData.entries());

    const response = await fetch(process.env.MATCH + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requestId: reqfocus,
        success: ((reqdata.succ).toString() !== "false"),
        winnerId: matchp[reqdata.winner].id,
        loserId: matchp[1 - reqdata.winner].id,
        winnerScore: reqdata.score1,
        loserScore: reqdata.score2,
        remark: reqdata.remarks,
        moderatorId: me.id,
      }),
    });

    if (response.ok) {
      console.log("reported");
    } else console.log(response);
  };

  async function leave(id, modpriv) {
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      if (modpriv == 0) {
        const response = await fetch(process.env.REQUEST + "/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log("cool");
          fetchReqs();
        } else console.log(response);
      } else {
        const response = await fetch(process.env.REQUEST + "/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log("cool");
          fetchReqs();
        } else console.log(response);
      }
    } else console.log("this request doesn't exist");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {formActive == true ? (
          <EpicForm
            onClose={formClose}
            onSubmit={report_req}
            players={matchp}
          />
        ) : (
          <></>
        )}
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
        <h1>MY REQUESTS</h1>
        <div className={styles.req}>
        <ClipLoader color="#999999" loading={loading} size={150} aria-label="Loading Spinner" data-testid="loader"/>
          {data
            .filter(
              req =>
                req.players[0]?.id === me.id ||
                req.players[1]?.id === me.id ||
                req?.moderator_id === me.id
            )
            .slice((count - 1) * 20, count * 20)
            .map((request, i) => (
              <RequestComp
                id={request.id}
                place={{ room: request.room, building: request.building }}
                time={request.time}
                mod={{
                  id: request.moderator_id,
                  surname: request.moderator_secondname,
                  name: request.moderator_firstname,
                  elo: request.moderator_elo,
                }}
                players={request.players}
                key={i}
                joinbutton={() => leave(request.id, modpriv)}
                modbutton={
                  me.ismod == true
                    ? () => formOpen(request.id, request.players)
                    : undefined
                }
              />
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
