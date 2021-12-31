import './ShowSurvey.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useMutation } from '@apollo/client';
import Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import vote from '../apollo/mutation/vote';

function ShowSurvey() {
  const { surveyId } = useParams();
  const [voteForOption] = useMutation(vote);
  const [survey, setSurvey] = useState();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/survey/' + surveyId)
        .then(response => response.json())
        .then(data => updateSurvey(data));
  }, [surveyId, voted])

  const updateSurvey = (survey) => {
      setSurvey(survey);
      setVotes(10); //TODO set total votes
  }

  const onVote = (e) => {
    setVoted(true);
    const key = e.target.id;
    voteForOption({ 
        variables: { 
            surveyId: surveyId,  
            option: key,
            name: "Test",
            message: "Test Message"
        } 
    });
  }

  return (
    <Card className="survey-card">
        <Card.Body>
            <Card.Title>{survey?.title}</Card.Title>
            <Card.Text>{survey?.description}</Card.Text>
            {!voted && survey?.options.map((option, i) => (
                <Button 
                    className="vote-option" 
                    key={i} id={i} 
                    variant="outline-success" 
                    onClick={onVote}>{option}
                </Button>
            ))}
            {voted && survey?.options?.map((option, i) => (
                <ProgressBar 
                    className="voted-option" 
                    key={i} id={i} 
                    variant="success" 
                    label={option} 
                    now={2} //TODO use votesByOption
                    max={votes} 
                />
            ))}
        </Card.Body>
    </Card>
  );
}

export default ShowSurvey;
