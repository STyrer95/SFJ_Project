const express = require("express");
 
// participantRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /participant.
const participantRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the records.
participantRoutes.route("/participant/:year").get(function (req, res) 
{
  let db_connect = dbo.getDb();
  db_connect
    .collection("sfj_participants")
    .find({registrationYear: req.params.year})
    .toArray()
    .then(
      result => {res.json(result)},
      err => {console.error(err); throw err}
    );
});
 
// This section will help you get a single participant by id
participantRoutes.route("/participant/:year/:id").get(function (req, res) 
{
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year };
  db_connect
    .collection("sfj_participants")
    .findOne(myquery)
    .then(
      result => {res.json(result)},
      err => {console.error(err); throw err}
  );
});
 
// This section will help you create a new participant.
participantRoutes.route("/participant/add/:year").post(async function (req, response) 
{
  let db_connect = dbo.getDb();

  const yearInfo = await db_connect.collection("sfj_counters").findOne({"registrationYear":req.params.year});
  let registrationNumber = yearInfo.registrationCount+1;
  
  let myobj = 
  {
    registrationYear: req.params.year,
    regNum: registrationNumber,
    stageName: req.body.stageName,
    contactFirstName: req.body.contactFirstName,
    contactLastName: req.body.contactLastName,
    phone: req.body.phone,
    participantCount: req.body.participantCount,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    birthday: req.body.birthday,
    age: req.body.age,
    events: req.body.events,
    eventCount: req.body.eventCount,
    totalFees: req.body.totalFees,
    inclusive: req.body.inclusive
  };
  db_connect
    .collection("sfj_participants")
    .insertOne(myobj)
    .then(
      result => {console.log("1 document added: Participant #"+registrationNumber); response.json(result);},
      err => {console.error(err); throw err}
  );

  for(let i = 0; i < myobj.eventCount; i++){
    console.log(myobj.events[i] + " incrementing");
    let eventQuery = {"registrationYear":req.params.year, "eventName":myobj.events[i]}
    let feeIncrease = 10*parseInt(myobj.participantCount);
    db_connect.collection("sfj_events").updateOne(eventQuery,{$inc: {"participantCount":1, "entryCount":parseInt(myobj.participantCount), "totalFees":feeIncrease}}).then(
      confirm => {console.log(confirm)},
      err => {console.error(err); throw err;}
    )
  }

  await db_connect.collection("sfj_counters").updateOne({"registrationYear":req.params.year}, { $set: { "registrationCount" : registrationNumber}});

});
 
// This section will help you update a record by id.
participantRoutes.route("/participant/update/:year/:id").post(async function (req, response) 
{
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year};

  db_connect.collection("sfj_participants").findOne(myquery)
    .then(
      participant => {
        for(let i = 0; i < participant.eventCount; i++){
          console.log(participant.events[i] + " incrementing");
          let eventQuery = {"registrationYear":req.params.year, "eventName":participant.events[i]}
          let feeDecrease = -10*parseInt(participant.participantCount);
          let negParticipant = parseInt(participant.participantCount)*-1;
          db_connect.collection("sfj_events").updateOne(eventQuery,{$inc: {"participantCount":-1, "entryCount":negParticipant, "totalFees":feeDecrease}}).then(
            () => {},
            err => {console.error(err); throw err;}
          )
        }
      },
      err => {console.error(err)}
    )

  let newvalues = 
  {
    $set: 
    {
      registrationYear:req.params.year,
      regNum: req.body.regNum,
      stageName: req.body.stageName,
      contactFirstName: req.body.contactFirstName,
      contactLastName: req.body.contactLastName,
      phone: req.body.phone,
      participantCount: req.body.participantCount,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      birthday: req.body.birthday,
      age: req.body.age,
      events: req.body.events,
      eventCount: req.body.eventCount,
      totalFees: req.body.totalFees,
      inclusive: req.body.inclusive
    },
  };
    db_connect
      .collection("sfj_participants")
      .updateOne(myquery, newvalues)
      .then(
        result => {console.log("1 document updated"); response.json(result)},
        err => {console.error(err); throw err}
    );

  for(let i = 0; i < req.body.eventCount; i++){
    console.log(req.body.events[i]);
  }

  for(let i = 0; i < req.body.eventCount; i++){
    console.log(req.body.events[i] + " incrementing");
    let eventQuery = {"registrationYear":req.params.year, "eventName":req.body.events[i]}
    let feeIncrease = 10*parseInt(req.body.participantCount);
    db_connect.collection("sfj_events").updateOne(eventQuery,{$inc: {"participantCount":1, "entryCount":parseInt(req.body.participantCount), "totalFees":feeIncrease}}).then(
      confirm => {console.log(confirm)},
      err => {console.error(err); throw err;}
    )
  }



});
 
// This section will help you delete a particpant
participantRoutes.route("/deleteParticipant/:year/:id").delete((req, response) => 
{
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year };

  db_connect.collection("sfj_participants").findOne(myquery).then(
    participant => {
      for(let i = 0; i < participant.eventCount; i++){
        console.log(participant.events[i] + " incrementing");
        let eventQuery = {"registrationYear":req.params.year, "eventName":participant.events[i]}
        let feeDecrease = -10*parseInt(participant.participantCount);
        let negParticipant = parseInt(participant.participantCount)*-1;
        db_connect.collection("sfj_events").updateOne(eventQuery,{$inc: {"participantCount":-1, "entryCount":negParticipant, "totalFees":feeDecrease}}).then(
          confirm => {console.log(confirm)},
          err => {console.error(err); throw err;}
        )
      }
    },

    err => {console.error(err); throw err;}

  )

  db_connect
    .collection("sfj_participants")
    .deleteOne(myquery)
    .then(
      result => {console.log("1 document deleted"); response.json(result)},
      err => {console.error(err); throw err}
  );
});

// This section will help you get a list of all the records for a given event.
participantRoutes.route("/participant/fromEvent/:year/:eventName").get(function (req, res) 
{
  let db_connect = dbo.getDb();
  db_connect
    .collection("sfj_participants")
    .find({"registrationYear":req.params.year,"events":req.params.eventName})
    .toArray()
    .then(
      result => {res.json(result)},
      err => {console.error(err); throw err}
  );
});
 
participantRoutes.route("/participant/search/").post(function (req,res)
{
    let db_connect = dbo.getDb();

    db_connect
        .collection("sfj_participants")
        .find({"phone":req.body.phone})
        .toArray()
        .then(
            result =>{res.json(result);},
            err => {console.error(err); throw err;}
        );

});

module.exports = participantRoutes;