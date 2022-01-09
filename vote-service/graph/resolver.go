package graph

import (
	"github.com/lfrei/survey/vote-service/graph/model"
	"github.com/lfrei/survey/vote-service/messaging"
	"sync"
)

type Resolver struct {
	voteChannels map[string]chan *model.Vote
	mutex        sync.RWMutex
}

func NewResolver() *Resolver {
	resolver := &Resolver{
		voteChannels: map[string]chan *model.Vote{},
		mutex:        sync.RWMutex{},
	}
	messaging.SubscribeToTopic("votes", resolver.voteChannels, &resolver.mutex)
	return resolver
}
