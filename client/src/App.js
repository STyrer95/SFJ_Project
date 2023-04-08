import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Menu from "./components/menu";
import Navbar from "./components/navbar";
import ParticipantList from "./components/participant/participantList";
import EditParticipant from "./components/participant/editParticipant";
import CreateParticipant from "./components/participant/createParticipant";
import CreateEvent from "./components/event/createEvent";
import EditEvent from "./components/event/editEvent"; 
import EventList from "./components/event/eventList";
import EventParticipants from "./components/event/eventParticipants";
import Login from "./components/login";
import ViewParticipant from "./components/participant/viewParticipant";
import '../src/styling/App.css'

// Displayed app
const App = () => 
{
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/viewParticipant/:id" element={<ViewParticipant />} />
        <Route path="/editParticipant/:id" element={<EditParticipant />} />
        <Route path="/createParticipant" element={<CreateParticipant />} />
        <Route path="/participantList" element={<ParticipantList />} />
        <Route path="/editEvent/:id" element={<EditEvent />} />
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/eventList" element={<EventList />} />
        <Route path="/eventParticipants/:eventName" element={<EventParticipants />} />
      </Routes>
    </div>
  );
};
 
export default App;