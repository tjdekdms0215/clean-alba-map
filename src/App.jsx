import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Home';
import AuthHandler from './AuthHandler';
import Guide from './Guide';
import ReviewSelect from './ReviewSelect';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/kakao/auth-code"
                    element={<AuthHandler />}
                />

                <Route
                    path="/kakao/callback"
                    element={<AuthHandler />}
                />

                <Route
                    path="/guide"
                    element={<Guide />}
                />

                <Route
                    path="/review/select"
                    element={<ReviewSelect />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;