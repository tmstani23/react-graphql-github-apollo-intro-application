# react-graphql-github-apollo-intro-application

## On Use

A github viewer and issue tracker.  There are two pages Profile and Organization.  The Profile pages displays the first five repositories and allows togglable issues for each.  The comments for each issue can be displayed by clicking the +button next to the issue title.  A user can also leave a comment in the text box.  The user can also watch/unwatch an issue and star/unstar a repository.  The Organization page allows the user to search an organization and display the first five repositories.  Features included for the profile page are also included on the organization page.  More repositories and issues can be displayed by clicking the More Issues/Repositories button at the bottom of the page. Prefetching is achieved using ApolloConsumer and happens when a user hovers over the issue or comment.  The query is fetched before the user clicks the button and thus reduces loading time and efficiently manages queries the user wants to see.  This approach allows for not fetching redundant data and excessively querying the github api.

## Technologies
GraphQl, Github-Api, React, React-Router, Apollo Client

### Attributions to Robin Wieruch's book the Road to GraphQL for explanation, inspiration and guidance on this project.

## Screenshots:
![Alt text](https://raw.githubusercontent.com/tmstani23/react-graphql-github-apollo-intro-application/master/ss1.png)
![Alt text](https://raw.githubusercontent.com/tmstani23/react-graphql-github-apollo-intro-application/master/ss2.png)
