import React from "react";
import PaymentCard from "../PaymentCard";

const PaymentMethods = () => {
  const dummyArray = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="row">
        {dummyArray.map((i) => (
          <div className="col-sm-12 col-md-4 col-lg-4">
            <PaymentCard
              cardDetails={null}
              title={"Credit Card"}
              deleteIcon={true}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentMethods;
