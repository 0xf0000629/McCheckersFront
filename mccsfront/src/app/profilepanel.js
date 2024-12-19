import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePanel(name, token) {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [adminrights, setAdmin] = useState(0);

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  const logout = async () => {
    const response = await fetch(process.env.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
      },
    });
    window.localStorage.removeItem("authToken");
    if (response.ok) {
      console.log("logged out");
      router.push("/");
    } else console.log(response);
  };

  const fetchAdmin = async () => {
    const adminreq = await fetch(process.env.API + "/admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (adminreq.ok){
      setAdmin(1);
    }
    else console.log("not an admin...");
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <div>
      {/* Trigger Button */}
      <button className={styles.profilebutton} onClick={togglePanel}>
        {name.name[0]}
      </button>

      {/* Sliding Panel */}
      <div
        style={{
          position: "fixed",
          top: "0",
          right: isPanelOpen ? "0" : "-300px", // Adjust based on your panel width
          width: "300px",
          height: "100vh",
          backgroundColor: "#f4f4f4",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          transition: "right 0.3s ease-in-out",
          padding: "20px",
        }}
      >
        <h2>hello {name.name}</h2>
        <button
          onClick={() => router.push("/profile")}
          className={styles.maxbutton}
        >
          My profile
        </button>
        <button
          onClick={() => router.push("/myrequests")}
          className={styles.maxbutton}
        >
          My requests
        </button>
        <button
          onClick={() => router.push("/mymatches")}
          className={styles.maxbutton}
        >
          My matches
        </button>
        {adminrights == 1 ? <button
          onClick={() => router.push("/reports")}
          className={styles.maxbutton}
        >
          Reports
        </button> : <></>}
        <button onClick={() => logout()} className={styles.maxbutton}>
          logout
        </button>
        <button onClick={togglePanel} className={styles.maxbutton}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
