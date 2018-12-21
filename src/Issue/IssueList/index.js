import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import './style.css';
import gql from 'graphql-tag';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import {ButtonUnobtrusive} from '../../Button';
import { withState } from 'recompose';
import FetchMore from '../../FetchMore';

// GQL get issues query to the github api
const GET_ISSUES_OF_REPOSITORY = gql`
    query(
        $repositoryOwner: String!, 
        $repositoryName:String!,
        $issueState: IssueState!,
        $cursor: String,
    )   {
        repository(name:$repositoryName, owner:$repositoryOwner) {
            issues(first: 5, states: [$issueState], after:$cursor) {
                edges{
                    node {
                        id
                        number
                        state
                        title
                        url
                        bodyHTML
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;
//Issue State object used for referencing issue states:
const ISSUE_STATES = {
    NONE: 'NONE',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
};
// Transition labels for each issue state
const TRANSITION_LABELS = {
    [ISSUE_STATES.NONE]: 'Show Open Issues',
    [ISSUE_STATES.OPEN]: 'Show Closed Issues',
    [ISSUE_STATES.CLOSED]: 'Hide Issues',
}
//Transition state object referencing the current issue state with the next state
const TRANSITION_STATE = {
    [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
    [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
    [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE, 
}
// Query object which updates the returned issues by merging the previous result, from the cache, with the current result
    // and returning the object.
const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
  
    return {
      ...previousResult,
      repository: {
        ...previousResult.repository,
        issues: {
          ...previousResult.repository.issues,
          ...fetchMoreResult.repository.issues,
          edges: [
            ...previousResult.repository.issues.edges,
            ...fetchMoreResult.repository.issues.edges,
          ],
        },
      },
    };
  };

//Function that checks whether an issue state exists
const isShow = issueState => issueState !== ISSUE_STATES.NONE;

//Function that displays a button to display issues in a repository depending on their state:
const Issues =({ 
    repositoryOwner,
    repositoryName,
    issueState,
    onChangeIssueState,
}) => (
    
            <div className="Issues">
                {/* Display a button that updates to the next issue state on click */}
                <IssueFilter
                    repositoryOwner={repositoryOwner}
                    repositoryName={repositoryName}
                    issueState={issueState}
                    onChangeIssueState={onChangeIssueState}
                >
                    {/* Display Transition state label */}
                    {TRANSITION_LABELS[issueState]}
                </IssueFilter>

                 {/* Check if issueState exists and display query component */}
                {isShow(issueState) && (
                    // Perform query mutation to get Issues from the current repository
                    <Query
                        query={GET_ISSUES_OF_REPOSITORY}
                        variables={{
                            repositoryOwner,
                            repositoryName,
                            issueState,
                        }}
                    >   
                        
                        {({data, loading, error, fetchMore}) => {
                            if(error) {
                                return <ErrorMessage error={error} />
                            }

                            const {repository} = data

                            if(loading && !repository) {
                                return <Loading />
                            }
                            
                            // Display Issues list with only filtered issues
                            return (
                                <IssueList 
                                issues={repository.issues}
                                loading={loading}
                                repositoryOwner={repositoryOwner}
                                repositoryName={repositoryName}
                                issueState={issueState}
                                fetchMore={fetchMore}
                            
                                />
                            )
                        }}
                    </Query>
                )}
            </div>
        )

const prefetchIssues = (
    client,
    repositoryOwner,
    repositoryName,
    issueState,
) => {
    // Save next issue state as a variable because when prefetching issues issuestate = NONE
    const nextIssueState = TRANSITION_STATE[issueState]
    // if issue state is NONE perform prefetch issue query.  Data is cached within the apollo client
    if(isShow(nextIssueState)) {
        client.query({
            query: GET_ISSUES_OF_REPOSITORY,
            variables: {
               repositoryOwner,
               repositoryName,
               issueState: nextIssueState, 
            },
        });
    }
};

const IssueFilter = ({
    issueState, 
    onChangeIssueState,
    repositoryName,
    repositoryOwner,
}) => (
    // ApolloConsumer component allows access to the Apollo client and the original prefetched data query
    <ApolloConsumer>
        {client => (
            <ButtonUnobtrusive
            
            onClick ={() => onChangeIssueState(TRANSITION_STATE[issueState])}
            // perform prefetch query on mouseover
            onMouseOver={() => 
                prefetchIssues(
                    client,
                    repositoryOwner,
                    repositoryName,
                    issueState,
                    )
                }
            >
                {TRANSITION_LABELS[issueState]}
            </ButtonUnobtrusive>
        )}
    </ApolloConsumer>
    
)    
    
// Component that displays an issue item component within a separate div for each issue
const IssueList = ({
        issues,
        issueState, 
        loading, 
        fetchMore,
        repositoryOwner,
        repositoryName,
    }) => (
    <div className="IssueList">
        {issues.edges.map(({node}) => (
            <IssueItem key={node.id} issue={node} />
        ))}
        {/* Fetchmore component performs a new query and returns updated result elements */}
        <FetchMore
            loading={loading}
            hasNextPage={issues.pageInfo.hasNextPage}
            variables={{
                cursor: issues.pageInfo.endCursor,
                repositoryOwner,
                repositoryName,
                issueState,
            }}
            
            fetchMore={fetchMore}
            updateQuery={updateQuery} // The updateQuery function is passed to merge the previous result with the new query result from the fetchMore function
        >

        </FetchMore>
    </div>
)


// first argument is the property name in the local state, 
// the second argument is the handler to change the property in the local state, 
// and the third argument is the initial state for that property.
// withState captures the state and allows it to be used by high order stateless components.
// Also the Issues component is exported
export default withState(
    'issueState',
    'onChangeIssueState',
    ISSUE_STATES.NONE,
)(Issues)