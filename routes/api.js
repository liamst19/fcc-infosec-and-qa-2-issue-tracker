/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

const Schema = mongoose.Schema;

module.exports = function(app) {
  app.use(bodyParser.text());

  /** this project needs a db !! **/
  mongoose.set("useFindAndModify", false);
  mongoose.connect(process.env.DB);

  const issueSchema = new Schema({
    project:     { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    status_text: { type: String },
    created_on: { type: Date },
    updated_on: { type: Date },
    open: { type: Boolean }
  });
  const Issue = mongoose.model("Issue", issueSchema);

  app
    .route("/api/issues/:project")
    .get(function(req, res) {
      var project = req.params.project;
      const query = { project, ...req.query }
      Issue.find(query, (err, issues) => {
        if(err){
          console.log("error", err)
          return res.status(500)
        } else{
         res.json(issues) 
        }               
      })
      
    })

    .post(function(req, res) {
      var project = req.params.project;

      // Validate
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.status(400).send("missing required fields");
      }
      const issueDate = new Date();

      const issue = new Issue({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: issueDate,
        updated_on: issueDate,
        open: true
      });
      issue.save((err, savedIssue) => {
        if (err) {
          console.log("error", err);
          res.json({ error: err });
          return;
        } else {
          res.json(savedIssue);
          return;
        }
      });
    })

    .put(function(req, res) {
      var project = req.params.project;
      const issueId = req.body._id;
      if (!issueId) {
        return res.status(400).send("_id error");
      } else if (!req.body) {
        return res.status(400).send("no updated field sent");
      }

      let issue = { ...req.body, updated_on: new Date() };

      Issue.findByIdAndUpdate(
        issueId,
        issue,
        { new: true },
        (err, savedIssue) => {
          if (err) {
            console.log("error", err);
            res.json({ error: err });
            return;
          } else {
            res.json(savedIssue);
            return;
          }
        }
      );
    })

    .delete(function(req, res) {
      var project = req.params.project;
      console.log("DELETE", project);
      const issueId = req.body._id;
      if (!issueId) {
        return res.status(400).send("_id error");
      }
    
      Issue.findByIdAndDelete(issueId, (err) => {
        if(err){
          console.log('error', err);
          return res.status(400).send('could not delete' + issueId)
        } else{
          return res.status(200).send('deleted '+ issueId)
        }
      })
    
    });
};
