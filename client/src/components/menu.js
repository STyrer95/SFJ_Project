import React from "react";
import { NavLink } from 'react-router-dom';

import '../styling/menu.css'
import '../styling/App.css'

function Menu() 
{

  return (
    <>
      <div className='menu-container'>
        <h1>Smithville Fiddlers Jamboree</h1>
        <div className='menu-btns'>
          <NavLink className='menu-item' to={"/eventList"}>Events</NavLink>
          <NavLink className='menu-item' to={"/participantList"}>Participant List</NavLink>
          <NavLink className='menu-item' to={"/"}>Log Out</NavLink>
        </div>
      </div>
    </>
  )
}

export default Menu