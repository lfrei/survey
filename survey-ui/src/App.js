import './App.css';
import { ApolloProvider } from '@apollo/client';
import VoteTicker from './components/VoteTicker';
import client from './apollo/apollo-client';

function App() {
  return (
    <ApolloProvider client={client}>
      <VoteTicker surveyId="55555" />
    </ApolloProvider>   
  );
}

export default App;
