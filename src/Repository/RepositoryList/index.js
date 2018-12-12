
import RepositoryItem from '../RepositoryItem';
import '../style.css';
import Loading from '../../Loading';
import React, { Fragment } from 'react';

const updateQuery = (previousResult, {fetchMoreResult}) => {
    if(!fetchMoreResult) {
        return previousResult;
    }
    let toReturn = {
        ...previousResult,
            viewer: {
                ...previousResult.viewer,
                repositories: {
                    ...previousResult.viewer.repositories,
                    ...fetchMoreResult.viewer.repositories,
                    edges: [
                        ...previousResult.viewer.repositories.edges,
                        ...fetchMoreResult.viewer.repositories.edges,
                    ],
                },
            },
    }
    return toReturn;
        
    
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
        {loading ? (
            <Loading />
        ) : (
            //  Display a button if repository contains the fetchMore data = true */}
            repositories.pageInfo.hasNextPage && (
                <button
                    type="button"
                    onClick={() => 
                        fetchMore({
                            // configuration object
                            variables: {
                                cursor: repositories.pageInfo.endCursor
                            },
                            updateQuery,
                        })    
                    }
                >
                    More Repositories
                </button>
            )    
        )}
    </Fragment>
);
    

    
export default RepositoryList;