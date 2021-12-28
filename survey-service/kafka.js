const { Kafka } = require('kafkajs')
const { v4: uuid } = require('uuid');

const surveyTopic = 'survey'
const totalVotesTopic = 'total-votes'

const kafka = new Kafka({
    clientId: 'survey-service',
    brokers: ['localhost:9092']
})

const surveys = new Map();
const votes = new Map();

module.exports = {
    sendSurvey: async function(survey) {
        const producer = kafka.producer()

        generateId(survey)

        const key = survey.id.toString()
        const value = JSON.stringify(survey)
    
        await producer.connect()
        await producer.send({
            topic: surveyTopic,
            messages: [
                { 
                    key,
                    value
                },
            ],
        })
    
        await producer.disconnect()
    },

    loadSurveys: async function() {
        loadToStore(surveyTopic, surveys)
    },

    loadVotes: async function() {
        loadToStore(totalVotesTopic, votes)
    },

    surveys,
    votes
};

async function loadToStore(topic, store) {
    const consumer = kafka.consumer({ groupId: uuid() })

    await consumer.connect()
    await consumer.subscribe({ topic: topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            store.set(
                message.key.toString(), 
                JSON.parse(message.value)
            )
        },
    })
}

function generateId(survey) {
    survey.id = uuid()
}