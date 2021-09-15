import React, { useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../assets/images/spinner.svg';

const TwitterRedirect = () => {

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('oauth_token');
        const oauthVerifier = urlParams.get('oauth_verifier');
        const twitter = localStorage.getItem('twitter');
        const requestToken = localStorage.getItem('requestToken');

        const body = {
            oauthToken,
            oauthVerifier,
            twitter,
            requestToken
        }
        postTwitterInfo(body);
    }, [])

    const postTwitterInfo = async (body: any) => {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/oauth/callback/twitter`, body);
        window.location.href = `${process.env.REACT_APP_BASE_URL_WEB}/oauth2/redirect?token=${result.data}`;
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }} className="d-flex justify-content-center align-items-center">
            <img src={Spinner}></img>
        </div>
    )
}

export default TwitterRedirect;
