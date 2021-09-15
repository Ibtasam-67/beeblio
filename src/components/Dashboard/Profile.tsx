import React, { useContext, useRef, useState, Fragment, useEffect } from 'react';
import ProfilePicture from '../../assets/images/dashboard/img1.jpg'
import { useFormik } from 'formik';
import { authAxios } from '../../api/authApi';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";
import ReactGA from 'react-ga';

const validate = (values: any) => {
    const errors: any = {};
    const pattern = /^[a-zA-Z]+$/i;
    if (!values.firstName) {
        errors.firstName = 'Required';
    } else if (values.firstName.length > 15) {
        errors.firstName = 'Must be 15 characters or less';
    } else if (!pattern.test(values.firstName)) {
        errors.firstName = 'Invalid name format';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    } else if (values.lastName.length > 15) {
        errors.lastName = 'Must be 15 characters or less';
    } else if (!pattern.test(values.lastName)) {
        errors.lastName = 'Invalid name format';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};



const Profile = () => {
    const currentUser: any = localStorage.getItem('currentUser');
    const user = JSON.parse(currentUser);
    const alertContext = useContext(AlertContext);
    const fileRef: any = useRef(null);
    const [imageUploadedPath, setImageUploadedPath] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const fetchProfile = async () => {
        const userResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/me`);
        localStorage.setItem('currentUser', JSON.stringify(userResult.data));
    }

    const fetchProfilePicture = async () => {
        const userResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/image`);
        if (userResult.data.length > 0) {
            setImageUploadedPath((userResult.data)[0].fileLink);
        }
    }

    useEffect(() => {
        fetchProfilePicture();
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: user?.apiUserProfile?.firstName !== null ? user?.apiUserProfile?.firstName : '',
            email: user?.email !== null ? user?.email : '',
            lastName: user?.apiUserProfile?.lastName !== null ? user?.apiUserProfile?.lastName : '',
        },
        validate,
        onSubmit: async values => {

            try {
                Event('Profile',"Clicked on 'Update Profile' ","Clicked on 'Update Profile': "+values?.email);
                setUpdating(true);
                const result = await authAxios.put(`${process.env.REACT_APP_BASE_URL}/user/profile`, values);
                fetchProfile();
                alertContext.setSuccessAlert('Profile Updated Succesfully');
                setUpdating(false);
            } catch (error) {
                const { response } = error;
                alertContext.setErrorAlert(response.data.message);
                setUpdating(false);
            }

        },
    });

    const handleImageChange = async (files: any) => {
        if (files[0].type.includes('image')) {
            const formData = new FormData();
            formData.append("file", files[0]);
            try {
                setLoading(true);
                const result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/user/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setImageUploadedPath(result.data.defaultFormat.path);
                setLoading(false);
                alertContext.setSuccessAlert('Image Uploaded Succesfully');
            } catch (err) {
                const { response } = err;
                alertContext.setErrorAlert(response.data.message);
                setLoading(false);
            }
        } else {
            alertContext.setErrorAlert('Invalid image format')
        }
    }

    // imageUrl
    return (
        <div className="content m-25">
            <div className="row bg-white py-5 newbox">
                <div className="col-lg-3">
                    <div className="box box-primary">
                        <div className="box-profile">

                            <img className="profile-user-img img-responsive img-circle"
                                src={imageUploadedPath ? imageUploadedPath : user?.apiUserProfile?.imageUrl ? user?.apiUserProfile?.imageUrl : ProfilePicture} alt="User profile picture" />
                            <button className="btn btn-primary text-white btn-block m-t-4 d-flex justify-content-center align-items-center" onClick={() => { if (fileRef.current !== null) { fileRef.current.click(); } Event('Profile',"Clicked on 'Change Picture' ","Clicked on 'Change Picture' ") }}>
                                {loading && <div className="d-flex align-items-center">
                                    <span>Uploading...</span>
                                    <FontAwesomeIcon className="loading-icon ml-2 mt-1" icon={faSpinner} />
                                </div>}
                                {!loading && <span>Change Picture</span>}</button>
                            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={(e) => { handleImageChange(e.target.files) }} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="box box-primary">
                        <form className="form-horizontal form-material" onSubmit={formik.handleSubmit}>
                            <h3 className="text-blue px-3 pb-2 text-center text-sm-left my-4 my-sm-0">Your Profile Details</h3>
                            <div className="form-group has-feedback">
                                <div className="col-md-12">
                                    <label htmlFor="FName" className="col-md-12">First Name</label>
                                    <input
                                        placeholder="First Name"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                    />
                                    <div className="help-block with-errors">
                                        {formik.touched.firstName && formik.errors.firstName ? (
                                            <div>{formik.errors.firstName}</div>
                                        ) : null}
                                    </div>
                                    <FontAwesomeIcon className="form-control-feedback" icon={faPencilAlt} />
                                    {/* <span className="fa fa-pencil form-control-feedback" aria-hidden="true"></span> */}
                                </div>
                            </div>
                            <div className="form-group has-feedback">
                                <div className="col-md-12">
                                    <label htmlFor="lastName" className="col-md-12">Last Name</label>
                                    <input
                                        placeholder="Last Name"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.lastName}
                                    />
                                    <div className="help-block with-errors">
                                        {formik.touched.lastName && formik.errors.lastName ? (
                                            <div>{formik.errors.lastName}</div>
                                        ) : null}
                                    </div>
                                    <FontAwesomeIcon className="form-control-feedback" icon={faPencilAlt} />
                                    {/* <span className="fa fa-pencil form-control-feedback" aria-hidden="true"></span> */}
                                </div>
                            </div>
                            <div className="form-group has-feedback">
                                <div className="col-md-12">
                                    <label htmlFor="email" className="col-md-12">Email Address</label>
                                    <input
                                        placeholder="Email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                    <FontAwesomeIcon className="form-control-feedback" icon={faPencilAlt} />
                                    {/* <span className="fa fa-pencil form-control-feedback" aria-hidden="true"></span> */}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-12">

                                    <button type="submit" className="btn btn-primary text-white">

                                        {updating && <div className="d-flex align-items-center">
                                            <span>Updating...</span>
                                            <FontAwesomeIcon className="loading-icon ml-2 mt-1" icon={faSpinner} />
                                        </div>}
                                        {!updating && <span>Update Profile</span>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;