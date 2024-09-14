"use client"; // This is a client component 👈🏽

import "./page.css";
import React, { useMemo } from "react";
import useFetchRates from "@/hooks/useFetchRates";
import { formatGroupName, formatRateHandler } from "@/business/rate-format";

export default function BankRatesPage() {
  const { data, loading, error } = useFetchRates();

  const formattedData = useMemo(() => {
    return data && data.list ? formatRateHandler(data.list) : null;
  }, [data]);

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
      <div className="w-full sticky top-0 left-0 right-0 bg-slate-400">
        <div className="max-w-7xl m-auto flex py-4 cursor-pointer page-header">
          <div className="w-40 px-2 group-title">Classification</div>
          <div className="flex-1 flex">
            <div className="w-40 px-2 bank-name">Bank Name</div>
            <div className="w-40 px-2 bank-savings">Savings</div>
            {Object.keys(formattedData.HKD.virtualBank[0].deposit[0].rates).map(
              (i) => (
                <div key={i} className={`px-2 flex-1 bank-${i}`}>
                  {i}
                </div>
              )
            )}
          </div>
          <div className="w-20 px-2 text-right">Min Amt</div>
        </div>
      </div>

      <div className="w-full max-w-7xl m-auto text-sm leading-loose	page-body">
        {Object.keys(formattedData).map((currency) => (
          // 按货币进行分类归组
          <div className="py-4" key={currency}>
            {/* 货币信息 */}
            <div className="text-4xl font-bold pb-4 text-center">
              {currency}
            </div>

            {Object.keys(formattedData[currency]).map((groupName) => (
              // 按银行类型进行分数归组，比如传统银行、虚拟银行
              <div
                key={groupName}
                className="flex py-2 bank-group border-b last:border-b-0"
              >
                {/* 银行类型 */}
                <div className="w-40 px-2 flex items-center group-title">
                  {formatGroupName(groupName)}
                </div>

                <div className="flex-1">
                  {formattedData[currency][groupName].map((bank) => (
                    // 每一家银行的详细信息
                    <div key={bank.bankName} className="flex bank-row">
                      <h3 className="w-40 px-2 flex items-center bank-name">
                        <a
                          target="_blank"
                          href={bank.url}
                          className="underline-offset-4 hover:underline"
                        >
                          {bank.bankName}
                        </a>
                      </h3>
                      <div className="w-40 px-2 flex items-center bank-savings">
                        <a
                          target="_blank"
                          href={bank.savingsUrl}
                          className="underline-offset-4 hover:underline"
                        >
                          {bank.savings || "-"}
                        </a>
                      </div>
                      {/* 每一家银行的定期利率信息(单个币种可能有多种定存利率信息) */}
                      <div className="flex-1">
                        {bank.deposit.map((deposit, idx) => (
                          <ol className="flex" key={idx}>
                            {Object.keys(deposit.rates).map((period) => (
                              <li
                                key={period}
                                className={`flex-1 px-2 deposit-${period}`}
                              >
                                {deposit.rates[period] || "-"}
                              </li>
                            ))}
                          </ol>
                        ))}
                      </div>

                      <div className="w-20 px-2 text-right">
                        {bank.deposit.map((deposit, idx) => (
                          <div key={idx}>{deposit.min || "-"}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
