// Requirements
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../navbar";

// React CreateEvent Class
export default function CreateEvent()
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
      groupType: "Solo"
  });

  // Get year from current session
  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));

  // Navigate as a constant
  const navigate = useNavigate();
 
  // These methods will update the state properties.
  function updateForm(value) 
  {
    return setForm((prev) => 
    {
      return { ...prev, ...value };
    });
  }
 
  // Form validation happens before submit
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

  // This function will handle the submission.
  async function onSubmit(e) 
  {
    e.preventDefault();

    // Checks form validity before submitting
    if(isformValid(form))
    {
      // When a post request is sent to the create url, we'll add a new participant to the database.
      const newEvent = { ...form };
      
      // Ensures that the event/add route is reachable then posts to it
      await fetch("http://localhost:5000/event/add/"+sessionYear, 
      {
        method: "POST",
        headers: 
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })
      .catch(error => 
      {
        window.alert(error);
        return;
      });
  
      // Clears the form state after submitting
      setForm({
        eventID: 0,
        eventNumber: 0,
        eventName: "",
        participantCount: 0,
        entryCount: 0,
        totalFees: 0,
        ageRestriction: "All",
        groupType: "Solo"
      });
      
      // Navigates to eventList after successful submission
      navigate("/eventList");
   
    } 
  }
 
 // This following section will display the form that takes the input from the user.
  return (
    <div>
      <Navbar />
      <h3 className="h3">Add Event</h3>
      <form onSubmit={onSubmit}>
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
            value="Add Event"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}