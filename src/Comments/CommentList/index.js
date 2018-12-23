import React from 'react';
import CommentItem from "../CommentItem"



const Comments = (issueId) => {
    return (
        <div>
            <CommentItem />
            {console.log(issueId)}
        </div>
    )
}

export default Comments;