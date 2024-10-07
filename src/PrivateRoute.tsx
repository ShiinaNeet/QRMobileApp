import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;