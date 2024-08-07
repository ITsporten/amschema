'use client'

import styles from './page.module.css'
import TextButton from '@/components/TextButton'
import { useEffect, useState } from 'react'
import { db } from './firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { createTeam } from '@/api/team'
import TeamsList from '@/components/TeamsList'

export default function Home() {
  const [teams, setTeams] = useState([]);
  const teamsCollectionRef = collection(db, "Teams");

  useEffect(() => {
    const getTeams = async () => {
      const data = await getDocs(teamsCollectionRef);
      setTeams(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    
    getTeams();
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.teamListContainer}>
        { teams.map((team) => <TeamsList key={team.id} team={team} />) }
      </div>
    </main>
  )
}
