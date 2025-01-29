import React, { ReactElement } from "react";
import { IInterestResp } from "@/type";

interface IBankDepositProps {
  old: IInterestResp[];
  today: IInterestResp[];
  depositUrl: string;
}

function compareArrays(today: string[][], old: string[][]) {
  const rows = today.length;
  const cols = today[0].length;

  const result: ReactElement[][] = [];

  for (let i = 0; i < rows; i++) {
    const row: ReactElement[] = [];
    for (let j = 0; j < cols; j++) {
      if (Number(today[i][j]) > Number(old[i][j])) {
        row.push(
          <span className="rate-item">
            {today[i][j] || "-"}
            <span className="rate-up">↑</span>
            <del className="rate-up">{old[i][j]}</del>
          </span>
        );
      } else if (Number(today[i][j]) < Number(old[i][j])) {
        row.push(
          <span className="rate-item">
            {today[i][j] || "-"}
            <span className="rate-down">↓</span>
            <del className="rate-down">{old[i][j]}</del>
          </span>
        );
      } else {
        row.push(<span className="rate-item">{today[i][j] || "-"}</span>);
      }
    }
    result.push(row);
  }

  return result;
}

class BankDepositComponent extends React.Component<IBankDepositProps> {
  render() {
    const { today, old, depositUrl } = this.props;
    const todayDeposit = today.map((i) => {
      return Object.keys(i.rates).map((p) => i.rates[p]);
    });
    const oldDeposit = old.map((i) => {
      return Object.keys(i.rates).map((p) => i.rates[p]);
    });
    const depositList = compareArrays(todayDeposit, oldDeposit);

    return (
      <div className="deposit-container">
        {today.map((today, idx) => (
          <div className="deposit-list" key={idx}>
            <div className="deposit-title">
              <a
                target="_blank"
                href={depositUrl}
                className="deposit-link"
              >
                {today.title || "-"}
              </a>
            </div>
            {depositList[idx].map((rate, subIdx) => (
              <div key={subIdx} className="deposit-rate">
                {rate}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default BankDepositComponent;
