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

  mongoose.connect(process.env.DB);
  
  const issueSchema = new Schema({
        issue_title: { type: String, required: true },
        issue_text:  { type: String, required: true },
        created_by:  { type: String, required: true },
        assigned_to: { type: String },
        status_text: { type: String }
  });
  const Issue = mongoose.model('Issue', issueSchema);

  app
    .route("/api/issues/:project")
    .get(function(req, res) {
      var project = req.params.project;
      console.log("GET", project);
    })

    .post(function(req, res) {
      var project = req.params.project;
      console.log('POST', project);
      const issue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });
      issue.save((err, savedIssue) => {
        if(err){
                console.log('error', err)
                res.json({ 'error': err })
                return;
              } else {
                res.json(savedIssue)
                return;
              }
      })
    })

    .put(function(req, res) {
      var project = req.params.project;
      console.log("PUT", project);
    })

    .delete(function(req, res) {
      var project = req.params.project;
      console.log("DELETE", project);
    });
};
