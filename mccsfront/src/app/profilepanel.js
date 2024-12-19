import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePanel(name) {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
        <button
          onClick={() => router.push("/mymatches")}
          className={styles.maxbutton}
        >
          My matches
        </button>
        <button onClick={togglePanel} className={styles.maxbutton}>
          CLOSE
        </button>
        <button onClick={() => logout()} className={styles.maxbutton}>
          logout
        </button>
      </div>
    </div>
  );
}
