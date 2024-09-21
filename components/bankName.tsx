import React from "react";

interface IBankNameProps {
  bankName: string;
  url: string;
}

class BankNameComponent extends React.Component<IBankNameProps> {
  render() {
    return (
      <h3 className="w-36 px-2 flex items-center">
        <a
          target="_blank"
          href={this.props.url}
          className="underline-offset-4 hover:underline"
        >
          {this.props.bankName}
        </a>
      </h3>
    );
  }
}

export default BankNameComponent;
