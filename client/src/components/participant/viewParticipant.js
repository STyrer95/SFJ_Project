import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../navbar";

export default function ViewParticipant()
{


    const [sessionYear, setSessionYear] = useState(sessionStorage.getItem("year"));
    const params = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(
    {
        regNum:   0,
        stageName: "",
        contactFirstName: "",
        contactLastName: "",
        phone: "",
        participantCount: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        birthday: "",
        age: "",
        events: [],
        eventCount: "",
        totalFees: "",
        inclusive: ""
  });

  useEffect(() =>
  {
    async function fetchData()
    {
        const id = params.id.toString();
        const response = await fetch(`http://localhost:5000/participant/`+sessionYear+`/${params.id.toString()}`);

        if(!response.ok)
        {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const record = await response.json();
        if(!record)
        {
            window.alert(`Participant with ID ${id} not found`);
            navigate(`/participantList`);
            return;
        }

        setForm(record);
    }
    fetchData();
    return;

  }, [params.id, navigate]);

  return (
        <div>
            <Navbar />
            <h2>Participant Information</h2>
            <hr/>
            <h4>ID: {form.regNum}</h4>
            <h4>Name: {form.stageName}</h4>
            <h4>Contact Name: {form.contactFirstName} {form.contactLastName}</h4>
            <h4>Phone Number: {form.phone.toString()}</h4>
            <h4>Number of Participants in Group: {form.participantCount.toString()}</h4>
            <h4>Address: {form.address}</h4>
            <h4>City: {form.city}</h4>
            <h4>State: {form.state}</h4>
            <h4>Zip: {form.zip.toString()}</h4>
            <h4>Birthday: {form.birthday.toString()}</h4>
            <h4>Age: {form.age.toString()}</h4>
            <h4>Events: {form.events.toString()}</h4>
            <h4>Event Count: {form.eventCount.toString()}</h4>
            <h4>Total Fees: ${form.totalFees.toString()}</h4>
            <h4>Included in Inclusive Events: {form.inclusive}</h4>
        </div>
    );
}