'use client'

import style from '../app/page.module.css'
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useState } from 'react';

export default function NavBar() {
    const pathname = usePathname();
    const [showSecondNavBar, setShowSecondNavBar] = useState(false);

    const hideSecondNavBar = () => {
      setShowSecondNavBar(false)
    }

    const toggleSecondNavBar = () => {
      setShowSecondNavBar(!showSecondNavBar)
    }
    return (
      <>
      <div className={style.navbar}>
        <Link className={pathname == "/" ? style.navbarTextActive : style.navbarText} href="/" onClick={hideSecondNavBar}>LAG</Link>
        <h2 className={pathname == "/schedule" ? style.navbarTextActive : style.navbarText} onClick={toggleSecondNavBar}>SCHEMA</h2>
        <Link className={pathname == "/groups" ? style.navbarTextActive : style.navbarText} href="/groups" onClick={hideSecondNavBar}>GRUPPER</Link>
        <Link className={pathname == "/results" ? style.navbarTextActive : style.navbarText} href="/results" onClick={hideSecondNavBar}>STÄLLNING</Link>
      </div>
      { showSecondNavBar &&
        <div className={style.secondNavbar}>
          <Link className={pathname == "/schedule" ? style.navbarTextActive : style.navbarText} href="/schedule" onClick={hideSecondNavBar}>SCHEMA</Link>
          <Link className={pathname == "/bracket" ? style.navbarTextActive : style.navbarText} href="/bracket" onClick={hideSecondNavBar}>SLUTSPEL</Link>
        </div>
      }
    </>
    )
  }