import React from 'react'
import { Route, Switch } from 'react-router'
import { Link, useRouteMatch } from 'react-router-dom'
import FlashCardForm from './FlashCardForm'

const Flashcard = () => {
    let { path, url } = useRouteMatch();

    return (
        <div className="content m-15" style={{ minHeight: '550px' }}>
            <Switch>
                <Route exact path={path}>
                    <div className="d-flex justify-content-end">
                        <Link to={`${url}/form`} className="btn btn-theme btn-sm">
                            Create New Flashcard</Link>
                    </div>
                </Route>
                <Route path={`${path}/form`}>
                    <FlashCardForm />
                </Route>
            </Switch>

        </div>
    )
}

export default Flashcard
