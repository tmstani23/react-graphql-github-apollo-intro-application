import React from 'react';
import Link from '../../Link';
import './style.css';
import Comments from '../../Comment'
import {withState} from 'recompose';
import Button from '../../Button';


const IssueItem = ({ 
    issue,
    repositoryOwner,
    repositoryName,
    isShowComments,
    onShowComments, 
}) => (
    <div className="IssueItem">
        <Button onClick={() => onShowComments(!isShowComments)}>
            {isShowComments ? '-' : '+'}
        </Button>
        <div className="Issue-Item-content">
            <h3>
                <Link href={issue.url}>{issue.title}</Link>
            </h3>
            {/* dangerouslySet... is a react prop type that expects an object containing the html to be displayed.  
            This is to avoid cross site scripting attacks which might inject unexpected code to be executed.
            Here the issue body text is displayed. */}
            <div dangerouslySetInnerHTML={{__html: issue.bodyHTML}} />
            {isShowComments && (
                // Comment component to display comments for an issue and allow a user to add a comment
                <Comments
                    repositoryOwner={repositoryOwner}
                    repositoryName={repositoryName}
                    issue={issue}
                />
            )}
        </div>
    </div>  
    
)

export default withState('isShowComments', 'onShowComments', false)(
    IssueItem,
);