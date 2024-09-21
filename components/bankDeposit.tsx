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
          <>
            {today[i][j] || "-"}
            <span className="pl-2 text-xs text-red-500">↑</span>
            <del className="text-xs text-red-500">{old[i][j]}</del>
          </>
        );
      } else if (Number(today[i][j]) < Number(old[i][j])) {
        row.push(
          <>
            {today[i][j] || "-"}
            <span className="pl-2 text-xs text-green-500">↓</span>
            <del className="text-xs text-green-500">{old[i][j]}</del>
          </>
        );
      } else {
        row.push(<>{today[i][j] || "-"}</>);
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
      <>
        {today.map((today, idx) => (
          <ol className="flex items-center" key={idx}>
            <li className="w-44 px-2">
              <a
                target="_blank"
                href={depositUrl}
                className="text-xs text-gray-400 underline-offset-4 hover:underline"
              >
                {today.title || "-"}
              </a>
            </li>
            {depositList[idx].map((rate, subIdx) => (
              <li key={subIdx} className="flex-1 px-2">
                {rate}
              </li>
            ))}
          </ol>
        ))}
      </>
    );
  }
}

export default BankDepositComponent;
