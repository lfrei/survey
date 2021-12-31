import { gql } from '@apollo/client';

export default gql`
  mutation OnVote($surveyId: String!, $option: Int!, $name: String!, $message: String!) {
    createVote(id: $surveyId, option: $option, name: $name, message: $message) {
        id,
        option
    }
  }
`