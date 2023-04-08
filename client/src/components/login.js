import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import '../styling/login.css'

function Login(){
  const [login, setLogin] = useState(
  {
    user:"",
    pass:""
  });
  const[minYear,setMinYear] = useState(2020);
  const[currYear,setcurrYear] = useState(new Date().getFullYear());
  const [selectedOption, setSelectedOption] = useState({"label":currYear, "value":currYear});
  const [yearOpts,setYearOpts] = useState([]);
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateLogin(value) 
  {
    return setLogin((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e)
  {
    e.preventDefault();

    const newLogin = { ...login };
    
    const response = await fetch("http://localhost:5000/login", 
    {
      method: "POST",
      headers: 
      {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLogin),
    })
    .catch(error => 
    {
      window.alert(error);
      return;
    });

    const validFlag = await response.json();

    if(validFlag){
      updateSessionYear(selectedOption.value);

      connectToYear(selectedOption.value);
      
      setLogin(
      {
        user:"",
        pass:""
      });
      
      navigate("/menu");
    }
    else{
      alert("Invalid Login");
    }    
  }
  
  async function getMinYear() 
  {
    const response = await fetch(`http://localhost:5000/getConstants/minyear`);

    if (!response.ok) 
    {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const resYear = await response.json();
    setMinYear(resYear);

  }
    
  useEffect(()=>
  {
      getMinYear();
      
      let tempYearOpts = [];
      for(let i = 0; i <= (currYear+2)-minYear;i++)
      {
          tempYearOpts.push({"value": parseInt(minYear)+i, "label": parseInt(minYear)+i});
      }
      
      setYearOpts(tempYearOpts);
      
  }, []);
  
  async function connectToYear(year){
    console.log("Checking existance of database for "+year)
    const response = await fetch(`http://localhost:5000/connect/`+year);

    if (!response.ok) 
    {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const resReturn = await response.json();
    console.log(resReturn);
  }

  function updateSessionYear(year)
  {
    console.log("session year set to " + year);
    sessionStorage.setItem("year",year);
      
  }

  return (
    <>
    <h1 className="h1">Sign In</h1>
    <form onSubmit={onSubmit} className="formBox">
    <label className="label">Username</label>
    <input
      type="text"
      className="form-control"
      name="username"
      id="username"
      onChange={(e) => updateLogin({ user: e.target.value })}
      required
    />
    <label className="label">Password</label>
    <input
      type="text"
      className="form-control"
      name="password"
      id="password"
      onChange={(e) => updateLogin({ pass: e.target.value })}
      required
    />
    <label className="label">Registration Year</label>
    <Select 
      className="select"
      options={yearOpts} 
      defaultValue={selectedOption}
      onChange={setSelectedOption}
    />
    <br />
    <input
      type="submit"
      value="Login"
      className="btn btn-primary"
    />
    </form>
    </>
  )
}

export default Login;