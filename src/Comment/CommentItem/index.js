
import React from 'react';

import './style.css';
// Comment component displays a comment author and comment body
const Comment = ({ comment }) => (
  <div className="CommentItem">
    <div>{comment.author.login}:</div>
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

export default Comment;