
import RepositoryItem from '../RepositoryItem';
import '../style.css';
import React, { Fragment } from 'react';
import FetchMore from '../../FetchMore';
import Issues from '../../Issue';


    
const RepositoryList = ({ repositories, loading, fetchMore, entry }) => (
    <Fragment> 
        {/* Loop through all the repositories and create a div for each repository */}
        {repositories.edges.map(({ node }) => (
            <div key={node.id} className="RepositoryItem">
                {/* Call the RepoItem component passing in all node information for each repo */}
                <RepositoryItem {...node} />

                <Issues
                    repositoryName={node.name}
                    repositoryOwner={node.owner.login}
                />
            </div>
        ))};
        {/* Component to handle fetching more repositories.
        Note: All dynamic parts are passed as props so the component can be widely used 
            Apollo Client will fire the fetchMore query 
            and use the logic in the updateQuery option to incorporate that into the original result.
        */}
        <FetchMore
            loading={loading}
            hasNextPage={repositories.pageInfo.hasNextPage}
            variables={{
                cursor: repositories.pageInfo.endCursor
            }}
            updateQuery={getUpdateQuery(entry)}
            fetchMore={fetchMore}
        >
            Repositories
        </FetchMore>
    </Fragment>
);

const getUpdateQuery = entry => (
    previousResult,
    {fetchMoreResult},
) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    let testReturn = {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges,
                ]
            }
        }
    }

console.log(testReturn)
    // Return a merged object that merges repositories and edges fields of the previous result with the current result once fetchMore mutation is run.
    // The return object uses js computed property names to provide dynamic properties at the input entry name
    return {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges,
                ]
            }
        }
    }
}
    

    
export default RepositoryList;