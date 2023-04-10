import React from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../router";
import { Layout } from './Layout';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Navigate to="/ItProject" replace />} />
                {privateRoutes.map(route =>
                <Route
                    element={<route.component/>}
                    path={route.path}
                    key={route.path}
                />
                )}
                <Route path="*" element={<Navigate to="/ItProject" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
