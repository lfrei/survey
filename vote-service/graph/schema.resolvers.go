package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/lfrei/survey/vote-service/graph/generated"
	"github.com/lfrei/survey/vote-service/graph/model"
)

func (r *mutationResolver) CreateVote(ctx context.Context, id string, option int, name string, message *string) (*model.Vote, error) {
	vote := &model.Vote{
		ID:      id,
		Option:  option,
		Name:    name,
		Message: message,
	}

	sendToTopic("votes", vote)
	return vote, nil
}

func (r *subscriptionResolver) Voted(ctx context.Context, id string) (<-chan *model.Vote, error) {
	//TODO filter votes by id
	vc := make(chan *model.Vote, 1)
	r.voteChannel = vc
	return vc, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }

func sendToTopic(topic string, vote *model.Vote) {
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
		Value: voteJson,
	}

	p.Produce(msg, nil)
}
