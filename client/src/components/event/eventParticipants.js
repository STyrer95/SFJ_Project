import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import '../../styling/eventParticipants.css'

const Record = (props) => (
  <tr>
    <td>{props.record.lineNo}</td>
    <td>{props.record.regNum}</td>
    <td>{props.record.inclusive}</td>
    <td>{props.record.stageName}</td>
    <td>{props.record.city}</td>
    <td>{props.record.state}</td>
    <td>{props.record.participantCount}</td>
  </tr>
);

export default function EventParticipants() 
{
  const [records, setRecords] = useState([]);
  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));
  const [totalCount, setTotalCount] = useState(0);
  const params = useParams();
  const location = useLocation();

  const [eventOrder, setEventOrder] = useState(0);
  

  // This method fetches the records from the database.
  useEffect(() => 
  {
    async function getRecords() 
    {
      const stringEvent = params.eventName.toString();

      const response = await fetch(`http://localhost:5000/participant/fromEvent/`+sessionYear+`/`+stringEvent);
 
      if (!response.ok) 
      {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      const records = await response.json();

      var participantAccumulator = 0;
      for(let i = 0; i < records.length; i++){
        records[i].lineNo = records.length-i;
        participantAccumulator += parseInt(records[i].participantCount);
      }

      setTotalCount(participantAccumulator);

      setRecords(records);
    }
 
    getRecords();

    //setEventOrder(location.state.eventOrder);
    
   return;

  }, []);
  

  // This method will map out the records on the table
  function printParticipant() 
  {
    return records.slice(0).reverse().map((record) => 
    {
      return (
        <Record
          record={record}
          key={record._id}
        />
      );
    });
  }
 
  // This following section will display the table with the records of individuals.
  return (
    <div>
      <Navbar />
      <button onClick={window.print}>Print Report</button>
      <h3>Participant Report</h3>
      <div className="section-to-print" id="section-to-print">
      <span className="nameSpan">Event Name: {params.eventName.toString()}</span>
      <span className="orderSpan">Event Order: {location.state.eventOrder.toString()}</span>
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>ID</th>
            <th>Inclusive</th>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>No. of Participants</th>
          </tr>
        </thead>
        <tbody>{printParticipant()}</tbody>
      </table>
      <span className="extraInfo">Total Participants : {totalCount}</span>
      </div>
    </div>
  );
}