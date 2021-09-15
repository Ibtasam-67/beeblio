import React, { useState, useEffect, useContext, FC } from "react";
import "./dashboard.scss";
import Sidebar from "../layout/Dashboard/Sidebar";
import Header from "../layout/Dashboard/Header";
import Footer from "../layout/Dashboard/Footer";
import { useRouteMatch, useLocation, Link, useHistory } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Home from "../components/Dashboard/Home";
import Profile from "../components/Dashboard/Profile";
import Collection from "../components/Dashboard/Collection";
import Search from "../components/Dashboard/Search";
import { Settings } from "../components/Dashboard/Settings";
import { Saved } from "../components/Dashboard/Saved";
import { authAxios } from "../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { AlertContext } from "../context/alert/AlertContextProvider";
import { AuthContext } from "../context/auth/AuthContextProvider";
import {
  Event,
  SetDimension,
  InitPageViewAndSetGA,
} from "../components/Tracking";
import ReactGA from "react-ga";
import Flashcard from "../components/Dashboard/Flashcard/Flashcard";
import FlashCardForm from "../components/Dashboard/Flashcard/FlashCardForm";

interface IProps {
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
  subGlobalInfo: any;
  setSubGlobalInfo: any;
  activeTab: any;
  setActiveTab: any;
}

const Dashboard: FC<IProps> = ({
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
  subGlobalInfo,
  setSubGlobalInfo,
  activeTab,
  setActiveTab,
}) => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const initialShotStae = width <= 767 ? true : false;
  const authContext = useContext(AuthContext);
  const [shortState, setShortstate] = useState(initialShotStae);
  const [proPicChanged, setProcPicChanged] = useState(false);
  const fetchProfile = async () => {
    const userResult = await authAxios.get(
      `${process.env.REACT_APP_BASE_URL}/user/me`
    );
    localStorage.setItem("currentUser", JSON.stringify(userResult.data));
    authContext.updateProfile();
  };
  const alertContext = useContext(AlertContext);
  let match = useRouteMatch();
  let { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    history.listen(() => {
      if (width <= 767) {
        setShortstate(true);
      }
    });
  }, [history, width]);

  const handleAnonUser = async (anonToken: string) => {
    await authAxios.post(
      `${process.env.REACT_APP_BASE_URL}/user/update-user-interaction`,
      {
        anonymousToken: anonToken,
        currentToken: "string",
      }
    );
  };

  console.log("pathname", pathname);

  useEffect(() => {
    console.log("useEffect called in dashboard");

    if (pathname === "/oauth2/redirect") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      console.log("token in dashboard", token);
      if (token) {
        const user: any = localStorage.getItem("currentUserToken");
        if (user && user.includes("Anonymous")) {
          const anonToken = user.split(" ")[1];
          localStorage.setItem("currentUserToken", `Bearer ${token}`);
          if (anonToken) {
            handleAnonUser(anonToken);
          }
        }

        if (token !== null) {
          localStorage.setItem("currentUserToken", `Bearer ${token}`);
          fetchProfile();
        }
      } else {
        const error: any = urlParams.get("error");
        if (error) {
          alertContext.setErrorAlert(error);
        }
        history.push("/");
      }
    }
  }, [pathname]);

  return (
    <div className="hold-transition skin-blue sidebar-mini dashboard">
      <div className="wrapper boxed-wrapper" style={{textAlign:"left"}}>
        <Header
          width={width}
          setShortstate={() => setShortstate(!shortState)}
          shortState={shortState}
        />
        <Sidebar shortState={shortState} />
        <div
          className={
            "content-wrapper " +
            (shortState ? "shortStateClass" : "longStateClass")
          }
        >
          <div className="content-header sty-one">
            <h1>Dashboard</h1>
            <ol className="breadcrumb"> 
              <li>
                <Link to="/dashboard">Home</Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faAngleRight} />
                {pathname === `${match.path}`
                  ? "Dashboard"
                  : pathname === `${match.path}/profile`
                  ? "Profile"
                  : pathname === `${match.path}/collection`
                  ? "Collection"
                  : pathname === `${match.path}/search`
                  ? "Searches"
                  : pathname === `${match.path}/saved`
                  ? "Saved"
                  : pathname.includes(`${match.path}/flashcard`)
                  ? "Flashcard"
                  : "Settings"}
              </li>
            </ol>
          </div>
          <Switch>
            <Route exact path={`${match.path}`}>
              <Home />
            </Route>
            <Route path={`${match.path}/profile`}>
              <Profile />
            </Route>
            <Route path={`${match.path}/collection`}>
              <Collection />
            </Route>
            <Route path={`${match.path}/search`}>
              <Search />
            </Route>
            <Route path={`${match.path}/saved`}>
              <Saved />
            </Route>
            <Route path={`${match.path}/flashcard`}>
              <Flashcard />
            </Route>
            <Route path={`${match.path}/settings`}>
              <Settings
                subGlobalInfo={subGlobalInfo}
                setSubGlobalInfo={setSubGlobalInfo}
                selectedSub={selectedSub}
                setSelectedSub={setSelectedSub}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleCardInfo={handleCardInfo}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                paymentInfos={paymentInfos}
              />
            </Route>
          </Switch>
        </div>
        <Footer shortState={shortState} />
      </div>
    </div>
  );
};

export default Dashboard;
