import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
  FC,
} from "react";
import OwlCarousel from "react-owl-carousel";
import { authAxios } from "../../api/authApi";
import { AlertContext } from "../../context/alert/AlertContextProvider";
import CollectionDetail from "./CollectionDetail";
import Spinner from "../../assets/images/spinner.svg";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faSpinner,
  faVolumeUp,
  faTimes,
  faTrashAlt,
  faBook,
  faAngleUp,
  faAngleDown,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Collapse,
  CardBody,
  Card,
  CardHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import { LOGO_CONTENT_SOURCE_MAP } from "../../constants";
import {
  Event,
  SetDimension,
  InitAndPageViewGA,
} from "../../components/Tracking";
import PaymentMethods from "../PaymentMethods";
import Subscription from "./Subscriptions/Index";
import ReactGA from "react-ga";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { PaymentTypes } from "./PaymentTypes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface IProps {
  subGlobalInfo: any;
  setSubGlobalInfo: any;
  selectedSub: any;
  setSelectedSub: any;
  setActiveTab: any;
  activeTab: any;
  cardDetails: any;
  setCardDetails: any;
  handleCardInfo: any;
  isAdded: any;
  setIsAdded: any;
  paymentInfos: any;
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
        <Box>
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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  
  //      [theme.breakpoints.up(600)]: {
  //       width:`3%`
  //  }  
  },
  
}));

