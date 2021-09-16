/*eslint-disable*/

import React, { useContext, useState, FC, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactCardFlip from "react-card-flip";
import {
  faCheck,
  faArrowRight,
  faMinus,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PaymentMethodForm from "../../PaymentMethodForm";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import qs from "querystring";
import axios from "axios";
import { authAxios } from "../../../api/authApi";
import { AlertContext } from "../../../context/alert/AlertContextProvider";
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface IProps {
  changeSub: any;
  selectedSub: any;
  setSelectedSub: any;
  cardDetails: any;
  setCardDetails: any;
  handleCardInfo: any;
  modal: any;
  setModal: any;
  isAdded: any;
  setIsAdded: any;
  paymentInfos: any;
  globalUserPaymentAndSubData: any;
  activeTab: any;
  setActiveTab: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "400px",
    margin: "auto",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    "& header": {
      borderRadius: "50px",
      boxShadow: "0px 0px 8px #d8d8d8 !important",
    },
    [theme.breakpoints.down(600)]:{
  width:"200px",
  height:"60px"
}
  },

}));

const Subscription: FC<IProps> = ({
  changeSub,
  selectedSub,
  setSelectedSub,
  cardDetails,
  setCardDetails,
  handleCardInfo,
  modal,
  setModal,
  isAdded,
  paymentInfos,
  globalUserPaymentAndSubData,
  setIsAdded,
  setActiveTab,
  activeTab,
}) => {
  const classes = useStyles();
  const [isFlipped, selIsFlipped] = useState(false);
  const [value, setValue] = React.useState(0);
  const alertContext = useContext(AlertContext);

  useEffect(() => {
    console.log("selectedSub in useEffect", selectedSub);
  }, [selectedSub]);

  useEffect(() => {
    if (changeSub) {
      console.log(
        "globalUserPaymentAndSubDataglobalUserPaymentAndSubDataglobalUserPaymentAndSubData",
        globalUserPaymentAndSubData
      );
      setSelectedSub(
        globalUserPaymentAndSubData.data.roles[0]?.company?.planId
      );
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    newValue === 1 ? selIsFlipped(true) : selIsFlipped(false);
    setValue(newValue);
  };

  const changeSubscription = async (sub: any) => {
    const paymentMethodResult = await axios({
      method: "post",
      url: "https://api.stripe.com/v1/tokens",

      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer sk_test_51IKWqdGsrWH4RNH5hM7E9M9Ng4pNpn6s52kGWZYVc8LmPu67jtO7TGsEWncsQx7mmSMm9eruuWxLns6vtiibkpRQ00abbfxeHM`,
      },

      data: qs.stringify({
        "card[number]": "4242424242424242",
        "card[exp_month]": 11,
        "card[exp_year]": 2028,
        "card[cvc]": "321",
      }),
    });

    const changeSubscriptionResult = await authAxios
      .post(
        `https://capi-test.beebl.io/company/${globalUserPaymentAndSubData.data.roles[0].company.id}/change-subscription-plan`,
        { stripeToken: paymentMethodResult?.data.id, planId: sub }
      )
      .then((res) => {
        setSelectedSub(sub);
        alertContext.setSuccessAlert("Subscription Changes Successfully!");
      })
      .catch((err) => {
        alertContext.setErrorAlert("Error while updating subscription!");
        console.log("error", err);
      });

    console.log("changeSubscriptionResult", changeSubscriptionResult);
  };

  return (
    <>
      <div className="container-fluid mb-3 mt-3">
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              variant="fullWidth"
              className="subscription-toggle-button"
            >
              <Tab disableRipple label="Monthly" {...a11yProps(0)} />
              <Tab disableRipple label="Yearly" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}></TabPanel>
          <TabPanel value={value} index={1}></TabPanel>
        </div>

        <div className="row ">
          {!changeSub ? (
            <div className="col-sm align-items-stretch "   >
              <div className="card shadow  mb-5 bg-white rounded position-relative card-height ">
                {/* <div className="position-absolute current-subscription">
                  <p className="">Current Subscription</p>
                </div> */}
                <div className="card-body subscriptionCardHeader " >
                  <h5 className="card-title sub-name ">FREE</h5>
                  <p className="card-text sub-price">$ 0.00</p>
                </div>
 
                <ul className="list-group list-group-flush cardul" style={{height:"350px"}} >
                  <li className="list-group-item cardItems">
                    {" "}
                    <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                  </li>
                  <li className="list-group-item cardItems">
                    {" "}
                    <FontAwesomeIcon icon={faCheck} /> Flash Cards
                  </li>
                  
                  
                  <li className="list-group-item cardItems minus-icon">
                    <FontAwesomeIcon icon={faMinus} />
                  </li>
                  <li className="list-group-item cardItems minus-icon">
                    <FontAwesomeIcon icon={faMinus} />
                  </li>
                  <li className="list-group-item cardItems minus-icon">
                    <FontAwesomeIcon icon={faMinus} />
                  </li>
                </ul>
                <div className="card-body card-signup-btn">
                  <button
                    disabled={selectedSub === "BEEBLIO_FREE" ? true : false}
                    className="btn btn-outline-info singup-btn"
                    onClick={() => setSelectedSub("BEEBLIO_FREE")}
                     
                  >
                    {!changeSub
                      ? selectedSub === "BEEBLIO_FREE"
                        ? "Selected"
                        : "Sign Up"
                      : "Select"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          <div className="col-sm">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div >
                <div className="card shadow mb-5 mx-2 bg-white rounded h-100 position-relative card-height">
                  {selectedSub === "BEEBLIO_BASIC_MONTHLY" ? (
                    <div className=" Current Subscription current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}

                  <div className="card-body subscriptionCardHeader">
                    <h5 className="card-title sub-name ">BASIC</h5>
                    <p className="card-text sub-price">$ 2.49/MO</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Family and
                      Tutors
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 5 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 5 Students each
                      classroom
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_BASIC_MONTHLY" ? true : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_BASIC_MONTHLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_BASIC_MONTHLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="card shadow mb-5 mx-2 bg-white rounded h-100 position-relative card-height">
                  {selectedSub === "BEEBLIO_BASIC_YEARLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader"   >
                    <h5 className="card-title sub-name ">BASIC</h5>
                    <p className="card-text sub-price">$ 29.88/YR</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Family and
                      Tutors
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 5 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 5 Students each
                      classroom
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_BASIC_YEARLY" ? true : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_BASIC_YEARLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_BASIC_YEARLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            </ReactCardFlip>
          </div>
          <div className="col-sm">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div>
                <div className="card shadow  mb-5 bg-white rounded h-100 position-relative  card-height">
                  {selectedSub === "BEEBLIO_ADVANCED_MONTHLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader"  >
                    <h5 className="card-title sub-name ">ADVANCED</h5>
                    <p className="card-text sub-price">$ 9.99/MO</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Teachers
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item F">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 10 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 25 Students each
                      classroom
                    </li>  
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_ADVANCED_MONTHLY"
                          ? true
                          : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_ADVANCED_MONTHLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_ADVANCED_MONTHLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="card shadow  mb-5 bg-white rounded h-100 position-relative card-height">
                  {selectedSub === "BEEBLIO_ADVANCED_YEARLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader">
                    <h5 className="card-title sub-name ">ADVANCED</h5>
                    <p className="card-text sub-price">$ 119.88/YR</p>
                  </div>
                  <ul className="list-group list-group-flush cardul"
                   style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Teachers
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 10 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 25 Students each
                      classroom
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_ADVANCED_YEARLY" ? true : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_ADVANCED_YEARLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_ADVANCED_YEARLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            </ReactCardFlip>
          </div>
          <div className="col-sm">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div>
                <div className="card shadow  mb-5 bg-white rounded h-100 position-relative  card-height">
                  {selectedSub === "BEEBLIO_PRO_MONTHLY" ? (
                    <div className="position-absolute current-subscription"
                    >
                      <p className=""  >Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader">
                    <h5 className="card-title sub-name "
                     style={{marginTop:"50px"}}>PRO</h5>
                    <p className="card-text sub-price">$ 25/MO</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" 
                   style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faArrowRight} /> For Bigger
                      Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 20 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 50 Students each
                      classroom
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_PRO_MONTHLY" ? true : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_PRO_MONTHLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_PRO_MONTHLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="card shadow  mb-5 bg-white rounded h-100 position-relative  card-height">
                  {selectedSub === "BEEBLIO_PRO_YEARLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader">
                    <h5 className="card-title sub-name ">PRO</h5>
                    <p className="card-text sub-price">$ 300/YR</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" 
                 style={{height:"350px"}} >
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faArrowRight} /> For Bigger
                      Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> 20 Classrooms
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Max 50 Students each
                      classroom
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_PRO_YEARLY" ? true : false
                      }
                      className="btn btn-outline-info singup-btn"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_PRO_YEARLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_PRO_YEARLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            </ReactCardFlip>
          </div>
          <div className="col-sm">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div>
                <div className="card shadow mb-5 bg-white rounded h-100 cardBody-enterprise position-relative  card-height">
                  {selectedSub === "BEEBLIO_ENTERPRISE_MONTHLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader-enterprise" >
                    <FontAwesomeIcon icon={faCrown} />
                    <h5 className="card-title sub-name-enterprise ">
                      ENTERPRISE
                    </h5>
                    <p className="card-text sub-price">$ 125/MO</p>
                  </div>
                  <ul className="list-group list-group-flush cardul" 
                  style={{height:"340px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Schools
                    </li>
                    <li className="list-group-item cardItems"  >
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> School Feature{" "}
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Unlimited schools and
                      students
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_ENTERPRISE_MONTHLY"
                          ? true
                          : false
                      }
                      className="btn btn-outline-info singup-btn-enterprise"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_ENTERPRISE_MONTHLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_ENTERPRISE_MONTHLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div><fieldset></fieldset>
              </div>
              <div>
                <div className="card shadow mb-5 bg-white rounded h-100 cardBody-enterprise position-relative">
                  {selectedSub === "BEEBLIO_ENTERPRISE_YEARLY" ? (
                    <div className="position-absolute current-subscription">
                      <p className="">Current Subscription</p>
                    </div>
                  ) : null}
                  <div className="card-body subscriptionCardHeader-enterprise"  >
                    <FontAwesomeIcon icon={faCrown} />
                    <h5 className="card-title sub-name-enterprise ">
                      ENTERPRISE
                    </h5>
                    <p className="card-text sub-price">$ 1500/YR</p>
                  </div>
                  <ul className="list-group list-group-flush cardul"  style={{height:"350px"}}>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faArrowRight} /> For Schools
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Vocabulary List
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Flash Cards
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> Classroom Feature
                    </li>
                    <li className="list-group-item cardItems">
                      {" "}
                      <FontAwesomeIcon icon={faCheck} /> School Feature{" "}
                    </li>
                    <li className="list-group-item cardItems">
                      <FontAwesomeIcon icon={faCheck} /> Unlimited schools and
                      students
                    </li>
                  </ul>
                  <div className="card-body card-signup-btn">
                    <button
                      disabled={
                        selectedSub === "BEEBLIO_ENTERPRISE_YEARLY"
                          ? true
                          : false
                      }
                      className="btn btn-outline-info singup-btn-enterprise"
                      onClick={() => {
                        changeSub
                          ? changeSubscription("BEEBLIO_ENTERPRISE_YEARLY")
                          : setActiveTab("2");
                      }}
                    >
                      {!changeSub
                        ? selectedSub === "BEEBLIO_ENTERPRISE_YEARLY"
                          ? "Selected"
                          : "Sign Up"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            </ReactCardFlip>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
