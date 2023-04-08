import React, { useEffect, useState } from "react";
import '../styling/navbar.css'
 
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
function Navbar() 
{
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const showButton = () => {
    if(window.innerWidth <= 960){
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);


  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
          <NavLink to='/menu' onClick={closeMobileMenu}>
            <img className='img' src='/sfj-logo.jpg'></img>
          </NavLink>
        <div className='navbar-container'>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? "fa-regular fa-x" : "fa-solid fa-bars"} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <NavLink to='/' className='nav-links' onClick={closeMobileMenu}>
                Log Out
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/eventList' className='nav-links' onClick={closeMobileMenu}>
                Event List
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/participantList' className='nav-links' onClick={closeMobileMenu}>
                Participant List
              </NavLink>
            </li>
            
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar