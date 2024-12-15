'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

let data = undefined;

export default function Profile() {

  function whome(){
    let request = 36; //request
    data = {
      "id": 36,
      "firstname": "mike",
      "secondname": "hawk",
      "phone": "+79276445030",
      "elo": 2300
    };
  }

  return (
    <div className={styles.page}>
      {whome()}
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
        <button className={styles.normalbutton}>CONFIRM</button>
        <button className={styles.normalbutton}>REPORT</button>
        <button className={styles.normalbutton}>BAN</button>
      </footer>
    </div>
  );
}
