// Requirements
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Select from 'react-select';
import Navbar from "../navbar";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";
import '../../styling/editParticipant.css'
 
// React EditParticipant Class
export default function EditParticipant() 
{
  const [selectedEvents, setSelectedEvents] = useState([]);

  // State Properties of form
  const [form, setForm] = useState(
  {
    regNum: 0,
    stageName: "",
    contactFirstName: "",
    contactLastName: "",
    phone: 0,
    participantCount: 0,
    address: "",
    city: "",
    state: "",
    zip: "",
    birthday: "",
    age: 0,
    events: [],
    eventCount: 0,
    totalFees: 0,
    inclusive: "No",
    records: [],
  });
  

  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));

  const params = useParams();
  const navigate = useNavigate();
 
  useEffect(() => 
  {

    async function fetchData() 
    {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/participant/`+sessionYear+`/${params.id.toString()}`);
 
      if (!response.ok) 
      {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      const record = await response.json();
      if (!record) 
      {
        window.alert(`Participant with id ${id} not found`);
        navigate("/participantList");
        return;
      }
      setForm(record);

      let tempArray = [];
      for(let i = 0; i < record.events.length; i++)
      {
        tempArray.push({value:record.events[i],label:record.events[i]});
      }
      setSelectedEvents(tempArray);

      
    }
 
    fetchData();

    return;

  }, [params.id, navigate]);
 
  // Fetches Event List
  async function getEventList() 
    {
      const response = await fetch(`http://localhost:5000/eventList/`+sessionYear);

      if (!response.ok) 
      {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const allEvents = await response.json();
      
      const tempEventOpts = [];
      for(let i = 0; i < allEvents.length; i++){
        tempEventOpts.push({"value":allEvents[i], "label":allEvents[i]});
      }
      return tempEventOpts;
    }

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

    if(form.stageName === '')
    {
      alert("Cannot submit without Stage Name");
      isValidForm = false;
    }

    if(form.contactFirstName === '')
    {
      alert("Cannot submit without Contact First Name");
      isValidForm = false;
    }

    if(form.contactLastName === '')
    {
      alert("Cannot submit without Contact Last Name");
      isValidForm = false;
    }

    if(form.phone === '')
    {
      alert("Cannot submit without Phone number");
      isValidForm = false;
    }

    if(form.participantCount === '')
    {
      form.participantCount = 1;
    }

    if(form.address === '')
    {
      alert("Cannot submit without Address");
      isValidForm = false;
    }

    if(form.city === '')
    {
      alert("Cannot submit without City");
      isValidForm = false;
    }

    if(form.state === '')
    {
      alert("Cannot submit without State");
      isValidForm = false;
    }

    // Checks if US zip code is valid format
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(form.zip);
    if(!isValidZip)
    {
      alert("Invalid ZIP");
      isValidForm = false;
    }

    if(form.birthday === '')
    {
      alert("Cannot submit without Birthday");
      isValidForm = false;
    }

    const birthday = new Date(form.birthday);
    const now = new Date();
    const diff = Math.abs(now - birthday);
    form.age = Math.floor(diff/(1000 * 60 * 60 * 24 * 365));
    
    // copied this from createParticipant, since the user could still technically
    // un-register the contestant from all events
    if(form.events.length === 0){
      alert("Connot submit without at least 1 event selected")
      isValidForm = false;
    }

    // this is meant to determine if there are ANY events that 
    // the contestant is not old enough to compete in
    var tooYoung = false;
    if(form.age <= 12)
    {
      for(let i = 0; i < form.events.length; i++)
      {
        if(form.events[i].type === "Adult")
        {
          tooYoung = true;
        }
      }
      
      // this is meant to prompt the user to determine whether or not 
      // to continue with registration or not
      // problem: the confirm box is not popping up
      // I know it is a pop-up blocker issue, but that's it
      // removing "window" will cause a compile-time error
      if(tooYoung === true)
      {
        alert("Warning: Contestant is registering for an adult event despite being 12 or younger");
        let isContinued = window.confirm("Do you still want to register this user?");
        if(isContinued === false)
        {
          isValidForm = false;
        }
      }
    }

    form.eventCount = form.events.length;

    form.totalFees = 10 * form.eventCount * form.participantCount;

    // Returns true if no issues found in form
    return isValidForm;

  }

  async function onSubmit(e) 
  {
    e.preventDefault();

    if(isformValid(form))
    {
      const editedPerson = 
      {
        regNum: form.regNum,
        stageName: form.stageName,
        contactFirstName: form.contactFirstName,
        contactLastName: form.contactLastName,
        phone: form.phone,
        participantCount: form.participantCount,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        birthday: form.birthday,
        age: form.age,
        events: form.events,
        eventCount: form.eventCount,
        totalFees: form.totalFees,
        inclusive: form.inclusive
      };
 
      // This will send a post request to update the data in the database.
      await fetch(`http://localhost:5000/participant/update/`+sessionYear+`/${params.id}`, 
      {
        method: "POST",
        body: JSON.stringify(editedPerson),
        headers: 
        {
            'Content-Type': 'application/json'
        },
      });
 
      navigate("/participantList");

    }
  }

  function handleEventChange(e)
  {
    let tempArray = [];
    for(let i = 0; i < e.length; i++)
    {
      tempArray.push(e[i].value);
    }
    setSelectedEvents(e);
    updateForm({events: tempArray});
  }

  const eventOptions = () =>
    new Promise((resolve) => {
      setTimeout(() => 
      {
        resolve(getEventList());
      }, 1000);
    });
  
  
  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <Navbar />
      <h3 className="h3">Update Participant</h3>
        <div className="regNum">
          <label htmlFor="regNum">Registration Number</label>
          <input
            type="text"
            className="form-control"
            id="regNum"
            value={form.regNum}
            onChange={(e) => updateForm({ regNum: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="events">Events</label>
          <AsyncSelect
            cacheOptions 
            defaultOptions
            value={selectedEvents}
            loadOptions={eventOptions}
            onChange={(e)=> handleEventChange(e)}
            isMulti
          />
        </div>
        <div className="form-group">
          <label htmlFor="stageName">Stage Name</label>
          <input
            type="text"
            className="form-control"
            id="stageName"
            value={form.stageName}
            onChange={(e) => updateForm({ stageName: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="contactFirstName">Contact First Name</label>
          <input
            type="text"
            className="form-control"
            id="contactFirstName"
            value={form.contactFirstName}
            onChange={(e) => updateForm({ contactFirstName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactLastName">Contact Last Name</label>
          <input
            type="text"
            className="form-control"
            id="contactLastName"
            value={form.contactLastName}
            onChange={(e) => updateForm({ contactLastName: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={form.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="participantCount">Number of Participants in Group</label>
          <input
            type="text"
            className="form-control"
            id="participantCount"
            value={form.participantCount}
            onChange={(e) => updateForm({ participantCount: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            className="form-control"
            id="state"
            value={form.state}
            onChange={(e) => updateForm({ state: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="address">Street Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={form.address}
            onChange={(e) => updateForm({ address: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip">Zip</label>
          <input
            type="text"
            className="form-control"
            id="zip"
            value={form.zip}
            onChange={(e) => updateForm({ zip: e.target.value })}
          />
        </div>
        <div class="clear">&nbsp;</div>
        <div className="form-group">
          <label htmlFor="birthday">Birth Date</label>
          <input
            type="text"
            className="form-control"
            id="birthday"
            value={form.birthday}
            onChange={(e) => updateForm({ birthday: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inclusive">Register for Inclusive Events</label>
          <select
            onChange={(e) => updateForm({ inclusive: e.target.value})}
            className="form-control"
            id="inclusive"
            value={form.inclusive}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <br />
        <div class="clear">&nbsp;</div>
        <div className="button">
          <input
            type="submit"
            value="Update Participant"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}