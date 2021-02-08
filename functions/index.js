const functions = require("firebase-functions");
const app = require('express')();
const { FBAuth } = require('./util/fbAuth');
const { getAllForms, createForm} = require('./handlers/forms');
const { signup, login } = require('./handlers/users');

//Signup
app.post('/signup', signup);
//Login
app.post('/login', login);
//GET FORMS
app.get('/forms', getAllForms);
//CREATE FORMS
app.post('/form', FBAuth, createForm);

//Allows our api to persist within different endpoints using express
//https://baseurl.com/api/*
exports.api = functions.https.onRequest(app);
