'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const token = window.localStorage.getItem('authToken');
  if (token) {
    router.push("/homepage");
  }

  const [login, setlogin] = useState('');
  const [password, setpassword] = useState('');

  const [thesurname, setsurname] = useState('');
  const [thename, setname] = useState('');
  const [thephone, setphone] = useState('');
  const [thectr, setcountry] = useState('');

  const [activeForm, setActiveForm] = useState('login');

  const handleLog = (e) => {setlogin(e.target.value);};
  const handlePass = (e) => {setpassword(e.target.value);};

  const handleSN = (e) => {setsurname(e.target.value);};
  const handleN = (e) => {setname(e.target.value);};
  const handlePH = (e) => {setphone(e.target.value);};
  const handleCTR = (e) => {setcountry(e.target.value);};


  const logEmIn = async (e) => { 
    e.preventDefault(); 
    //alert(`"Login:": ${login}, "Password:": ${password}`); 
    const response = await fetch(process.env.AUTH+'/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: login, password: password}),
    });
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      router.push("/homepage");
    } else {
      console.log(response);
    }
  };

  const regEmIn = async (e) => { 
    e.preventDefault(); 
    const response = await fetch(process.env.AUTH+'/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: login, password: password, name: thename, surname: thesurname, phoneNumber: thephone, countryId: Number(thectr)}),
    });
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      router.push("/homepage");
    } else {
      console.log(response);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>

        <h1>oughhhhh register me</h1>
      
        {/* Buttons to Switch Forms */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => {if (activeForm === 'login') setActiveForm('register'); else setActiveForm('login');}}
            style={{
              padding: '10px',
              marginRight: '10px',
              background: activeForm === 'login' ? 'lightblue' : 'white',
            }}
          >
            {activeForm === 'login' ? 'No account?' : 'Already registered?'}
          </button>
        </div>


        {activeForm === 'login' && (
          <form onSubmit={logEmIn}>
            <input
              type="text"
              placeholder="Username..."
              value={login}
              onChange={handleLog}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={handlePass}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <button type="submit" style={{ padding: '8px' }}>
              get me in
            </button>
          </form>
        )}

        {activeForm === 'register' && (
          <form onSubmit={regEmIn}>
            <input
              type="text"
              placeholder="Surname..."
              value={thesurname}
              onChange={handleSN}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <input
              type="text"
              placeholder="Name..."
              value={thename}
              onChange={handleN}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <input
              type="text"
              placeholder="Phone number..."
              value={thephone}
              onChange={handlePH}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <select value={thectr} onChange={handleCTR} style={{ padding: '8px', marginRight: '10px' }}>
              <option value="" disabled> select... </option>
              <option value="0">Russia</option>
            </select><br/>
            <input
              type="text"
              placeholder="Username..."
              value={login}
              onChange={handleLog}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <input
              type="text"
              placeholder="Password..."
              value={password}
              onChange={handlePass}
              style={{ padding: '8px', marginRight: '10px' }}
            /><br/>
            <button type="submit" style={{ padding: '8px' }}>
              register me
            </button>
          </form>
        )}

        </div>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
