// Requirements
const express = require("express");
 
// eventsRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /events.
const eventsRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the eventRecords.
eventsRoutes.route("/event/:year").get(function (req, res)
{
    let db_connect = dbo.getDb();

    db_connect
    .collection("sfj_events")
    .find({registrationYear: req.params.year})
    .toArray()
    .then(
        result => {res.json(result)},
        err => {console.error(err); throw err}
    );
});
 
// This section will help you get a single events by id
eventsRoutes.route("/event/:year/:id").get(function (req, res) 
{
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year };
  
    db_connect
    .collection("sfj_events")
    .findOne(myquery)
    .then(
        result => {res.json(result)},
        err => {console.error(err); throw err}
    );
});
 
// This section will help you create a new events.
eventsRoutes.route("/event/add/:year").post(async function (req, response) 
{
  let db_connect = dbo.getDb();

  const yearInfo = await db_connect.collection("sfj_counters").findOne({"registrationYear":req.params.year});
  let newEventID = yearInfo.eventIDCount+1;

  let myobj = 
  {
    registrationYear: req.params.year,
    eventID: newEventID,
    eventNumber: req.body.eventNumber,
    eventName: req.body.eventName,
    participantCount: req.body.participantCount, 
    entryCount: req.body.entryCount,
    totalFees: req.body.totalFees,
    ageRestriction: req.body.ageRestriction,
    groupType: req.body.groupType
  };

  db_connect
    .collection("sfj_events")
    .insertOne(myobj)
    .then(
      result => {console.log("1 document added"); response.json(result)},
      err => {console.error(err); throw err}
  );

  db_connect.collection("sfj_counters").updateOne({"registrationYear":req.params.year},{$inc: {"eventIDCount":1}}).then(
    () => {},
    err => {console.error(err); throw err;}
  )

});
 
// This section will help you update a record by id.
eventsRoutes.route("/event/update/:year/:id").post(function (req, response) 
{
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year};
  let newvalues = 
  {
    $set: 
    {
        registrationYear: req.params.year.toString(),
        eventID: req.body.eventID,
        eventNumber: req.body.eventNumber,
        eventName: req.body.eventName,
        participantCount: req.body.participantCount, 
        entryCount: req.body.entryCount,
        totalFees: req.body.totalFees,
        ageRestriction: req.body.ageRestriction,
        groupType: req.body.groupType
    },
  };

    db_connect
      .collection("sfj_events")
      .updateOne(myquery, newvalues)
      .then(
        result => {console.log("1 document updated"); response.json(result)}, 
        err => {console.error(err); throw err}
    );
});
 
// This section will help you delete an event
eventsRoutes.route("/deleteEvent/:year/:id").delete((req, response) => 
{
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id), registrationYear: req.params.year };

  db_connect
    .collection("sfj_events")
    .deleteOne(myquery)
    .then(
      result => {console.log("1 document deleted"); response.json(result)},
      err => {console.error(err); throw err}
  );

  db_connect.collection("sfj_counters").updateOne({"registrationYear":req.params.year},{$inc: {"eventIDCount":-1}}).then(
    () => {},
    err => {console.error(err); throw err;}
  )
  
});

// This section will help you get a list of all the eventRecords.
eventsRoutes.route("/eventList/:year").get(function (req, res)
{
  let db_connect = dbo.getDb();
  db_connect
    .collection("sfj_events")
    .find({registrationYear: req.params.year})
    .toArray()
    .then(
      result => {
        var i, count;
        let resultArray = [];
        for(i = 0, count = result.length; i < count; i++)
        {
          resultArray.push(result[i].eventName);
        }
        res.json(resultArray);
      },
      err => {console.error(err); throw err}
    );
});

// This section will help you get a list of all the eventRecords in Select format.
eventsRoutes.route("/eventListSelect/:year").get(function (req, res)
{
  let db_connect = dbo.getDb();
  db_connect
    .collection("sfj_events")
    .find({registrationYear: req.params.year})
    .toArray()
    .then(
      result => {
        var i, count;
        let resultArray = [];
        for(i = 0, count = result.length; i < count; i++)
        {
          resultArray.push({"label":result[i].eventName, "value":result[i].eventName});
        }
        res.json(resultArray);
      },
      err => {console.error(err); throw err}
    );
});

module.exports = eventsRoutes;