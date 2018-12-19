import React, { Component } from 'react';
import Profile from '../Profile';
import Organization from '../Organization';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './Navigation'
import * as routes from '../constants/routes';
import './style.css';

class App extends Component {
  state = {
    organizationName: 'the-road-to-learn-react'
  }
  //Method that updates the organization name in App state with an input value
  onOrganizationSearch = value => {
    this.setState({organizationName: value})
  }

  render() {

    const {organizationName} = this.state
    return (
      // React Router component to introduce react router
      <Router>
        {/* Display navigation component to handle links between pages */}
        <div className="App">
          <Navigation 
            // Here the organization search method and name are passed to the navigation component as props.
            onOrganizationSearch={this.onOrganizationSearch}
            organizationName={organizationName}
          />

          {/* Organization components path is mapped using the imported constant and Route component */}
          <div className="App-main">
            {/* React Route component maps components to route paths */}
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  {/* This component displays the organization list and makes the organization mutation */}
                  <Organization 
                    organizationName={organizationName}
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