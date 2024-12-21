import styles from "../page.module.css";
import { useRouter } from "next/navigation";

export default function MatchComp({ match }) {
    const router = useRouter();
    function timeconv(time){
        const date = new Date(time);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        return formattedDate;
      }
    let id = match.request.id;
    return (
        <div className={styles.reqout}>
            <div key={"info"+id} className={styles.reqin}>
                {match.success == true ? <h1>SUCCESSFUL</h1> : <h1>FAILED</h1>}
                <h3>Time: {match.request.time}</h3>
                <h3>Moderator: {match.moderator_firstname} {match.moderator_secondname}, ELO: {match.moderator_elo}</h3>
                {match.friendlymatch ? <h3>friendly match</h3> : <></>}
                <h3>Remark: {match.remark}</h3>
            </div>
            <div key={"player"+id} className={styles.reqin}>
                <div onClick={() => {router.push("/profile/" + match.winner.id);}} key={"player"+id+"_"+match.winner.id}>
                    {match.winner.firstname} {match.winner.secondname}, ELO: {match.winner.elo}
                    <br/>
                </div>
                <div onClick={() => {router.push("/profile/" + match.loser.id);}} key={"player"+id+"_"+match.loser.id}>
                    {match.loser.firstname} {match.loser.secondname}, ELO: {match.loser.elo}
                    <br/>
                </div>
            </div>
        </div>
    );
  }
  