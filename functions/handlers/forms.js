const { db } = require('../util/admin');

exports.getAllForms = (req, res) => {
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
}

exports.createForm = (req, res) => {
    const newForm = {
        body: req.body.body,
        userHandle: req.user.handle,
        formHandle: req.body.formHandle
    };

    db.collection('forms')
        .add(newForm)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` })
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to create form' })
            console.error(err);
        })
}