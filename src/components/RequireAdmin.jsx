import React from 'react';
import {
    Navigate,
    Outlet,
    useLocation
} from 'react-router-dom';
import {
    getStoredAuth,
    setPostLoginRedirectPath
} from '../utils/auth';

const RequireAdmin = () => {
    const location = useLocation();
    const auth = getStoredAuth();

    if (!auth.isLoggedIn) {
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

    if (!auth.isAdmin) {
        return (
            <Navigate
                to="/"
                replace
                state={{ adminOnly: true }}
            />
        );
    }

    return <Outlet />;
};

export default RequireAdmin;
