import './App.css';
import { ApolloProvider } from '@apollo/client';
import VoteTicker from './components/VoteTicker';
import client from './apollo/apollo-client';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="container-fluid">
        <VoteTicker surveyId="55555" />
      </div>
    </ApolloProvider>   
  );
}

export default App;
