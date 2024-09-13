import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
  FormatRate,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetDbsBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "星展銀行",
    group: "OtherTraditionalBank",
    savingsUrl: "https://www.dbs.com.hk/personal-zh/ratesfees-tiered.page",
    depositUrl: "https://www.dbs.com.hk/personal-zh/promotion/OnlineTD-promo",
    url: "https://www.dbs.com.hk/personal-zh/default.page",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
      USD: [] as IInterestResp[],
      CNY: [] as IInterestResp[],
    },
  };
  try {
    // 获取活期利率信息
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    // 获取定期利率信息
    const depositContent = await FetchWebsiteContent(
      browser,
      output.depositUrl
    );
    output.deposit = getDepositDetail(depositContent);
    return output;
  } catch (error) {
    console.log("----------------GetDbsBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetDbsBankInterestRate----------------");
    return output;
  }
}

/**
 * 获取活期存款
 * @param html
 * @returns
 */
function getSavingsDetail(html: string) {
  const $ = cheerio.load(html);
  const tbody = $('h2:contains("港元儲蓄戶口")').next("table").find("tbody");
  return {
    HKD: FormatRate(tbody.find("tr").eq(0).find("td").eq(0).text()),
    CNY: "",
    USD: "",
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  return {
    HKD: [getDetailWithHKD(html)],
    CNY: [getDetailWithCNY(html)],
    USD: [getDetailWithUSD(html)],
  };
}

function getDetailWithHKD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $("#new-fund .currency_table.HKD");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 3) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (period && rate && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "50000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $("#new-fund .currency_table.USD");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 3) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (period && rate && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "6000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $("#new-fund .currency_table.RMB");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 3) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (period && rate && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "40000",
    rates: FormatInterestOutput(output),
  };
}
