'use client'

import Image from "next/image";
import styles from "../../page.module.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfilePanel from "@/app/profilepanel";
import EpicForm from "./epicform.js";

let me = {
  "id": -1,
  "firstname": "Guest",
  "secondname": "hawk",
  "elo": 2300,
  "active": true,
  "ismod": false
}
let data = {
  "id": 0,
  "firstname": "Place",
  "secondname": "Holder",
  "phone": "+79009009090",
  "elo": 3333,
  "rank": "GOAT",
  "active": true,
  "ismod": false
};

export default function Profile() {
  const token = window.localStorage.getItem('authToken');
  if (!token) {
    console.log("you are not authorized!!!");
    //return;
  }
  const params = useParams();
  const id = params.id;
  let adminrights = 0;

  const [ismod, setMod] = useState(false);
  const [active, setActive] = useState(false);

  const [formActive, setForm] = useState(false);
  const router = useRouter();

  const formOpen = () => {setForm(true);};
  const formClose = () => {setForm(false);};


  useEffect(() => {
    // Function to fetch data
    const fetchUser = async () => {
      const response = await fetch(process.env.USER+'/'+id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        let info = response.json().then(player => {
          data = {
            "id": player.id,
            "firstname": player.name,
            "secondname": player.surname,
            "phone": player.phoneNumber,
            "elo": player.elo,
            "rank": player.rank,
            "active": player.active,
            "ismod": player.isModerator
          }
          setMod(player.isModerator);
          setActive(player.active);
        });
      }
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
    fetchMe();
    fetchUser();
    fetchAdmin();
  }, []);

  async function promoteswitch(id){
    if (data.ismod == false){
      const response = await fetch(process.env.ADMIN+'/moderator/'+id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        console.log("user promoted");
        data.ismod = true;
        setMod(true);
      }
    }
    else{
      const response = await fetch(process.env.ADMIN+'/moderator/'+id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        console.log("user unpromoted");
        data.ismod = false;
        setMod(false);
      }
    }
  }

  async function banswitch(id){
    if (data.active == false){
      const response = await fetch(process.env.ADMIN+'/activate/'+id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        console.log("user unbanned");
        data.active = true;
        setActive(true);
      }
    }
    else{
      const response = await fetch(process.env.ADMIN+'/deactivate/'+id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      });
      if (response.ok) {
        console.log("user banned");
        data.active = false;
        setActive(false);
      }
    }
  }

  const blocke = async (e) => {
    e.preventDefault();
    formClose();
    const formData = new FormData(e.target);
    const reqdata = Object.fromEntries(formData.entries());

    const response = await fetch(process.env.ADMIN+'/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ userId: Number(id), enddate: reqdata.time, cause: reqdata.cause}),
    });

    if (response.ok){
      console.log("user blocked");
    }
    else console.log(response);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
          <EpicForm
            isOpen={formActive}
            onClose={formClose}
            onSubmit={blocke}
          />
          <button className={styles.maxbutton} onClick={() => router.push("/requests")}>REQUESTS</button>
          <button className={styles.maxbutton} onClick={() => router.push("/matches")}>MATCHES</button>
          <button className={styles.maxbutton} onClick={() => router.push("/leaderboard")}>LEADERBOARDS</button>
          <ProfilePanel name={me.firstname}/>
      </header>
      <main className={styles.main}>
        <div className={styles.profcard}>
          <div className={styles.reqin}>
          <Image
            src="/defaultpfp.png"
            //alt="Description of the image"
            width={200}
            height={200}
          />
          </div>
          <div className={styles.reqin}>
            <h3>user id {data.id}</h3>
            <h2>NAME: {data.firstname} {data.secondname}</h2>
            <h2>PHONE: {data.phone}</h2>
            <h2>ELO: {data.elo}, {data.rank}</h2>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        {me.ismod==1 ? (<button className={styles.normalbutton}>REPORT</button>) : (<></>)}
        {adminrights==1 ? (<button className={styles.normalbutton} onClick={() => banswitch(data.id)}>BAN</button>) : (<></>)}
        {adminrights==1 ? (<button className={styles.normalbutton} onClick={() => promoteswitch(data.id)}>PROMOTE</button>) : (<></>)}
        {adminrights==0 ? (<button className={styles.normalbutton} onClick={() => formOpen()}>BLOCK</button>) : (<></>)}
      </footer>
    </div>
  );
}
