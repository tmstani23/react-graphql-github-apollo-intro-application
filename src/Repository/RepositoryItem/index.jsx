import React from 'react';
import Link from '../../Link';
import '../style.css';

//Repository item component uses destructuring on the passed in repository data object
    //and displays specific repository data.
    //each of the arguments share the same name as the keys within the data object
const RepositoryItem = ({
    name,
    url,
    descriptionHTML,
    primaryLanguage,
    owner,
    stargazers,
    watchers,
    viewerSubscription,
    viewerHasStarred,
}) => (
    <div>
        <div className = "RepositoryItem-title">
            <h2>
                <Link href={url}> {name} </Link>
            </h2>
            <div className="RepositoryItem-title-action">
                {stargazers.totalCount} Stars
            </div>
        </div>

        <div className="RepositoryItem-description">
            <div 
                className="RepositoryItem-description-info"
                dangerouslySetInnerHTML={{__html: descriptionHTML}} 
            />
            <div className="RepositoryItem-description-details">
                <div>
                    {primaryLanguage && (
                        <span> Language: {primaryLanguage.name} </span>
                    )}
                </div>
                <div>
                    {owner && (
                        <span>
                            Owner: <a href={owner.url}>{owner.login}</a>
                        </span>
                    )}
                </div>
            </div>
        </div>    
    </div>
)

export default RepositoryItem;