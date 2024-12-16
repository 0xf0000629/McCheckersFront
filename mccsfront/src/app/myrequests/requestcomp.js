import styles from "../page.module.css";
import { useRouter } from "next/navigation";

export default function RequestComp({ id, place, time, mod, players, joinbutton, modbutton }) {
    const router = useRouter();
    return (
        <div className={styles.reqout}>
            <div key={"info"+id} className={styles.reqin}>
                <h2>PLACE: room {place.room}, {place.building}</h2>
                <h2>TIME: {time}</h2>
                {mod.id != undefined && (<h3>Moderator: {mod.surname} {mod.name}, ELO: {mod.elo}</h3>)}
            </div>
            <div key={"player"+id} className={styles.reqin}>
                <h2>Players: </h2>
                {players.map((player) => (
                    <div onClick={() => {router.push("/profile/" + player.id);}} key={"player"+id+"_"+player.id}>
                        {player.firstname} {player.secondname}, ELO: {player.elo}
                        <br/>
                    </div>
                ))}
            </div>
            {joinbutton && (<button className={styles.normalbutton} onClick={joinbutton}>LEAVE</button>)}
            {modbutton && (<button className={styles.normalbutton} onClick={modbutton}>REPORT</button>)}
        </div>
    );
  }
  