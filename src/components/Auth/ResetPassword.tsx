import React, { useState, useContext } from 'react';
import LockLogo from '../../assets/images/fp.png';
import axios from 'axios';
import './Auth.scss';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {

    const [email, setEmail] = useState('');
    const [emailRequired, setEmailRequired] = useState(false);
    const [emailPatternError, setEmailPatternError] = useState(false);
    const alertContext = useContext(AlertContext)
    const [sumbitting, setSumbitting] = useState(false);
    const [alert, setAlert] = useState(false);

    const handleResetPassord = async () => {
        if (!email || email === '') {
            setEmailRequired(true);
            return;
        } else {
            setEmailRequired(false);
            if (!validateEmail(email)) {
                setEmailPatternError(true);
                return;
            }
            else {
                setEmailPatternError(false);
            }
        }
        try {
            setSumbitting(true);
            const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/forgot-password`, { email });
            if (result) {
                setAlert(true);
            }
            setEmail('');
            setSumbitting(false);

        } catch (error) {
            const { response } = error;
            alertContext.setErrorAlert(response.data.message);
            setSumbitting(false);
            setEmail('');
        }
    }

    const validateEmail = (email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <div className="col-md-7">
            <div className="row register-form">
                <div className="col-md-12">
                    <img src={LockLogo} />
                    <h2>Forgot Password?</h2>
                    <p>Enter your email to reset your</p>
                    <div className="form-group">
                        <input type="email" className="form-control" placeholder="Email *" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <div className="help-block with-errors">
                            {emailRequired && <p>Email required</p>}
                            {emailPatternError && <p>Email is not valid</p>}
                        </div>
                    </div>
                    {/* <Button className="btn btn-theme btn-lg"  ><span>Reset Password</span></Button> */}
                    <button type="submit" className="btn btn-theme btn-md" onClick={() => { handleResetPassord() }}>
                        {
                            sumbitting ? <span> Submitting... <FontAwesomeIcon icon={faSpinner} className="loading-icon" /></span> :
                                <span>Reset Password</span>
                        }
                    </button>
                </div>
                {alert &&
                    <div className="alert alert-success mt-3" role="alert">
                        Password reset link has been sent to your email
                </div>
                }
            </div>
        </div>
    );
};

export default ResetPassword;