import React, { useState, FC } from "react";
import MainNavbar from "../layout/Navbar";
import Hero from "../layout/Hero";
import Intro from "../layout/Intro";
import CuratedContentsList from "../components/CuratedContentsList";
import StatAndWork from "../layout/StatAndWork";
import { FilterContextProvider } from "../context/filter/FilterContextProvider";
import FilteredResults from "../components/FilteredResults";
import { authAxios } from "../api/authApi";

interface ItProps {
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

const LandingPage: FC<ItProps> = ({
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
  // const [currentUser, setCurrentUser] = useState({ dictionary: { id: '' } });

  // const fetchProfile = async () => {
  //     const userResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/me`);
  //     localStorage.setItem('currentUser', JSON.stringify(userResult.data));
  // }

  const substring = cardDetails.card_expiration_date.split("/");

  console.log("isAdded", isAdded);

  if (isAdded) {
    paymentInfos = [
      {
        cardCvc: cardDetails.card_cvc,
        cardExpirationMonth: substring[0],
        cardExpirationYear: substring[1],
        cardNumber: cardDetails.card_number,
        nickname: cardDetails.card_username,
      },
    ];
  } else {
    paymentInfos = [
      {
        cardCvc: "",
        cardExpirationMonth: "",
        cardExpirationYear: "",
        cardNumber: "",
        nickname: "",
      },
    ];
  }

  return (
    <div className="landingPage">
      <MainNavbar />
      <FilterContextProvider>
        <Hero
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
        <FilteredResults />
        <CuratedContentsList
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
        <Intro />
        <StatAndWork />
      </FilterContextProvider>
    </div>
  );
};

export default LandingPage;
