import './ShowSurvey.css';
import { useParams } from "react-router-dom";
import Survey from './Survey';

function ShowSurvey() {
  const { surveyId } = useParams();
  
  return (
    <Survey surveyId={surveyId} />
  );
}

export default ShowSurvey;
