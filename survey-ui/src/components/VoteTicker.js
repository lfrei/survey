import './VoteTicker.css';
import React, { useState } from 'react';
import { useSubscription } from '@apollo/client';
import voted from '../apollo/subscription/voted';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";

function VoteTicker() {
  const { surveyId } = useParams();
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
      <h3>See Votes for {surveyId}:</h3>

      {votes.map((v, i) => <Alert key={i} variant="info">{v.name} has voted for option {v.option}</Alert>)}
    </div>
  );
}

export default VoteTicker;
