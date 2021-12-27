package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
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
	r.votes = append(r.votes, vote)
	return vote, nil
}

func (r *queryResolver) GetVote(ctx context.Context) (*model.Vote, error) {
	if len(r.votes) == 0 {
		return nil, fmt.Errorf("no votes available")
	}
	return r.votes[len(r.votes)-1], nil
}

func (r *subscriptionResolver) Voted(ctx context.Context, id string) (<-chan *model.Vote, error) {
	vc := make(chan *model.Vote, 1)

	for i := range r.votes {
		if id == r.votes[i].ID {
			vc <- r.votes[i]
		}
	}

	return vc, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
