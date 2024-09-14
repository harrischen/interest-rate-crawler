import React from "react";
import { IInterestResp } from "@/type";

interface IBankDepositProps {
  deposit: IInterestResp[];
  depositUrl: string;
}

class BankDepositComponent extends React.Component<IBankDepositProps> {
  render() {
    return (
      <>
        {this.props.deposit.map((deposit, idx) => (
          <ol className="flex items-center" key={idx}>
            <li className="w-44 px-2">
              <a
                target="_blank"
                href={this.props.depositUrl}
                className="text-xs text-gray-400 underline-offset-4 hover:underline"
              >
                {deposit.title || "-"}
              </a>
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
