import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FormatRate,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetChBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "创兴银行",
    savingsUrl: `https://www.chbank.com/tc/personal/banking-services/useful-information/deposit-rates/index.shtml?tab=cloudRate`,
    depositUrl: `https://www.chbank.com/tc/personal/banking-services/useful-information/deposit-rates/index.shtml?tab=cloudRate`,
    url: "https://www.chbank.com/tc/homepage.shtml",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
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
  const tbody = $("#ERateTable3 tbody");

  return {
    HKD: FormatRate(tbody.find("tr[title=HKD]").find("td").eq(1).text().trim()),
    CNY: FormatRate(tbody.find("tr[title=RMB]").find("td").eq(1).text().trim()),
    USD: FormatRate(tbody.find("tr[title=USD]").find("td").eq(1).text().trim()),
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
  const tbody = $("#ERateTable tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  const rateRow = tbody.find("tr[title=HKD]").eq(0);
  output["7D"] = rateRow.find("td").eq(3).text().trim();
  output["1M"] = rateRow.find("td").eq(5).text().trim();
  output["3M"] = rateRow.find("td").eq(7).text().trim();
  output["6M"] = rateRow.find("td").eq(8).text().trim();
  output["12M"] = rateRow.find("td").eq(10).text().trim();

  return {
    title: "",
    min: "5000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $("#ERateTable tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  const rateRow = tbody.find("tr[title=USD]").eq(0);
  output["7D"] = rateRow.find("td").eq(3).text().trim();
  output["1M"] = rateRow.find("td").eq(5).text().trim();
  output["3M"] = rateRow.find("td").eq(7).text().trim();
  output["6M"] = rateRow.find("td").eq(8).text().trim();
  output["12M"] = rateRow.find("td").eq(10).text().trim();

  return {
    title: "",
    min: "1000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $("#ERateTable tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  const rateRow = tbody.find("tr[title=RMB]").eq(0);
  output["7D"] = rateRow.find("td").eq(3).text().trim();
  output["1M"] = rateRow.find("td").eq(5).text().trim();
  output["3M"] = rateRow.find("td").eq(7).text().trim();
  output["6M"] = rateRow.find("td").eq(8).text().trim();
  output["12M"] = rateRow.find("td").eq(10).text().trim();

  return {
    title: "",
    min: "5000",
    rates: FormatInterestOutput(output),
  };
}
