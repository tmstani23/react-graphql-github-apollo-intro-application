import React from 'react';
import Link from '../../Link';
import REPOSITORY_FRAGMENT from '../fragments';
import Button from '../../Button';
import gql from 'graphql-tag';
import '../style.css';
import {Mutation} from 'react-apollo';

//viewer subscriptions object for designating subscription states:
const VIEWER_SUBSCRIPTIONS = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED',
};
//function that takes a viewer subscription state and returns true if it equals
//  the subscribed string:
const isWatch = viewerSubscription =>
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

//Function that handles updating the watch/unwatch status in the Apollo client cache
const updateWatch = (
    // input apollo client and data segment to be modified in the cache
    client,
    {
        data: {
            updateSubscription: {
                subscribable: {id, viewerSubscription},
            },
        },
    },
) => {
    // Read the fragment from the client using subscribable id and fragment:
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    })
    // Set totalCount to deconstructed watcher count object:
    
    let {totalCount} = repository.watchers;
    // if viewersubscription status is subscribed add 1 to total count else subract 1
    totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED 
        ? totalCount + 1 
        : totalCount - 1
    //Write the updated fragment back into the cache:
    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            watchers: {
                ...repository.watchers,
                totalCount,
            },
        },
    });
};

//Function to handle updating the cache when a star is added.
const updateAddStar = (
    client,
    { data: { addStar: { starrable: { id } } } },
) => {
    // Retrieve repository from Apollo Client using identifier +typename and fragment
    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
    });
    
    //Add one to the retrieved data's stargazer count
    const totalCount = repository.stargazers.totalCount + 1;
    //Write the updated fragment back to the Apollo cache
        //Written data only updates the local cache not the server data.
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
                {/* Update watch status mutation:
                    the viewerSubscription argument calls the isWatch function 
                    and checks if it is === to "SUBSCRIBED"
                    If so it returns "UNSUBSCRIBED" else "SUBSCRIBED"
                */}
                <Mutation
                    mutation={WATCH_REPOSITORY}
                    variables={{
                        id,
                        viewerSubscription: isWatch(viewerSubscription)
                            ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                            : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
                    }}
                    // Call updateWatch function to update the apollo cache with the new fragment
                    update={updateWatch}
                >
                    {/* Update function that displays Button component and 
                    performs the updateSubscription mutation on button click */}
                    {(updateSubscription, {data, loading, error}) => (
                        <Button
                            className="RepositoryItem-title-action"
                            onClick={updateSubscription}
                        >
                            {/* Display watcher count and if subscribed display unwatch else watch */}
                            {watchers.totalCount}{' '}
                            {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
                        </Button>
                    )}
                </Mutation>
                
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
//Mutation return fields are used for next mutations or display ex:starrable,subscribable
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
//GQL mutation to update subscriptions watch/unwatch status:
const WATCH_REPOSITORY = gql`
    mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
        updateSubscription(
            input: {
            subscribableId: $id,
            state: $viewerSubscription}
        ) {
            subscribable {
                id
                viewerSubscription
            }
        }
    }
`;


export default RepositoryItem;