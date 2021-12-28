const { Kafka } = require('kafkajs')
const { v4: uuidv4 } = require('uuid');

const surveyTopic = 'survey'
const kafka = new Kafka({
    clientId: 'survey-service',
    brokers: ['localhost:9092']
})

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

        return survey
    }
};

function generateId(survey) {
    survey.id = uuidv4()
}