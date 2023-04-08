import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom"; 
import Navbar from "../navbar";
import '../../styling/participantList.css'

const Record = (props) => (
  <tr>
    <td>{props.record.regNum}</td>
    <td>{props.record.stageName}</td>
    <td>{props.record.city}</td>
    <td>{props.record.state}</td>
    <td>{props.record.participantCount}</td>
    <td>{props.record.eventCount}</td>
    <td>${props.record.totalFees}</td>
    <td>
      <Link className="btn btn-link" to={`/editParticipant/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link" onClick={() => {props.deleteRecord(props.record._id);}}>
        Delete
      </button>|
      <Link className="btn btn-link" to={`/viewParticipant/${props.record._id}`}>Entry</Link>
    </td>
  </tr>
);

export default function ParticipantList() 
{
  const [records, setRecords] = useState([]);
  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));

  // This method fetches the records from the database.
  useEffect(() => 
  {
    async function getRecords() 
    {
      const response = await fetch(`http://localhost:5000/participant/`+sessionYear);
 
      if (!response.ok) 
      {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      const records = await response.json();

      setRecords(records);
    }
 
    getRecords();
 
   return;

  }, [records.length]);
 
  // This method will delete a record
  async function deleteRecord(id) 
  {
    await fetch(`http://localhost:5000/deleteParticipant/`+sessionYear+`/${id}`, 
    {
      method: "DELETE"
    });
 
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }
 
  // This method will map out the records on the table
  function participantList() 
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
      <h3 className="participantTitle">Participant List</h3>
      <div className="participantLink">
      <NavLink className="btn btn-primary" to="/createParticipant">
        Add Participant
      </NavLink>
      </div>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Stage Name</th>
            <th>City</th>
            <th>State</th>
            <th>No. of Participants</th>
            <th>No. of Events</th>
            <th>Total Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{participantList()}</tbody>
      </table>
    </div>
  );
}