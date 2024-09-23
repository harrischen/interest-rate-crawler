"use client"; // This is a client component 👈🏽

import "./page.css";
import React, { useMemo } from "react";
import BankNameComponent from "@/components/bankName";
import MenuRatesComponent from "@/components/menuRates";
import BankSavingsComponent from "@/components/bankSavings";
import BankDepositComponent from "@/components/bankDeposit";
import { useFetchCurrentRates } from "@/hooks/useFetchRates";
import BankMinDepositAmtComponent from "@/components/bankMinAmt";
import { formatGroupName, formatRateHandler } from "@/business/rate-format";
import dayjs from "dayjs";

export default function BankRatesPage() {
  const { currentRates, oldRates, loading, error } = useFetchCurrentRates();

  const todayData = useMemo(() => {
    return currentRates.list ? formatRateHandler(currentRates.list) : null;
  }, [currentRates]);

  const updateTime = useMemo(() => {
    const tpl = "YYYY-MM-DD HH:mm:ss";
    return currentRates?.start
      ? dayjs(parseInt(currentRates.start, 10)).format(tpl)
      : "";
  }, [currentRates]);

  const oldData = useMemo(() => {
    return oldRates.list ? formatRateHandler(oldRates.list) : null;
  }, [oldRates]);

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

  if (error || !todayData || !oldData) {
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
    <div className="page-layout">
      <div className="w-full sticky top-0 left-0 right-0 bg-slate-400">
        <div className="max-w-7xl m-auto flex py-4 cursor-pointer">
          <div className="w-20 px-2 group-title"></div>
          <div className="flex-1 flex">
            <div className="w-36 px-2">Bank Name</div>
            <div className="w-36 px-2">Savings</div>
            <MenuRatesComponent
              rates={todayData.HKD.virtualBank[0].deposit[0].rates}
            />
          </div>
          <div className="w-20 px-2 text-right">Min Amt</div>
        </div>
      </div>

      <div className="w-full max-w-7xl m-auto text-sm leading-loose page-body">
        {Object.keys(todayData).map((currency) => (
          <div className="py-4" key={currency}>
            {/* 货币信息 */}
            <div className="text-4xl font-bold text-center">{currency}</div>
            <p className="text-xs pb-4 text-center">{updateTime}</p>

            {Object.keys(todayData[currency]).map((groupName) => (
              // 按银行类型进行分数归组，比如传统银行、虚拟银行
              <div
                key={groupName}
                className="flex py-2 bank-group border-b last:border-b-0"
              >
                {/* 银行类型 */}
                <div className="w-20 px-2 flex items-center group-title">
                  {formatGroupName(groupName)}
                </div>

                <div className="flex-1">
                  {todayData[currency][groupName].map((bank, idx) => (
                    // 每一家银行的详细信息
                    <div key={bank.bankName} className="flex bank-row">
                      <BankNameComponent
                        url={bank.url}
                        bankName={bank.bankName}
                      />

                      <BankSavingsComponent
                        today={bank.savings}
                        savingsUrl={bank.savingsUrl}
                        old={oldData[currency][groupName][idx].savings}
                      />

                      <div className="flex-1">
                        <BankDepositComponent
                          today={bank.deposit}
                          old={oldData[currency][groupName][idx].deposit}
                          depositUrl={bank.depositUrl}
                        />
                      </div>

                      <div className="w-20 px-2 text-right">
                        <BankMinDepositAmtComponent deposit={bank.deposit} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
