const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyBK7_Fl64MkxfTglJe40CBEYB7kX6mSswY",
    authDomain: "forms-cb59f.firebaseapp.com",
    projectId: "forms-cb59f",
    storageBucket: "forms-cb59f.appspot.com",
    messagingSenderId: "517201843104",
    appId: "1:517201843104:web:9605f58944f60e4bc20ac5"
}
const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

//GET FORMS
app.get('/forms', (req, res) => {
    db.collection('forms')
    .get()
    .then(data => {
        let forms = [];
        data.forEach(doc => {
            forms.push({
                formID: doc.id,
                body: doc.data().body,
                formHandle: doc.data().formHandle
            });
        });
        return res.json(forms);
    })
    .catch(err => console.error(err));
})

//CREATE FORMS
app.post('/form', (req, res) => {
    const newForm = {
        body: req.body.body,
        formHandle: req.body.formHandle
    };

    db.collection('forms')
    .add(newForm)
    .then(doc => {
        res.json({ message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to create form'})
        console.error(err);
    })
});

//Signup
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    // TODO: validate DATA
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then((doc) => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this user is already taken'})
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAT: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use'})
            } else {
                return res.status(500).json({ error: err.code });
            }
        });
});

//Allows our api to persist within different endpoints using express
//https://baseurl.com/api/*

exports.api = functions.https.onRequest(app);