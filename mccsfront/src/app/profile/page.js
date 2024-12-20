"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePanel from "../profilepanel";

/* let data = {
  id: -1,
  firstname: "Guest",
  secondname: "",
  phone: "None",
  elo: 0,
  rank: "none",
  active: false,
}; */

export default function Profile() {
  const router = useRouter();

  const [data, setData] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    if (!token) {
      router.push("/");
    }
    const id = window.sessionStorage.getItem("focus");
    // Function to fetch data
    const fetchUser = async () => {
      const response = await fetch(process.env.USER + "/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let info = response.json().then(player => {
          setData({
            id: player.id,
            firstname: player.name,
            secondname: player.surname,
            phone: player.phoneNumber,
            elo: player.elo,
            rank: player.rank,
            active: player.active,
          });
        });
      }
    };
    fetchUser();
  }, []);

  return (
    data && (
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
          <ProfilePanel name={data.firstname} />
        </header>
        <main className={styles.main}>
          <div className={styles.profcard}>
            <div className={styles.reqin}>
              <Image
                src="/defaultpfp.png"
                alt="Profile picture"
                width={200}
                height={200}
              />
            </div>
            <div className={styles.reqin}>
              <h3>user id {data.id}</h3>
              <h2>
                NAME: {data.firstname} {data.secondname}
              </h2>
              <h2>PHONE: {data.phone}</h2>
              <h2>
                ELO: {data.elo}, {data.rank}
              </h2>
            </div>
          </div>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    )
  );
}
