const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const kafka = require('./kafka')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.options('*', cors());

app.get('/survey/:id', (req, res) => {
    const survey = kafka.surveys.get(req.params.id)
    const votes = kafka.votes.get(req.params.id)

    if (survey) {
        const surveyWithVotes = Object.assign(survey, votes)
        res.status(200)  
        res.send(surveyWithVotes)
    } else {
        res.status(404)
        res.send()
    }
})

app.get('/surveys', (req, res) => {
    const surveys = Array
        .from(kafka.surveys.values())
        .filter(s => s.status === 'public')
        .filter(s => s.options.length >= 2)
        .map(s => s.id)

    res.status(200)
    res.send(surveys)
})

app.post('/survey', async function (req, res) {
    const survey = await kafka.sendSurvey(req.body)

    res.status(201);
    res.send(survey)
});

app.listen(3000)

kafka.loadSurveys()
kafka.loadVotes()