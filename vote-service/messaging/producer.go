package messaging

import (
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/lfrei/survey/vote-service/graph/model"
)

func SendToTopic(topic string, vote *model.Vote) {
	p, _ := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": "localhost",
	})
	defer p.Close()

	voteJson, _ := json.Marshal(vote)
	msg := &kafka.Message{
		TopicPartition: kafka.TopicPartition{
			Topic:     &topic,
			Partition: kafka.PartitionAny,
		},
		Key:   []byte(vote.ID),
		Value: voteJson,
	}

	p.Produce(msg, nil)
}
