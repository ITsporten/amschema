'use client'

import styles from '../page.module.css'
import { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import StandingItem from '@/components/StandingItem'

export default function Home() {
  const [standingList, setStandingList] = useState([]);
  const [standingList1, setStandingList1] = useState([]);
  const [standingList2, setStandingList2] = useState([]);
  const [standingList3, setStandingList3] = useState([]);
  const [standingList4, setStandingList4] = useState([]);
  const [season, setSeason] = useState("");

  const [filter, setFilter] = useState("Total")
  const standingsCollectionRef = collection(db, "Standings");

  const compTotal = (standing1, standing2) => {
    if(standing1.TotalPoints <= standing2.TotalPoints){
      return 1;
    } else {
      return -1;
    }
  }

  const compVolley = (standing1, standing2) => {
    if(standing1.Points[0] <= standing2.Points[0]){
      return 1;
    } else {
      return -1;
    }
  }

  const compSurprise = (standing1, standing2) => {
    if(standing1.Points[1] <= standing2.Points[1]){
      return 1;
    } else {
      return -1;
    }
  }

  const compFloorball = (standing1, standing2) => {
    if(standing1.Points[2] <= standing2.Points[2]){
      return 1;
    } else {
      return -1;
    }
  }

  const compFootball = (standing1, standing2) => {
    if(standing1.Points[3] <= standing2.Points[3]){
      return 1;
    } else {
      return -1;
    }
  }
  
  useEffect(() => {
    const getStandings = async () => {
      const data = await getDocs(standingsCollectionRef);
      let lst = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      let lst1 = [...lst];
      let lst2 = [...lst];
      let lst3 = [...lst];
      let lst4 = [...lst];
      
      //Sortera totalställningarna
      lst.sort(compTotal);
      setStandingList(lst);
      
      //Sortera volleybollställningarna
      lst1.sort(compVolley)
      setStandingList1(lst1)
      
      //Sortera surpriseställningarna
      lst2.sort(compSurprise)
      setStandingList2(lst2) 

      //Sortera innebandyställningarna
      lst3.sort(compFloorball)
      setStandingList3(lst3)

      //Sortera fotbollsställningarna
      lst4.sort(compFootball)
      setStandingList4(lst4)

      setSeason(lst[0].Season);
    }
    
    getStandings();
  }, [])

  return (
    <main className={styles.main}>
      <h1 className={styles.standingHeader}>{season}</h1>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="Total">Säsongsställning</option>
          <option value="Volley">Volleyboll</option>
          <option value="Surprise">Surprise</option>
          <option value="Floorball">Innebandy</option>
          <option value="Football">Fotboll</option>
      </select>
      <div className={styles.teamListContainer}>
        { filter == "Total" ?
          <>
            {standingList.map((standing, index) => 
              <StandingItem key={standing.id} standingItem={standing} points={standing.TotalPoints} placement={index+1}/>)
            }
          </> 
          : filter == "Volley" ?
          <>
            {standingList1.map((standing, index) => 
              <StandingItem key={standing.id} standingItem={standing} points={standing.Points[0]} placement={index+1}/>)
            }
          </>
          : filter == "Surprise" ?
          <>
            {standingList2.map((standing, index) => 
              <StandingItem key={standing.id} standingItem={standing} points={standing.Points[1]} placement={index+1}/>)
            }
          </>
          : filter == "Floorball" ? 
          <>
            {standingList3.map((standing, index) => 
              <StandingItem key={standing.id} standingItem={standing} points={standing.Points[2]} placement={index+1}/>)
            } 
          </>
          : 
          
          <>
            {standingList4.map((standing, index) => 
              <StandingItem key={standing.id} standingItem={standing} points={standing.Points[3]} placement={index+1}/>)
            } 
          </>
        }
      </div>
    </main>
  )
}
