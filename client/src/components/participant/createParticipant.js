// Requirements
import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { useNavigate } from "react-router";
import AsyncSelect from "react-select/async";
import Navbar from "../navbar";
import '../../styling/createParticipant.css'

ReactModal.setAppElement('#root');

const Record = (props) => (
  <tr>
    <td>{props.record.stageName}</td>
    <td>{props.record.city}</td>
    <td>{props.record.state}</td>
    <td>{props.record.participantCount}</td>
    <td>
      <button className="btn btn-link" onClick={() => {props.setRecord(props);}}>
        Select
      </button>
    </td>
  </tr>
);

// React CreateParticipant Class
export default function CreateParticipant() 
{

  async function getEventList() 
  {
    const response = await fetch(`http://localhost:5000/eventListSelect/`+sessionYear);

    if (!response.ok) 
    {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const allEvents = await response.json();
    
    let tempEventOpts = [];
    for(let i = 0; i < allEvents.length; i++){
      tempEventOpts.push(allEvents[i])
    }
    
    return tempEventOpts;

  }
  
  // State Properties of page
  const [form, setForm] = useState(
  {
    regNum: 0,
    stageName: "",
    contactFirstName: "",
    contactLastName: "",
    phone: "",
    participantCount: 1,
    address: "",
    city: "",
    state: "",
    zip: "",
    birthday: "",
    age: 0,
    events: [],
    eventCount: 0,
    totalFees: 0,
    inclusive: "No"
  });

  const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));

  const [showModal, setShowModal] = useState(false);
  const [records,setRecords] = useState([]);


  // These methods will update the state properties.
  function updateForm(value) 
  {
    return setForm((prev) => {
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
      alert("Cannot submit without Participant or Group Name");
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

    if(form.birthday === ''){
      alert("Cannot submit without Birthday");
      isValidForm = false;
    }

    const birthday = new Date(form.birthday);
    const now = new Date();
    const diff = Math.abs(now - birthday);
    form.age = Math.floor(diff/(1000 * 60 * 60 * 24 * 365));

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
      if(tooYoung)
      {
        alert("Warning: Contestant is registering for an adult event despite being 12 or younger");
        let isContinued = window.confirm("Do you still want to register this contestant?");
        if(!isContinued)
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
  
  const navigate = useNavigate();

  // This function will handle the submission.
  async function onSubmit(e)
  {
    e.preventDefault();

    // Checks form validity before submitting
    if(isformValid(form))
    {
      // When a post request is sent to the create url, we'll add a new participant to the database.
      const newPerson = { ...form };

      // Ensures that the participant/add route is reachable then posts to it
      await fetch("http://localhost:5000/participant/add/"+sessionYear, 
      {
        method: "POST",
        headers: 
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      })
      .catch(error => 
      {
        window.alert(error);
        return;
      });

      // Clears the form state after submitting
      setForm({
        regNum: 0,
        stageName: "",
        contactFirstName: "",
        contactLastName: "",
        phone: "",
        participantCount: 1,
        address: "",
        city: "",
        state: "",
        zip: "",
        birthday: "",
        age: 0,
        events: [],
        eventCount: 0,
        totalFees: 0,
        inclusive: "No"   
      });

      // Navigates to participantList on form submission
      navigate("/participantList");
    } 
  }

  // Only functions for a single phone, create modal overlay for selecting 
  async function phoneLookup(){
    let pnum = document.getElementById("pNumLookup").value
    let bodyObj = {phone: pnum};
    
    const response = await fetch("http://localhost:5000/participant/search/", 
    {
      method: "POST",
      headers: 
      {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    })
    .catch(error => 
    {
      window.alert(error);
      return;
    });

    const searchResults = await response.json();

    if(searchResults.length === 0){
      alert("No participant found with given phone number.");
    }
    else{
      setRecords(searchResults);
      handleOpenModal();
    }

  }
 

  function lookupList() 
  {
    return records.map((record) => 
    {
      return (
        <Record
          record={record}
          setRecord={() => {setForm(record); handleCloseModal()}}
          key={record._id}
        />
      );
    });
  }

  function handleOpenModal () {
    setShowModal(true);
  }
  
  function handleCloseModal () {
    setShowModal(false);
  }

  function handleEventChange(e)
  {
    let tempArray = [];
    for(let i = 0; i < e.length; i++)
    {
      tempArray.push(e[i].value);
    }
    updateForm({events: tempArray});
  }

  const eventOptions = () =>
    new Promise((resolve) => 
    {
      setTimeout(() => 
      {
        resolve(getEventList());
      }, 1000);
    });
    
  
  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <Navbar />
      <h3 className="h3">Add Participant</h3>
      <div id = "searchWrapper" className="searchWrapper">
      <div className = "pNum">
      <button className="btn btn-primary" onClick={phoneLookup}>Lookup by Phone# :</button>
      <input className="pNumBox" type="text" id="pNumLookup"></input>
      </div>
        <ReactModal 
          isOpen={showModal}
          className='modal-main'
          onRequestClose={handleCloseModal}
          shouldCloseOnOverlayClick={false}
        >
          <button onClick={handleCloseModal}>Close Modal</button>
          <div>
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Stage Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>No. of Participants</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{lookupList()}</tbody>
            </table>
          </div>
          
        </ReactModal>
      </div>
      <div class="clear">&nbsp;</div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="events">Events</label>
          <AsyncSelect
            cacheOptions 
            defaultOptions 
            loadOptions={eventOptions}
            onChange={(e)=> handleEventChange(e)}
            isMulti
          />
        </div>
        <div className="form-group">
          <label htmlFor="stageName">Participant or Group Name</label>
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
          <label htmlFor="phone">Phone Number (Numbers only)</label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            className="form-control"
            id="phone"
            value={form.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="participantCount">Number of Participants in Group</label>
          <input
            type="number"
            min={1}
            className="form-control"
            id="participantCount"
            value={form.participantCount}
            onChange={(e) => updateForm({ participantCount: e.target.value })}
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
            type="number"
            className="form-control"
            id="zip"
            value={form.zip}
            onChange={(e) => updateForm({ zip: e.target.value })}
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
          <label htmlFor="birthday">Birth Date</label>
          <input
            type="date"
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
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div class="clear">&nbsp;</div>
        <div className="button">
          <input
            type="submit"
            value="Add Participant"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}