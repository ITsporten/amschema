'use client'

import styles from '../page.module.css'
import { db } from '../firebase-config'
import { doc, getDoc, collection, query, getDocs, where, documentId} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { SingleEliminationBracket, createTheme, DoubleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@jteglund/jt-tournament-brackets'


export const WhiteTheme = createTheme({
    textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
    matchBackground: { wonColor: '#149CE9', lostColor: '#127ebc' },
    score: {
      background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
      text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
    },
    border: {
      color: '#149CE9',
      highlightedColor: '#127ebc',
    },
    roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
  });

export default function Home({params}) {
    const [bracket, setBracket] = useState([]);
    const [windowSize, setWindowSize] = useState({
      width: 0,
      height: 0
    });

    useEffect(() => {
      // This will only run on the client side (after the component mounts)
      if (typeof window !== 'undefined') {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
  
        // Set initial size
        handleResize();
  
        // Attach the resize event listener
        window.addEventListener('resize', handleResize);
  
        // Cleanup event listener on unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);


    const bracketRef = collection(db, "Bracket");

    const SingleElimination = () => {     
        const finalWidth = windowSize.width - 50;
        const finalHeight = windowSize.height - 100;

        return (<SingleEliminationBracket
          matches={bracket}
          matchComponent={Match}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer background={'#00cc8c'} SVGBackground={'#00cc8c'} width={finalWidth} height={finalHeight} {...props}>
              {children}
            </SVGViewer>
          )}
      
        />)
    };

    useEffect(() => {
        const getBracket = async () => {
            let lst = []
            const querySnapshot = await getDocs(bracketRef);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              lst.push(doc.data());
            });
            
            setBracket(lst);
        }
        getBracket();
    }, [])
    return (
        <main className={styles.main}>
          <div className={styles.center}>
            { bracket.length != 0 && window.innerWidth != 0 &&
              <SingleElimination></SingleElimination>
            } 
          </div>
           
        </main>
    )
}