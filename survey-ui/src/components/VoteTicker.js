import './VoteTicker.css';
import React, { useState } from 'react';
import { useSubscription } from '@apollo/client';
import voted from '../apollo/subscription/voted';

function VoteTicker({ surveyId }) {
  const [votes, setVotes] = useState([]);

  useSubscription(voted, { 
    variables: { surveyId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      console.log(data)
      setVotes(votes => [...votes, data?.voted])
    },
  });

  return (
    <div>
      See Votes for {surveyId}:
      <ul>
        {votes.map((v, i) => <li key={i}>{v.name} has voted for option {v.option}</li>)}
      </ul>
    </div>
  );
}

export default VoteTicker;
