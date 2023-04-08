const express = require("express");
 
// participantRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /participant.
const utilityRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
utilityRoutes.route("/connect/:year").get(async function (req,res)
{
  console.log(req.params.year);
  
  let db_connect = dbo.getDb();
  
  let myquery = {registrationYear:req.params.year}; 

  const indexExists =  await db_connect.collection("sfj_counters").findOne(myquery);
  
  if(indexExists != null){
    return res.json("Year exists");
  }
  else{
    console.log("Creating New Year");

    let lastYear = (req.params.year-1).toString();
    
    const lastYearEvents = await db_connect.collection("sfj_events").find({"registrationYear":lastYear}).toArray()
    
    let lastYearEventCount = lastYearEvents.length;

    for(let i = 0; i < lastYearEventCount; i++){

      let event_obj = {
        registrationYear: req.params.year,
        eventID: lastYearEvents[i].eventID,
        eventNumber: lastYearEvents[i].eventNumber,
        eventName: lastYearEvents[i].eventName,
        participantCount: 0, 
        entryCount: 0,
        totalFees: 0,
        ageRestriction: lastYearEvents[i].ageRestriction,
        groupType: lastYearEvents[i].groupType
      };
      

      db_connect.collection("sfj_events").insertOne(event_obj).then(
        () => {console.log("Event Added :", lastYearEvents[i].eventName)},
        err => {console.error(err); throw err;}
      );

    };
    
    let counter_obj = {
      registrationYear: req.params.year,
      registrationCount: 0,
      eventIDCount: lastYearEventCount
    };

    db_connect.collection("sfj_counters").insertOne(counter_obj).then(
      () => {console.log("Year Entry Created ==", req.params.year)},
      err => {console.error(err); throw err;}
    );
        
    return res.json("Year did not exist - Year Info created."); 
  }
  
});
 
utilityRoutes.route("/getConstants/minyear").get(function (req, res) 
{
  res.json(process.env.MIN_YEAR)
});

utilityRoutes.route("/login").post(function (req, response) 
{
  if(req.body.user === "admin" && req.body.pass === "pass"){
    response.json(true);
  }
  else{
    response.json(false);
  }
});

module.exports = utilityRoutes;