import React from 'react';
import Link from '../../Link';
import REPOSITORY_FRAGMENT from '../fragments';
import Button from '../../Button';
import gql from 'graphql-tag';
import '../style.css';
import {Mutation} from 'react-apollo';

//Function to handle updating the cache when a star is added.
const updateAddStar = (
    client,
    { data: { addStar: { starrable: { id } } } },
) => {
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    });
    const totalCount = repository.stargazers.totalCount + 1;
    
    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            stargazers: {
                ...repository.stargazers,
                totalCount,
            },
        },
    });
};

//Function to handle updating the cache when a star is removed.
const updateRemoveStar = (
    client,
    { data: { removeStar: { starrable: { id } } } },
) => {
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    });
    const totalCount = repository.stargazers.totalCount - 1;
    
    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            stargazers: {
                ...repository.stargazers,
                totalCount,
            },
        },
    });
};

//Repository item component uses destructuring on the passed in repository data object
    //and displays specific repository data.
    //each of the arguments share the same name as the keys within the data object
const RepositoryItem = ({
    id,
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
            <div>
                {/* If viewer hasn't starred yet */}
                {!viewerHasStarred ? (
                    // call mutation component function passing in the gql star repository mutation 
                        // and id variable from the apollo client cache
                        // id and other data variables are available from the previous query
                    <Mutation 
                        mutation={STAR_REPOSITORY} 
                        variables={{ id }}
                        update={updateAddStar}
                    >
                        {/* display Button component passing in addStar mutation type */}
                        {(addStar, { data, loading, error }) => (
                            // Call addStar mutation when user clicks the button
                            <Button
                                className={'RepositoryItem-title-action'}
                                onClick={addStar}
                            >
                                {stargazers.totalCount} Star
                            </Button>
                        )}
                    </Mutation>
                ) : (
                    <Mutation 
                        mutation={REMOVE_STAR_REPOSITORY} 
                        variables={{ id }}
                        update={updateRemoveStar}
                    >
                        {/* display Button component passing in removeStar mutation type */}
                        {(removeStar, { data, loading, error }) => (
                            // Call removeStar mutation when user clicks the button
                            <Button
                                className={'RepositoryItem-title-action'}
                                onClick={removeStar}
                            >
                                {stargazers.totalCount} Star
                            </Button>
                        )}
                    </Mutation>
                )}
                
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
//GQL mutation that adds a star to an input repository
const STAR_REPOSITORY = gql`
    mutation($id: ID!) {
        addStar(input: {starrableId: $id}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;
//GQL mutation that adds a star to an input repository
const REMOVE_STAR_REPOSITORY = gql`
    mutation($id: ID!) {
        removeStar(input: {starrableId: $id}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;

export default RepositoryItem;