package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/lfrei/survey/vote-service/graph/generated"
	"github.com/lfrei/survey/vote-service/graph/model"
)

func (r *mutationResolver) CreateVote(ctx context.Context, option int, name string, message *string) (*model.Vote, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) GetVote(ctx context.Context) (*model.Vote, error) {

	vote := model.Vote{
		Option: 1,
		Name:   "User 1",
	}

	return &vote, nil
}

func (r *subscriptionResolver) Voted(ctx context.Context) (<-chan *model.Vote, error) {
	vc := make(chan *model.Vote, 1)

	vote := model.Vote{
		Option: 2,
		Name:   "User 2",
	}

	vc <- &vote

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
