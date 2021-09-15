import React, { useContext, useState, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons";

interface ItProps {
  cardDetails: any;
  title: String;
  deleteIcon: Boolean;
}

const PaymentCard: FC<ItProps> = ({ cardDetails, title, deleteIcon }) => {
  return (
    <>
      <div className="justify-content-center mb-3">
        <div className="payment-card shadow">
          <div className="p-3">
            <div className=" payment-card-header mb-4">
              <h3>{title}</h3>
              <div>
                <FontAwesomeIcon icon={faPen} className="mr-3 pointer" />
                {deleteIcon ? (
                  <FontAwesomeIcon icon={faTrashAlt} className="pointer" />
                ) : null}
              </div>
            </div>
            <div className=" payment-card-body mb-2">
              <p className="mb-0">Card Number</p>
              <h3>
                {cardDetails?.card_number
                  ? cardDetails?.card_number
                  : "4000 1234 5678 9010"}
              </h3>
            </div>
            <div className=" payment-card-body ">
              <p className="mb-0">Expiration</p>
              <h6>
                {" "}
                {cardDetails?.card_expiration_date
                  ? cardDetails?.card_expiration_date
                  : "23/2024"}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCard;
