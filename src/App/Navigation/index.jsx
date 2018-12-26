import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as routes from '../../constants/routes';
import './style.css';
import Button from '../../Button';
import Input from '../../Input';


// Navigation component that handles navigating between linked pages
const Navigation =({
    location: {pathname},
    organizationName,
    onOrganizationSearch,
}) => (
    
        // Display header with a react link component to connect the Profile and Organization pages
        <header className="Navigation">
            <div className="Navigation-link">
                <Link to={routes.PROFILE}>Profile</Link>
            </div>
            <div className="Navigation-link">
                <Link to={routes.ORGANIZATION}>Organization</Link>
            </div>
            {/* If on the organization page display Organization Search input component
            and pass in the organization name as default search input */}
            {pathname === routes.ORGANIZATION && (
                <OrganizationSearch
                    organizationName={organizationName}
                    onOrganizationSearch={onOrganizationSearch}
                />
            )}
        </header>       
)
//Component to display input and handle when user inputs a new organization to search
class OrganizationSearch extends React.Component {
    state = {
        value: this.props.organizationName,
    }
    //The sorganizationName in state is updated with the input's value
    onChange = event => {
        this.setState({value: event.target.value});
    }

    onSubmit = event => {
        // The current state Organization is passed up to the parent component by 
        // updating the organizationSearch props with the new input value
        this.props.onOrganizationSearch(this.state.value);

        event.preventDefault();
    };

    render() {
        const {value} = this.state;
        // Return a jsx form with an input and button component
        return (
            <div className="Navigation-search">
                <form onSubmit={this.onSubmit}>
                    <Input
                        color={'white'}
                        type="text"
                        value={value}
                        onChange={this.onChange}
                    />{' '}
                    <Button color={'white'} type="submit">
                        Search
                    </Button>
                </form>
            </div>
        )
    }
}

export default withRouter(Navigation);