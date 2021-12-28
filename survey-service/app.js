const express = require('express')
const bodyParser = require('body-parser')
const kafka = require('./kafka')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/survey/:id', (req, res) => {
    //TODO implement
    res.send('Requested survey with id ' + req.params.id)
})

app.post('/survey', function (req, res) {
    kafka.sendSurvey(req.body);

    res.status(201);
    res.send('Survey created');
});

app.listen(3000);