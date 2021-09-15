import React from 'react'
import Spinner from '../../assets/images/spinner.svg';
import './FullPageLoader.scss'

const FullPageLoader = () => {
    return (
        <div className="fullPageLoaderContainer">
            <img src={Spinner} alt="spinner" />
        </div>
    )
}

export default FullPageLoader
