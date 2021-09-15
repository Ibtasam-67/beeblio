import React, { useContext, useEffect, useState } from "react";
import FacebookLogo from "../../assets/images/f.png";
import GoogleLogo from "../../assets/images/g.png";
import TwitterLogo from "../../assets/images/t.png";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { AuthContext } from "../../context/auth/AuthContextProvider";
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useFullPageLoader from "../../hooks/FullPageLoader";
import { AlertContext } from "../../context/alert/AlertContextProvider";
import AmazonLogo from "../../assets/images/a.png";
import {
  Event,
  SetDimension,
  InitAndPageViewGA,
} from "../../components/Tracking";
import ReactGA from "react-ga";

declare const window: any;

const validate = (values: any) => {
  const errors: any = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length > 20) {
    errors.password = "Must be 20 characters or less";
  }

  return errors;
};

const handleTwiterRedirect = async () => {
  try {
    const result: any = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/oauth/twitter`
    );
    const twiiterObject = result.data;
    console.log(twiiterObject);
    localStorage.setItem("twitter", twiiterObject.twitter);
    localStorage.setItem("requestToken", twiiterObject.requestToken);
    window.location.href = twiiterObject.twitterAuthUrl;
  } catch (error) {
    console.log(error);
    // const { response } = error;
    // alertContext.setErrorAlert(response.data.message);
  }
};

const SignIn = (props: any) => {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const error = authContext.error;
  const currentUserToken = authContext.currentUserToken;
  const [sumbitting, setSumbitting] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const alertContext = useContext(AlertContext);

  const postAmazonData = async (body: any) => {
    const fn: any = showLoader;
    fn();
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/oauth/aws`,
        body
      );
      window.location.href = `${process.env.REACT_APP_BASE_URL_WEB}/oauth2/redirect?token=${result.data}`;
      const fn: any = hideLoader;
      fn();
    } catch (error) {
      const { response } = error;
      alertContext.setErrorAlert(response.data.message);
      const fn: any = hideLoader;
      fn();
    }
  };

  const handleAmazonLogin = () => {
    let options: any = {};
    options.scope = "profile";
    options.pkce = true;
    window.amazon.Login.authorize(options, function (response: any) {
      if (response.error) {
        console.log("oauth error " + response.error);
        return;
      }
      window.amazon.Login.retrieveToken(
        response.code,
        function (response: any) {
          if (response.error) {
            console.log("oauth error " + response.error);
            return;
          }
          window.amazon.Login.retrieveProfile(
            response.access_token,
            function (response: any) {
              const body = {
                email: response.profile.PrimaryEmail,
                providerId: response.profile.CustomerId,
                name: response.profile.Name,
              };
              postAmazonData(body);
              if (window.console && window.console.log)
                window.console.log(response);
            }
          );
        }
      );
    });
  };

  useEffect(() => {
    if (error) {
      setSumbitting(false);
      authContext.resetError();
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      password: "password",
      email: "hamzazia2005+b1@gmail.com",
    },
    validate,
    onSubmit: async (values) => {
      Event("SignIn", "Signing In", "Signing In with: " + values?.email);
      setSumbitting(true);

      const data: any = await authContext.loginByEmail(values);

      const paymentData: any = await authContext.getPaymentInfo(data);

      props.setSubGlobalInfo({
        data: data?.loginInfo,
        paymentData: paymentData?.dataFromGetPaymentInfo,
      });

      let globalUserPaymentAndSubData: any = {
        data: data?.loginInfo,
        paymentData: paymentData?.dataFromGetPaymentInfo,
      };

      globalUserPaymentAndSubData = JSON.stringify(globalUserPaymentAndSubData);

      console.log(
        "before setting in local storage globalUserPaymentAndSubData",
        globalUserPaymentAndSubData
      );

      localStorage.setItem(
        "globalUserPaymentAndSubData",
        globalUserPaymentAndSubData
      );
    },
  });

  useEffect(() => {
    if (currentUserToken && currentUserToken !== "") {
      console.log("ubGlobalInfo", props.subGlobalInfo);
      history.push("/dashboard");
    }
  }, [currentUserToken]);

  return (
    <form className="row register-form" onSubmit={formik.handleSubmit}>
      <div className="col-md-12">
        <div className="form-group">
          <input
            placeholder="Email *"
            className="form-control"
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <div className="help-block with-errors">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
        </div>
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
        <div className="form-group mt-4 mb-5">
          <div className="remember-checkbox d-sm-flex align-items-center justify-content-between">
            <a
              className="cursor-pointer mb-0"
              onClick={() => props.toggleResetPassword()}
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button type="submit" className="btn btn-theme btn-lg">
          {sumbitting ? (
            <span>
              {" "}
              Logging In...{" "}
              <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
            </span>
          ) : (
            <span>Login</span>
          )}
        </button>

        <div className="social-icons fullwidth social-colored mt-5 text-center clearfix">
          <h5 className="text-green mb-3">Or Login with</h5>
          <ul className="d-flex justify-content-center align-items-center">
            <li>
              <ReactGA.OutboundLink
                to={`${GOOGLE_AUTH_URL}`}
                eventLabel="Google"
              >
                <a>
                  <img src={GoogleLogo} alt="googleLogo" width="50px" />
                </a>
              </ReactGA.OutboundLink>
            </li>

            <li>
              <ReactGA.OutboundLink
                to={`${FACEBOOK_AUTH_URL}`}
                eventLabel="Facebook"
              >
                <a>
                  <img src={FacebookLogo} alt="facenookLogo" />
                </a>
              </ReactGA.OutboundLink>
            </li>

            <li>
              <a
                className="cursor-pointer"
                onClick={() => {
                  handleTwiterRedirect();
                  Event(
                    "SignIn",
                    "Handling Twiter Redirect",
                    "Handling Twiter Redirect"
                  );
                }}
              >
                <img src={TwitterLogo} alt="twitterLogo" />
              </a>
            </li>

            <li>
              <button
                type="button"
                id="LoginWithAmazon"
                style={{ border: "none", outline: "none" }}
                onClick={() => {
                  handleAmazonLogin();
                  Event(
                    "SignIn",
                    "Handling Amazon Login",
                    "Handling Amazon Login"
                  );
                }}
              >
                <img
                  style={{ borderRadius: "10px" }}
                  width="55px"
                  alt="Login with Amazon"
                  src={AmazonLogo}
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
