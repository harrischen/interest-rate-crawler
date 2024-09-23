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
            <span className="pl-2 text-xs text-red-500">↑</span>
            <del className="text-xs text-red-500">{old}</del>
          </>
        ) : (
          <>
            <span className="pl-2 text-xs text-green-500">↓</span>
            <del className="text-xs text-green-500">{old}</del>
          </>
        );
    }
    return (
      <div className="w-36 px-2 flex items-center">
        <a
          target="_blank"
          href={this.props.savingsUrl}
          className="underline-offset-4 hover:underline"
        >
          {this.props.today || "-"}
        </a>
        {statusTpl}
      </div>
    );
  }
}

export default BankSavingsComponent;
