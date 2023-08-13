import React from 'react';
import Axios from 'axios';

// components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute, AuthProvider } from './auth';

// 404
import NotFound from './../pages/error/404';

// settings
import Settings from './../settings'
import SideNav from '../component/nav/sidenav';

const routes = [

  ...require('./../routes/auth').default,
  ...require('./../routes/app').default,

]

export default function App(){

    const user = JSON.parse(localStorage.getItem('user'));
    Axios.defaults.baseURL = Settings[process.env.NODE_ENV].server_url;

    if (user?.token){

        // add auth token to api header calls
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    }

    // render the routes
    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    { 
                        routes.map(route => {
                            return (
                                <Route 
                                    key={ route.path } 
                                    path={ route.path }
                                    element={ 
                                        route.permission ? 
                                            <PrivateRoute permission={ route.permission }>
                                                <SideNav>
                                                    {route.view}
                                                </SideNav>
                                            </PrivateRoute> 
                                            :
                                            route.view
                                    }
                                />
                            )
                        })
                    }

                    { /* 404 */}
                    <Route path='*' element={ <NotFound /> }/>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
