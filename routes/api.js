/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app) {
  
  app.use(bodyParser.text());
  
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if(err) console.log('Database error: ' + err);
    console.log('connected to database')
    
    app.route('/api/issues/:project')  
      .get(function (req, res){
        var project = req.params.project;
      })

      .post(function (req, res){
        
        var project = req.params.project;
        console.log('posting', project)
        db.collection('issues').insertOne({
          project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text
        }, (err, doc) => {
          if(err){
            console.log('error', err);
            res.json({ error: 'something went wrong'});
          } else{
            console.log('success', doc)
            res.json(doc);
          }
        });
      })

      .put(function (req, res){
        var project = req.params.project;

      })

      .delete(function (req, res){
        var project = req.params.project;

      });
    });
};
