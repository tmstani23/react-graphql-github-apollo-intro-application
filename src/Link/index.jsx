import React from 'react';
//Link component that displays children as text and props as the link url
const Link = ({children, ...props}) => (
    <a {...props} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

export default Link;
