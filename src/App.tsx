import React, { useEffect, useState } from "react";
import "./App.scss";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";
import ChangePassword from "./components/Auth/ChangePassword";
import { AlertContextProvider } from "./context/alert/AlertContextProvider";
import AlertComponent from "./components/Alert/AlertComponent";
import DictionaryMeaning from "./components/DictionaryMeaning";
import DictionaryThesaurus from "./components/DictionaryThesaurus";
import PrivateRoute from "./components/Auth/PrivateRoute";
import TwitterRedirect from "./components/Auth/TwitterRedirect";
import { PageView, initGA } from "./components/Tracking";
import { FbPageView, initFBP } from "./components/FacebookPixel";

function App() {
  const [activeTab, setActiveTab] = useState("1");
  const [isAdded, setIsAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState("BEEBLIO_FREE");
  const [cardDetails, setCardDetails] = useState({
    card_username: "",
    card_number: "",
    card_expiration_date: "",
    card_cvc: "",
  });
  let paymentInfos;

  const handleCardInfo = (e: any) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const [subGlobalInfo, setSubGlobalInfo] = useState({
    initial: "iniasdoaisjdlk",
  });

  useEffect(() => {
    initGA();
    PageView();

    initFBP();
    FbPageView();
  }, []);

  return (
    <AlertContextProvider>
      <AuthContextProvider>
        <Router>
          <div className="App"></div>
          <Switch>
            <Route exact path="/">
              <LandingPage
                subGlobalInfo={subGlobalInfo}
                setSubGlobalInfo={setSubGlobalInfo}
                selectedSub={selectedSub}
                setSelectedSub={setSelectedSub}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleCardInfo={handleCardInfo}
                modal={modal}
                setModal={setModal}
                paymentInfos={paymentInfos}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Route>
            <Route path="/auth">
              <LandingPage
                subGlobalInfo={subGlobalInfo}
                setSubGlobalInfo={setSubGlobalInfo}
                selectedSub={selectedSub}
                setSelectedSub={setSelectedSub}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleCardInfo={handleCardInfo}
                modal={modal}
                setModal={setModal}
                paymentInfos={paymentInfos}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Route>
            {/* <Route path="/dashboard">
              <Dashboard />
            </Route> */}
            <PrivateRoute path="/dashboard">
              <Dashboard
                subGlobalInfo={subGlobalInfo}
                setSubGlobalInfo={setSubGlobalInfo}
                selectedSub={selectedSub}
                setSelectedSub={setSelectedSub}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleCardInfo={handleCardInfo}
                modal={modal}
                setModal={setModal}
                paymentInfos={paymentInfos}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </PrivateRoute>
            <Route path="/oauth2/redirect">
              <Dashboard
                subGlobalInfo={subGlobalInfo}
                setSubGlobalInfo={setSubGlobalInfo}
                selectedSub={selectedSub}
                setSelectedSub={setSelectedSub}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                handleCardInfo={handleCardInfo}
                modal={modal}
                setModal={setModal}
                paymentInfos={paymentInfos}
                isAdded={isAdded}
                setIsAdded={setIsAdded}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Route>
            <Route path="/oauth/callback/twitter">
              <TwitterRedirect />
            </Route>
            <Route path="/forget-password">
              <ChangePassword />
            </Route>
            <Route path="/meaning">
              <DictionaryMeaning />
            </Route>
            <Route path="/thesaurus">
              <DictionaryThesaurus />
            </Route>
          </Switch>
        </Router>
      </AuthContextProvider>
      <AlertComponent />
    </AlertContextProvider>
  );
}

export default App;
