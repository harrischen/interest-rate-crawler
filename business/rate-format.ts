import { ITableResp, IGetRateData } from "@/type";

export function formatGroupName(group: string) {
  const map: { [key: string]: string } = {
    virtualBank: "虛擬銀行",
    firstTierBank: "一級銀行",
    otherTraditionalBank: "傳統銀行",
  };
  return map[group] || "";
}

export const formatRateHandler = (list: IGetRateData[]) => {
  if (!list.length) {
    return;
  }

  const output: ITableResp = {
    HKD: {
      virtualBank: [],
      firstTierBank: [],
      otherTraditionalBank: [],
    },
    USD: {
      virtualBank: [],
      firstTierBank: [],
      otherTraditionalBank: [],
    },
    CNY: {
      virtualBank: [],
      firstTierBank: [],
      otherTraditionalBank: [],
    },
  };

  list.forEach((i) => {
    if (i.group === "VirtualBank") {
      output.HKD.virtualBank.push(group("HKD", i));
      output.CNY.virtualBank.push(group("CNY", i));
      output.USD.virtualBank.push(group("USD", i));
    }

    if (i.group === "1stTierBank") {
      output.HKD.firstTierBank.push(group("HKD", i));
      output.CNY.firstTierBank.push(group("CNY", i));
      output.USD.firstTierBank.push(group("USD", i));
    }

    if (i.group === "OtherTraditionalBank") {
      output.HKD.otherTraditionalBank.push(group("HKD", i));
      output.CNY.otherTraditionalBank.push(group("CNY", i));
      output.USD.otherTraditionalBank.push(group("USD", i));
    }
  });

  return output;
};

function group(currency: string, detail: IGetRateData) {
  return {
    url: detail.url,
    savingsUrl: detail.savingsUrl,
    depositUrl: detail.depositUrl,
    bankName: detail.bankName,
    savings: detail.savings[currency],
    deposit: detail.deposit[currency],
  };
}
