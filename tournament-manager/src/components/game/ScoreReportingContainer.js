import styles from '../../app/score_keeper/page.module.css'
import ScoreButton from './ScoreButton'

export default function ScoreReportingContainer({teamName, handleReduceScore, handleAddScore, team}) {

    return(
        <div className={styles.teamScore}>
            <div className={styles.teamNameContainer}>
                <h3 className={styles.TeamText}>{teamName}</h3>
            </div>
            <div className={styles.teamScoreHorizontal}>
                <ScoreButton prompt={"-"} handlePress={handleReduceScore} team={team}/>
                <ScoreButton prompt={"+"} handlePress={handleAddScore} team={team}/>
            </div>
        </div>
    )
}