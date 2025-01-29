"use client"; // This is a client component 👈🏽

import "./page.css";
import dayjs from "dayjs";
import React, { useMemo, useState, useEffect } from "react";
import BankNameComponent from "@/components/bankName";
import BankSavingsComponent from "@/components/bankSavings";
import { useFetchCurrentRates } from "@/hooks/useFetchRates";
import { formatGroupName, formatRateHandler } from "@/business/rate-format";

// 在组件顶部获取期限列表
const getPeriods = (
  data: Record<
    string,
    {
      virtualBank?: Array<{ deposit?: Array<{ rates?: Record<string, any> }> }>;
    }
  >
) => {
  // 从第一个银行的第一个存款产品中获取所有可能的期限
  const firstBank = Object.values(data)[0]?.virtualBank?.[0];
  if (firstBank?.deposit?.[0]?.rates) {
    return Object.keys(firstBank.deposit[0].rates);
  }
  return [];
};

export default function BankRatesPage() {
  const { currentRates, oldRates, loading, error } = useFetchCurrentRates();
  const [activeTab, setActiveTab] = useState<string>('');

  const todayData = useMemo(() => {
    return currentRates.list ? formatRateHandler(currentRates.list) : null;
  }, [currentRates]);

  useEffect(() => {
    if (todayData && Object.keys(todayData).length > 0) {
      setActiveTab(Object.keys(todayData)[0]);
    }
  }, [todayData]);

  const periods = useMemo(() => {
    return todayData ? getPeriods(todayData) : [];
  }, [todayData]);

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
      <div className="loading-container">
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>
    );
  }

  if (error || !todayData || !oldData) {
    return (
      <main className="page-layout">
        <div className="error-container">
          <h1>No data available.</h1>
          {error && <p>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <div className="page-layout">
      <div className="currency-section">
        <div className="currency-tabs">
          <div className="tabs-wrapper">
            {Object.keys(todayData || {}).map((currency) => (
              <button
                key={currency}
                className={`currency-tab ${activeTab === currency ? 'active' : ''}`}
                onClick={() => setActiveTab(currency)}
              >
                {currency}
              </button>
            ))}
          </div>
          <p className="update-time">{updateTime}</p>
        </div>

        {activeTab && todayData && (
          <div className="currency-container">
            <div className="table-container">
              <div className="header-sticky">
                <table className="bank-table">
                  <thead>
                    <tr>
                      <th className="bank-column">銀行名稱</th>
                      <th className="savings-column">活期存款</th>
                      <th className="deposit-title">定期存款</th>
                      {periods.map((period) => (
                        <th key={period} className="rate-column">
                          {period}
                        </th>
                      ))}
                      <th className="amount-column">起存金額</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="table-wrapper">
                <table className="bank-table">
                  <tbody>
                    {Object.keys(todayData[activeTab]).map((groupName) => (
                      <React.Fragment key={groupName}>
                        <tr className="bank-group-header">
                          <td colSpan={periods.length + 4}>
                            {formatGroupName(groupName)}
                          </td>
                        </tr>
                        {todayData[activeTab][groupName].map((bank, idx) => {
                          const depositCount = bank.deposit.length;
                          return bank.deposit.map((depositItem, depositIdx) => (
                            <tr
                              key={`${bank.bankName}-${depositIdx}`}
                              className="bank-row"
                            >
                              {depositIdx === 0 && (
                                <td
                                  className="bank-column"
                                  rowSpan={depositCount}
                                >
                                  <BankNameComponent url={bank.url} bankName={bank.bankName} />
                                </td>
                              )}
                              {depositIdx === 0 && (
                                <td
                                  className="savings-column"
                                  rowSpan={depositCount}
                                >
                                  <BankSavingsComponent
                                    today={bank.savings}
                                    savingsUrl={bank.savingsUrl}
                                    old={
                                      oldData[activeTab][groupName][idx].savings
                                    }
                                  />
                                </td>
                              )}
                              <td className="deposit-title">
                                {depositItem.title || "-"}
                              </td>
                              {periods.map((period) => (
                                <td key={period} className="rate-column">
                                  {depositItem.rates[period] || "-"}
                                </td>
                              ))}
                              <td className="amount-column">
                                {depositItem.min || "-"}
                              </td>
                            </tr>
                          ));
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
