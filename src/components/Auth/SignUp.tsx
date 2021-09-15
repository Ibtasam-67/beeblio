/*eslint-disable*/

import React, { useContext, useState, FC } from "react";
import FacebookLogo from "../../assets/images/f.png";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TwitterLogo from "../../assets/images/t.png";
import GoogleLogo from "../../assets/images/g.png";
import AmazonLogo from "../../assets/images/a.png";
import { useFormik } from "formik";
import axios from "axios";
import {
  GOOGLE_AUTH_URL,
  FACEBOOK_AUTH_URL,
  GITHUB_AUTH_URL,
} from "../../constants";
import { AlertContext } from "../../context/alert/AlertContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { authAxios } from "../../api/authApi";
import useFullPageLoader from "../../hooks/FullPageLoader";
import { Event } from "../../components/Tracking";
import {
  FbPageView,
  initFBP,
  TrackFbpStandardEvent,
  TrackFbpCustomEvent,
} from "../../components/FacebookPixel";
import PaymentCard from "../PaymentCard";
import PaymentMethodForm from "../PaymentMethodForm";
import qs from "querystring";

declare const window: any;
interface IProps {
  selectedSub: any;
  setSelectedSub: any;
  cardDetails: any;
  setCardDetails: any;
  handleCardInfo: any;
  modal: any;
  setModal: any;
  isAdded: any;
  paymentInfos: any;
  setIsAdded: any;
}
const validate = (values: any) => {
  const errors: any = {};
  const pattern = /^[a-zA-Z]+$/i;

  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  } else if (!pattern.test(values.firstName)) {
    errors.firstName = "Invalid name format";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length > 20) {
    errors.password = "Must be 20 characters or less";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.confirmPassword.length > 20) {
    errors.confirmPassword = "Must be 20 characters or less";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password doesn't match";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const Signup: FC<IProps> = ({
  selectedSub,
  setSelectedSub,
  cardDetails,
  setCardDetails,
  handleCardInfo,
  modal,
  setModal,
  isAdded,
  setIsAdded,
  paymentInfos,
}) => {
  console.log("cardDetails", cardDetails);
  console.log("paymentInfos", paymentInfos);

  const [stripeToken, setStripeToken] = useState();
  const alertContext = useContext(AlertContext);
  const [alert, setAlert] = useState(false);
  const [sumbitting, setSumbitting] = useState(false);

  const initialFormValues = {
    firstName: "",
    password: "",
    email: "",
    confirmPassword: "",
    platformOrigin: "",
  };
  const currentUserToken =
    localStorage.getItem("currentUserToken") &&
    localStorage.getItem("currentUserToken")?.includes("Anonymous");

  const handleRedirect = (link: string) => {
    window.location.href = link;
  };
  const [loader, showLoader, hideLoader] = useFullPageLoader();

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

  const formik = useFormik({
    initialValues: initialFormValues,
    validate,
    onSubmit: async (values, { resetForm }) => {
      const maskedEmail = values?.email?.replace("@", "-AT-");
      Event("SignUp", "Signing Up", "Signing Up with: " + maskedEmail);

      TrackFbpStandardEvent("CompleteRegistration", {
        userId: maskedEmail,
        currency: "USD",
        value: 0.01,
      });

      if (values.confirmPassword === values.password) {
        try {
          // setModal(true);

          if (!modal) {
            if (
              !cardDetails.card_username ||
              !cardDetails.card_number ||
              !cardDetails.card_expiration_date ||
              !cardDetails.card_cvc ||
              cardDetails.card_cvc.includes("_") ||
              cardDetails.card_number.includes("_") ||
              cardDetails.card_expiration_date.includes("_")
            ) {
              setSumbitting(false);
              return alertContext.setErrorAlert(
                "Please fill the card info first"
              );
            }
            setSumbitting(true);
            const token = await addStripePaymentMethod();

            values.platformOrigin = "WEB_APP";

            let result = null;
            if (currentUserToken) {
              result = await authAxios.post(
                `${process.env.REACT_APP_BASE_URL}/auth/register`,
                {
                  ...values,
                  // paymentInfos,

                  type: "SCHOOL",
                  name: "School1",
                  contact: {
                    line1: "1 main st",
                  },

                  company: {
                    stripeToken: token,
                    planId: selectedSub,
                  },
                }
              );
            } else {
              result = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/auth/register`,
                {
                  ...values,
                  // paymentInfos,
                  company: {
                    type: "SCHOOL",
                    name: "School1",
                    contact: {
                      line1: "1 main st",
                    },

                    stripeToken: token,
                    planId: selectedSub,
                  },
                }
              );
            }
            alertContext.setSuccessAlert("User saved successfully");
            setAlert(true);
            setSumbitting(false);
            resetForm({ values: initialFormValues });
            localStorage.clear();
          }
          //fbq('track', 'PageView');
        } catch (error) {
          const { response } = error;
          alertContext.setErrorAlert(response.data.message);
          setSumbitting(false);
        }
      }
    },
  });

  const addStripePaymentMethod = async () => {
    const substring = cardDetails.card_expiration_date.split("/");
    const paymentDetails = {
      cardCvc: cardDetails.card_cvc,
      cardExpirationMonth: substring[0],
      cardExpirationYear: substring[1],
      cardNumber: cardDetails.card_number,
      nickname: cardDetails.card_username,
    };

    console.log("paymentDetails", paymentDetails);

    try {
      const paymentMethodResult = await axios({
        method: "post",
        url: "https://api.stripe.com/v1/tokens",

        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer sk_test_51IKWqdGsrWH4RNH5hM7E9M9Ng4pNpn6s52kGWZYVc8LmPu67jtO7TGsEWncsQx7mmSMm9eruuWxLns6vtiibkpRQ00abbfxeHM`,
        },

        data: qs.stringify({
          "card[number]": paymentDetails.cardNumber,
          "card[exp_month]": paymentDetails.cardExpirationMonth,
          "card[exp_year]": paymentDetails.cardExpirationYear,
          "card[cvc]": paymentDetails.cardCvc,
        }),
      });
      setStripeToken(paymentMethodResult.data.id);
      return paymentMethodResult.data.id;
    } catch (error) {
      console.log("error", error);
    }
  };

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
      // }
      // );
    });
    return false;
  };

  return (
    <>
      <form className="row register-form" onSubmit={formik.handleSubmit}>
        <div className="col-md-12">
          <div className="form-group">
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
          </div>

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
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div>{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
          </div>
          {console.log("modal in sign up", modal)}
          <div
            style={{
              display:
                modal ||
                !cardDetails.card_username ||
                !cardDetails.card_number ||
                !cardDetails.card_expiration_date ||
                !cardDetails.card_cvc ||
                cardDetails.card_cvc.includes("_") ||
                cardDetails.card_number.includes("_") ||
                cardDetails.card_expiration_date.includes("_")
                  ? "none"
                  : isAdded
                  ? "block"
                  : "none",
            }}
            className="form-group"
          >
            <Modal
              isOpen={modal}
              toggle={() => {
                setModal(!modal);
              }}
              className="payment-form-modal"
            >
              <ModalHeader toggle={() => setModal(!modal)}>
                Enter Card Details
              </ModalHeader>
              <ModalBody>
                <PaymentMethodForm
                  cardDetails={cardDetails}
                  setCardDetails={setCardDetails}
                  handleCardInfo={handleCardInfo}
                  setModal={setModal}
                  modal={modal}
                  isAdded={isAdded}
                  setIsAdded={setIsAdded}
                  addPaymentInfo={null}
                  companyId={null}
                />
              </ModalBody>
            </Modal>
          </div>
          <button
            type="button"
            onClick={() => {
              console.log("before setModal");
              if (
                !formik.values.firstName ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.confirmPassword
              ) {
                console.log("inside first if");
                return alertContext.setErrorAlert("Required all feild");
              }

              if (
                formik.errors.firstName ||
                formik.errors.email ||
                formik.errors.password ||
                formik.errors.confirmPassword
              ) {
                console.log("inside second if");
                formik.errors.firstName
                  ? alertContext.setErrorAlert(`${formik.errors.firstName}`)
                  : null;
                formik.errors.email
                  ? alertContext.setErrorAlert(`${formik.errors.email}`)
                  : null;
                formik.errors.password
                  ? alertContext.setErrorAlert(`${formik.errors.password}`)
                  : null;
                formik.errors.confirmPassword
                  ? alertContext.setErrorAlert(
                      `${formik.errors.confirmPassword}`
                    )
                  : null;
                return;
              }
              return setModal(true);
            }}
            className="btn btn-theme btn-lg"
          >
            {sumbitting ? (
              <span>
                {" "}
                Submitting...{" "}
                <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
              </span>
            ) : (
              <span>Submit</span>
            )}
          </button>
          {alert && (
            <div className="alert alert-success mt-2" role="alert">
              A verification link has been sent to your email
            </div>
          )}
          <div className="social-icons fullwidth social-colored mt-5 text-center clearfix">
            <h5 className="text-green mb-3">Or Sign up with</h5>
            <ul className="d-flex align-items-center justify-content-center">
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    handleRedirect(`${GOOGLE_AUTH_URL}`);
                    Event(
                      "SignUp",
                      "Handling Google Redirect",
                      "Handling Google Redirect"
                    );
                    TrackFbpCustomEvent("GoogleAuthSignup", {});
                  }}
                >
                  <img src={GoogleLogo} alt="googleLogo" width="50px" />
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    handleRedirect(`${FACEBOOK_AUTH_URL}`);
                    Event(
                      "SignUp",
                      "Handling Facebook Redirect",
                      "Handling Facebook Redirect"
                    );
                    TrackFbpCustomEvent("FacebookAuthSignup", {});
                  }}
                >
                  <img src={FacebookLogo} alt="facebookLogo" />
                </a>
              </li>

              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    handleTwiterRedirect();
                    Event(
                      "SignUp",
                      "Handling Twitter Redirect",
                      "Handling Twitter Redirect"
                    );
                    TrackFbpCustomEvent("TwitterAuthSignup", {});
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
                      "SignUp",
                      "Handling Amazon Redirect",
                      "Handling Amazon Redirect"
                    );
                    TrackFbpCustomEvent("AmazonAuthSignup", {});
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
              <li>
                {/* <button
                  style={{ border: "none", outline: "none" }}
                  type="button"
                  onClick={testStripePaymentMethod}
                >
                  call payment method
                </button> */}
              </li>
            </ul>
          </div>
        </div>
        {loader}
      </form>
    </>
  );
};

export default Signup;
