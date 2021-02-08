const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/forms', (req, res) => {
    admin.firestore().collection('forms')
    .get()
    .then(data => {
        let forms = [];
        data.forEach(doc => {
            forms.push(doc.data());
        });
        return res.json(forms);
    })
    .catch(err => console.error(err));
})

app.post('/forms', (req, res) => {
    const newForm = {
        body: req.body.body,
        formHandle: req.body.formHandle
    };

    admin.firestore()
    .collection('forms')
    .add(newForm)
    .then(doc => {
        res.json({ message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to create form'})
        console.error(err);
    })
});

//Allows our api to persist within different endpoints using express
//https://baseurl.com/api/*

exports.api = functions.https.onRequest(app);