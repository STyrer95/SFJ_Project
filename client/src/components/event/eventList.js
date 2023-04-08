// Requirements
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom"; 
import Navbar from "../navbar";
import '../../styling/eventList.css'

const Record = (props) => (
  <tr>
    <td>{props.record.eventNumber}</td>
    <td>{props.record.eventName}</td>
    <td>{props.record.participantCount}</td>
    <td>{props.record.entryCount}</td>
    <td>${props.record.totalFees}</td>
    <td>
      <Link className="btn btn-link" to={`/editEvent/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link" onClick={() => {props.deleteRecord(props.record._id);}}>
        Delete
      </button> | 
      <Link className="btn btn-link" to={`/eventParticipants/${props.record.eventName}`} state={{eventOrder: props.record.eventNumber}}>
        Participants
      </Link>
    </td>
  </tr>
);

export default function EventList() 
{
  const [records, setRecords] = useState([]);
  
  // A CONSTANT const per participant :: Replace with utility API call at some point
  const CONST_COST_PER_PARTICIPANT = 10;

  // Get year from current session
  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));


  // This method fetches the records from the database.
  useEffect(() => 
  {
    async function getRecords() 
    {
      const response = await fetch(`http://localhost:5000/event/`+sessionYear);
 
      if (!response.ok) 
      {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      // this bit of code right here is most likely the key
      // to filtering out events by name
      // We need to figure out how to control how the records
      // are pulled instead of pulling them all
      // Note: that change wouldn't apply to this file, but to
      // the list file for the search function's implementation
      const records = await response.json();

      

     setRecords(records);
    }
 
    getRecords();
 
    return;
  }, [records.length]);
  


  // This method will delete a record
  async function deleteRecord(id) 
  {
    await fetch(`http://localhost:5000/deleteEvent/`+sessionYear+`/${id}`, 
    {
      method: "DELETE"
    });
 
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);

  }
  

  // This method will map out the records on the table
  function eventList() 
  {
    return records.map((record) => 
    {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }
 
  // This following section will display the table with the records of individuals.
  return (
    <div>
      <Navbar />
      <h3 className="eventTitle">Event List</h3>
      <div className="eventLink">
      <NavLink className="btn btn-primary" to="/createEvent">
        Add Event
      </NavLink>
      </div>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Event Number</th>
            <th>Event Name</th>
            <th>Partcipant Count</th>
            <th>Number of Entries</th>
            <th>Total Fees Collected</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{eventList()}</tbody>
      </table>
    </div>
  );
}