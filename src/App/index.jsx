import React, { Component } from 'react';
import Profile from '../Profile';
import Organization from '../Organization';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './Navigation'
import * as routes from '../constants/routes';
import './style.css';

class App extends Component {
  render() {
    return (
      <Router>
        {/* Display navigation component to handle links between pages */}
        <div className="App">
          <Navigation />

          {/* Organization components path is mapped using the imported constant and Route component */}
          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  <Organization 
                    organizationName={'the-road-to-learn-react'}
                  />  
                </div>
              )}
            />
            {/* Profile component's route is mapped here */}
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_small-header">
                  <Profile />
                </div>
              )}
            />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;