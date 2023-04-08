// Requirements
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../navbar";
import '../../styling/editEvent.css'
 
// React EditEvent Class
export default function EditEvent() 
{
  // State Properties of form
  const [form, setForm] = useState(
  {
    eventID: 0,
    eventNumber: 0,
    eventName: "",
    participantCount: 0,
    entryCount: 0,
    totalFees: 0,
    ageRestriction: "All",
    groupType: "Solo",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();
 
  // Get year from current session
  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));

  useEffect(() => {
    async function fetchData() 
    {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/event/`+sessionYear+`/${params.id.toString()}`);
      
      if (!response.ok) 
      {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      const record = await response.json();
      if (!record) 
      {
        window.alert(`Event with id ${id} not found`);
        navigate("/eventList");
        return;
      }
 
      setForm(record);
    }
 
    fetchData();
 
    return;
  }, [params.id, navigate]);
 
  // These methods will update the state properties.
  function updateForm(value) 
  {
    return setForm((prev) => 
    {
      return { ...prev, ...value };
    });
  }
 
  // Form validation function
  function isformValid(form)
  {
    // Boolean that determines whether form is valid
    var isValidForm = true; 

    if(form.eventName === '')
    {
      alert("Cannot submit without Event Name");
      isValidForm = false;
    }

    // Returns true if no issues found in form
    return isValidForm;
  }

  async function onSubmit(e) 
  {
    e.preventDefault();

    if(isformValid(form))
    {
      const editedPerson = {
        eventID: form.eventID,
        eventNumber: form.eventNumber,
        eventName: form.eventName,
        participantCount: form.participantCount,
        entryCount: form.entryCount,
        totalFees: form.totalFees,
        ageRestriction: "All",
        groupType: "Solo"
      };
   
      // This will send a post request to update the data in the database.
      await fetch(`http://localhost:5000/event/update/`+sessionYear+`/${params.id}`, 
      {
        method: "POST",
        body: JSON.stringify(editedPerson),
        headers: 
        {
          'Content-Type': 'application/json'
        },
      });
  
      navigate("/eventList");

    }

  }
 
  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <Navbar />
      <h3 className="h3">Update Event</h3>
      <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="eventID">Event ID</label>
        <input
          type="number"
          min={0}
          className="form-control"
          id="eventID"
          value={form.eventID}
          onChange={(e) => updateForm({ eventID: e.target.value })}
        />
        </div>
        <div className="form-group">
          <label htmlFor="eventNumber">Event Number</label>
          <input
            type="number"
            min={0}
            className="form-control"
            id="eventNumber"
            value={form.eventNumber}
            onChange={(e) => updateForm({ eventNumber: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="eventName">Event Name</label>
          <input
            type="text"
            className="form-control"
            id="eventName"
            value={form.eventName}
            onChange={(e) => updateForm({ eventName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ageRestriction">Age Restriction</label>
          <select
            onChange={(e) => updateForm({ ageRestriction: e.target.value })}
            className="form-control"
            id="ageRestriction"
          >
            <option value="All">All Ages</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Beginner">Beginner</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="groupType">Solo/Group</label>
          <select
            onChange={(e) => updateForm({ groupType: e.target.value })}
            className="form-control"
            id="groupType"
          >
            <option value="Solo">Solo</option>
            <option value="Group">Group</option>
          </select>
        </div>
        <br />
        <div class="clear">&nbsp;</div>
        <div className="button">
          <input
            type="submit"
            value="Update Event"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}