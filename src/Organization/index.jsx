import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

// GQL github organization query returning organization and first five repositories
const GET_REPOSITORIES_OF_ORGANIZATION = gql`
    query($organizationName: String! $cursor: String) {
        organization(login: $organizationName) {
            repositories(first: 5, after: $cursor) {
                edges {
                    node {
                        ...repository
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            } 
        }
    }
    ${REPOSITORY_FRAGMENT}
`;

const Organization = ({organizationName}) => (
    <Query
        query={GET_REPOSITORIES_OF_ORGANIZATION}
        variables={{
            organizationName,
        }}
        skip={organizationName === ''} //if organization name is empty skip executing the query
        notifyOnNetworkStatusChange={true}
    >
    {/* Render prop child function used to handle loading and errors as well as pagination to display more repos on button click */}
        {({data, loading, error, fetchMore}) => {
            // Display Errormessage component with the error if an error occurs
            if (error) {
                return <ErrorMessage error={error} />;
            }
            const {organization} = data;
            // If loading and data hasn't returned yet return loading component
            if (loading && !organization) {
                return <Loading />;
            }
            // Else return the repository list
            return (
                <RepositoryList
                    loading={loading}
                    repositories={organization.repositories}
                    fetchMore={fetchMore}
                    entry={'organization'}
                />
            )
        }}

    </Query>
)

export default Organization;