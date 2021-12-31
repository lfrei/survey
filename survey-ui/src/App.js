import './App.css';
import { ApolloProvider } from '@apollo/client';
import VoteTicker from './components/VoteTicker';
import client from './apollo/apollo-client';
import CreateSurvey from './components/CreateSurvey';
import ShowSurvey from './components/ShowSurvey';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="container-fluid">
          <Switch>
            <Route path="/:surveyId">
              <ShowSurvey />
              <VoteTicker />
            </Route>
            <Route path="/">
              <CreateSurvey />
            </Route>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>   
  );
}

export default App;
