import React from 'react';
import { Query } from 'react-apollo';
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
                <ButtonUnobtrusive
                    onClick={() =>
                        onChangeIssueState(TRANSITION_STATE[issueState])
                    }
                >
                    {/* Display Transition state label */}
                    {TRANSITION_LABELS[issueState]}
                </ButtonUnobtrusive>

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
            updateQuery={updateQuery}
        >

        </FetchMore>
    </div>
)


// first argument is the property name in the local state, 
// the second argument is the handler to change the property in the local state, 
// and the third argument is the initial state for that property.
// Also the Issues component is exported
export default withState(
    'issueState',
    'onChangeIssueState',
    ISSUE_STATES.NONE,
)(Issues)