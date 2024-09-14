import React from "react";

interface IBankSavingsProps {
  savings: string;
  savingsUrl: string;
}

class BankSavingsComponent extends React.Component<IBankSavingsProps> {
  render() {
    return (
      <div className="w-32 px-2 flex items-center">
        <a
          target="_blank"
          href={this.props.savingsUrl}
          className="underline-offset-4 hover:underline"
        >
          {this.props.savings || "-"}
        </a>
      </div>
    );
  }
}

export default BankSavingsComponent;
