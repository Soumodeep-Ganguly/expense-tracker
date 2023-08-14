import React, { useState, useEffect, useContext } from 'react'
import { UilTimes, UilListUl, UilBars, UilSun, UilMoon, UilSignOutAlt, UilCreateDashboard, UilDollarAlt, UilSetting } from '@iconscout/react-unicons'
import { AuthContext } from '../../app/auth'
import { Link } from 'react-router-dom'
import './sidenav.scss'

export default function SideNav(props) {
    const [open, setOpen] = useState(false)
    const [dark, setDark] = useState(false)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        // Use window.innerWidth to get the current screen width
        const screenWidth = window.innerWidth;

        // Set the initial state of open based on screen width
        setOpen(screenWidth >= 769);
        setDark(localStorage.getItem('darkMode'))
    }, []);

    const toggleDarkMode = () => {
        if(dark) { // turn off dark mode
            localStorage.removeItem('darkMode')
            setDark(false)
        } else { // turn onn dark mode
            localStorage.setItem('darkMode', true)
            setDark(true)
        }
    }

    return (
        <div className='container'>
            <div className={`sidenav-view ${open ? 'open' : ''} ${dark ? 'dark' : ''}`}>
                <nav className={`${open ? "open" : "closed"}`}>
                    <header>MERN Dev</header>
                    <div className='nav-wrapper'>
                        <Link to='/' className={window.location.pathname === "/" ? 'active' : ""}>
                            <UilCreateDashboard style={{ marginTop: 20 }} />
                            <span className="nav-text">Dashboard</span>
                        </Link>
                        <Link to='/categories' className={window.location.pathname.includes("/categories") ? 'active' : ""}>
                            <UilListUl style={{ marginTop: 20 }} />
                            <span>Categories</span>
                        </Link>
                        <Link to='/expenses' className={window.location.pathname.includes("/expenses") ? 'active' : ""}>
                            <UilDollarAlt style={{ marginTop: 20 }} />
                            <span>Expenses</span>
                        </Link>
                        <Link to='/settings' className={window.location.pathname === "/settings" ? 'active' : ""}>
                            <UilSetting style={{ marginTop: 20 }} />
                            <span>Settings</span>
                        </Link>
                    </div>
                    <div className='nav-action'>
                        {dark && <UilSun onClick={() => toggleDarkMode()} />}
                        {!dark && <UilMoon onClick={() => toggleDarkMode()} />}
                        <UilSignOutAlt className="sign-off" onClick={() => authContext.signout()} />
                    </div>
                </nav>
            </div>
            <div className={`sidenav-toggler ${dark ? 'dark' : ''}`}>
                {!open && <UilBars size={14} className="on" onClick={() => setOpen(true)} />}
                {open && <UilTimes size={18} className="off" onClick={() => setOpen(false)} />}
            </div>
            <div className={`content-view ${open ? 'open' : ''} ${dark ? 'dark' : ''}`}>
                {props.children}
            </div>
        </div>
    )
}
