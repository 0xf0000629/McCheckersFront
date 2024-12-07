import styles from "./page.module.css";

export default function RequestComp({ id, place, time, mod, players, modbutton }) {
    return (
        <div className={styles.reqout}>
            <div key={"info"+id} className={styles.reqin}>
                <h2>PLACE: room {place.room}, {place.building}</h2>
                <h2>TIME: {time}</h2>
                <h3>Moderator: {mod.surname} {mod.name}, ELO: {mod.elo}</h3>
            </div>
            <div key={"player"+id} className={styles.reqin}>
                <h2>Players: </h2>
                {players.map((player) => (
                    <div key={"player"+id+"_"+player.id}>
                        {player.firstname} {player.secondname}, ELO: {player.elo}
                        <br/>
                    </div>
                ))}
            </div>
            {modbutton && (<button className={styles.normalbutton} onClick={modbutton}>FUCK YOU</button>)}
        </div>
    );
  }
  