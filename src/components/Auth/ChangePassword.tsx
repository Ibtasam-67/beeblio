import React, { useState, useContext } from 'react'
import { useFormik } from 'formik';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { useHistory } from 'react-router-dom';
import LockLogo from '../../assets/images/fp.png';

const ChangePassword = () => {
    const [sumbitting, setSumbitting] = useState(false);
    const history = useHistory();
    const validate = (values: any) => {
        const errors: any = {};
        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length > 20) {
            errors.password = 'Must be 20 characters or less';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Required';
        } else if (values.confirmPassword.length > 20) {
            errors.confirmPassword = 'Must be 20 characters or less';
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Password doesn\'t match';
        }
        return errors;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('t');
    const alertContext = useContext(AlertContext);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
            token: token
        },
        validate,
        onSubmit: async values => {
            setSumbitting(true);
            try {
                const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/reset-password`, values);
                alertContext.setSuccessAlert('Passwrod Changed Successfully');
                history.push('/auth');
            } catch (error) {
                const { response } = error;
                alertContext.setErrorAlert(response.data.message);
                setSumbitting(false);
            }
        },
    });

    return (
        <div className="d-flex justify-content-center align-items-center resetPasswordPage bg-primary">
            <form className="row register-form card p-5 text-center" onSubmit={formik.handleSubmit}>
                <div className="col-md-12">
                    <img src={LockLogo} />
                    <h2 className="py-3">Reset Password</h2>
                    <div className="form-group">
                        <input
                            placeholder="Password *"
                            className="form-control"
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        <div className="help-block with-errors">
                            {formik.touched.password && formik.errors.password ? (
                                <div>{formik.errors.password}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Confirm Password *"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        <div className="help-block with-errors">
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div>{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-theme btn-block">
                        {
                            sumbitting ? <span> Submitting... <FontAwesomeIcon icon={faSpinner} className="loading-icon" /></span> :
                                <span>Submit</span>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
export default ChangePassword;