import React from "react";

interface IBankSavingsProps {
  old: string;
  today: string;
  savingsUrl: string;
}

class BankSavingsComponent extends React.Component<IBankSavingsProps> {
  render() {
    let statusTpl = <></>;
    const { today, old } = this.props;
    if (today && old && Number(today) !== Number(old)) {
      statusTpl =
        Number(today) > Number(old) ? (
          <>
            <span className="rate-up">↑</span>
            <del className="rate-up">{old}</del>
          </>
        ) : (
          <>
            <span className="rate-down">↓</span>
            <del className="rate-down">{old}</del>
          </>
        );
    }
    return (
      <div className="savings-wrapper">
        <a
          target="_blank"
          href={this.props.savingsUrl}
          className="savings-link"
        >
          {this.props.today || "-"}
        </a>
        {statusTpl}
      </div>
    );
  }
}

export default BankSavingsComponent;
