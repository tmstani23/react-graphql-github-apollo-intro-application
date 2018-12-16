
import RepositoryItem from '../RepositoryItem';
import '../style.css';
import React, { Fragment } from 'react';
import FetchMore from '../../FetchMore';

//Function that takes the previous query result and merges it with the query returned in the FetchMore component.
const updateQuery = (previousResult, {fetchMoreResult}) => {
    if(!fetchMoreResult) {
        return previousResult;
    }
    // The merged object is first constructed by copying the base and nested viewer object from the previous result nested objects
    return {
        ...previousResult,
            viewer: {
                ...previousResult.viewer,
                // repositories objects from the previous result and the fetch more result are merged
                repositories: {
                    ...previousResult.viewer.repositories,
                    ...fetchMoreResult.viewer.repositories,
                    //Edges arrays are merged.
                    edges: [
                        ...previousResult.viewer.repositories.edges,
                        ...fetchMoreResult.viewer.repositories.edges,
                    ],
                },
            },
    }           
};
    
const RepositoryList = ({ repositories, loading, fetchMore }) => (
    <Fragment> 
        {/* Loop through all the repositories and create a div for each repository */}
        {repositories.edges.map(({ node }) => (
            <div key={node.id} className="RepositoryItem">
                {/* Call the RepoItem component passing in all node information for each repo */}
                <RepositoryItem {...node} />
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
            updateQuery={updateQuery}
            fetchMore={fetchMore}
        >
            Repositories
        </FetchMore>
    </Fragment>
);
    

    
export default RepositoryList;