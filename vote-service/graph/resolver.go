package graph

import (
	"github.com/lfrei/survey/vote-service/graph/model"
	"github.com/lfrei/survey/vote-service/messaging"
)

type Resolver struct {
	voteChannels map[string]chan *model.Vote
}

func NewResolver() *Resolver {
	resolver := &Resolver{
		voteChannels: map[string]chan *model.Vote{},
	}
	messaging.SubscribeToTopic("votes", resolver.voteChannels)
	return resolver
}
