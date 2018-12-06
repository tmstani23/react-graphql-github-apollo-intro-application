import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './style.css';
import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
console.log(process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN);

