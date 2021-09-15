import { Route, Redirect } from "react-router-dom";
import React from "react";

const PrivateRoute = (props: any) => {
    const { children, ...rest } = props;
    return (
        <Route
            {...rest}
            render={({ location }) =>
                (localStorage.getItem('currentUserToken') && localStorage.getItem('currentUserToken')?.includes('Bearer')) ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;