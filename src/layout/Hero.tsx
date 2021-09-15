import React, { forwardRef, FC, useEffect } from "react";
import Background from "../assets/images/bg/08.png";
import Filter from "../components/Filter";
import { useRouteMatch } from "react-router-dom";
import Auth from "../components/Auth/Auth";

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

const Hero: FC<IProps> = ({
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
  const authRoutematch = useRouteMatch("/auth");
  const homeRoutematch = useRouteMatch("/");

  return (
    <div>
      <div
        className="fullscreen-banner p-0 banner o-hidden grediant-overlay"
        data-overlay="10"
      >
        <div className="d-none d-md-block">
          <img
            className="img-fluid"
            style={{ minHeight: "1350px" }}
            src={Background}
            alt="heroBackground"
          />
        </div>
        {homeRoutematch?.isExact && <Filter />}
        {authRoutematch?.isExact && (
          <Auth
            subGlobalInfo={subGlobalInfo}
            setSubGlobalInfo={setSubGlobalInfo}
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default Hero;
