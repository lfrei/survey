import './ShowSurvey.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useMutation } from '@apollo/client';
import Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';
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
      if (survey.totalVotes) {
          setVotes(survey.totalVotes);
      }
  }

  const onVote = (e) => { 
    const key = e.target.id;
    voteForOption({ 
        variables: { 
            surveyId: surveyId,  
            option: key,
            name: "Test",
            message: "Test Message"
        } 
    });
    setVoted(true);
  }

  return (
    <Card className="survey-card">
        <Card.Body>
            <Card.Title>
                {survey?.title}  
                <Badge bg="secondary" className="status">{survey?.status}</Badge>
            </Card.Title>
            <Card.Text>
                {survey?.description}
            </Card.Text>
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
                    now={survey?.votesByOption?.[i]}
                    max={votes} 
                />
            ))}
        </Card.Body>
    </Card>
  );
}

export default ShowSurvey;
