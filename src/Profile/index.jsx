import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading';
import RepositoryList from '../Repository';
import ErrorMessage from '../Error';

//GQL query that defines a query string using gql tag to be passed into the apollo client.
//Gets user repository information data from the github api.
const GET_REPOSITORIES_OF_CURRENT_USER = gql`
    {
        viewer {
            repositories(first: 5, orderBy: {direction: DESC, field: STARGAZERS}) {
            edges {
                node {
                    id
                    name
                    url
                    descriptionHTML
                    primaryLanguage {
                        name
                    }
                    owner {
                        login
                        url
                    }
                    stargazers {
                        totalCount
                    }
                    viewerHasStarred
                    watchers {
                        totalCount
                    }
                    viewerSubscription
                    }
                }
            }
        }
    }  
`
//Profile component used for defining the query and displaying repository component
const Profile = () => (
    // Query is an Apollo React component that executes a gql query string when rendered.
    <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
        {/* Display repository or loading component depending on returned data state */}
        {({ data, loading, error }) => {
            if(error) {
                return <ErrorMessage error={error} />
            }
            const { viewer } = data;
           
            // If viewer data is not returned or loading state is true return loading component
            if (!viewer || loading) {
                return <Loading />
            }
            //Else display Repository list component passing down the viewer repository data.
            return <RepositoryList repositories={viewer.repositories} />
        }}
    </Query>
);
   

export default Profile;