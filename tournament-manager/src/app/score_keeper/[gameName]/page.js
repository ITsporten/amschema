'use client'

import { useEffect, useState } from 'react'
import styles from '../page.module.css'
import { db } from '../../firebase-config'
import { doc, getDoc, collection, query, getDocs, where, documentId, updateDoc} from 'firebase/firestore'
import GameListItem from '@/components/Game'
import ScoreButton from '@/components/game/ScoreButton'
import StatusButton from '@/components/game/StatusButton'
import FinishGamePopup from '@/components/game/FinishGamePopup'
import { useRouter } from 'next/navigation'
import { finishGame } from '@/api/game'
import { FadeLoader } from 'react-spinners'
import ScoreReportingContainer from "@/components/game/ScoreReportingContainer";

export default function Home({params}) {
    const [gameName, setGameName] = useState(params.gameName)
    const [game, setGame] = useState(null);
    const [score1, setScore1] = useState(null);
    const [score2, setScore2] = useState(null);
    const [status, setStatus] = useState(null);
    const [gamesRef, setGamesRef] = useState(collection(db, "Games"));
    const [bracketCollectionRef, setBracketRef] = useState(collection(db, "Bracket"));
    const [sc, setSC] = useState("åmkingkong")
    const [teamGameRef, setTeamGamesRef] = useState(collection(db, "TeamGame"));
    const [goal, setGoal] = useState(0);
    const [popup, setPopup] = useState(0);
    const [tieError, setTieError] = useState(0);
    const [ready, setReady] = useState(false);
    const [team1ID, setTeam1ID] = useState("");
    const [team2ID, setTeam2ID] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [bracketItem, setBracketItem] = useState(null);
    const [fetchBracketItem, setFetchBracketItem] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const getBracketItem = async () => {
            const q = query(bracketCollectionRef, where("id", "==", game.id));
            const querySnapshot = await getDocs(q);
            let lst = [];

            querySnapshot.forEach((doc) => {
                lst.push({ ...doc.data(), id: doc.id });
            });
            if(lst.length > 0){
                setBracketItem(lst[0]);
            }
        }
        
        if(game){
            getBracketItem()
        }
    }, [fetchBracketItem])

    useEffect(() => {
        const getGame = async () => {
            const q = query(gamesRef, where("GameName", "==", gameName));
            const querySnapshot = await getDocs(q);
            let lst = [];

            querySnapshot.forEach((doc) => {
                lst.push({ ...doc.data(), id: doc.id });
            });
            setGame(lst[0]);
            if(!fetchBracketItem){
                setFetchBracketItem(true);
            }
            const q2 = query(teamGameRef, where("GameID", "==", lst[0].id));
            const querySnapshot2 = await getDocs(q2);
            let count = 0;
            querySnapshot2.forEach((doc) => {
                count++;
                if(doc.data().TeamPosition == 1){
                    setTeam1ID(doc.data().TeamID);
                }
                if(doc.data().TeamPosition == 2){
                    setTeam2ID(doc.data().TeamID);
                }
            });
            if(count == 2){
                setReady(true);
            }

        }
        getGame();
    }, [gameName, gamesRef, status, goal]);
    
    useEffect(() => {
        if(game){
            setScore1(game.Team1Score);
            setScore2(game.Team2Score);
        }
    }, [game])

    const handleAddScore = async (team) => {
        const gameRef = doc(db, "Games", game.id);

        if(team === 1){
            await updateDoc(gameRef, {Team1Score: score1+1});
            if(bracketItem){
                const bracketRef = doc(db, "Bracket", bracketItem.Identifier)
                
                let team1BracketData = bracketItem.participants[0];
                team1BracketData.resultText = (score1+1).toString();

                await updateDoc(bracketRef, {participants: [team1BracketData, bracketItem.participants[1]]})
            }
            setGoal(goal+1);
        }
        if(team === 2){
            await updateDoc(gameRef, {Team2Score: score2+1});
            if(bracketItem){
                const bracketRef = doc(db, "Bracket", bracketItem.Identifier)
                let team2BracketData = bracketItem.participants[1];
                team2BracketData.resultText = (score2+1).toString();
    
                await updateDoc(bracketRef, {participants: [bracketItem.participants[0], team2BracketData]})
            }
            setGoal(goal+2);
        }
    }

    const updatePassword = (event) =>{
        setPassword(event.target.value);
    }

    const handleReduceScore = async (team) => {
        const gameRef = doc(db, "Games", game.id);
        if(team === 1){
            if(score1 > 0){
                await updateDoc(gameRef, {Team1Score: score1-1});
                if(bracketItem){
                    const bracketRef = doc(db, "Bracket", bracketItem.Identifier)
                    let team1BracketData = bracketItem.participants[0];
                    team1BracketData.resultText = (score1-1).toString();
    
                    await updateDoc(bracketRef, {participants: [team1BracketData, bracketItem.participants[1]]})
                }
                setGoal(goal+3);
            }
        }
        if(team === 2){
            if(score2 > 0){
                await updateDoc(gameRef, {Team2Score: score2-1});
                if(bracketItem){
                    const bracketRef = doc(db, "Bracket", bracketItem.Identifier)
                    let team2BracketData = bracketItem.participants[1];
                    team2BracketData.resultText = (score2-1).toString();
        
                    await updateDoc(bracketRef, {participants: [bracketItem.participants[0], team2BracketData]})
                }

                setGoal(goal+4);
            }
        }
    }

    const handleStartGame = async () => {
        //Kolla så att matchen har lag!!!
        if(ready){
            //Sätt status till 1
            const gameRef = doc(db, "Games", game.id);
            await updateDoc(gameRef, {Status: 1});
            setStatus(1);
        }
    }

    const handleFinishGame = async () => {
        setLoading(true);
        if(game.Type == 1){
            if(game.Team1Score != game.Team2Score){
                const gameRef = doc(db, "Games", game.id);
                await updateDoc(gameRef, {Status: 2});
                await finishGame(game, team1ID, team2ID);
                setStatus(2);
                setPopup(0);
            }
        }else if(game.Type == 0){
            const gameRef = doc(db, "Games", game.id);
            await updateDoc(gameRef, {Status: 2});
            await finishGame(game, team1ID, team2ID);
            setStatus(2);
            setPopup(0);
        }
        setLoading(false);
    }

    const test = () => {
        finishGame(game);
    }

    const openPopup = () => {
        if(game.Type == 1){
            if(game.Team1Score != game.Team2Score){
                setPopup(1);
                setTieError(0);
            }else{
                setTieError(1);
            }
        }else if(game.Type == 0){
            setPopup(1);
            setTieError(0);
        }
    }

    const closePopup = () => {
        setPopup(0);
    }

    const login = () => {
        if(password == sc){
            setLoggedIn(true)
        }
    }

    return (

        <main className={styles.main}>
        <div className={styles.center}>
            { !loggedIn &&
                <>
                    <input className={styles.input} value={password} onChange={updatePassword} placeholder='Lösenord'></input>
                    <div onClick={login} className={styles.enterButton}> 
                        <h4>
                            Logga in
                        </h4> 
                    </div>

                </>
            }
            { loggedIn && game && popup === 0 &&
                <div >
                    <GameListItem game={game} />
                    <div >
                    { game.Status === 1 ?
                        <>
                            <div className={styles.finishGameContainer}>
                                <StatusButton prompt={"Finish game"} handlePress={openPopup} status={game.Status}/> 
                            </div>
                            <ScoreReportingContainer teamName={game.Team1Name} handleReduceScore={handleReduceScore} handleAddScore={handleAddScore} team={1}/>
                            <ScoreReportingContainer teamName={game.Team2Name} handleReduceScore={handleReduceScore} handleAddScore={handleAddScore} team={2}/>
                            { game && tieError === 1 &&
                                <h4>ERROR: You cannot end a game as a tie</h4>
                            }
                        </>
                        :
                        <StatusButton prompt={"Start game"} handlePress={handleStartGame} status={game.Status}/> 
                    }
                    </div>
                </div>
            }
            { game && popup === 1 && !loading &&
                <FinishGamePopup game={game} handleReturn={closePopup} handleSave={handleFinishGame}/>
            }
            { game && popup === 1 && loading &&
                <FadeLoader
                    color={"#ff0084"}
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            }   
            </div>
        </main>
  )
}