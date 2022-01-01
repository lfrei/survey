import './ShowSurveys.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Survey from './Survey';
import { useHistory } from 'react-router';

function ShowSurveys() {
  const history = useHistory();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/surveys')
        .then(response => response.json())
        .then(data => setSurveys(data));
  }, []);
  
  const onCreate = () => { 
    history.push('/create');
  }

  return (
    <div>
      <h3 className="title">
          Trending Surveys
          <Button variant="outline-primary" className="create" onClick={onCreate}>Create your own</Button>
      </h3>
      {surveys.map((s, i) => (
        <Survey key={i} surveyId={s} />
      ))}
    </div>
  );
}

export default ShowSurveys;
