import React from "react";

interface IBankSavingsProps {
  old: string;
  today: string;
  savingsUrl: string;
}

class BankSavingsComponent extends React.Component<IBankSavingsProps> {
  render() {
    let status = "";
    const { today, old } = this.props;
    if (today && old && Number(today) !== Number(old)) {
      status = Number(today) > Number(old) ? "↑" : "↓";
    }
    return (
      <div className="w-32 px-2 flex items-center">
        <a
          target="_blank"
          href={this.props.savingsUrl}
          className="underline-offset-4 hover:underline"
        >
          {this.props.today || "-"}
        </a>
        <span className="pl-2 text-xs">{status || ""}</span>
      </div>
    );
  }
}

export default BankSavingsComponent;
