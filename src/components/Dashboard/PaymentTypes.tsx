import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
  FC,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PaymentMethodForm from "../PaymentMethodForm";

interface IProps {
  PaymentTypesPropsData: any;
}

export const PaymentTypes: FC<IProps> = ({ PaymentTypesPropsData }) => {
  const {
    deletePaymentInfo,
    globalUserPaymentAndSubData,
    modal,
    setModal,
    cardDetails,
    setCardDetails,
    isAdded,
    setIsAdded,
    paymentInfos,
    handleCardInfo,
    addPaymentInfo,
  } = PaymentTypesPropsData;

  console.log(
    "globalUserPaymentAndSubData in PaymentTypes",
    globalUserPaymentAndSubData
  );

  const methods =
    globalUserPaymentAndSubData.data.roles[0].company.paymentInfos;
  const companyId = globalUserPaymentAndSubData.data.roles[0].company.id;

  return (
    <div style={{ padding: "10px" }}>
      {methods.map((method: any) => (
        <>
          <div className="d-flex justify-content-between payment-method-in-settings">
            <div>
              <img src={"/paypal.png"} /> {method.cardBrand}
            </div>
            <div>
              {" "}
              <button
                onClick={() => deletePaymentInfo(companyId, null)}
                className="btn"
                style={{ color: "blue" }}
              >
                {" "}
                <FontAwesomeIcon color="blue" icon={faTrashAlt} /> Remove
              </button>
            </div>
          </div>
        </>
      ))}

      {/* <div className="d-flex justify-content-between payment-method-in-settings">
        <div>
          <img src={"/mastercard.png"} /> Master Card
        </div>
        <button className="btn" style={{ color: "blue" }}>
          {" "}
          <FontAwesomeIcon color="blue" icon={faTrashAlt} /> Remove
        </button>
      </div>
      <div className="d-flex justify-content-between payment-method-in-settings">
        <div>
          <img src={"/american-express.png"} /> American Express
        </div>
        <button className="btn" style={{ color: "blue" }}>
          {" "}
          <FontAwesomeIcon color="blue" icon={faTrashAlt} /> Remove
        </button>
      </div>
      <div className="d-flex justify-content-between payment-method-in-settings">
        <div>
          {" "}
          <img src={"/stripe.png"} /> Stripe{" "}
        </div>
        <button className="btn" style={{ color: "blue" }}>
          {" "}
          <FontAwesomeIcon color="blue" icon={faTrashAlt} /> Remove
        </button>
      </div> */}

      <div className="text-center">
        <button
          onClick={() => setModal(true)}
          className="btn add-new-payment-btn"
        >
          Add New Payment Method +
        </button>
      </div>

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
            addPaymentInfo={addPaymentInfo}
            companyId={companyId}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};
