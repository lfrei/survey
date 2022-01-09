package messaging

import (
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/lfrei/survey/vote-service/graph/model"
	"sync"
)

func SubscribeToTopic(topic string, voteChannels map[string]chan *model.Vote, mutex *sync.RWMutex) {
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

				mutex.RLock()
				voteChannel, exists := voteChannels[key]
				mutex.RUnlock()
				if !exists {
					voteChannel = make(chan *model.Vote, 1)
					mutex.Lock()
					voteChannels[key] = voteChannel
					mutex.Unlock()
				}

				voteChannel <- &vote
			}
		}
	}()
}