export const Settings: FC<IProps> = ({
  subGlobalInfo,
  setSubGlobalInfo,
  selectedSub,
  setSelectedSub,
  setActiveTab,
  activeTab,
  cardDetails,
  setCardDetails,
  isAdded,
  setIsAdded,
  handleCardInfo,
  paymentInfos,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [owlState, setOwlState] = useState({
    options: {
      margin: 10,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 3,
        },
      },
    },
  });
  const [collectionDetail, setCollectionDetail] = useState({});
  const [likedWords, setLikedWords] = useState([]);
  const [likedContents, setLikedContents] = useState([]);
  const [dictionaries, setDictionaries] = useState([]);
  const alertContext = useContext(AlertContext);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    dictionary: { id: "" },
  });
  const history = useHistory();
  const [wordPageNumber, setWordPageNumber] = useState(0);
  const [wordPageCount, setWordPageCount] = useState(0);
  const [contentPageNumber, setContentPageNumber] = useState(0);
  const [contentPageCount, setContentPageCount] = useState(0);
  const ref = useRef(null);
  const contentRef = useRef(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef: any = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [wordReacting, setWordReacting] = useState(false);
  const [contentReacting, setContentReacting] = useState(false);
  const [collapse, setCollapse] = useState(0);
  const [collapseArray, setCollapseArray] = useState([]);
  const [collapseArrayTab2, setCollapseArrayTab2] = useState([]);
  const [innerCollapseArray, setInnerCollapseArray] = useState([]);
  const [tempIndex, setTempIndex] = useState(-1);
  const [modal, setModal] = useState(false);

  const [globalUserPaymentAndSubData, setGlobalUserPaymentAndSubData] =
    useState();

  const fetchProfile = async () => {
    const userResult = await authAxios.get(
      `${process.env.REACT_APP_BASE_URL}/user/me`
    );
    localStorage.setItem("currentUser", JSON.stringify(userResult.data));
  };

  const fetchDictionaries = async () => {
    const dictionaries = await authAxios.get(
      `${process.env.REACT_APP_BASE_URL}/dictionaries`
    );
    setDictionaries(dictionaries.data);
  };

  useEffect(() => {
    fetchDictionaries();
    const user: any = localStorage.getItem("currentUser");
    setCurrentUser(JSON.parse(user));

    setTimeout(() => {}, 1000);

    const data: any = localStorage.getItem("globalUserPaymentAndSubData");

    setTimeout(() => {}, 1000);

    const parsedData = JSON.parse(data);
    console.log("parsedData", parsedData);

    setGlobalUserPaymentAndSubData(parsedData);
  }, []);

  console.log("globalUserPaymentAndSubData", globalUserPaymentAndSubData);

  const getLogo = (search: any) => {
    const url = search?.content?.url
      ? search?.content?.url
      : search?.content?.content_link;
    if (!url) {
      return "";
    }
    const matchingValue = Object.keys(LOGO_CONTENT_SOURCE_MAP).filter((e) =>
      url.match(e)
    );
    if (matchingValue && matchingValue.length > 0) {
      const result = (LOGO_CONTENT_SOURCE_MAP as { [key: string]: any })[
        matchingValue[0]
      ];
      return result;
    } else {
      return "";
    }
  };

  const handleDictonary = async (dictionaryId: string) => {
    try {
      const result = await authAxios.post(
        `${process.env.REACT_APP_BASE_URL}/user/dictionary/${dictionaryId}`
      );
      alertContext.setSuccessAlert("Default dictionary changed");
      await fetchProfile();
      const tempDictionaries = dictionaries;
      setDictionaries([]);
      setTimeout(() => {
        const user: any = localStorage.getItem("currentUser");
        setCurrentUser(JSON.parse(user));
        fetchDictionaries();
      }, 100);
    } catch (err) {
      const { response } = err;
      alertContext.setErrorAlert(response.data.message);
    }
  };

  const PaymentTypesPropsData = {
    deletePaymentInfo: async (payId: any, companyId: any) => {
      await authAxios
        .delete(
          `https://capi-test.beebl.io/company/${companyId}/payment-info/${payId}`
        )
        .then((res) => {
          alertContext.setSuccessAlert("Successfully Removed PaymentInfo!");
        })
        .catch((err) => {
          alertContext.setErrorAlert("Error in Remove payment method!");
          console.log("error", err);
        });
    },

    addPaymentInfo: async (companyId: any) => {
      const substring = cardDetails.card_expiration_date.split("/");
      let paymentDetails = {
        cardCvc: cardDetails.card_cvc,
        cardExpirationMonth: substring[0],
        cardExpirationYear: substring[1],
        cardNumber: cardDetails.card_number,
        nickname: cardDetails.card_username,
      };

      await authAxios
        .post(
          `https://capi-test.beebl.io/company/${companyId}/add-payment-info`,
          paymentDetails
        )
        .then((res) => {
          alertContext.setSuccessAlert("Successfully Removed PaymentInfo!");
        })
        .catch((err) => {
          alertContext.setErrorAlert("Error in Remove payment method!");
          console.log("error", err);
        });
    },

    globalUserPaymentAndSubData,
    modal,
    setModal,
    cardDetails,
    setCardDetails,
    isAdded,
    setIsAdded,
    paymentInfos,
    handleCardInfo,
  };

  return (
    <div>
      <div className="row bg-white py-5 newbox m-25">
        <div className="brands pb-0">
          <div className="container-fluid">
            <div className={classes.root}>
              <AppBar position="static">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                  variant="fullWidth"
                  scrollButtons="auto"
                  indicatorColor="primary"
                  className="setting-dashboard-tabs"
                   
                >
                  <Tab label="General" {...a11yProps(0)} />
                  <Tab label="Subscription" {...a11yProps(1)} />
                  <Tab label="Payment" {...a11yProps(2)} />
                  <Tab label="Activity Log" {...a11yProps(3)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                Item One
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="row">
                  <div className="col-12">
                    {/* <h4 className="text-blue font-24 text-center payment-method-heading pt-2 pb-2">
                      Change Subscription
                    </h4> */}
                    <Subscription
                      paymentInfos={null}
                      isAdded={null}
                      setIsAdded={null}
                      changeSub={true}
                      selectedSub={selectedSub}
                      setSelectedSub={setSelectedSub}
                      cardDetails={null}
                      setCardDetails={null}
                      handleCardInfo={null}
                      modal={null}
                      setModal={null}
                      globalUserPaymentAndSubData={globalUserPaymentAndSubData}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <div  >
                  <div className="col-12">
                    {/* <h4 className="text-blue font-24 text-center payment-method-heading pt-2 pb-2">
                      Payment Methods
                    </h4> */}
                    <PaymentTypes
                      PaymentTypesPropsData={PaymentTypesPropsData}
                    />
                    {/* <PaymentMethods /> */}
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={value} index={3}>
                Item Four
              </TabPanel>
            </div>
            {/* <div className="row">
              <div className="col">
                <h4 className="text-blue font-24 text-center pt-2 pb-2">
                  Recommended Dictionaries
                </h4>
                <p className="font-weight-bold text-center">
                  Hover over a dictionary to set it as the default. Scroll left
                  or right to view more options.
                </p>
                <div className="brands_slider_container d-flex align-items-center">
                  {dictionaries.length === 0 && (
                    <div className="d-flex justify-content-center align-items-center">
                      <img className="mx-auto text-center" src={Spinner} />
                    </div>
                  )}
                  {dictionaries.length > 0 && (
                    <OwlCarousel className="owl-theme" {...owlState.options}>
                      {dictionaries.map((dic: any, index: number) => {
                        return (
                          <div
                            className={
                              "cursor-pointer d-flex flex-column recommendeDictionary " +
                              (currentUser?.dictionary &&
                              dic.id === currentUser?.dictionary?.id
                                ? "activeDic"
                                : "")
                            }
                            key={index}
                          >
                            <div
                              className="d-flex justify-content-sm-center"
                              key={index}
                            >
                              <div>
                                <div className="brands_item d-flex flex-column justify-content-center py-2">
                                  <div className="selected">
                                    <img
                                      src={dic.imageUrl}
                                      alt={dic.name}
                                      width="200px"
                                      height="100px"
                                      style={{ objectFit: "contain" }}
                                    />
                                  </div>
                                  {currentUser?.dictionary &&
                                    dic.id === currentUser?.dictionary.id && (
                                      <p className="mb-0 text-center text-primary font-weight-bold">
                                        <small>Current Default</small>
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                            {currentUser?.dictionary &&
                              dic.id !== currentUser?.dictionary.id &&
                              dic.name !== "WORDNIK" &&
                              dic.name !== "COLLINS" && (
                                <button
                                  className="btn btn-link text-primary defaultButton"
                                  onClick={() => {
                                    handleDictonary(dic.id);
                                    Event(
                                      "Settings",
                                      "Clicked on Dictionary ",
                                      "Clicked on Dictionary:" + dic.id
                                    );
                                  }}
                                >
                                  Set as default
                                </button>
                              )}
                            {(dic.name === "WORDNIK" ||
                              dic.name === "COLLINS") && (
                              <span className="btn text-info defaultButton">
                                Will be available Soon...
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </OwlCarousel>
                  )} */}
            {/* <div className="brands_nav brands_prev"><i className="fa fa-chevron-left"></i></div> */}
            {/* <div className="brands_nav brands_next"><i className="fa fa-chevron-right"></i></div> */}
            {/* </div>
              </div>
            </div>

            <hr className="mt-5 mb-5"></hr>
            <div className="row">
              <div className="col-12">
                <h4 className="text-blue font-24 text-center payment-method-heading pt-2 pb-2">
                  Payment Methods
                </h4>
                <PaymentMethods />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h4 className="text-blue font-24 text-center payment-method-heading pt-2 pb-2">
                  Change Subscription
                </h4>
                <Subscription
                  paymentInfos={null}
                  isAdded={null}
                  setIsAdded={null}
                  changeSub={null}
                  selectedSub={null}
                  setSelectedSub={null}
                  cardDetails={null}
                  setCardDetails={null}
                  handleCardInfo={null}
                  modal={null}
                  setModal={null}
                />
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
