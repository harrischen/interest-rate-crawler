import React from "react";

interface IBankNameProps {
  bankName: string;
  url: string;
}

class BankNameComponent extends React.Component<IBankNameProps> {
  render() {
    return (
      <div className="bank-name-wrapper">
        <a
          target="_blank"
          href={this.props.url}
          className="bank-name-link"
        >
          {this.props.bankName}
        </a>
      </div>
    );
  }
}

export default BankNameComponent;
