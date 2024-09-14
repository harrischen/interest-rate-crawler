import React from "react";
import { IInterestResp } from "@/type";

interface IBankDepositProps {
  deposit: IInterestResp[];
}

class BankDepositComponent extends React.Component<IBankDepositProps> {
  render() {
    return (
      <>
        {this.props.deposit.map((deposit, idx) => (
          <ol className="flex items-center" key={idx}>
            <li className="w-40 px-2">
              <span className="text-xs text-gray-400">
                {deposit.title || "-"}
              </span>
            </li>
            {Object.keys(deposit.rates).map((period) => (
              <li key={period} className="flex-1 px-2">
                {deposit.rates[period] || "-"}
              </li>
            ))}
          </ol>
        ))}
      </>
    );
  }
}

export default BankDepositComponent;
