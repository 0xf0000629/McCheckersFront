import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePanel(props) {
  const name = props.name;
  const token = props.token;
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [me, setMe] = useState({
    isadmin: 0,
  });

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

  const fetchMe = async () => {
    if (localStorage.getItem("me") != undefined) {
      let loadme = JSON.parse(localStorage.getItem("me"));
      setMe(loadme);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [token]);


  return (
    <div>
      {/* Trigger Button */}
      <button className={styles.profilebutton} onClick={togglePanel}>
        {name[0]}
      </button>

      {/* Sliding Panel */}
      <div
        className={styles.sliding_panel}
        style={{
          right: isPanelOpen ? "0" : "-300px", // Adjust based on your panel width
        }}
      >
        <h2>hello {name}</h2>
        <button
          onClick={() => router.push("/profile")}
          className={styles.maxbutton}
        >
          My profile
        </button>
        {me.isadmin == 0 ? (
        <button
          onClick={() => router.push("/myrequests")}
          className={styles.maxbutton}
        >
          My requests
        </button>
        ) : (
          <></>
        )}
        {me.isadmin == 0 ? (
        <button
          onClick={() => router.push("/mymatches")}
          className={styles.maxbutton}
        >
          My matches
        </button>
        ) : (
          <></>
        )}
        {me.isadmin == 1 ? (
          <button
            onClick={() => router.push("/reports")}
            className={styles.maxbutton}
          >
            Reports
          </button>
        ) : (
          <></>
        )}
        {me.isadmin == 1 ? (
          <button
            onClick={() => router.push("/unactivated")}
            className={styles.maxbutton}
          >
            Unactivated users
          </button>
        ) : (
          <></>
        )}
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
