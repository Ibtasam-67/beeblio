import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const FlashCardForm = () => {
    let { path, url } = useRouteMatch();

    return (
        <div>
            <div className="bg-white p-5">
                <div className="d-flex justify-content-end">
                    <Link to={`/dashboard/flashcard`} className="btn btn-primary text-white btn-sm"><FontAwesomeIcon className="mr-2" icon={faAngleLeft} />Back</Link>
                </div>
                <h4 className="mb-0">Create a new flash card</h4>
                <p>Add commma separated word below to create a flashcard</p>
                <div className="d-flex flex-column">
                    <textarea></textarea>
                    <label>Flash Card Name</label>
                    <input className="form-control" placeholder="Enter a Flashcard Name"></input>
                </div>
            </div>
        </div>
    )
}

export default FlashCardForm
