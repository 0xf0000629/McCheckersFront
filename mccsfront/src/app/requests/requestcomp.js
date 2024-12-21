import styles from "../page.module.css";
import { useRouter } from "next/navigation";

export default function RequestComp({
  id,
  place,
  time,
  mod,
  players,
  joinbutton,
  modbutton
}) {
  const router = useRouter();
  function timeconv(time){
    const date = new Date(time);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
  }
  return (
    <div className={styles.reqout}>
      <div key={"info" + id} className={styles.reqin}>
        <h2>
          PLACE: room {place.room}, {place.building}
        </h2>
        <h2>TIME: {timeconv(time)}</h2>
        {mod.id != undefined && (
          <h3>
            Moderator: {mod.surname} {mod.name}, ELO: {mod.elo}
          </h3>
        )}
      </div>
      <div key={"player" + id} className={styles.reqin}>
        <h2>Players: </h2>
        {players.map((player, i) => (
          <div
            onClick={() => {
              router.push("/profile/" + player.id);
            }}
            key={i}
          >
            {player.firstname} {player.secondname}, ELO: {player.elo}
            <br />
          </div>
        ))}
      </div>
      {joinbutton && (
        <button className={styles.normalbutton} onClick={joinbutton}>
          {modbutton === true ? "LEAVE" : "JOIN"}
        </button>
      )}
    </div>
  );
}
