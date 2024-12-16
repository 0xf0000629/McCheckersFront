'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

let data = {
  "id": 999,
  "firstname": "Place",
  "secondname": "Holder",
  "phone": "+79009009090",
  "elo": 3333
};;

export default function Profile() {
  const token = window.localStorage.getItem('authToken');
  if (!token) {
    console.log("you are not authorized!!!");
    //return;
  }
  const params = useParams();
  const id = params.id;
  let adminrights = 0;


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
          "elo": player.elo
        }});
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
    fetchUser();
    fetchAdmin();
  }, []);

  async function promote(id){
    const response = await fetch(process.env.API+'/moderator/'+id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    if (response.ok) {
      console.log("user promoted");
    }
  }

  return (
    <div className={styles.page}>
      <header>
          <h1>PROFILE</h1>
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
            <h2>ELO: {data.elo}</h2>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <button className={styles.normalbutton}>REPORT</button>
        {adminrights==1 ? (<button className={styles.normalbutton}>BAN</button>) : (<></>)}
        {adminrights==1 ? (<button className={styles.normalbutton}>CONFIRM</button>) : (<></>)}
        {adminrights==1 ? (<button className={styles.normalbutton} onClick={() => promote(data.id)}>PROMOTE</button>) : (<></>)}
      </footer>
    </div>
  );
}
