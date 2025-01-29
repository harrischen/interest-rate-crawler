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
  const [activeTab, setActiveTab] = useState<string>("");
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

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

  // 处理列hover事件
  const handleColumnHover = (columnIndex: number | null) => {
    setHoveredColumn(columnIndex);
  };

  // 获取列的类名
  const getColumnClassName = (columnIndex: number, isHeader = false) => {
    let baseClass = "";
    // 根据列索引添加对应的基础样式类
    if (columnIndex === 0) {
      baseClass = "bank-column";
    } else if (columnIndex === 1) {
      baseClass = "savings-column";
    } else if (columnIndex === 2) {
      baseClass = "deposit-title";
    } else if (columnIndex === periods.length + 3) {
      baseClass = "amount-column";
    } else {
      baseClass = "rate-column";
    }

    // 添加 hover 效果的类名
    const hoverClass = hoveredColumn === columnIndex ? "column-hover" : "";

    return `${baseClass} ${
      isHeader ? "bank-table-th" : "bank-table-td"
    } ${hoverClass}`.trim();
  };

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
                className={`currency-tab ${
                  activeTab === currency ? "active" : ""
                }`}
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
                  <colgroup>
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "16%" }} />
                    {periods.map((period) => (
                      <col
                        key={period}
                        style={{ width: `${60 / periods.length}%` }}
                      />
                    ))}
                    <col style={{ width: "6%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th
                        className={getColumnClassName(0, true)}
                        onMouseEnter={() => handleColumnHover(0)}
                        onMouseLeave={() => handleColumnHover(null)}
                      >
                        銀行名稱
                      </th>
                      <th
                        className={getColumnClassName(1, true)}
                        onMouseEnter={() => handleColumnHover(1)}
                        onMouseLeave={() => handleColumnHover(null)}
                      >
                        活期存款
                      </th>
                      <th
                        className={getColumnClassName(2, true)}
                        onMouseEnter={() => handleColumnHover(2)}
                        onMouseLeave={() => handleColumnHover(null)}
                      >
                        定期存款
                      </th>
                      {periods.map((period, index) => (
                        <th
                          key={period}
                          className={getColumnClassName(index + 3, true)}
                          onMouseEnter={() => handleColumnHover(index + 3)}
                          onMouseLeave={() => handleColumnHover(null)}
                        >
                          {period}
                        </th>
                      ))}
                      <th
                        className={getColumnClassName(periods.length + 3, true)}
                        onMouseEnter={() =>
                          handleColumnHover(periods.length + 3)
                        }
                        onMouseLeave={() => handleColumnHover(null)}
                      >
                        起存金額
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="table-wrapper">
                <table className="bank-table">
                  <colgroup>
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "16%" }} />
                    {periods.map((_, index) => (
                      <col
                        key={index}
                        style={{ width: `${60 / periods.length}%` }}
                      />
                    ))}
                    <col style={{ width: "6%" }} />
                  </colgroup>
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
                            <tr key={`${bank.bankName}-${depositIdx}`}>
                              {depositIdx === 0 && (
                                <td
                                  className={getColumnClassName(0)}
                                  rowSpan={depositCount}
                                  onMouseEnter={() => handleColumnHover(0)}
                                  onMouseLeave={() => handleColumnHover(null)}
                                >
                                  <BankNameComponent
                                    url={bank.url}
                                    bankName={bank.bankName}
                                  />
                                </td>
                              )}
                              {depositIdx === 0 && (
                                <td
                                  className={getColumnClassName(1)}
                                  rowSpan={depositCount}
                                  onMouseEnter={() => handleColumnHover(1)}
                                  onMouseLeave={() => handleColumnHover(null)}
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
                              <td
                                className={getColumnClassName(2)}
                                onMouseEnter={() => handleColumnHover(2)}
                                onMouseLeave={() => handleColumnHover(null)}
                              >
                                {depositItem.title || "-"}
                              </td>
                              {periods.map((period, index) => {
                                const newRate = depositItem.rates[period];
                                const oldRate =
                                  oldData[activeTab][groupName][idx].deposit[
                                    depositIdx
                                  ].rates[period];
                                let rateClass = "";

                                if (newRate && oldRate) {
                                  const newValue = parseFloat(newRate);
                                  const oldValue = parseFloat(oldRate);
                                  if (newValue > oldValue) {
                                    rateClass = "rate-up";
                                  } else if (newValue < oldValue) {
                                    rateClass = "rate-down";
                                  }
                                }

                                return (
                                  <td
                                    key={period}
                                    className={getColumnClassName(index + 3)}
                                    onMouseEnter={() =>
                                      handleColumnHover(index + 3)
                                    }
                                    onMouseLeave={() => handleColumnHover(null)}
                                  >
                                    {newRate || "-"}
                                    {rateClass && oldRate && (
                                      <>
                                        <del
                                          style={{
                                            marginLeft: "8px",
                                            color:
                                              rateClass === "rate-up"
                                                ? "#e57373"
                                                : "#81c784",
                                          }}
                                        >
                                          {oldRate}
                                        </del>
                                        <span className={rateClass}>
                                          {rateClass === "rate-up" ? "↑" : "↓"}
                                        </span>
                                      </>
                                    )}
                                  </td>
                                );
                              })}
                              <td
                                className={getColumnClassName(
                                  periods.length + 3
                                )}
                                onMouseEnter={() =>
                                  handleColumnHover(periods.length + 3)
                                }
                                onMouseLeave={() => handleColumnHover(null)}
                              >
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
