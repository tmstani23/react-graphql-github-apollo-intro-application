import React from 'react';
import RepositoryItem from '../RepositoryItem';
import '../style.css';
    
const RepositoryList = ({ repositories }) =>
    //Loop through all the repositories and create a div for each repository
    repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
            {/* Call the RepoItem component passing in all node information for each repo */}
            <RepositoryItem {...node} />
        </div>
    ));

    
export default RepositoryList;