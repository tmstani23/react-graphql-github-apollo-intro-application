import React from 'react';
import { Query } from 'react-apollo';
import './style.css';
import gql from 'graphql-tag';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import {ButtonUnobtrusive} from '../../Button';

// GQL get issues query to the github api
const GET_ISSUES_OF_REPOSITORY = gql`
    query($repositoryOwner: String!, $repositoryName:String!) {
        repository(name:$repositoryName, owner:$repositoryOwner) {
            issues(first: 5) {
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

//Function that checks whether an issue state exists
const isShow = issueState => issueState !== ISSUE_STATES.NONE;
//Function that displays a button to display issues in a repository depending on their state:
class Issues extends React.Component { 
    
    state = {
        issueState: ISSUE_STATES.NONE
    };
    // Method that updates state with the next issue state
    onchangeIssueState = nextIssueState => {
        this.setState({issueState: nextIssueState})
    }

    render() {
        const {issueState} = this.state;
        const { repositoryOwner, repositoryName} = this.props
    
        
        return (
            <div className="Issues">
                {/* Display a button that updates to the next issue state on click */}
                <ButtonUnobtrusive
                    onClick={() =>
                        this.onchangeIssueState(TRANSITION_STATE[issueState])
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
                        }}
                    >
                        {({data, loading, error}) => {
                            if(error) {
                                return <ErrorMessage error={error} />
                            }

                            const {repository} = data

                            if(loading && !repository) {
                                return <Loading />
                            }
                            // Filter returned issues states to only the current issue state
                            const filteredRepository = {
                                issues: {
                                    edges: repository.issues.edges.filter(
                                        issue => issue.node.state === issueState,
                                    )
                                }
                            }

                            if (!filteredRepository.issues.edges.length) {
                                return <div className="IssueList"> No Issues ...</div>
                            }
                            
                            // Display Issues list with only filtered issues
                            return <IssueList issues={filteredRepository.issues} />
                        }}
                    </Query>
                )}
            </div>
        )
    }
}
    
    
// Component that displays an issue item component within a separate div for each issue
const IssueList = ({issues}) => (
    <div className="IssueList">
        {issues.edges.map(({node}) => (
            <IssueItem key={node.id} issue={node} />
        ))}
    </div>
)

export default Issues;