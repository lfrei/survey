package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"github.com/lfrei/survey/vote-service/graph/generated"
	"github.com/lfrei/survey/vote-service/graph/model"
	"github.com/lfrei/survey/vote-service/messaging"
)

func (r *mutationResolver) CreateVote(ctx context.Context, id string, option int, name string, message *string) (*model.Vote, error) {
	vote := &model.Vote{
		ID:      id,
		Option:  option,
		Name:    name,
		Message: message,
	}

	messaging.SendToTopic("votes", vote)
	return vote, nil
}

func (r *subscriptionResolver) Voted(ctx context.Context, id string) (<-chan *model.Vote, error) {
	if voteChannel, exists := r.voteChannels[id]; exists {
		return voteChannel, nil
	} else {
		r.voteChannels[id] = make(chan *model.Vote)
		return r.voteChannels[id], nil
	}
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
