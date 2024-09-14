import React from "react";
import { IInterestResp } from "@/type";

interface IBankMinDepositAmtProps {
  deposit: IInterestResp[];
}

class BankMinDepositAmtComponent extends React.Component<IBankMinDepositAmtProps> {
  render() {
    return (
      <>
        {this.props.deposit.map((deposit, idx) => (
          <div key={idx}>{deposit.min || "-"}</div>
        ))}
      </>
    );
  }
}

export default BankMinDepositAmtComponent;
