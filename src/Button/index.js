import React from 'react';
import './style.css';
const Button = ({
    children,
    className,
    color = 'black',
    type = 'button',
    ...props
}) => ( 
    <button 
        className = {
        `${className} Button Button_${color}`}
        type = {type} 
        //props are copied from the parent component to be used in the button instance:
        { ...props}
    >
        {/* Whatever jsx is placed as content within the Button Component when 
            it is rendered is placed here as children */}
        {children} 
    </button>
);
export default Button;