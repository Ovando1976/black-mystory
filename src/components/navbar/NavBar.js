import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import styles from './navbar.module.css';


const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

const Dropdown = ({ children }) => {
    return ReactDOM.createPortal(
        <div style={{ 
            position: 'absolute', 
            insetBlockStart: '100%', 
            insetInlineStart: 0, 
            border: '1px solid #ddd', 
            backgroundColor: 'white' 
        }}>
            {children}
        </div>,
        document.body
    );  
};

const NavBar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => setDropdownOpen(false));

    const links = [
        { path: "/", label: "Home" },
        { path: "/blog", label: "Blog" },
        { path: "/user", label: "User" },
        { path: "/groups", label: "Groups" },
        { path: "/events", label: "Events" },
        { path: "/booking", label: "Booking" },
        { path: "/driverProfile", label: "Driver Profile" }
    ];

    const handleLogout = () => {
        console.log("User logged out!");
        // Your logout logic here...
    }

    return (
        <nav className={styles.navbar}>
            {links.map(link => (
    <NavLink 
        key={link.path} 
        to={link.path} 
        className={styles.link} 
        activeClassName={styles.activeLink}
    >
        {link.label}
    </NavLink>
            ))}

            {/* User Dropdown */}
            <div 
                className={styles.link} 
                onClick={() => setDropdownOpen(prevState => !prevState)}
                ref={dropdownRef}
            >
                User
                {isDropdownOpen && (
                    <Dropdown>c
                        <NavLink to="/profile"activelassname="activeClass" className={styles.link}>Profile</NavLink>
                        <NavLink to="/settings" activeclassname="activeClass" className={styles.link}>Settings</NavLink>
                        <div className={styles.link} onClick={handleLogout}>Logout</div>
                    </Dropdown>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
