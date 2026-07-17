import React from 'react';
import {
    Navigate,
    Outlet,
    useLocation
} from 'react-router-dom';
import {
    isAuthenticated,
    setPostLoginRedirectPath
} from '../utils/auth';

const RequireAuth = () => {
    const location = useLocation();

    if (!isAuthenticated()) {
        setPostLoginRedirectPath(
            `${location.pathname}${location.search}${location.hash}`
        );

        return (
            <Navigate
                to="/review/select"
                replace
                state={{ authRequired: true }}
            />
        );
    }

    return <Outlet />;
};

export default RequireAuth;
