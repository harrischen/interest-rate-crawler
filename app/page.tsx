"use client"; // This is a client component 👈🏽

import React, { useMemo } from "react";
import useFetchRates from "@/hooks/useFetchRates";
import { formatGroupName, formatRateHandler } from "@/business/rate-format";

export default function BankRatesPage() {
  const { data, loading, error } = useFetchRates();

  const formattedData = useMemo(() => {
    return data && data.list ? formatRateHandler(data.list) : null;
  }, [data]);
  console.log(formattedData);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce" />
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]" />
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (error || !formattedData) {
    return (
      <main className="flex min-h-screen justify-center items-center px-6 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            No data available.
          </h1>
          {error ? <p className="mt-6 text-base leading-7">{error}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="w-full sticky top-0 left-0 right-0">
        <div className="max-w-7xl m-auto flex ">
          <div className="w-40">銀行分類</div>
          <div className="flex-1 flex">
            <div className="w-40">銀行名稱</div>
            <div className="w-40">活期利率</div>
            {Object.keys(formattedData.HKD.virtualBank[0].deposit[0].rates).map(
              (i) => (
                <div key={i} className="flex-1">{i}</div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl m-auto">
        {Object.keys(formattedData).map((currency) => (
          // 按货币进行分类归组
          <div className="pb-20" key={currency}>
            {/* 货币信息 */}
            <div className="text-4xl font-bold pb-10 text-center">
              {currency}
            </div>

            {Object.keys(formattedData[currency]).map((groupName) => (
              // 按银行类型进行分数归组，比如传统银行、虚拟银行
              <div key={groupName} className="flex border-b last:border-b-0">
                {/* 银行类型 */}
                <div className="w-40">{formatGroupName(groupName)}</div>

                <ul className="flex-1">
                  {formattedData[currency][groupName].map((bank) => (
                    // 每一家银行的详细信息
                    <li
                      key={bank.bankName}
                      className="flex hover:bg-slate-200 dark:hover:bg-zinc-700"
                    >
                      <h3 className="w-40">{bank.bankName}</h3>
                      <div className="w-40">{bank.savings || "-"}</div>
                      {/* 每一家银行的定期利率信息(单个币种可能有多种定存利率信息) */}
                      <div className="flex-1">
                        {bank.deposit.map((deposit, idx) => (
                          <ul className="flex" key={idx}>
                            {Object.keys(deposit.rates).map((period) => (
                              <li className="flex-1" key={period}>
                                {deposit.rates[period] || "-"}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
