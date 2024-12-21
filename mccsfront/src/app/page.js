"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [token, setToken] = useState(undefined);

  const [login, setlogin] = useState("");
  const [password, setpassword] = useState("");

  const [me, setMe] = useState({
    placeholder: true,
  });

  const [adminstate, setAdmin] = useState(undefined);

  const [thesurname, setsurname] = useState("");
  const [thename, setname] = useState("");
  const [thephone, setphone] = useState("");
  const [thectr, setcountry] = useState("");

  const [badpass, setBP] = useState(0);

  const [activeForm, setActiveForm] = useState("login");

  const handleLog = e => {
    setlogin(e.target.value);
  };
  const handlePass = e => {
    setpassword(e.target.value);
  };

  const handleSN = e => {
    setsurname(e.target.value);
  };
  const handleN = e => {
    setname(e.target.value);
  };
  const handlePH = e => {
    setphone(e.target.value);
  };
  const handleCTR = e => {
    setcountry(e.target.value);
  };

  async function fetchMe(info) {
    const response = await fetch(process.env.USER + "/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${info}`,
      },
    });
    if (response.ok) {
      console.log("got you");
      let jsondata = response.json().then(jsondata => {
        const newme = {
          id: jsondata.id,
          firstname: jsondata.name,
          secondname: jsondata.surname,
          elo: jsondata.elo,
          active: jsondata.active,
          ismod: jsondata.moderator,
          isadmin: adminstate,
        };
        localStorage.setItem("me", JSON.stringify(newme));
        setMe(newme);
      });
    } else console.log(response);
  }

  const fetchAdmin = async () => {
    const adminreq = await fetch(process.env.API + "/admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (adminreq.ok) {
      setAdmin(1);
    } else setAdmin(0);
  };

  const logEmIn = async e => {
    e.preventDefault();
    //console.log(`"Login:": ${login}, "Password:": ${password}`);
    try {
      const response = await fetch(process.env.AUTH + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password: password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        setToken(localStorage.getItem("authToken"));
      } else {
        console.log(response);
      }
    }
    catch (e) {setBP(1);}
  };

  const regEmIn = async e => {
    e.preventDefault();
    const response = await fetch(process.env.USER + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: login,
        password: password,
        name: thename,
        surname: thesurname,
        phoneNumber: thephone,
        countryId: Number(thectr) + 1,
      }),
    });
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      setToken(localStorage.getItem("authToken"));
    } else {
      console.log(response);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    if (token != undefined && token != null){
      if (adminstate != undefined && adminstate != null) {
        if (me.placeholder == undefined) {
          router.push("/requests");
        }
        else fetchMe(token);
      }
      else fetchAdmin(token);
    }
  }, [me, adminstate, token]);

  return (
    <div className={styles.page}>
      <main className={styles.loginmain}>
        <div className={styles.logina}>
          {activeForm === "login" ? <h1>Login</h1> : <h1>Register</h1>}

          {/* Buttons to Switch Forms */}
          <div>
            <button className={styles.normalbutton}
              onClick={() => {
                if (activeForm === "login") setActiveForm("register");
                else setActiveForm("login");
              }}
            >
              {activeForm === "login" ? "No account?" : "Already registered?"}
            </button>
          </div>

          {activeForm === "login" && (
            <form onSubmit={logEmIn}>
              <input
                type="text"
                placeholder="Username..."
                value={login}
                onChange={handleLog}
              />
              <br />
              <input
                type="password"
                placeholder="Password..."
                value={password}
                onChange={handlePass}
              />
              <br />
              {badpass ? "Wrong login on password!" : ""}
              <br />
              <button type="submit" className={styles.normalbutton}>get me in</button>
            </form>
          )}

          {activeForm === "register" && (
            <form onSubmit={regEmIn}>
              <input
                type="text"
                placeholder="Surname..."
                value={thesurname}
                onChange={handleSN}
              />
              <br />
              <input
                type="text"
                placeholder="Name..."
                value={thename}
                onChange={handleN}
              />
              <br />
              <input
                type="text"
                placeholder="Phone number..."
                value={thephone}
                onChange={handlePH}
              />
              <br />
              <select value={thectr} onChange={handleCTR}>
                <option value="" disabled>
                  {" "}
                  select...{" "}
                </option>
                <option value="0">Russia</option>
              </select>
              <br />
              <input
                type="text"
                placeholder="Username..."
                value={login}
                onChange={handleLog}
              />
              <br />
              <input
                type="text"
                placeholder="Password..."
                value={password}
                onChange={handlePass}
              />
              <br />
              <button type="submit"  className={styles.normalbutton}>register me</button>
            </form>
          )}
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
