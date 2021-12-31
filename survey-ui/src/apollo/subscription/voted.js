import { gql } from '@apollo/client';

export default gql`
  subscription OnVoted($surveyId: String!) {
    voted(id: $surveyId){
      id,
      name,
      option,
      message
    }
  }
`