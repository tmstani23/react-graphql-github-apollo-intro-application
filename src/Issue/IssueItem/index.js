import React from 'react';
import Link from '../../Link';
import './style.css';
import Comments from '../../Comments'
import {withState} from 'recompose';


const IssueItem = ({ issue }) => (
    <div className="IssueItem">
        {/* placeholder showhide comment button */}
        <div className="Issue-Item-content">
            <h3>
                <Link href={issue.url}>{issue.title}</Link>
            </h3>
            {/* dangerouslySet... is a react prop type that expects an object containing the html to be displayed.  
            This is to avoid cross site scripting attacks which might inject unexpected code to be executed.
            Here the issue body text is displayed. */}
            <div dangerouslySetInnerHTML={{__html: issue.bodyHTML}} />
            <Comments issueId={issue.id}/>
        </div>
    </div>  
    
)

export default withState(
    'issueItemState',
    'IssueItem',
    'no state yet',
 ) (IssueItem);