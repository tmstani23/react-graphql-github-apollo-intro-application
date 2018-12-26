import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';
import gql from 'graphql-tag';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import './style.css';

//Graphql query to get first 5 comments from each issue
const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $number: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        id
        comments(first: 5, after: $cursor) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;
// Update query by merging previous query result comments with current result
const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
  
    return {
      ...previousResult,
      repository: {
        ...previousResult.repository,
        issue: {
          ...previousResult.repository.issue,
          ...fetchMoreResult.repository.issue,
          comments: {
            ...previousResult.repository.issue.comments,
            ...fetchMoreResult.repository.issue.comments,
            edges: [
              ...previousResult.repository.issue.comments.edges,
              ...fetchMoreResult.repository.issue.comments.edges,
            ],
          },
        },
      },
    };
  };
  // Comments function which contains the query, error and loading components
  const Comments = ({ repositoryOwner, repositoryName, issue }) => (
    // Apollo Query component handles making the query to the github api
    <Query
      query={GET_COMMENTS_OF_ISSUE}
      variables={{
        repositoryOwner,
        repositoryName,
        number: issue.number,
      }}
      notifyOnNetworkStatusChange={true}
    >
      {({ data, loading, error, fetchMore }) => {
        if (error) {
          return <ErrorMessage error={error} />;
        }
  
        const { repository } = data;
  
        if (loading && !repository) {
          return <Loading />;
        }
  
        return (
          // Comment list component to display the list of comments and handle pagination
          <Fragment>
            <CommentList
              comments={repository.issue.comments}
              loading={loading}
              number={issue.number}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              fetchMore={fetchMore}
            />
            {/* CommentAdd component handles adding a comment to an issue */}
            <CommentAdd issueId={repository.issue.id} />
          </Fragment>
        );
      }}
    </Query>
  );
  // CommentList component generates a list of commentItems and a fetchmore component 
  const CommentList = ({
    comments,
    loading,
    repositoryOwner,
    repositoryName,
    number,
    fetchMore,
  }) => (
    <div className="CommentList">
      {/* Map all the comments as a comment component */}
      {comments.edges.map(({ node }) => (
        <CommentItem key={node.id} comment={node} />
      ))}
      {/* Fetchmore handles displaying more comments on button click and updating the query */}
      <FetchMore
        loading={loading}
        hasNextPage={comments.pageInfo.hasNextPage}
        variables={{
          cursor: comments.pageInfo.endCursor,
          repositoryOwner,
          repositoryName,
          number,
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Comments
      </FetchMore>
    </div>
  );
  
  export default Comments;