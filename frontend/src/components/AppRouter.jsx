import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import {Route, Routes, Navigate} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../router";
import Main from "../pages/Main";
import { Layout } from './Layout';

const AppRouter = () => {
    let {user} = useContext(AuthContext)

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Main/>} />

                {user
                    ?
                    <>
                        {privateRoutes.map(route =>
                        <Route
                            element={<route.component/>}
                            path={route.path}
                            key={route.path}
                        />
                        )}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                    :
                    <>
                        {publicRoutes.map(route =>
                        <Route
                            element={<route.component/>}
                            path={route.path}
                            key={route.path}
                        />
                        )}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                }
                
            </Route>
        </Routes>
    );
};

export default AppRouter;
