package messaging

import (
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/lfrei/survey/vote-service/graph/model"
)

func SubscribeToTopic(topic string, voteChannels map[string]chan *model.Vote) {
	go func() {
		c, _ := kafka.NewConsumer(&kafka.ConfigMap{
			"bootstrap.servers": "localhost",
			"group.id":          "vote-service",
			"auto.offset.reset": "earliest",
		})

		c.SubscribeTopics([]string{topic}, nil)

		for {
			msg, err := c.ReadMessage(-1)
			if err == nil {
				key := string(msg.Key)
				value := string(msg.Value)

				vote := model.Vote{}
				json.Unmarshal([]byte(value), &vote)

				voteChannel, exists := voteChannels[key]
				if !exists {
					voteChannel = make(chan *model.Vote)
					voteChannels[key] = voteChannel
				}

				voteChannel <- &vote
			}
		}
	}()
}
