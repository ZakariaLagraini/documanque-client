import React, { useState, useEffect } from 'react';
import logo from './sources/logo.png';
import { Link } from 'react-router-dom';
import { FaListAlt, FaUserCircle } from 'react-icons/fa';
import { GrAnnounce } from 'react-icons/gr';
import { MdNotificationsNone, MdSettings } from 'react-icons/md';
import { BiLogInCircle } from 'react-icons/bi';
import { IoLogOut } from 'react-icons/io5';
import Notification from './Notification'; // Assuming you have this component

let Nav = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    let userPfp = props.loggedIn ? require("" + sessionStorage.getItem("pfp")) : "";

    useEffect(() => {
        if(props.loggedIn) fetchNotifications().then(data => setNotifications(data));
    }, [props.loggedIn]);

    const countNotSeen = (array) => {
        return array.filter(item => !item.seen).length;
    }

    const toggleMenu = (menuId) => {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = menu.style.display === "none" ? "inherit" : "none";
        }
    };

    const logOut = () => {
        sessionStorage.clear();
        window.history.back();
    }

    async function fetchNotifications() {
        const response = await fetch('https://documanque-server.onrender.com/notification/getNotifications?id=' + sessionStorage.getItem("id"));
        return response.json();
    }

    return (
        <header>
            <nav>
                <div id="leftNav">
                    <Link className="navLogo" to="/">
                        <img height="65%" alt="Documanque" src={logo} />
                        <h1>ocumanque</h1>
                    </Link>
                    <label htmlFor="toggle" id="toggleLabel" onClick={() => setMenuOpen(!menuOpen)}>
                        <FaListAlt className='decreasedFa' />
                    </label>
                </div>

                <div id="rightNav">
                    <Link to="/Announce">
                        <button className="announce"><GrAnnounce className='InUpIcon' />Annoncer</button>
                    </Link>

                    {props.loggedIn ? (
                        <>
                            <button onClick={() => toggleMenu("notifsmenu")} notification-count={countNotSeen(notifications)} className="notificationsIcon">
                                <MdNotificationsNone />
                            </button>
                            <button onClick={() => toggleMenu("dropmenu")} className="profilePic">
                                <img alt="" src={userPfp} />
                            </button>
                        </>
                    ) : (
                        <Link to="/SignIn">
                            <button className="login"><BiLogInCircle className='InUpIcon' />Connexion</button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Responsive Navigation */}
            <input type="checkbox" id="toggle"/>
            <div className={`respoNav`}>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/Announce">Annoncer</Link></li>
                    {props.loggedIn ? (
                        <>
                            <li><Link to="/Profile">Mon Profil</Link></li>
                            <li><Link to="/Settings">Paramètres</Link></li>
                            <li><Link onClick={logOut}>Déconnexion</Link></li>
                        </>
                    ) : (
                        <li><Link to="/SignIn">Connexion</Link></li>
                    )}
                </ul>
            </div>

            {/* Dropdown Menus */}
            <ul style={{ display: "none" }} id="dropmenu">
                <li><Link to="/Profile"><FaUserCircle /> Mon Profil</Link></li>
                <li><Link to="/Settings"><MdSettings /> Paramètres</Link></li>
                <li><Link onClick={logOut}><IoLogOut /> Déconnexion</Link></li>
            </ul>

            <ul style={{ display: "none" }} id="notifsmenu">
                {notifications.length !== 0 ?
                    notifications.map((notif) => (
                        <Notification key={notif.id} idAnnonce={notif.annonce.id} idNotif={notif.id} about={notif.annonce.document.nomDocument + "(" + notif.annonce.document.numDocument + ")"} date={notif.date} seen={notif.seen} />
                    )) :
                    <p className="no-notifs">Aucune notification!</p>
                }
            </ul>
        </header>
    )
}

export default Nav;