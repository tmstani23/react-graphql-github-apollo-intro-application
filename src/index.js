import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './style.css';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import { onError } from 'apollo-link-error';

//Initialize the Github API endpoint
const GITHUB_BASE_URL = 'https://api.github.com/graphql';

//Link object containing uri and headers
const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});

//Handle application level errors:
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
  //do something with gql errors
  console.log(graphQLErrors)
  }
  if (networkError) {
    //do something with network errors
    console.log(networkError)
  }
})
//combine http and error links for use in apollo client instance:
const link = ApolloLink.from([errorLink, httpLink]);

//Create memory cache that manages and normalizes data, 
  //caches requests to avoid duplicates and makes it possible to read and write to the cache.
  //Cache data is also fed to the Apollo Client
const cache = new InMemoryCache();

//Apollo client instance, link and cache are fed to the client
const client = new ApolloClient({
  link,
  cache,
})



//Render the app surrounded by the ApolloProvider which contains the apollo client
//Apollo Provider component handles the http requests and cache.
//Client cache information is now available to the App component.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
