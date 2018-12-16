import React from 'react';
import './style.css';
import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

//Component function that displays loading or More repos button
const FetchMore = ({
    variables,
    loading,
    hasNextPage,
    updateQuery,
    fetchMore,
    children,
}) => (
    <div className="FetchMore">
        {loading ? (
            <Loading />
        ) : (
            hasNextPage && (
                <ButtonUnobtrusive
                    className="FetchMore-button"
                    onClick={() => fetchMore({ variables, updateQuery})}
                >
                    {/* fetchMore, which is provided on the data prop by the graphql higher order component. 
                    This basically allows you to do a new GraphQL query and merge the result into the original result. */}
                    More {children}
                </ButtonUnobtrusive>
            )
        )}
    </div>
);

export default FetchMore;
