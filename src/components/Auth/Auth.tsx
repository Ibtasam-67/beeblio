import React, { useState, useEffect, useContext, useRef, FC } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import ResetPassword from "./ResetPassword";
import { FilterContext } from "../../context/filter/FilterContextProvider";
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
  subGlobalInfo: any;
  setSubGlobalInfo: any;
  activeTab: any;
  setActiveTab: any;
}

const Auth: FC<IProps> = ({
  selectedSub,
  setSelectedSub,
  cardDetails,
  setCardDetails,
  handleCardInfo,
  modal,
  setModal,
  paymentInfos,
  isAdded,
  setIsAdded,
  subGlobalInfo,
  setSubGlobalInfo,
  activeTab,
  setActiveTab,
}) => {
  // const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
    localStorage.setItem("authState", tab);
  };

  const [resetPassword, setResetPassword] = useState(false);
  const context = useContext(FilterContext);
  // const ref = useRef(null);
  window.scrollTo(0, -100);

  useEffect(() => {
    // context.clearResults();
    if (localStorage.getItem("authState")) {
      toggle(localStorage.getItem("authState"));
    }
  }, []);

  return (
    <div className="align-center" style={{ marginTop: "100px" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-11 midcol">
            <div className="container register text-center box-shadow px-5 py-4 xs-px-2 xs-py-2">
              <div className="row">
                {!resetPassword && (
                  <div className="col-md-7">
                    <Nav tabs className="d-flex">
                      <NavItem className="flex-1">
                        <NavLink
                          className={classnames(
                            { active: activeTab === "1" },
                            "cursor-pointer"
                          )}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          Login
                        </NavLink>
                      </NavItem>
                      <NavItem className="flex-1">
                        <NavLink
                          className={classnames(
                            { active: activeTab === "2" },
                            "cursor-pointer"
                          )}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          Signup
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="2">
                        <div
                          className="tab-pane fade show active"
                          id="home"
                          role="tabpanel"
                          aria-labelledby="home-tab"
                        >
                          <SignUp
                            selectedSub={selectedSub}
                            setSelectedSub={setSelectedSub}
                            cardDetails={cardDetails}
                            setCardDetails={setCardDetails}
                            handleCardInfo={handleCardInfo}
                            modal={modal}
                            setModal={setModal}
                            isAdded={isAdded}
                            paymentInfos={paymentInfos}
                            setIsAdded={setIsAdded}
                          />
                        </div>
                      </TabPane>
                      <TabPane tabId="1">
                        <div
                          className="tab-pane fade show"
                          id="profile"
                          role="tabpanel"
                          aria-labelledby="profile-tab"
                        >
                          <SignIn
                            toggleResetPassword={() => {
                              setResetPassword(true);
                            }}
                            subGlobalInfo={subGlobalInfo}
                            setSubGlobalInfo={setSubGlobalInfo}
                          />
                        </div>
                      </TabPane>
                    </TabContent>
                  </div>
                )}
                {resetPassword && <ResetPassword />}
                <div className="col-md-5 register-left"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
