import React, { useState, FC } from "react";
import InputMask from "react-input-mask";
import { handleInputChange } from "react-select/src/utils";

interface ItProps {
  cardDetails: any;
  setCardDetails: any;
  handleCardInfo: any;
  setModal: any;
  modal: any;
  isAdded: any;
  setIsAdded: any;
  addPaymentInfo: any;
  companyId: any;
}

const PaymentMethodForm: FC<ItProps> = ({
  cardDetails,
  setCardDetails,
  handleCardInfo,
  setModal,
  modal,
  isAdded,
  setIsAdded,
  addPaymentInfo,
  companyId,
}) => {
  console.log("cardDetails", cardDetails);

  const [showError, setShowError] = useState(false);

  const validateCardInfo = () => {
    if (
      !cardDetails.card_username ||
      !cardDetails.card_number ||
      !cardDetails.card_expiration_date ||
      !cardDetails.card_cvc
    )
      return setShowError(true);
    setModal(false);
    companyId ? addPaymentInfo(companyId) : setIsAdded(true);
  };

  return (
    <>
      <div className="container-fluid p-4 ">
        <form className="payment-form">
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Enter User Name"
              name="card_username"
              onChange={handleCardInfo}
            />
          </div>
          <div className="form-group">
            <InputMask
              mask="9999-9999-9999-9999"
              name="card_number"
              type="text"
              onChange={handleCardInfo}
            >
              {(inputProps: any) => (
                <input
                  {...inputProps}
                  className="form-control"
                  placeholder="Enter Card Number"
                />
              )}
            </InputMask>
          </div>
          <div className="form-group row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <InputMask
                mask="99/9999"
                name="card_expiration_date"
                type="text"
                onChange={handleCardInfo}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    className="form-control"
                    placeholder="Enter Card Expiration"
                  />
                )}
              </InputMask>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <InputMask
                mask="999"
                name="card_cvc"
                type="text"
                onChange={handleCardInfo}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    className="form-control"
                    placeholder="Enter Card CVC"
                  />
                )}
              </InputMask>
            </div>
          </div>
          <p style={{ display: showError ? "block" : "none" }}>
            Please fill all Information
          </p>
          <button
            type={companyId ? "button" : "submit"}
            onClick={validateCardInfo}
            className="btn btn-primary"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
