package graph

import (
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/lfrei/survey/vote-service/graph/model"
)

type Resolver struct {
	voteChannel chan *model.Vote
}

func NewResolver() *Resolver {
	return &Resolver{
		voteChannel: make(chan *model.Vote, 1),
	}
}

func (r *Resolver) SubscribeToTopic(topic string) {
	go func() {
		c, err := kafka.NewConsumer(&kafka.ConfigMap{
			"bootstrap.servers": "localhost",
			"group.id":          "vote-service",
			"auto.offset.reset": "earliest",
		})

		if err != nil {
			panic(err)
		}

		err = c.SubscribeTopics([]string{topic}, nil)

		if err != nil {
			panic(err)
		}

		for {
			msg, err := c.ReadMessage(-1)
			if err == nil {
				value := string(msg.Value)
				vote := model.Vote{}
				json.Unmarshal([]byte(value), &vote)

				r.voteChannel <- &vote
			}
		}
	}()
}
