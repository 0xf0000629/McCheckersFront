"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import RequestComp from "./requestcomp";
import EpicForm from "./epicform";
import ProfilePanel from "../profilepanel";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

let me = {
  id: -1,
  firstname: "Guest",
  secondname: "hawk",
  elo: 2300,
  active: true,
};
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
        id: 36,
        firstname: "mike",
        secondname: "hawk",
        elo: 2300,
      },
    ],
  },
];
let basebuilding = [
  {
    name: "Joe Mama St.",
    rooms: ["100", "101", "102"],
  },
  {
    name: "Mike Oxlong St.",
    rooms: ["200", "201", "202"],
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
export default function Homepage() {
  const token = window.localStorage.getItem("authToken");
  const router = useRouter();
  let auth = true;
  if (!token) {
    auth = false;
    router.push("/");
  }

  const [count, setCount] = useState(1);

  const [modpriv, setmodpriv] = useState(0);
  const [reload, setReload] = useState(false);

  const [formActive, setForm] = useState(false);

  const formOpen = () => {
    setForm(true);
  };
  const formClose = () => {
    setForm(false);
  };

  const [data, setData] = useState(basedata);

  const increment = () => {
    if (count < Math.floor(data.length / 20) + 1) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const fetchBuildings = async () => {
    const response = await fetch(process.env.REQUEST, {
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
            name: item.id,
            rooms: [],
          });
          for (let j = 0; j < item.rooms.length; j++) {
            loaded[loaded.length - 1].players.push(item.rooms[j]);
          }
        }
        setData(loaded);
      });
    } else console.log(response);
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
    const response = await fetch(process.env.USER + "/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    } else console.log(response);
  };

  console.log("redraw");
  useEffect(() => {
    // Function to fetch data
    fetchBuildings();
    fetchReqs();
    fetchMe();
  }, []);

  const create_req = async e => {
    e.preventDefault();
    formClose();
    const formData = new FormData(e.target);
    const reqdata = Object.fromEntries(formData.entries());

    const response = await fetch(process.env.REQUEST + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId: Number(reqdata.room),
        dateTime: reqdata.time,
      }),
    });

    if (response.ok) {
      fetchReqs();
    } else console.log(response);
  };

  async function tryjoin(id, modpriv) {
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      if (modpriv == 0) {
        if (data[index].players.length < 2) {
          const response = await fetch(process.env.REQUEST + "/" + id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) alert("cool");
          else console.log(response);
        } else alert("this request is full!");
      } else {
        if (data[index].moderator_id == undefined) {
          const response = await fetch(process.env.REQUEST + "/" + id, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) alert("cool");
          else console.log(response);
        } else alert("this request already has a moderator in charge!");
      }
    } else alert("this request doesn't exist");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <EpicForm
          isOpen={formActive}
          onClose={formClose}
          onSubmit={create_req}
        />
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
        <ProfilePanel name={me.firstname} />
      </header>
      <main className={styles.main}>
        <h1>AVAILABLE REQUESTS</h1>
        {auth == false ? <h3>not authenticated</h3> : <></>}
        <button className={styles.roundbutton} onClick={() => formOpen()}>
          +
        </button>
        <div className={styles.req}>
          {data.slice((count - 1) * 20, count * 20).map(request => (
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
              key={request.id}
              joinbutton={() => tryjoin(request.id, modpriv)}
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
