import React from "react";
import { IInterestResp } from "@/type";

interface IBankDepositProps {
  old: IInterestResp[];
  today: IInterestResp[];
  depositUrl: string;
}

function compareArrays(array1: string[][], array2: string[][]): string[][] {
  const rows = array1.length;
  const cols = array1[0].length;

  const result: string[][] = [];

  for (let i = 0; i < rows; i++) {
    const row: string[] = [];
    for (let j = 0; j < cols; j++) {
      if (Number(array1[i][j]) > Number(array2[i][j])) {
        row.push("↑");
      } else if (Number(array1[i][j]) < Number(array2[i][j])) {
        row.push("↓");
      } else {
        row.push("");
      }
    }
    result.push(row);
  }

  return result;
}

class BankDepositComponent extends React.Component<IBankDepositProps> {
  render() {
    const { today, old, depositUrl } = this.props;
    const todayDeposit = today.map((item) => {
      return Object.keys(item.rates).map((period) => item.rates[period]);
    });
    const oldDeposit = old.map((item) => {
      return Object.keys(item.rates).map((period) => item.rates[period]);
    });
    const status = compareArrays(todayDeposit, oldDeposit);

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
            {todayDeposit[idx].map((todayRate, subIdx) => (
              <li key={subIdx} className="flex-1 px-2">
                {todayRate || "-"}
                {todayRate && oldDeposit[idx][subIdx] && status[idx][subIdx] ? (
                  <>
                    <span className="pl-2 text-xs">{status[idx][subIdx]}</span>
                    <del className="text-xs">{oldDeposit[idx][subIdx]}</del>
                  </>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ol>
        ))}
      </>
    );
  }
}

export default BankDepositComponent;
